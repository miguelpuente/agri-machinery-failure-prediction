"""Contract tests for the data payload consumed by the Sion ML site."""

import json
from pathlib import Path

import pytest

PAYLOAD = Path(__file__).resolve().parents[1] / "web" / "src" / "data" / "ai4i.json"


def test_payload_matches_the_delivered_results() -> None:
    data = json.loads(PAYLOAD.read_text(encoding="utf-8"))
    meta = data["meta"]
    assert meta["rows"] == 10_000
    assert meta["failureCount"] == 339
    assert meta["failureRate"] == pytest.approx(0.0339, abs=1e-4)

    split = data["split"]
    assert split["testRows"] == 2_000
    assert split["testFailures"] == 68
    assert split["trainRows"] == 8_000

    models = {row["name"]: row for row in data["models"]}
    assert set(models) == {"Logistic Regression", "Random Forest", "Decision Tree"}
    assert models["Logistic Regression"]["f1"] == pytest.approx(0.1772, abs=5e-4)
    assert models["Random Forest"]["f1"] == pytest.approx(0.6286, abs=5e-4)
    assert models["Decision Tree"]["f1"] == pytest.approx(0.3095, abs=5e-4)

    tuned = data["tuned"]
    assert tuned["params"] == {"max_depth": 8, "min_samples_leaf": 3}
    assert tuned["cvMean"] == pytest.approx(0.7096, abs=5e-4)
    assert tuned["cvStd"] == pytest.approx(0.0436, abs=5e-4)
    assert tuned["metrics"]["f1"] == pytest.approx(0.7581, abs=5e-4)
    assert tuned["metrics"]["fn"] == 21


def test_payload_has_the_lab_material() -> None:
    data = json.loads(PAYLOAD.read_text(encoding="utf-8"))
    assert len(data["sampleRows"]) >= 10
    assert len(data["sensorStats"]) == 5
    assert len(data["correlation"]["matrix"]) == 5
    assert len(data["nullsSample"]["rows"]) == len(data["sampleRows"])
    assert len(data["linearRegression"]["points"]) >= 100
    assert len(data["knn"]["points"]) >= 150
    assert len(data["kmeans"]["clusterStats"]) == 4
    assert len(data["kmeans"]["points"]) >= 300
    assert [row["depth"] for row in data["depthCurve"]] == list(range(1, 13))
    heatmap = data["tuningHeatmap"]
    assert len(heatmap["depths"]) == 6
    assert len(heatmap["leaves"]) == 4
    assert all(len(row) == 4 for row in heatmap["scores"])
    assert len(data["featureImportance"]) == 8
    assert len(data["target"]["toolWearBins"]) >= 4
