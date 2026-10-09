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
