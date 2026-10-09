"""Held-out binary evaluation using sklearn metrics and positive-class scores."""

from dataclasses import dataclass

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)

from agrofail.models import FeatureInput, TargetInput, TrainedModel, _binary_inputs


@dataclass(frozen=True)
class ModelMetrics:
    """Scalar scores, explicit confusion counts and aligned ROC points.

    Class 1 is machine failure. Counts use actual labels as rows and predictions
    as columns in the [0, 1] order. ROC arrays describe positive-class probability
    thresholds, not hard predictions; their lengths may differ between models.
    """

    name: str
    accuracy: float
    precision: float
    recall: float
    f1: float
    tn: int
    fp: int
    fn: int
    tp: int
    fpr: np.ndarray
    tpr: np.ndarray
    roc_auc: float


def evaluate_model(model: TrainedModel, X_test: FeatureInput, y_test: TargetInput) -> ModelMetrics:
    """Evaluate a fitted baseline on held-out numeric features, without refitting.

    Accept the same Polars/NumPy boundary as train_models. Use the same feature
    order and any training-fitted external preprocessing. Inputs are not mutated.
    Class 1 is positive; undefined precision/recall/F1 become 0 (zero_division=0).
    Require both true labels 0 and 1: single-class test sets raise ValueError
    rather than returning misleading or undefined ROC-AUC. sklearn validates
    finite numeric features and matching lengths. Probabilities for class 1,
    not thresholded predictions, determine ROC points and ROC-AUC.
    """
    features, target = _binary_inputs(X_test, y_test)
    predictions = model.estimator.predict(features)
    positive_index = int(np.flatnonzero(model.estimator.classes_ == 1)[0])
    scores = model.estimator.predict_proba(features)[:, positive_index]
    tn, fp, fn, tp = confusion_matrix(target, predictions, labels=[0, 1]).ravel()
    fpr, tpr, _ = roc_curve(target, scores, pos_label=1)
    return ModelMetrics(
        name=model.name,
        accuracy=float(accuracy_score(target, predictions)),
        precision=float(precision_score(target, predictions, zero_division=0)),
        recall=float(recall_score(target, predictions, zero_division=0)),
        f1=float(f1_score(target, predictions, zero_division=0)),
        tn=int(tn),
        fp=int(fp),
        fn=int(fn),
        tp=int(tp),
        fpr=fpr,
        tpr=tpr,
        roc_auc=float(roc_auc_score(target, scores)),
    )
