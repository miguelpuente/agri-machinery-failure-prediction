from pathlib import Path

import numpy as np
import polars as pl
import pytest
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler

from agrofail import config
from agrofail.tuning import PARAM_GRIDS, tune_models


@pytest.fixture
def training_frame(tmp_path: Path) -> pl.DataFrame:
    X, y = make_classification(
        n_samples=80, n_features=5, weights=[0.75, 0.25], random_state=config.RANDOM_STATE
    )
    frame = pl.DataFrame(X).with_columns(pl.Series("target", y))
    path = tmp_path / "training.csv"
    frame.write_csv(path)
    return pl.read_csv(path)


def test_grid_scores_and_parameters(training_frame: pl.DataFrame) -> None:
    results = tune_models(training_frame.drop("target"), training_frame["target"], cv=3)
    expected = {
        "Logistic Regression": {"classifier__C", "classifier__penalty"},
        "Random Forest": {
            "classifier__n_estimators",
            "classifier__max_depth",
            "classifier__min_samples_leaf",
        },
        "Decision Tree": {"classifier__max_depth", "classifier__min_samples_leaf"},
    }
    assert {result.name for result in results} == set(expected)
    for result in results:
        assert set(result.best_params) == expected[result.name]
        for key, value in result.best_params.items():
            assert value in PARAM_GRIDS[result.name][key]
        assert np.isfinite([result.cv_mean, result.cv_std]).all()
        assert 0 <= result.cv_mean <= 1
        assert 0 <= result.cv_std <= 1
        assert result.estimator.predict(training_frame.drop("target").to_numpy()).shape == (80,)


def test_repeatability_and_training_only(
    training_frame: pl.DataFrame, tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    before = training_frame.clone()
    held_out = tmp_path / "test.csv"
    held_out.write_text("invalid test data must never be loaded")
    X, y = training_frame.drop("target"), training_frame["target"]
    fits = []
    original_fit = StandardScaler.fit

    def record_fit(self, values, *args, **kwargs):
        fits.append(values.copy())
        return original_fit(self, values, *args, **kwargs)

    monkeypatch.setattr(StandardScaler, "fit", record_fit)
    first = tune_models(X, y, cv=3)
    held_out.write_text("different invalid test data")
    second = tune_models(X, y, cv=3)
    assert [(r.best_params, r.cv_mean, r.cv_std) for r in first] == [
        (r.best_params, r.cv_mean, r.cv_std) for r in second
    ]
    assert training_frame.equals(before)
    assert first[0].estimator.named_steps["scale"].mean_ == pytest.approx(X.mean().row(0))
    assert {len(values) for values in fits} == {53, 54, 80}
    training_rows = {tuple(row) for row in X.to_numpy()}
    assert all(tuple(row) in training_rows for values in fits for row in values)


def test_categories_are_fitted_inside_folds(
    training_frame: pl.DataFrame, monkeypatch: pytest.MonkeyPatch
) -> None:
    from sklearn.preprocessing import OneHotEncoder

    fits = []
    original_fit = OneHotEncoder.fit

    def record_fit(self, values, *args, **kwargs):
        fits.append(len(values))
        return original_fit(self, values, *args, **kwargs)

    monkeypatch.setattr(OneHotEncoder, "fit", record_fit)
    X = training_frame.drop("target").with_columns(pl.Series("category", [0, 1] * 40))
    models = tune_models(X, training_frame["target"], cv=3, categorical_columns=(5,))
    assert set(fits) == {53, 54, 80}
    unseen = X.with_columns(pl.lit(2).alias("category")).to_numpy()
    assert all(model.estimator.predict(unseen).shape == (80,) for model in models)


@pytest.mark.parametrize("cv", [1, 30])
def test_rejects_unsupported_folds(training_frame: pl.DataFrame, cv: int) -> None:
    with pytest.raises(ValueError, match="fold"):
        tune_models(training_frame.drop("target"), training_frame["target"], cv=cv)
