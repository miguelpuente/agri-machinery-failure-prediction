import numpy as np
import polars as pl
import pytest
from sklearn.base import BaseEstimator, ClassifierMixin
from sklearn.pipeline import Pipeline

from agrofail.metrics import evaluate_model
from agrofail.models import TrainedModel, train_models


class FixedClassifier(ClassifierMixin, BaseEstimator):
    def __init__(self, predictions: list[int], scores: list[float]) -> None:
        self.predictions = predictions
        self.scores = scores

    def fit(self, X: np.ndarray, y: np.ndarray) -> "FixedClassifier":
        self.classes_ = np.array([0, 1])
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        return np.array(self.predictions)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        scores = np.array(self.scores)
        return np.column_stack((1 - scores, scores))


def fixed_model(predictions: list[int], scores: list[float]) -> TrainedModel:
    estimator = Pipeline([("classifier", FixedClassifier(predictions, scores))])
    estimator.fit(np.zeros((len(scores), 1)), np.array(predictions))
    return TrainedModel("Fixed", estimator)


def test_hand_computed_metrics_and_exact_confusion_counts() -> None:
    labels = pl.Series([0, 0, 0, 1, 1, 1])
    features = pl.DataFrame({"sensor": range(6)})
    original = features.clone()
    model = fixed_model([0, 0, 1, 0, 1, 1], [0.1, 0.2, 0.8, 0.3, 0.7, 0.9])
    metrics = evaluate_model(model, features, labels)
    assert metrics.name == "Fixed"
    assert (metrics.tn, metrics.fp, metrics.fn, metrics.tp) == (2, 1, 1, 2)
    for value in (metrics.accuracy, metrics.precision, metrics.recall, metrics.f1):
        assert value == pytest.approx(2 / 3)
    assert 0 <= metrics.roc_auc <= 1
    assert features.equals(original)
    assert labels.equals(pl.Series([0, 0, 0, 1, 1, 1]))


def test_perfect_ranker_roc_is_aligned_and_monotone() -> None:
    x = np.arange(4).reshape(-1, 1)
    y = np.array([0, 0, 1, 1])
    original_x, original_y = x.copy(), y.copy()
    metrics = evaluate_model(fixed_model([0, 0, 1, 1], [0.1, 0.2, 0.8, 0.9]), x, y)
    assert metrics.roc_auc == 1.0
    assert metrics.fpr.shape == metrics.tpr.shape
    assert np.all(np.diff(metrics.fpr) >= 0)
    assert np.all(np.diff(metrics.tpr) >= 0)
    assert (metrics.fpr[0], metrics.tpr[0]) == (0, 0)
    assert (metrics.fpr[-1], metrics.tpr[-1]) == (1, 1)
    np.testing.assert_array_equal(x, original_x)
    np.testing.assert_array_equal(y, original_y)


def test_no_predicted_positives_uses_zero_division_zero() -> None:
    metrics = evaluate_model(
        fixed_model([0, 0, 0, 0], [0.1, 0.2, 0.3, 0.4]),
        np.zeros((4, 1)),
        pl.DataFrame({"target": [0, 0, 1, 1]}),
    )
    assert (metrics.precision, metrics.recall, metrics.f1) == (0, 0, 0)
    assert (metrics.tn, metrics.fp, metrics.fn, metrics.tp) == (2, 0, 2, 0)
    assert metrics.roc_auc == 1.0  # Ranking is independent of thresholded predictions.


@pytest.mark.parametrize("labels", [[0, 0], [1, 1], [2, 3]])
def test_undefined_roc_or_nonbinary_target_raises(labels: list[int]) -> None:
    with pytest.raises(ValueError, match="both binary labels 0 and 1"):
        evaluate_model(fixed_model([0, 1], [0.1, 0.9]), np.zeros((2, 1)), np.array(labels))


def test_all_models_evaluate_same_held_out_separable_frame() -> None:
    train = pl.DataFrame({"sensor": [-4.0, -3.0, -2.0, -1.0, 1.0, 2.0, 3.0, 4.0]})
    labels = pl.Series([0, 0, 0, 0, 1, 1, 1, 1])
    test = pl.DataFrame({"sensor": [-2.5, -1.5, 1.5, 2.5]})
    for model in train_models(train, labels):
        metrics = evaluate_model(model, test, pl.Series([0, 0, 1, 1]))
        for value in (
            metrics.accuracy,
            metrics.precision,
            metrics.recall,
            metrics.f1,
            metrics.roc_auc,
        ):
            assert 0 <= value <= 1
        assert metrics.accuracy == 1.0
        assert metrics.roc_auc == 1.0


def test_evaluation_does_not_refit_training_scaler() -> None:
    model = train_models(np.array([[-2.0], [-1.0], [1.0], [2.0]]), np.array([0, 0, 1, 1]))[0]
    scaler = model.estimator.named_steps["scale"]
    mean, scale = scaler.mean_.copy(), scaler.scale_.copy()
    evaluate_model(model, np.array([[100.0], [200.0]]), np.array([0, 1]))
    np.testing.assert_array_equal(scaler.mean_, mean)
    np.testing.assert_array_equal(scaler.scale_, scale)
    assert scaler.n_samples_seen_ == 4
