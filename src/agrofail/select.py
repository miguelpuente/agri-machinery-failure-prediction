"""Assignment section 5: domain-based variable selection, without model fitting.

The policy retains the five physical sensors and machine Type, not arbitrary
engineered features. Variance and pairwise sensor correlations are descriptive
evidence, not full-dataset thresholds that learn a selection rule. Evaluate any
future data-driven elimination on training rows only, after splitting.
"""

from dataclasses import dataclass
from itertools import combinations
from math import isfinite

import polars as pl

from agrofail import config


@dataclass(frozen=True)
class SelectionRationale:
    """Notebook-ready reasons for every input column and descriptive evidence.

    ``kept`` includes the target as a label, never as a predictor. Variances use
    population variance; correlations are Pearson coefficients between sensors.
    Undefined/nonfinite statistics are represented by None, not invented zeros.
    """

    kept: dict[str, str]
    dropped: dict[str, str]
    variances: dict[str, float | None]
    correlations: dict[tuple[str, str], float | None]
    notes: tuple[str, ...]


_SENSOR_REASONS = (
    "Ambient thermal conditions affect cooling and operating temperature.",
    "Process temperature describes operating heat, distinct from ambient conditions.",
    "Rotational speed describes the machine operating regime.",
    "Torque measures mechanical load and stress.",
    "Tool wear measures accumulated degradation.",
)


def _kept_columns(df: pl.DataFrame) -> dict[str, str]:
    if config.TARGET_COLUMN not in df.columns:
        raise ValueError(f"Missing required target column: {config.TARGET_COLUMN}")
    kept = {
        column: reason
        for column, reason in zip(config.NUMERIC_COLUMNS, _SENSOR_REASONS, strict=True)
        if column in df.columns
    }
    for column in df.columns:
        if column in config.CATEGORICAL_COLUMNS:
            kept[column] = (
                "Machine Type represents product quality; encode using training rows only."
            )
        elif column.startswith("Type_") and df.schema[column].is_numeric():
            # Accept the binary indicators emitted by features.py, not any prefixed quantity.
            if df[column].null_count() == 0 and df[column].is_in([0, 1]).all():
                kept[column] = (
                    "Encoded machine Type indicator represents product quality without order."
                )
    kept[config.TARGET_COLUMN] = "Prediction target retained as a label, not a predictor."
    return kept


def _finite_statistic(value: float | None) -> float | None:
    return float(value) if value is not None and isfinite(value) else None


def selection_rationale(df: pl.DataFrame) -> SelectionRationale:
    """Explain a fixed domain policy on raw or encoded frames without mutation.

    Report only columns present in the input. Retain even constant or correlated
    sensors: small samples can be constant, and correlation alone does not prove
    domain redundancy. These diagnostics do not validate predictive usefulness.
    No target association or trained-model importance is used for selection.
    """
    kept = _kept_columns(df)
    dropped = {}
    for column in df.columns:
        if column in kept:
            continue
        if column in config.ID_COLUMNS:
            dropped[column] = (
                "Excluded identifier: record/product identity is not a physical predictor."
            )
        elif column in config.FAILURE_MODE_COLUMNS:
            dropped[column] = (
                "Excluded target leakage: failure-mode labels expose the failure outcome."
            )
        else:
            dropped[column] = (
                "Excluded unconfigured/derived feature: no relevance evidence supports it."
            )

    sensors = [
        column
        for column in config.NUMERIC_COLUMNS
        if column in df.columns and df.schema[column].is_numeric()
    ]
    variances = {column: _finite_statistic(df[column].var(ddof=0)) for column in sensors}
    correlations = {
        (left, right): _finite_statistic(df.select(pl.corr(left, right)).item())
        for left, right in combinations(sensors, 2)
    }
    return SelectionRationale(
        kept=kept,
        dropped=dropped,
        variances=variances,
        correlations=correlations,
        notes=(
            "Sensor correlation flags possible redundancy, not grounds for automatic elimination; "
            "ambient/process temperatures and speed/torque describe distinct physical conditions.",
            "Zero variance in this sample is reported, not learned as a global drop rule; "
            "assess any variance-based elimination on training rows only.",
            "Keep all Type indicators; their one-hot dependence is explicit, and no model-specific "
            "reference-category decision is needed before choosing a model.",
            "No derived feature survives without relevance evidence; no model is trained here.",
        ),
    )


def select_features(df: pl.DataFrame) -> pl.DataFrame:
    """Return sensors, raw Type or binary Type indicators, and the unchanged target.

    Support both cleaned raw and encoded frames, retaining available predictors
    in sensor/Type/target order. Drop identifiers, failure-mode leakage and
    unsupported derived columns. Do not mutate rows, fit transformations or use
    diagnostic statistics to change this fixed domain policy.
    """
    return df.select(list(_kept_columns(df)))
