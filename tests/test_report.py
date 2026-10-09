import ast
import base64
from pathlib import Path

import nbformat
import polars as pl
import pytest

from agrofail import config
from agrofail.clean import clean
from agrofail.report import build_notebook
from agrofail.split import split


@pytest.fixture
def report_frame() -> pl.DataFrame:
    rows = 40
    frame = pl.DataFrame(
        {
            "UDI": list(range(rows)),
            "Product ID": [f"L{i}" for i in range(rows)],
            "Type": ["L", "M", "H", "L"] * 10,
            **{
                name: [float(i + j) for i in range(rows)]
                for j, name in enumerate(config.NUMERIC_COLUMNS)
            },
            config.TARGET_COLUMN: [0, 1] * 20,
            **{name: [0] * rows for name in config.FAILURE_MODE_COLUMNS},
        }
    )
    missing = frame.head(1).with_columns(
        pl.lit(None).cast(pl.Float64).alias(config.NUMERIC_COLUMNS[0])
    )
    return pl.concat([frame, frame.head(1), missing])


def test_notebook_sections_and_real_outputs(report_frame: pl.DataFrame, tmp_path: Path) -> None:
    path = build_notebook(report_frame, tmp_path / "delivery.ipynb")
    assert path.stat().st_size > 0
    notebook = nbformat.read(path, as_version=4)
    nbformat.validate(notebook)
    assert notebook.nbformat == 4
    phrases = [
        ("1. Selección del dataset", "datos industriales sintéticos"),
        ("2. Análisis exploratorio inicial (EDA)", "valores faltantes"),
        ("3. Limpieza de datos", "duplicados exactos"),
        ("4. Transformaciones básicas", "solo con entrenamiento"),
        ("5. Selección de variables", "fuga de información"),
        ("6. División del dataset", "no se entrena ningún modelo"),
        ("Anexo", "Referencias"),
    ]
    assert len(notebook.cells) == 2 * len(phrases)
    for index, (heading, phrase) in enumerate(phrases):
        markdown, code = notebook.cells[index * 2 : index * 2 + 2]
        assert markdown.cell_type == "markdown"
        assert heading in markdown.source
        assert phrase in markdown.source
        assert code.cell_type == "code"
        assert code.source.strip()
        compile(code.source, "delivery.ipynb", "exec")
        assert code.outputs
        assert all(output.output_type != "error" for output in code.outputs)
    images = [
        output.data["image/png"]
        for output in notebook.cells[3].outputs
        if "image/png" in output.get("data", {})
    ]
    assert len(images) == len(config.NUMERIC_COLUMNS) + 1
    assert all(base64.b64decode(image).startswith(b"\x89PNG\r\n\x1a\n") for image in images)
    assert config.DATASET_URL in notebook.cells[0].source
    assert config.DATASET_LICENSE in notebook.cells[0].source
    assert config.DATASET_CITATION in notebook.cells[-2].source
    cleaning = ast.literal_eval(notebook.cells[5].outputs[0].data["text/plain"])
    assert cleaning["duplicates_removed"] == 1
    assert cleaning["rows_dropped_missing"] == 1
    assert cleaning["remaining_rows"] == 40
    parameters = ast.literal_eval(notebook.cells[7].outputs[-1].data["text/plain"])
    expected_train, _ = split(clean(report_frame))
    assert parameters["sensor_means"] == pytest.approx(
        expected_train.select(config.NUMERIC_COLUMNS).mean().row(0)
    )
    assert set(config.ID_COLUMNS + config.FAILURE_MODE_COLUMNS).issubset(
        parameters["removed_columns"]
    )
    partitions = ast.literal_eval(notebook.cells[11].outputs[0].data["text/plain"])
    assert partitions["train"]["shape"][0] == 32
    assert partitions["test"]["shape"][0] == 8
    assert partitions["train"]["class_proportions"] == {0: 0.5, 1: 0.5}
    assert partitions["test"]["class_proportions"] == {0: 0.5, 1: 0.5}
    selection_table = notebook.cells[9].outputs[0].data["text/html"]
    assert "<table" in selection_table
    assert all(column in selection_table for column in report_frame.columns)


def test_report_does_not_mutate_input(report_frame: pl.DataFrame, tmp_path: Path) -> None:
    before = report_frame.clone()
    build_notebook(report_frame, tmp_path / "delivery.ipynb")
    assert report_frame.equals(before)


def test_report_rejects_missing_target(report_frame: pl.DataFrame, tmp_path: Path) -> None:
    path = tmp_path / "invalid.ipynb"
    with pytest.raises(ValueError):
        build_notebook(report_frame.drop(config.TARGET_COLUMN), path)
    assert not path.exists()


@pytest.mark.skipif(not config.RAW_DATASET_PATH.exists(), reason="Official CSV is absent")
def test_report_real_dataset(tmp_path: Path) -> None:
    path = build_notebook(output_path=tmp_path / "real.ipynb")
    notebook = nbformat.read(path, as_version=4)
    nbformat.validate(notebook)
    assert "10000" in notebook.cells[1].outputs[0].data["text/plain"]


def test_final_notebook_complete_and_populated(report_frame: pl.DataFrame, tmp_path: Path) -> None:
    import base64

    from agrofail.compare import choose_model, compare_models
    from agrofail.features import apply_encode_and_scale, fit_encode_and_scale
    from agrofail.metrics import evaluate_model
    from agrofail.models import train_models
    from agrofail.report import build_final_notebook
    from agrofail.select import select_features

    before = report_frame.clone()
    path = build_final_notebook(report_frame, tmp_path / "final.ipynb")
    notebook = nbformat.read(path, as_version=4)
    nbformat.validate(notebook)
    assert notebook.nbformat == 4
    assert report_frame.equals(before)
    narrative = "\n".join(c.source for c in notebook.cells if c.cell_type == "markdown")
    for heading in [
        "1. Selección",
        "2. Análisis",
        "3. Limpieza",
        "4. Transformaciones",
        "5. Selección",
        "6. División",
        "7. Modelos",
        "8. Evaluación",
        "9. Comparación",
        "10. Elección",
        "11. Hallazgos y recomendaciones",
        "Anexo: fuente y referencias",
    ]:
        assert heading in narrative
    for text in [
        "sintéticos industriales",
        "falsos negativos",
        "estabilidad",
        "interpretabilidad",
        "dominio",
        "F1",
        "no se ha medido",
    ]:
        assert text.lower() in narrative.lower()
    assert "En esta Pre-Entrega" not in narrative
    code = [c for c in notebook.cells if c.cell_type == "code"]
    assert all(c.outputs for c in code)
    evaluation = next(c for c in code if "evaluate_model" in c.source)
    assert sum("image/png" in o.get("data", {}) for o in evaluation.outputs) == 4
    for output in evaluation.outputs[1:]:
        assert base64.b64decode(output.data["image/png"]).startswith(b"\x89PNG\r\n\x1a\n")
    train_raw, test_raw = split(clean(report_frame))
    transformer = fit_encode_and_scale(select_features(train_raw))
    train = apply_encode_and_scale(select_features(train_raw), transformer)
    test = apply_encode_and_scale(select_features(test_raw), transformer)
    target = config.TARGET_COLUMN
    models = train_models(train.drop(target), train[target])
    expected = [evaluate_model(model, test.drop(target), test[target]) for model in models]
    actual = ast.literal_eval(evaluation.outputs[0].data["text/plain"])
    assert actual == [
        {key: value for key, value in vars(result).items() if key not in ("fpr", "tpr")}
        for result in expected
    ]
    assert f"**{choose_model(compare_models(expected)).name}**" in narrative
    for cell in code:
        compile(cell.source, "delivery-cell", "exec")
    comparison = next(c for c in code if "compare_models" in c.source)
    html = comparison.outputs[0].data["text/html"]
    for name in ["Logistic Regression", "Random Forest", "Decision Tree"]:
        assert name in html
    for metric in ["accuracy", "precision", "recall", "f1", "roc_auc", "tn", "fp", "fn", "tp"]:
        assert metric in html
    assert "…" not in html


def test_final_report_rejects_missing_target(report_frame: pl.DataFrame, tmp_path: Path) -> None:
    from agrofail.report import build_final_notebook

    path = tmp_path / "invalid-final.ipynb"
    with pytest.raises(ValueError):
        build_final_notebook(report_frame.drop(config.TARGET_COLUMN), path)
    assert not path.exists()


@pytest.mark.skipif(not config.RAW_DATASET_PATH.exists(), reason="Official CSV is absent")
def test_final_report_real_dataset(tmp_path: Path) -> None:
    from agrofail.report import build_final_notebook

    for builder, name in [(build_notebook, "pre"), (build_final_notebook, "final")]:
        notebook = nbformat.read(builder(output_path=tmp_path / f"{name}.ipynb"), as_version=4)
        nbformat.validate(notebook)
        assert "10000" in notebook.cells[1].outputs[0].data["text/plain"]
