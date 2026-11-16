"""Export the real AI4I material consumed by the Sion Machine Learning site.

The site is static: this script is the only bridge between the Python pipeline
and the React labs. It writes web/src/data/ai4i.json from the official CSV and
reuses the same modules, split, transformer and models as the delivery notebooks.
Run with: uv run python scripts/export_web_data.py
"""

from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any

import numpy as np
import polars as pl
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.metrics import f1_score
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

from agrofail import config, eda
from agrofail.clean import clean, detect_outliers, drop_duplicates
from agrofail.features import apply_encode_and_scale, fit_encode_and_scale
from agrofail.load import load_dataset
from agrofail.metrics import evaluate_model
from agrofail.models import train_models
from agrofail.report import _tuning_features
from agrofail.select import select_features
from agrofail.split import split
from agrofail.tuning import tune_models

OUTPUT_PATH = Path(__file__).resolve().parents[1] / "web" / "src" / "data" / "ai4i.json"
TARGET = config.TARGET_COLUMN
NUMERIC = list(config.NUMERIC_COLUMNS)

# A wider teaching grid than tuning.PARAM_GRIDS["Decision Tree"], kept real:
# every cell is a 5-fold F1 on the training split only.
HEATMAP_DEPTHS = [2, 4, 6, 8, 10, 12]
HEATMAP_LEAVES = [1, 3, 5, 10]


def _number(value: Any, digits: int = 4) -> float | None:
    if value is None:
        return None
    number = float(value)
    if not math.isfinite(number):
        return None
    return round(number, digits)


def _scalar(value: Any) -> Any:
    if isinstance(value, np.generic):
        value = value.item()
    if isinstance(value, float) and not math.isfinite(value):
        return None
    return value


def _rows(frame: pl.DataFrame) -> list[dict[str, Any]]:
    return [{key: _scalar(value) for key, value in row.items()} for row in frame.to_dicts()]


def _sample_rows(df: pl.DataFrame) -> list[dict[str, Any]]:
    healthy = df.filter(pl.col(TARGET) == 0).head(8)
    failure = df.filter(pl.col(TARGET) == 1).head(4)
    columns = ["UDI", "Product ID", "Type", *NUMERIC, TARGET]
    sample = pl.concat([healthy, failure]).select(columns).sort("UDI")
    return _rows(sample)


def _nulls_sample(rows: list[dict[str, Any]]) -> dict[str, Any]:
    """A deterministic didactic sample: AI4I itself has no missing values."""
    sample = [dict(row) for row in rows]
    cells: list[list[Any]] = []
    for row_index, column in ((2, NUMERIC[0]), (5, NUMERIC[1]), (7, NUMERIC[3])):
        if row_index < len(sample):
            sample[row_index][column] = None
            cells.append([row_index, column])
    return {"rows": sample, "nullCells": cells}


def _sensor_stats(df: pl.DataFrame) -> dict[str, dict[str, Any]]:
    stats: dict[str, dict[str, Any]] = {}
    for name in NUMERIC:
        values = df[name]
        stats[name] = {
            "min": _number(values.min()),
            "q1": _number(values.quantile(0.25, interpolation="linear")),
            "median": _number(values.median()),
            "q3": _number(values.quantile(0.75, interpolation="linear")),
            "max": _number(values.max()),
            "mean": _number(values.mean()),
            "std": _number(values.std(ddof=1)),
        }
    return stats


def _type_stats(df: pl.DataFrame) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    grouped = df.group_by("Type").agg(
        pl.len().alias("count"),
        pl.col(TARGET).sum().alias("failures"),
    )
    for row in grouped.sort("Type").to_dicts():
        count = int(row["count"])
        failures = int(row["failures"])
        result[str(row["Type"])] = {
            "count": count,
            "failures": failures,
            "failureRate": _number(failures / count if count else 0),
        }
    return result


def _correlation(df: pl.DataFrame) -> dict[str, Any]:
    table = eda.correlation_matrix(df)
    return {
        "columns": list(NUMERIC),
        "matrix": [[_number(value) for value in row] for row in table.select(NUMERIC).rows()],
    }


def _model_row(metrics: Any) -> dict[str, Any]:
    count = max(len(metrics.fpr), 1)
    indices = sorted({0, count - 1, *np.linspace(0, count - 1, 24, dtype=int).tolist()})
    return {
        "name": metrics.name,
        "accuracy": _number(metrics.accuracy),
        "precision": _number(metrics.precision),
        "recall": _number(metrics.recall),
        "f1": _number(metrics.f1),
        "rocAuc": _number(metrics.roc_auc),
        "tn": int(metrics.tn),
        "fp": int(metrics.fp),
        "fn": int(metrics.fn),
        "tp": int(metrics.tp),
        "roc": [
            {"fpr": _number(metrics.fpr[index]), "tpr": _number(metrics.tpr[index])}
            for index in indices
        ],
    }


def _linear_regression(df: pl.DataFrame) -> dict[str, Any]:
    x_name = NUMERIC[0]  # Air temperature [K]
    y_name = NUMERIC[1]  # Process temperature [K]
    x = df[x_name].to_numpy().astype(float)
    y = df[y_name].to_numpy().astype(float)
    model = LinearRegression().fit(x.reshape(-1, 1), y)
    predicted = model.predict(x.reshape(-1, 1))
    residuals = y - predicted
    indices = np.linspace(0, len(x) - 1, min(120, len(x)), dtype=int)
    return {
        "xLabel": x_name,
        "yLabel": y_name,
        "points": [{"x": _number(x[index], 2), "y": _number(y[index], 2)} for index in indices],
        "slope": _number(model.coef_[0], 6),
        "intercept": _number(model.intercept_, 4),
        "r2": _number(model.score(x.reshape(-1, 1), y), 4),
        "mae": _number(np.mean(np.abs(residuals)), 4),
        "mse": _number(np.mean(residuals**2), 4),
        "rmse": _number(np.sqrt(np.mean(residuals**2)), 4),
    }


def _knn_sample(df: pl.DataFrame) -> dict[str, Any]:
    work = df.with_columns((pl.col(NUMERIC[1]) - pl.col(NUMERIC[0])).alias("temp_diff"))
    failures = work.filter(pl.col(TARGET) == 1)
    healthy = work.filter(pl.col(TARGET) == 0)
    failure_sample = failures.sample(n=min(80, failures.height), seed=42)
    healthy_sample = healthy.sample(n=min(120, healthy.height), seed=42)
    sample = pl.concat([failure_sample, healthy_sample]).sort("temp_diff")
    points = [
        {
            "x": _number(row["temp_diff"], 3),
            "y": _number(row[NUMERIC[3]], 2),
            "label": int(row[TARGET]),
        }
        for row in sample.to_dicts()
    ]
    return {
        "xLabel": "ΔT proceso - ambiente [K]",
        "yLabel": "Torque [Nm]",
        "points": points,
    }


def _kmeans(df: pl.DataFrame) -> dict[str, Any]:
    columns = [NUMERIC[2], NUMERIC[3], NUMERIC[4]]  # rpm, torque, tool wear
    matrix = df.select(columns).to_numpy().astype(float)
    scaler = StandardScaler().fit(matrix)
    scaled = scaler.transform(matrix)
    model = KMeans(n_clusters=4, n_init=10, random_state=config.RANDOM_STATE).fit(scaled)
    labels = model.labels_
    centers = scaler.inverse_transform(model.cluster_centers_)

    points: list[dict[str, Any]] = []
    for cluster in range(4):
        indices = np.flatnonzero(labels == cluster)[:100]
        for index in indices:
            points.append(
                {
                    "x": _number(matrix[index, 0], 0),
                    "y": _number(matrix[index, 1], 2),
                    "cluster": cluster,
                }
            )

    stats: list[dict[str, Any]] = []
    for cluster in range(4):
        mask = labels == cluster
        count = int(mask.sum())
        failures = int(df.filter(pl.Series(mask))[TARGET].sum())
        stats.append(
            {
                "cluster": cluster,
                "count": count,
                "failures": failures,
                "failureRate": _number(failures / count if count else 0),
                "meanRpm": _number(centers[cluster, 0], 0),
                "meanTorque": _number(centers[cluster, 1], 2),
                "meanWear": _number(centers[cluster, 2], 0),
            }
        )
    return {
        "k": 4,
        "xLabel": "Velocidad rotacional [rpm]",
        "yLabel": "Torque [Nm]",
        "points": points,
        "centers": [
            {
                "x": _number(centers[cluster, 0], 0),
                "y": _number(centers[cluster, 1], 2),
                "cluster": cluster,
            }
            for cluster in range(4)
        ],
        "clusterStats": stats,
    }


def _depth_curve(
    train_x: np.ndarray, train_y: np.ndarray, test_x: np.ndarray, test_y: np.ndarray
) -> list[dict[str, Any]]:
    curve = []
    for depth in range(1, 13):
        tree = DecisionTreeClassifier(max_depth=depth, random_state=config.RANDOM_STATE)
        tree.fit(train_x, train_y)
        curve.append(
            {
                "depth": depth,
                "trainF1": _number(f1_score(train_y, tree.predict(train_x), zero_division=0)),
                "testF1": _number(f1_score(test_y, tree.predict(test_x), zero_division=0)),
            }
        )
    return curve


def _heatmap(train_x: np.ndarray, train_y: np.ndarray) -> dict[str, Any]:
    folds = StratifiedKFold(n_splits=5, shuffle=True, random_state=config.RANDOM_STATE)
    search = GridSearchCV(
        Pipeline([("classifier", DecisionTreeClassifier(random_state=config.RANDOM_STATE))]),
        {
            "classifier__max_depth": HEATMAP_DEPTHS,
            "classifier__min_samples_leaf": HEATMAP_LEAVES,
        },
        scoring="f1",
        cv=folds,
        n_jobs=1,
        error_score="raise",
        refit=True,
    ).fit(train_x, train_y)

    scores = [[None for _ in HEATMAP_LEAVES] for _ in HEATMAP_DEPTHS]
    for params, mean in zip(
        search.cv_results_["params"], search.cv_results_["mean_test_score"], strict=True
    ):
        row = HEATMAP_DEPTHS.index(params["classifier__max_depth"])
        column = HEATMAP_LEAVES.index(params["classifier__min_samples_leaf"])
        scores[row][column] = _number(mean)

    return {
        "depths": HEATMAP_DEPTHS,
        "leaves": HEATMAP_LEAVES,
        "scores": scores,
        "best": {
            "maxDepth": int(search.best_params_["classifier__max_depth"]),
            "minSamplesLeaf": int(search.best_params_["classifier__min_samples_leaf"]),
            "cvF1": _number(search.best_score_),
        },
        "chosen": {"maxDepth": 8, "minSamplesLeaf": 3},
    }


def _target(df: pl.DataFrame) -> dict[str, Any]:
    means: dict[str, dict[str, Any]] = {}
    for name in NUMERIC:
        means[name] = {
            "healthy": _number(df.filter(pl.col(TARGET) == 0)[name].mean()),
            "failure": _number(df.filter(pl.col(TARGET) == 1)[name].mean()),
        }

    bins = [0, 50, 100, 150, 200, 250, 1000]
    wear_rows = []
    for lower, upper in zip(bins[:-1], bins[1:], strict=True):
        subset = df.filter((pl.col(NUMERIC[4]) >= lower) & (pl.col(NUMERIC[4]) < upper))
        count = subset.height
        failures = int(subset[TARGET].sum())
        wear_rows.append(
            {
                "label": f"{lower}-{upper} min" if upper < 1000 else f"{lower}+ min",
                "count": count,
                "failures": failures,
                "failureRate": _number(failures / count if count else 0),
            }
        )

    return {
        "classBalance": {
            "healthy": df.height - int(df[TARGET].sum()),
            "failure": int(df[TARGET].sum()),
        },
        "sensorMeans": means,
        "toolWearBins": wear_rows,
    }


def build_payload(df: pl.DataFrame) -> dict[str, Any]:
    summary = eda.summarise(df)
    sample_rows = _sample_rows(df)

    cleaned = clean(df)
    train_raw, test_raw = split(cleaned)
    train_selected = select_features(train_raw)
    test_selected = select_features(test_raw)
    transformer = fit_encode_and_scale(train_selected)
    train_encoded = apply_encode_and_scale(train_selected, transformer)
    test_encoded = apply_encode_and_scale(test_selected, transformer)
    train_x = train_encoded.drop(TARGET).to_numpy().astype(float)
    train_y = train_encoded[TARGET].to_numpy().astype(int)
    test_x = test_encoded.drop(TARGET).to_numpy().astype(float)
    test_y = test_encoded[TARGET].to_numpy().astype(int)

    baselines = train_models(train_encoded.drop(TARGET), train_encoded[TARGET])
    metrics = [
        _model_row(evaluate_model(model, test_encoded.drop(TARGET), test_encoded[TARGET]))
        for model in baselines
    ]

    # Match the delivery notebook: raw sensors plus fixed Type codes, with
    # one-hot and logistic scaling fitted inside each CV fold.
    tuning_train = _tuning_features(train_selected)
    tuning_test = _tuning_features(test_selected)
    tuned = tune_models(
        tuning_train,
        train_encoded[TARGET],
        categorical_columns=(len(NUMERIC),),
    )
    tuned_tree = next(model for model in tuned if model.name == "Decision Tree")
    tuned_metrics = _model_row(evaluate_model(tuned_tree, tuning_test, test_encoded[TARGET]))
    feature_names = list(transformer.output_columns[:-1])
    forest = next(model for model in baselines if model.name == "Random Forest")
    forest_importances = forest.estimator.named_steps["classifier"].feature_importances_
    importances = sorted(
        (
            {"name": name, "importance": _number(value)}
            for name, value in zip(feature_names, forest_importances, strict=True)
        ),
        key=lambda row: row["importance"] or 0,
        reverse=True,
    )

    failures = int(df[TARGET].sum())
    cleaning = {
        "duplicatesRemoved": df.height - drop_duplicates(df).height,
        "rowsDroppedMissing": drop_duplicates(df).height - cleaned.height,
        "remainingRows": cleaned.height,
        "outlierRows": detect_outliers(cleaned).height,
        "outliersBySensor": {name: detect_outliers(cleaned, [name]).height for name in NUMERIC},
    }

    return {
        "meta": {
            "dataset": "AI4I 2020 Predictive Maintenance Dataset",
            "source": "https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset",
            "license": config.DATASET_LICENSE,
            "citation": config.DATASET_CITATION,
            "rows": df.height,
            "columns": df.width,
            "failureCount": failures,
            "failureRate": _number(failures / df.height),
            "testSize": config.TEST_SIZE,
            "randomState": config.RANDOM_STATE,
        },
        "summary": {
            "rowCount": summary["row_count"],
            "columnCount": summary["column_count"],
            "classBalance": summary["class_balance"],
        },
        "sensorStats": _sensor_stats(df),
        "typeStats": _type_stats(df),
        "correlation": _correlation(df),
        "sampleRows": sample_rows,
        "nullsSample": _nulls_sample(sample_rows),
        "cleaning": cleaning,
        "split": {
            "trainRows": train_raw.height,
            "testRows": test_raw.height,
            "trainFailures": int(train_raw[TARGET].sum()),
            "testFailures": int(test_raw[TARGET].sum()),
        },
        "models": metrics,
        "tuned": {
            "name": tuned_tree.name,
            "params": {
                key.removeprefix("classifier__"): _scalar(value)
                for key, value in tuned_tree.best_params.items()
            },
            "cvMean": _number(tuned_tree.cv_mean),
            "cvStd": _number(tuned_tree.cv_std),
            "metrics": tuned_metrics,
        },
        "featureImportance": importances,
        "depthCurve": _depth_curve(train_x, train_y, test_x, test_y),
        "tuningHeatmap": _heatmap(train_x, train_y),
        "linearRegression": _linear_regression(cleaned),
        "knn": _knn_sample(cleaned),
        "kmeans": _kmeans(cleaned),
        "target": _target(cleaned),
    }


def main() -> None:
    df = load_dataset()
    payload = build_payload(df)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    size = OUTPUT_PATH.stat().st_size / 1024
    print(
        f"Wrote {OUTPUT_PATH.relative_to(OUTPUT_PATH.parents[3])} "
        f"({size:.1f} KB): {payload['meta']['rows']} rows, "
        f"{payload['meta']['failureCount']} failures, "
        f"tuned F1 {payload['tuned']['metrics']['f1']}, "
        f"CV {payload['tuned']['cvMean']} ± {payload['tuned']['cvStd']}"
    )


if __name__ == "__main__":
    main()
