"""Small training-only F1 searches with deterministic stratified cross-validation."""

from dataclasses import dataclass

import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier

from agrofail import config
from agrofail.models import FeatureInput, TargetInput, _binary_inputs

PARAM_GRIDS = {
    "Logistic Regression": {"classifier__C": [0.1, 1.0, 10.0], "classifier__penalty": ["l2"]},
    "Random Forest": {
        "classifier__n_estimators": [50, 100],
        "classifier__max_depth": [8, None],
        "classifier__min_samples_leaf": [1, 3],
    },
    "Decision Tree": {
        "classifier__max_depth": [4, 8],
        "classifier__min_samples_leaf": [1, 3],
    },
}


@dataclass(frozen=True)
class TunedModel:
    """Refitted best pipeline and its winning candidate's fold F1 mean/std."""

    name: str
    estimator: Pipeline
    best_params: dict[str, object]
    cv_mean: float
    cv_std: float


def tune_models(
    X_train: FeatureInput,
    y_train: TargetInput,
    cv: int = 5,
    *,
    n_jobs: int = 1,
    random_state: int = config.RANDOM_STATE,
    categorical_columns: tuple[int, ...] = (),
) -> list[TunedModel]:
    """Tune only supplied training rows; there is deliberately no test-data argument.

    Accept finite numeric features and binary labels as in ``train_models``.
    Optional categorical column indices denote fixed numeric category codes;
    one-hot vocabularies and logistic scaling are learned INSIDE each CV fold.
    Do not supply features scaled using validation rows. Refitting learns from
    all training rows, never held-out test rows. Folds require both classes.

    The small grids vary regularization, ensemble size and tree complexity;
    L2 keeps the default logistic solver compatible. Search by F1 without class
    weighting or threshold optimization. Mean/std describe the best candidate,
    not independent performance estimates or temporal/domain robustness: the
    same folds select parameters and estimate their variation.
    """
    features, target = _binary_inputs(X_train, y_train)
    if not isinstance(cv, int) or cv < 2 or np.bincount(target.astype(int)).min() < cv:
        raise ValueError("CV folds must be at least 2 and no more than either class count")
    folds = StratifiedKFold(n_splits=cv, shuffle=True, random_state=random_state)
    classifiers = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=random_state),
        "Random Forest": RandomForestClassifier(random_state=random_state),
        "Decision Tree": DecisionTreeClassifier(random_state=random_state),
    }
    results = []
    for name, classifier in classifiers.items():
        encoding = (
            ColumnTransformer(
                [
                    (
                        "category",
                        OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                        list(categorical_columns),
                    )
                ],
                remainder="passthrough",
            )
            if categorical_columns
            else "passthrough"
        )
        estimator = Pipeline(
            [
                ("encode", encoding),
                ("scale", StandardScaler() if name == "Logistic Regression" else "passthrough"),
                ("classifier", classifier),
            ]
        )
        search = GridSearchCV(
            estimator,
            PARAM_GRIDS[name],
            scoring="f1",
            cv=folds,
            n_jobs=n_jobs,
            error_score="raise",
            refit=True,
        ).fit(features, target)
        index = search.best_index_
        results.append(
            TunedModel(
                name,
                search.best_estimator_,
                dict(search.best_params_),
                float(search.cv_results_["mean_test_score"][index]),
                float(search.cv_results_["std_test_score"][index]),
            )
        )
    return results
