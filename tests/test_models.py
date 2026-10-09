import numpy as np
import polars as pl
import pytest
from sklearn.pipeline import Pipeline
from sklearn.utils.validation import check_is_fitted

from agrofail.models import train_models


def separable_data() -> tuple[pl.DataFrame, pl.Series]:
    values = np.r_[np.linspace(-4, -1, 20), np.linspace(1, 4, 20)]
    return pl.DataFrame({"sensor": values}), pl.Series("target", [0] * 20 + [1] * 20)


def test_three_fitted_reproducible_pipelines_without_mutation() -> None:
    features, target = separable_data()
    original_features, original_target = features.clone(), target.clone()
    first = train_models(features, target)
    second = train_models(features, target)
    assert [model.name for model in first] == [
        "Logistic Regression",
        "Random Forest",
        "Decision Tree",
    ]
    for model, repeated in zip(first, second, strict=True):
        assert isinstance(model.estimator, Pipeline)
        check_is_fitted(model.estimator)
        assert model.estimator.named_steps["classifier"].random_state == 42
        np.testing.assert_array_equal(
            model.estimator.predict(features.to_numpy()),
            repeated.estimator.predict(features.to_numpy()),
        )
    np.testing.assert_array_equal(first[0].estimator.predict(features.to_numpy()), target)
    assert features.equals(original_features)
    assert target.equals(original_target)


def test_numpy_inputs_and_training_only_scaling() -> None:
    features, target = separable_data()
    x, y = features.to_numpy(), target.to_numpy()
    original_x, original_y = x.copy(), y.copy()
    model = train_models(x, y)[0]
    np.testing.assert_allclose(model.estimator.named_steps["scale"].mean_, x.mean(axis=0))
    np.testing.assert_array_equal(x, original_x)
    np.testing.assert_array_equal(y, original_y)


@pytest.mark.parametrize("labels", [[0] * 40, [1] * 40, [2] * 20 + [3] * 20])
def test_training_rejects_nonbinary_or_single_class_targets(labels: list[int]) -> None:
    features, _ = separable_data()
    with pytest.raises(ValueError, match="both binary labels 0 and 1"):
        train_models(features, np.array(labels))
