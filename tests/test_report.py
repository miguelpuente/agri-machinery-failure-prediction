import ast
import base64
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

import nbformat
import polars as pl
import pytest

from agrofail import config
from agrofail.clean import clean
from agrofail.report import build_final_notebook, build_notebook
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


@pytest.mark.parametrize("builder", [build_notebook, build_final_notebook])
def test_colab_setup_cells(builder, report_frame: pl.DataFrame, tmp_path: Path) -> None:
    notebook = nbformat.read(builder(report_frame, tmp_path / "colab.ipynb"), as_version=4)
    preamble, setup = notebook.cells[:2]
    assert preamble.cell_type == "markdown"
    assert "Colab" in preamble.source
    assert "raíz del repositorio" in preamble.source
    assert "pipeline real" in preamble.source
    assert setup.cell_type == "code"
    assert (
        "git+https://github.com/miguelpuente/agri-machinery-failure-prediction.git" in setup.source
    )
    assert '"pip", "install"' in setup.source
    assert "urlopen" in setup.source
    assert "ZipFile" in setup.source
    assert "config.DATASET_URL" in setup.source
    assert "utf-8-sig" in setup.source
    assert setup.execution_count is None
    assert not setup.outputs
    compile(setup.source, "colab-setup", "exec")
    loading = next(c for c in notebook.cells if "raw = load_dataset(" in c.source)
    assert "load_dataset(Path('data/raw/ai4i2020.csv'))" in loading.source


@pytest.fixture
def setup_source(report_frame: pl.DataFrame, tmp_path: Path) -> str:
    notebook = nbformat.read(build_notebook(report_frame, tmp_path / "setup.ipynb"), as_version=4)
    assert "urlopen" in notebook.cells[1].source
    return notebook.cells[1].source


@pytest.mark.parametrize("cached,bom", [(False, False), (False, True), (True, True)])
def test_colab_setup_download(
    setup_source: str, tmp_path: Path, monkeypatch: pytest.MonkeyPatch, capsys, cached, bom
) -> None:
    import subprocess
    import urllib.request

    monkeypatch.chdir(tmp_path)
    installs = []
    monkeypatch.setattr(subprocess, "check_call", lambda args: installs.append(args))
    payload = ("\ufeff" if bom else "") + "UDI,Machine failure\n1,0\n2,1\n"
    archive = BytesIO()
    with ZipFile(archive, "w") as bundle:
        bundle.writestr("ai4i2020.csv", payload.encode("utf-8"))
    downloads = []

    def download(url, timeout):
        downloads.append((url, timeout))
        assert not cached, "Cached CSV must not trigger network access"
        return BytesIO(archive.getvalue())

    monkeypatch.setattr(urllib.request, "urlopen", download)
    destination = tmp_path / "data/raw/ai4i2020.csv"
    if cached:
        destination.parent.mkdir(parents=True)
        destination.write_bytes(payload.encode("utf-8"))
    namespace = {}
    exec(compile(setup_source, "colab-setup", "exec"), namespace)
    assert namespace["header"][0] == "UDI"
    assert destination.read_bytes() == payload.encode("utf-8")
    assert not destination.with_suffix(".part").exists()
    assert (tmp_path / "data/processed").is_dir()
    assert (tmp_path / "notebooks/figures").is_dir()
    assert "Rows: 2" in capsys.readouterr().out
    assert installs[0][1:3] == ["-m", "pip"]
    assert downloads == ([] if cached else [(config.DATASET_URL, 60)])
    exec(compile(setup_source, "colab-setup", "exec"), {})
    assert len(downloads) == (0 if cached else 1)


def test_colab_setup_failed_publish(
    setup_source: str, tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    import subprocess
    import urllib.request

    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(subprocess, "check_call", lambda args: None)
    archive = BytesIO()
    with ZipFile(archive, "w") as bundle:
        bundle.writestr("ai4i2020.csv", "UDI,Machine failure\n1,0\n")
    monkeypatch.setattr(
        urllib.request, "urlopen", lambda *args, **kwargs: BytesIO(archive.getvalue())
    )

    def fail_replace(self, target):
        assert self.read_bytes()
        assert not target.exists()
        raise OSError("publish failed")

    monkeypatch.setattr(Path, "replace", fail_replace)
    with pytest.raises(OSError, match="publish failed"):
        exec(compile(setup_source, "colab-setup", "exec"), {})
    assert not (tmp_path / "data/raw/ai4i2020.csv").exists()
    assert not (tmp_path / "data/raw/ai4i2020.part").exists()


def test_notebook_sections_and_real_outputs(report_frame: pl.DataFrame, tmp_path: Path) -> None:
    path = build_notebook(report_frame, tmp_path / "delivery.ipynb")
    assert path.stat().st_size > 0
    notebook = nbformat.read(path, as_version=4)
    nbformat.validate(notebook)
    notebook.cells = notebook.cells[2:]
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
        parameters["excluded_columns"]
    )
    assert "Type" not in parameters["excluded_columns"]
    assert parameters["encoded_columns"] == {"Type": ["Type_H", "Type_L", "Type_M"]}
    assert "uv sync --extra notebook" in notebook.cells[0].source
    partitions = ast.literal_eval(notebook.cells[11].outputs[0].data["text/plain"])
    assert partitions["train"]["shape"][0] == 32
    assert partitions["test"]["shape"][0] == 8
    assert partitions["train"]["class_proportions"] == {0: 0.5, 1: 0.5}
    assert partitions["test"]["class_proportions"] == {0: 0.5, 1: 0.5}
    selection_table = notebook.cells[9].outputs[0].data["text/html"]
    assert "<table" in selection_table
    assert all(column in selection_table for column in report_frame.columns)
    assert "condiciones térmicas" in selection_table
    assert "Ambient thermal" not in selection_table
    assert "correlación" in notebook.cells[9].outputs[1].data["text/plain"]


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
    notebook.cells = notebook.cells[2:]
    assert "10000" in notebook.cells[1].outputs[0].data["text/plain"]


def test_final_notebook_complete_and_populated(report_frame: pl.DataFrame, tmp_path: Path) -> None:
    import base64

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
        "validación cruzada",
    ]:
        assert text.lower() in narrative.lower()
    assert "En esta Pre-Entrega" not in narrative
    code = [c for c in notebook.cells if c.cell_type == "code"]
    assert all(c.outputs for c in code[1:])
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
    for cell in code:
        compile(cell.source, "delivery-cell", "exec")
    comparison = next(c for c in code if "compare_models" in c.source)
    html = comparison.outputs[0].data["text/html"]
    for name in ["Logistic Regression", "Random Forest", "Decision Tree"]:
        assert name in html
    for metric in ["accuracy", "precision", "recall", "f1", "roc_auc", "tn", "fp", "fn", "tp"]:
        assert metric in html
    assert "…" not in html


def test_final_tuning_section(report_frame: pl.DataFrame, tmp_path: Path) -> None:
    from dataclasses import asdict

    from agrofail.compare import choose_model, compare_models
    from agrofail.metrics import evaluate_model
    from agrofail.report import build_final_notebook
    from agrofail.select import select_features

    notebook = nbformat.read(
        build_final_notebook(report_frame, tmp_path / "tuned.ipynb"), as_version=4
    )
    narrative = "\n".join(c.source for c in notebook.cells if c.cell_type == "markdown")
    assert "Ajuste de hiperparámetros y estabilidad" in narrative
    from agrofail.report import _tuning_features
    from agrofail.tuning import tune_models

    assert "solo con entrenamiento" in narrative
    assert "auditoría final independiente" in narrative
    cell = next(c for c in notebook.cells if c.cell_type == "code" and "tune_models" in c.source)
    html = cell.outputs[0].data["text/html"]
    assert all(key in html for key in ["cv_mean", "cv_std", "best_params"])
    train, test = split(clean(report_frame))
    expected = tune_models(
        _tuning_features(select_features(train)),
        train[config.TARGET_COLUMN],
        categorical_columns=(len(config.NUMERIC_COLUMNS),),
    )
    actual = ast.literal_eval(cell.outputs[1].data["text/plain"])
    assert actual == [
        {"name": r.name, "cv_mean": r.cv_mean, "cv_std": r.cv_std, "best_params": r.best_params}
        for r in expected
    ]
    comparison = next(
        c for c in notebook.cells if c.cell_type == "code" and "tuned_results =" in c.source
    )
    assert all(r.name in comparison.outputs[0].data["text/html"] for r in expected)
    metrics = [
        evaluate_model(r, _tuning_features(select_features(test)), test[config.TARGET_COLUMN])
        for r in expected
    ]
    table = compare_models(metrics)
    from agrofail.report import _text_output

    expected_table = pl.DataFrame(
        [{"rank": i, **asdict(row)} for i, row in enumerate(table.rows, 1)]
    )
    assert comparison.outputs[0].data == _text_output(expected_table).data
    assert f"**{choose_model(table).name}** ajustado" in narrative
    choice_cell = next(
        c for c in notebook.cells if c.cell_type == "code" and "choice_data =" in c.source
    )
    assert "F1 medio de CV en entrenamiento=" in choice_cell.outputs[0].data["text/plain"]
    assert "Ranked first" not in choice_cell.outputs[0].data["text/plain"]
    assert "puede conservar la misma familia" not in narrative
    assert "Evaluación de líneas base" in narrative
    images = [o.data["text/plain"] for o in choice_cell.outputs if "image/png" in o.data]
    assert images == ["tuned-confusion-0.png", "tuned-roc-models.png"]


def test_metric_figure_labels_and_contrast(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from matplotlib.figure import Figure

    from agrofail.metrics import ModelMetrics
    from agrofail.report import plot_model_metrics

    figures = []
    monkeypatch.setattr(Figure, "savefig", lambda figure, path: figures.append(figure))
    result = ModelMetrics(
        name="Decision Tree",
        accuracy=0.9,
        precision=0.8,
        recall=0.7,
        f1=0.75,
        roc_auc=0.88,
        tn=1929,
        fp=9,
        fn=21,
        tp=47,
        fpr=[0.0, 1.0],
        tpr=[0.0, 1.0],
    )
    baseline = plot_model_metrics([result], tmp_path, evaluation="baseline")
    tuned = plot_model_metrics([result], tmp_path, evaluation="tuned")
    assert set(baseline).isdisjoint(tuned)
    assert "línea base" in figures[0].axes[0].get_title()
    assert "ajustado" in figures[2].axes[0].get_title()
    texts = figures[0].axes[0].texts
    assert [text.get_text() for text in texts] == ["1929", "9", "21", "47"]
    assert [text.get_color() for text in texts] == ["white", "black", "black", "black"]


def test_spanish_eda_captions(
    report_frame: pl.DataFrame, tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    from matplotlib.figure import Figure

    from agrofail import eda

    figures = []
    monkeypatch.setattr(Figure, "savefig", lambda figure, path: figures.append(figure))
    eda.plot_distributions(report_frame, tmp_path, language="es")
    eda.plot_correlation_heatmap(report_frame, tmp_path, language="es")
    assert figures[0].axes[0].get_title() == f"Distribución de {config.NUMERIC_COLUMNS[0]}"
    assert figures[0].axes[0].get_ylabel() == "Frecuencia"
    assert figures[-1].axes[0].get_title() == "Correlaciones de Pearson entre sensores"


def test_selection_presentation_preserves_internal_policy(report_frame: pl.DataFrame) -> None:
    from agrofail.report import selection_presentation
    from agrofail.select import selection_rationale

    frame = report_frame.with_columns(pl.lit(1).alias("Type_L"), pl.lit(3).alias("extra"))
    rationale = selection_rationale(frame)
    decisions, diagnostics = selection_presentation(rationale)
    assert "Ambient thermal" in rationale.kept[config.NUMERIC_COLUMNS[0]]
    assert diagnostics["variances"] == rationale.variances
    assert diagnostics["correlations"] == rationale.correlations
    rows = {row["column"]: row for row in decisions.to_dicts()}
    assert "sin imponer un orden" in rows["Type_L"]["reason"]
    assert rows["extra"]["decision"] == "excluida"
    assert "evidencia de relevancia" in rows["extra"]["reason"]


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
        notebook.cells = notebook.cells[2:]
        assert "10000" in notebook.cells[1].outputs[0].data["text/plain"]
        if name == "final":
            baseline = ast.literal_eval(notebook.cells[15].outputs[0].data["text/plain"])
            assert [round(row["f1"], 4) for row in baseline] == [0.1772, 0.6286, 0.3095]
            assert [row["fn"] for row in baseline] == [61, 35, 55]
            choice = ast.literal_eval(notebook.cells[23].outputs[0].data["text/plain"])
            assert choice["name"] == "Decision Tree"
            assert "F1=0.7581" in choice["rationale"]["performance"]
            assert "ROC-AUC=0.8877" in choice["rationale"]["performance"]
            assert "negativos=21" in choice["rationale"]["error_types"]
            assert "positivos=9" in choice["rationale"]["error_types"]
            assert "entrenamiento=0.7096" in choice["rationale"]["stability"]
            assert "estándar=0.0436" in choice["rationale"]["stability"]
            assert "detecta 47 fallas" in notebook.cells[24].source
