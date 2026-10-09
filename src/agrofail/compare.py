"""Deterministic comparison of already evaluated, untuned maintenance baselines."""

from collections.abc import Mapping
from dataclasses import dataclass
from math import isfinite

from agrofail.metrics import ModelMetrics


@dataclass(frozen=True)
class ComparisonRow:
    """Scalar held-out metrics; class 1 means machine failure."""

    name: str
    accuracy: float
    precision: float
    recall: float
    f1: float
    roc_auc: float
    tn: int
    fp: int
    fn: int
    tp: int


@dataclass(frozen=True)
class ComparisonTable:
    """Rows in ranked order, with the explicit policy used to order them."""

    rows: tuple[ComparisonRow, ...]
    ranking_rule: str = "F1 descending, ROC-AUC descending, accuracy descending, name ascending"


@dataclass(frozen=True)
class ModelChoice:
    """Provisional baseline choice and criterion-keyed English rationale."""

    name: str
    rationale: Mapping[str, str]


def compare_models(results: list[ModelMetrics] | Mapping[str, ModelMetrics]) -> ComparisonTable:
    """Rank by F1, ROC-AUC, accuracy, then model name for deterministic ties.

    F1 balances failure precision and recall when accuracy is dominated by the
    healthy majority. ROC-AUC adds threshold-independent discrimination; accuracy
    is only a tertiary criterion. Mapping keys are ignored in favor of metric
    names. Require a nonempty set of unique names and finite unit-range scores.
    All results must describe the same held-out population and positive label;
    the caller owns that invariant. This is not cross-validation or training.
    """
    values = list(results.values()) if isinstance(results, Mapping) else results
    if not values:
        raise ValueError("Comparison cannot be empty")
    if len({value.name for value in values}) != len(values):
        raise ValueError("Model names must be unique")
    rows = []
    for value in values:
        scores = (value.accuracy, value.precision, value.recall, value.f1, value.roc_auc)
        if not all(isfinite(score) and 0 <= score <= 1 for score in scores):
            raise ValueError("Scores must be finite and within [0, 1]")
        rows.append(ComparisonRow(value.name, *scores, value.tn, value.fp, value.fn, value.tp))
    return ComparisonTable(
        tuple(sorted(rows, key=lambda r: (-r.f1, -r.roc_auc, -r.accuracy, r.name)))
    )


def choose_model(table: ComparisonTable) -> ModelChoice:
    """Choose the top-ranked baseline, not a certified deployment candidate.

    Discuss maintenance costs qualitatively: missed failures can cause unplanned
    downtime, false alarms unnecessary inspection. No measured cost ratio or
    resampling stability is inferred from one split. Interpretability and domain
    fit qualify the performance choice rather than silently changing the ranking.
    """
    if not table.rows:
        raise ValueError("Choice table cannot be empty")
    best = table.rows[0]
    interpretability = {
        "Logistic Regression": "Linear coefficients support inspection, not causal inference.",
        "Decision Tree": "The depth-4 tree offers short, inspectable decision rules.",
        "Random Forest": "The ensemble is less directly interpretable than a shallow tree "
        "or linear model.",
    }.get(best.name, "Interpretability is unknown for this model and requires inspection.")
    return ModelChoice(
        best.name,
        {
            "performance": f"Ranked first by {table.ranking_rule}; F1={best.f1:.4f}, "
            f"ROC-AUC={best.roc_auc:.4f}, accuracy={best.accuracy:.4f}.",
            "error_types": f"False negatives={best.fn}; false positives={best.fp}. Missed failures "
            "can cause unplanned downtime; false alarms cause unnecessary inspections. "
            "Operational costs are not measured; F1 is a provisional tradeoff.",
            "stability": "Stability is not measured: a fixed seed reproduces one split, "
            "not robustness "
            "across samples, time or farms. Resampling validation remains necessary.",
            "interpretability": interpretability,
            "domain_fit": "Sensor-based maintenance is relevant to agricultural machinery, "
            "but these "
            "synthetic industrial data require validation on real agricultural records. "
            "The choice is provisional and does not authorize deployment.",
        },
    )
