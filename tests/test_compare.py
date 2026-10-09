from dataclasses import replace

import numpy as np
import pytest

from agrofail.metrics import ModelMetrics


def scores(name: str, f1: float = 0.6, auc: float = 0.8, accuracy: float = 0.9) -> ModelMetrics:
    return ModelMetrics(
        name, accuracy, 0.7, 0.5, f1, 85, 5, 5, 5, np.array([0, 1]), np.array([0, 1]), auc
    )


def test_ranking_and_choice_are_order_independent() -> None:
    from agrofail.compare import choose_model, compare_models

    results = [
        scores("Z", accuracy=0.95),
        scores("A", accuracy=0.95),
        scores("D", accuracy=0.9),
        scores("B", auc=0.9),
        scores("C", f1=0.7),
    ]
    table = compare_models(results)
    assert [row.name for row in table.rows] == ["C", "B", "A", "Z", "D"]
    assert compare_models(dict(zip("vwxyz", reversed(results), strict=True))) == table
    assert (table.rows[0].f1, table.rows[0].roc_auc, table.rows[0].accuracy) == (0.7, 0.8, 0.9)
    assert (table.rows[0].tn, table.rows[0].fp, table.rows[0].fn, table.rows[0].tp) == (85, 5, 5, 5)
    choice = choose_model(table)
    assert choice.name == "C"
    assert set(choice.rationale) == {
        "performance",
        "error_types",
        "stability",
        "interpretability",
        "domain_fit",
    }
    assert all(choice.rationale.values())
    assert "not measured" in choice.rationale["stability"]
    assert "false negatives" in choice.rationale["error_types"].lower()


def test_baseline_interpretability_and_invalid_comparisons() -> None:
    from agrofail.compare import choose_model, compare_models

    for name, description in [
        ("Decision Tree", "depth-4"),
        ("Random Forest", "ensemble"),
        ("Logistic Regression", "coefficients"),
    ]:
        choice = choose_model(compare_models([scores(name)]))
        assert description in choice.rationale["interpretability"]
    with pytest.raises(ValueError, match="empty"):
        compare_models([])
    with pytest.raises(ValueError, match="unique"):
        compare_models([scores("A"), scores("A")])
    with pytest.raises(ValueError, match="finite"):
        compare_models([replace(scores("A"), f1=float("nan"))])


@pytest.mark.parametrize("score", [float("inf"), -0.1, 1.1])
def test_comparison_rejects_invalid_scores(score: float) -> None:
    from agrofail.compare import compare_models

    with pytest.raises(ValueError, match="finite"):
        compare_models([replace(scores("A"), roc_auc=score)])
