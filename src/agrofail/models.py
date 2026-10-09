"""Fixed baseline binary classifiers for the final-project comparison."""

from dataclasses import dataclass

import numpy as np
import polars as pl
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.utils.validation import check_X_y

from agrofail import config

FeatureInput = pl.DataFrame | np.ndarray
TargetInput = pl.Series | pl.DataFrame | np.ndarray


@dataclass(frozen=True)
class TrainedModel:
    """A named fitted pipeline, reusable on the same ordered feature columns."""

    name: str
    estimator: Pipeline


def _binary_inputs(X: FeatureInput, y: TargetInput) -> tuple[np.ndarray, np.ndarray]:
    """Convert numeric features and a one-column binary target without mutation."""
    features = X.to_numpy() if isinstance(X, pl.DataFrame) else X
    target = y.to_numpy() if isinstance(y, (pl.Series, pl.DataFrame)) else y
    if target.ndim == 2 and target.shape[1] == 1:
        target = target.ravel()
    features, target = check_X_y(features, target, dtype="numeric")
    if not np.array_equal(np.unique(target), [0, 1]):
        raise ValueError("Target must contain both binary labels 0 and 1")
    return features, target


def train_models(
    X_train: FeatureInput,
    y_train: TargetInput,
    *,
    random_state: int = config.RANDOM_STATE,
) -> list[TrainedModel]:
    """Fit Logistic Regression, Random Forest and a simple Decision Tree.

    Accept numeric Polars frames or two-dimensional NumPy feature arrays and
    Polars Series, single-column frames or NumPy binary targets (0/1). Reject
    nonfinite features, mismatched lengths and targets missing either class.
    Encode categorical columns before calling, for example with agrofail.features.
    Keep feature order identical at evaluation; never include the target in X.

    Every classifier uses an sklearn Pipeline. Logistic Regression learns a
    StandardScaler on training data ONLY; trees use explicit passthrough because
    scaling does not affect their splits. Callers may supply already-transformed
    features, but must fit any learned preprocessing on training rows only and
    reuse that transformation on held-out rows. Inputs are not mutated.

    These are untuned baselines, not a model-selection or resampling procedure.
    No class reweighting is applied; compare recall/F1/ROC-AUC as well as accuracy
    for the imbalanced failure target. The tree is capped at depth 4 for simplicity.
    """
    features, target = _binary_inputs(X_train, y_train)
    models = [
        TrainedModel(
            "Logistic Regression",
            Pipeline(
                [
                    ("scale", StandardScaler()),
                    ("classifier", LogisticRegression(max_iter=1000, random_state=random_state)),
                ]
            ),
        ),
        TrainedModel(
            "Random Forest",
            Pipeline(
                [
                    ("scale", "passthrough"),
                    (
                        "classifier",
                        RandomForestClassifier(n_estimators=100, random_state=random_state),
                    ),
                ]
            ),
        ),
        TrainedModel(
            "Decision Tree",
            Pipeline(
                [
                    ("scale", "passthrough"),
                    ("classifier", DecisionTreeClassifier(max_depth=4, random_state=random_state)),
                ]
            ),
        ),
    ]
    for model in models:
        model.estimator.fit(features, target)
    return models
