"""Generate both deliveries with ``uv run python -m agrofail.report``.

Use ``--pre`` or ``--final`` to regenerate only the corresponding artifact.
"""

import argparse
import base64
from dataclasses import asdict
from pathlib import Path
from pprint import pformat

import nbformat
import polars as pl
from matplotlib.figure import Figure

from agrofail import config, eda
from agrofail.clean import clean, detect_outliers, drop_duplicates
from agrofail.compare import choose_model, compare_models
from agrofail.features import apply_encode_and_scale, fit_encode_and_scale
from agrofail.load import load_dataset, validate_schema
from agrofail.metrics import ModelMetrics, evaluate_model
from agrofail.models import train_models
from agrofail.select import select_features, selection_rationale
from agrofail.split import split
from agrofail.tuning import tune_models

_DATASET_PAGE = "https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset"
_DEFAULT_OUTPUT = config.PROJECT_ROOT / "notebooks" / "preentrega.ipynb"
_FINAL_OUTPUT = config.PROJECT_ROOT / "notebooks" / "entrega-final.ipynb"


def _text_output(value: object) -> nbformat.NotebookNode:
    if isinstance(value, pl.DataFrame):
        with pl.Config(tbl_rows=-1, tbl_cols=-1, fmt_str_lengths=200):
            data = {"text/plain": str(value), "text/html": value._repr_html_()}
    else:
        data = {"text/plain": pformat(value, sort_dicts=False)}
    return nbformat.v4.new_output("display_data", data=data)


def _image_output(path: Path) -> nbformat.NotebookNode:
    return nbformat.v4.new_output(
        "display_data",
        data={
            "image/png": base64.b64encode(path.read_bytes()).decode("ascii"),
            "text/plain": path.name,
        },
    )


def _balance(df: pl.DataFrame) -> dict[str, object]:
    counts = eda.summarise(df)["class_balance"]
    return {
        "shape": df.shape,
        "class_counts": counts,
        "class_proportions": {label: count / df.height for label, count in counts.items()},
    }


def build_notebook(df: pl.DataFrame | None = None, output_path: Path = _DEFAULT_OUTPUT) -> Path:
    """Generate a populated v4 delivery notebook from one in-process pipeline run.

    Load the configured CSV when no frame is supplied. Preserve the input frame,
    split before fitting transformations, and never train a prediction model.
    Save EDA PNGs beside the notebook in ``figures/`` and embed their bytes so the
    notebook remains readable without those files. Cells document executable
    Python steps; outputs are captured directly, not through a notebook executor.
    Dataset/stratification errors propagate rather than producing partial results.
    """
    return _build_notebook(df, output_path, final=False)


def build_final_notebook(df: pl.DataFrame | None = None, output_path: Path = _FINAL_OUTPUT) -> Path:
    """Generate all six preparation sections plus evaluated baseline conclusions.

    Reuse the preparation pipeline, fitting only on training rows. Select a
    provisional model on the held-out split; this split is no longer an unbiased
    final audit of the selected model. Tuning uses training-only CV; no operational
    validation occurs.
    """
    return _build_notebook(df, output_path, final=True)


def _build_notebook(df: pl.DataFrame | None, output_path: Path, *, final: bool) -> Path:
    raw = load_dataset() if df is None else df
    validate_schema(raw)
    summary = eda.summarise(raw)
    correlations = eda.correlation_matrix(raw)
    cleaned = clean(raw)
    cleaning = {
        "input_rows": raw.height,
        "duplicates_removed": raw.height - drop_duplicates(raw).height,
        "rows_dropped_missing": drop_duplicates(raw).height - cleaned.height,
        "remaining_rows": cleaned.height,
        "outlier_rows_retained": detect_outliers(cleaned).height,
        "outliers_by_sensor": {
            name: detect_outliers(cleaned, [name]).height for name in config.NUMERIC_COLUMNS
        },
    }
    train_raw, test_raw = split(cleaned)
    train_selected = select_features(train_raw)
    test_selected = select_features(test_raw)
    transformer = fit_encode_and_scale(train_selected)
    train_encoded = apply_encode_and_scale(train_selected, transformer)
    test_encoded = apply_encode_and_scale(test_selected, transformer)
    rationale = selection_rationale(train_raw)
    decisions = pl.DataFrame(
        [
            {"column": name, "decision": decision, "reason": reason}
            for decision, reasons in [("kept", rationale.kept), ("dropped", rationale.dropped)]
            for name, reason in reasons.items()
        ]
    )
    train, test = train_encoded, test_encoded
    provenance = {
        "source_page": _DATASET_PAGE,
        "download_url": config.DATASET_URL,
        "license": config.DATASET_LICENSE,
        "citation": config.DATASET_CITATION,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    figure_dir = output_path.parent / "figures"
    figures = eda.plot_distributions(raw, figure_dir)
    figures.append(eda.plot_correlation_heatmap(raw, figure_dir))
    cells: list[nbformat.NotebookNode] = []

    def section(markdown: str, source: str, outputs: list[nbformat.NotebookNode]) -> None:
        cells.extend(
            [
                nbformat.v4.new_markdown_cell(markdown),
                nbformat.v4.new_code_cell(
                    source, execution_count=len(cells) // 2 + 1, outputs=outputs
                ),
            ]
        )

    section(
        "## 1. Selección del dataset\n\n"
        "AI4I 2020 (UCI) permite estudiar la predicción binaria de `Machine failure` "
        "para mantenimiento predictivo. Sus temperaturas, velocidad, torque y desgaste "
        "justifican un problema análogo al mantenimiento de maquinaria agropecuaria. "
        "Son datos industriales sintéticos: este encuadre didáctico no demuestra "
        "validez operativa agrícola.\n\n"
        f"Fuente: [página UCI]({_DATASET_PAGE}). "
        f"Descarga oficial: {config.DATASET_URL}.\n\n"
        f"Licencia: {config.DATASET_LICENSE}. Cita: {config.DATASET_CITATION}.\n\n"
        "Notebook generado desde Python; los resultados ya están incorporados. "
        "Para volver a ejecutar las celdas, usar el entorno del proyecto desde su raíz.",
        "from pathlib import Path\nfrom pprint import pprint\n"
        "\nimport polars as pl\n\nfrom agrofail import config, eda\n"
        "from agrofail.load import load_dataset\n\n"
        "raw = load_dataset()\npprint({'shape': raw.shape, 'target': config.TARGET_COLUMN})",
        [_text_output({"shape": raw.shape, "target": config.TARGET_COLUMN})],
    )
    section(
        "## 2. Análisis exploratorio inicial (EDA)\n\n"
        "Se inspeccionan dimensiones, tipos, valores faltantes (nulos y NaN), "
        "estadísticas descriptivas y balance de clases. Los histogramas muestran "
        "las distribuciones de sensores; el mapa de calor resume correlaciones de "
        "Pearson. Correlación no implica causalidad ni utilidad predictiva. "
        "Esta exploración no ajusta parámetros de transformación.",
        "from IPython.display import Image, display\n\n"
        "pprint(eda.summarise(raw))\nprint(eda.correlation_matrix(raw))\n"
        "figure_dir = Path('notebooks/figures')\n"
        "figures = eda.plot_distributions(raw, figure_dir)\n"
        "figures.append(eda.plot_correlation_heatmap(raw, figure_dir))\n"
        "for path in figures:\n    display(Image(filename=str(path)))",
        [_text_output(summary), _text_output(correlations), *map(_image_output, figures)],
    )
    section(
        "## 3. Limpieza de datos\n\n"
        "Se eliminan duplicados exactos conservando la primera fila y se descartan "
        "filas con nulos en sensores, tipo u objetivo, sin imputación. Esta política "
        "no trata NaN como nulo: los sensores no finitos fallan en la transformación. "
        "Los valores atípicos se reportan mediante límites IQR (1,5 veces el rango "
        "intercuartílico), pero no se eliminan ni recortan: pueden indicar fallas. "
        "Los conteos por sensor pueden solaparse; se informa también el total de filas. "
        "La pérdida por faltantes debe revisarse por posible sesgo de selección.",
        "from agrofail.clean import clean, detect_outliers, drop_duplicates\n\n"
        "cleaned = clean(raw)\n"
        "pprint({'input_rows': raw.height,\n"
        "        'duplicates_removed': raw.height - drop_duplicates(raw).height,\n"
        "        'rows_dropped_missing': drop_duplicates(raw).height - cleaned.height,\n"
        "        'remaining_rows': cleaned.height,\n"
        "        'outlier_rows_retained': detect_outliers(cleaned).height,\n"
        "        'outliers_by_sensor': {name: detect_outliers(cleaned, [name]).height\n"
        "                               for name in config.NUMERIC_COLUMNS}})",
        [_text_output(cleaning)],
    )
    section(
        "## 4. Transformaciones básicas\n\n"
        "Aunque la división se presenta en la sección 6, se realiza ANTES del ajuste. "
        "Se ajustan categorías y escalas solo con entrenamiento y se aplican al test "
        "sin reajuste. One-hot evita imponer un orden a `Type`; categorías nuevas "
        "se representan con ceros. StandardScaler centra y escala sensores según "
        "media y desviación de entrenamiento. Se muestran filas antes/después y "
        "parámetros aprendidos. Se excluyen identificadores, modos de falla y "
        "columnas no configuradas mediante selección de dominio sobre las columnas "
        "originales (justificada en la sección 5); el objetivo permanece como etiqueta.",
        "from agrofail.features import apply_encode_and_scale, fit_encode_and_scale\n"
        "from agrofail.select import select_features\n"
        "from agrofail.split import split\n\n"
        "train_raw, test_raw = split(cleaned)\n"
        "train_selected = select_features(train_raw)\n"
        "test_selected = select_features(test_raw)\n"
        "transformer = fit_encode_and_scale(train_selected)\n"
        "train_encoded = apply_encode_and_scale(train_selected, transformer)\n"
        "test_encoded = apply_encode_and_scale(test_selected, transformer)\n"
        "print(train_raw.head())\nprint(train_encoded.head())\nprint(test_encoded.head())\n"
        "pprint({'sensor_means': transformer.scaler.mean_.tolist(),\n"
        "        'sensor_scales': transformer.scaler.scale_.tolist(),\n"
        "        'categories': transformer.encoder.categories_[0].tolist(),\n"
        "        'removed_columns': [c for c in train_raw.columns\n"
        "                            if c not in transformer.output_columns]})",
        [
            _text_output(train_raw.head()),
            _text_output(train_encoded.head()),
            _text_output(test_encoded.head()),
            _text_output(
                {
                    "sensor_means": transformer.scaler.mean_.tolist(),
                    "sensor_scales": transformer.scaler.scale_.tolist(),
                    "categories": transformer.encoder.categories_[0].tolist(),
                    "removed_columns": [
                        c for c in train_raw.columns if c not in transformer.output_columns
                    ],
                }
            ),
        ],
    )
    section(
        "## 5. Selección de variables\n\n"
        "La tabla presenta la política de dominio y sus razones: conservar sensores "
        "y tipo; excluir identificadores y modos de falla para evitar fuga de información. "
        "El objetivo se conserva como etiqueta, nunca como predictor. La varianza y "
        "correlación en entrenamiento son diagnósticos, no reglas automáticas de "
        "eliminación. No se inventan variables derivadas ni importancias de modelos.",
        "from agrofail.select import selection_rationale\n\n"
        "rationale = selection_rationale(train_raw)\n"
        "decisions = pl.DataFrame([{'column': name, 'decision': decision, 'reason': reason}\n"
        "    for decision, reasons in [('kept', rationale.kept), ('dropped', rationale.dropped)]\n"
        "    for name, reason in reasons.items()])\n"
        "with pl.Config(tbl_rows=-1, tbl_cols=-1, fmt_str_lengths=200):\n"
        "    display(decisions)\n"
        "pprint({'variances': rationale.variances, 'correlations': rationale.correlations,\n"
        "        'notes': rationale.notes})\n"
        "train, test = train_encoded, test_encoded",
        [
            _text_output(decisions),
            _text_output(
                {
                    "variances": rationale.variances,
                    "correlations": rationale.correlations,
                    "notes": rationale.notes,
                }
            ),
        ],
    )
    section(
        "## 6. División del dataset\n\n"
        f"Se utiliza una división estratificada con fracción de prueba {config.TEST_SIZE} "
        f"y semilla {config.RANDOM_STATE}. Las proporciones se conservan sujetas al "
        "redondeo de filas. La separación previa al ajuste protege la evaluación; "
        "ambas particiones comparten el esquema aprendido en entrenamiento. "
        + (
            "Los modelos se entrenan a continuación."
            if final
            else "En esta Pre-Entrega no se entrena ningún modelo."
        ),
        "for name, frame in [('train', train), ('test', test)]:\n"
        "    counts = eda.summarise(frame)['class_balance']\n"
        "    pprint({name: {'shape': frame.shape, 'class_counts': counts,\n"
        "                   'class_proportions': {label: count / frame.height\n"
        "                                         for label, count in counts.items()}}})",
        [_text_output({"train": _balance(train), "test": _balance(test)})],
    )
    if final:
        cells.extend(_modeling_cells(train, test, figure_dir, train_selected, test_selected))
    section(
        "## Anexo: fuente y referencias\n\n"
        f"Fuente: [AI4I 2020 en UCI]({_DATASET_PAGE}).\n\n"
        f"Descarga oficial: {config.DATASET_URL}.\n\n"
        f"Licencia: [{config.DATASET_LICENSE}](https://creativecommons.org/licenses/by/4.0/).\n\n"
        f"Referencias: {config.DATASET_CITATION}.\n\n"
        "Son datos sintéticos industriales, no mediciones de maquinaria agrícola; "
        "la analogía no sustituye validación con datos del sector.",
        f"provenance = {pformat(provenance, sort_dicts=False)}\npprint(provenance)",
        [_text_output(provenance)],
    )
    notebook = nbformat.v4.new_notebook(
        cells=cells,
        metadata={
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python"},
        },
    )
    nbformat.validate(notebook)
    nbformat.write(notebook, output_path)
    return output_path


def plot_model_metrics(results: list[ModelMetrics], figure_dir: Path) -> list[Path]:
    """Save labeled confusion matrices and a combined probability-based ROC plot."""
    figure_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for index, result in enumerate(results):
        figure = Figure(figsize=(4, 4))
        axis = figure.subplots()
        counts = [[result.tn, result.fp], [result.fn, result.tp]]
        axis.imshow(counts, cmap="Blues")
        for row in range(2):
            for column in range(2):
                axis.text(column, row, str(counts[row][column]), ha="center", va="center")
        axis.set(
            xticks=[0, 1],
            yticks=[0, 1],
            xlabel="Predicción",
            ylabel="Valor real",
            title=result.name,
        )
        figure.tight_layout()
        path = figure_dir / f"confusion-{index}.png"
        figure.savefig(path)
        paths.append(path)
    figure = Figure(figsize=(6, 4))
    axis = figure.subplots()
    for result in results:
        axis.plot(result.fpr, result.tpr, label=f"{result.name} (AUC={result.roc_auc:.4f})")
    axis.plot([0, 1], [0, 1], "--", color="gray", label="Azar")
    axis.set(
        xlabel="Tasa de falsos positivos",
        ylabel="Tasa de verdaderos positivos",
        title="Curvas ROC",
        xlim=(0, 1),
        ylim=(0, 1),
    )
    axis.legend()
    figure.tight_layout()
    path = figure_dir / "roc-models.png"
    figure.savefig(path)
    return [*paths, path]


def _tuning_features(frame: pl.DataFrame) -> pl.DataFrame:
    """Use raw sensors and fixed domain category codes, without learned transforms."""
    return frame.select(
        *config.NUMERIC_COLUMNS,
        pl.col("Type").replace_strict({"L": 0, "M": 1, "H": 2}).alias("Type"),
    )


def _modeling_cells(
    train: pl.DataFrame,
    test: pl.DataFrame,
    figure_dir: Path,
    train_selected: pl.DataFrame,
    test_selected: pl.DataFrame,
) -> list[nbformat.NotebookNode]:
    target = config.TARGET_COLUMN
    models = train_models(train.drop(target), train[target])
    results = [evaluate_model(model, test.drop(target), test[target]) for model in models]
    table = compare_models(results)
    comparison = pl.DataFrame([{"rank": i, **asdict(row)} for i, row in enumerate(table.rows, 1)])
    choice = choose_model(table)
    best = table.rows[0]
    interpretations = {
        "Logistic Regression": "sus coeficientes permiten inspeccionar asociaciones lineales, "
        "no causalidad",
        "Decision Tree": "su profundidad máxima de 4 facilita inspeccionar reglas breves",
        "Random Forest": "su conjunto de árboles es menos transparente que un árbol simple "
        "o un modelo lineal",
    }
    cells = []

    def section(markdown: str, source: str, outputs: list[nbformat.NotebookNode]) -> None:
        cells.extend(
            [
                nbformat.v4.new_markdown_cell(markdown),
                nbformat.v4.new_code_cell(
                    source, execution_count=7 + len(cells) // 2, outputs=outputs
                ),
            ]
        )

    section(
        "## 7. Modelos entrenados\n\n"
        "Se ajustan tres líneas base sin optimización: regresión logística (máximo 1000 "
        "iteraciones), Random Forest (100 árboles) y árbol de decisión (profundidad 4). "
        "No se ponderan las clases. Todos usan la misma partición y los mismos sensores "
        "y categorías, sin identificadores ni modos de falla. La regresión incluye "
        "StandardScaler ajustado solo con entrenamiento; los árboles no requieren escala. "
        "La escala externa ya aprendida se conserva para reproducir la preparación. "
        "La semilla fija permite reproducibilidad, no demuestra estabilidad.",
        "from agrofail.models import train_models\n\n"
        "target = config.TARGET_COLUMN\n"
        "models = train_models(train.drop(target), train[target])\n"
        "pprint({model.name: str(model.estimator) for model in models})",
        [_text_output({model.name: str(model.estimator) for model in models})],
    )
    section(
        "## 8. Evaluación: métricas, matrices de confusión y curvas ROC\n\n"
        "La clase positiva (1) es la falla. Las matrices tienen valores reales en filas "
        "y predicciones en columnas, en orden [0, 1]. Se muestran verdaderos negativos "
        "(tn), falsos positivos (fp), falsos negativos (fn) y verdaderos positivos (tp). "
        "Accuracy mide aciertos globales; precisión, la proporción de alarmas correctas; "
        "recall, la proporción de fallas detectadas; F1 combina precisión y recall. "
        "Las curvas ROC y su área usan probabilidades, no predicciones binarias; las "
        "matrices usan la decisión predeterminada de cada estimador.",
        "from agrofail.metrics import evaluate_model\n"
        "from agrofail.report import plot_model_metrics\n\n"
        "results = [evaluate_model(model, test.drop(target), test[target]) for model in models]\n"
        "pprint([{k: v for k, v in vars(result).items() if k not in ('fpr', 'tpr')}\n"
        "        for result in results])\n"
        "for path in plot_model_metrics(results, figure_dir):\n"
        "    display(Image(filename=str(path)))",
        [
            _text_output(
                [
                    {k: v for k, v in vars(result).items() if k not in ("fpr", "tpr")}
                    for result in results
                ]
            ),
            *map(_image_output, plot_model_metrics(results, figure_dir)),
        ],
    )
    section(
        "## 9. Comparación de modelos\n\n"
        "Se ordenan por F1 descendente, luego ROC-AUC y accuracy descendentes; los "
        "empates exactos se resuelven por nombre ascendente. F1 tiene prioridad ante "
        "el desbalance porque combina detección de fallas y fiabilidad de alarmas. "
        "Accuracy por sí sola favorece a la clase mayoritaria; ROC-AUC complementa "
        "la discriminación pero no establece un costo operativo ni un umbral óptimo. "
        "La tabla HTML incluye todas las filas y columnas.",
        "from dataclasses import asdict\n"
        "\nfrom agrofail.compare import choose_model, compare_models\n\n"
        "table = compare_models(results)\n"
        "comparison = pl.DataFrame([{'rank': i, **asdict(row)}\n"
        "                           for i, row in enumerate(table.rows, 1)])\n"
        "with pl.Config(tbl_rows=-1, tbl_cols=-1):\n    display(comparison)",
        [_text_output(comparison)],
    )
    baseline_choice = choice
    tuning_train = _tuning_features(train_selected)
    tuning_test = _tuning_features(test_selected)
    categorical_columns = (len(config.NUMERIC_COLUMNS),)
    tuned = tune_models(tuning_train, train[target], categorical_columns=categorical_columns)
    stability = [
        {
            "name": model.name,
            "cv_mean": model.cv_mean,
            "cv_std": model.cv_std,
            "best_params": model.best_params,
        }
        for model in tuned
    ]
    section(
        "## 9.1. Ajuste de hiperparámetros y estabilidad\n\n"
        "GridSearchCV maximiza F1 mediante validación cruzada estratificada de 5 pliegues, "
        f"con mezcla y semilla {config.RANDOM_STATE}, solo con entrenamiento. "
        "La grilla pequeña explora C con penalización L2 compatible con el solver; "
        "50/100 árboles, profundidad 8/sin límite y hojas de 1/3 registros en el bosque; "
        "profundidad 4/8 y hojas de 1/3 en el árbol. No optimiza pesos ni umbrales. "
        "Se usan sensores sin escala previa y códigos fijos L=0, M=1, H=2, tratados "
        "como categorías, no magnitudes. One-hot y escalado logístico se ajustan dentro "
        "de cada pliegue para evitar fuga desde validación. El mejor pipeline se reajusta "
        "con todo entrenamiento. Test no participa en la búsqueda.\n\n"
        "cv_mean y cv_std son media y desviación estándar poblacional del F1 de los "
        "pliegues del candidato ganador. Miden variación interna, no un intervalo de "
        "confianza ni validación independiente: los mismos pliegues eligen parámetros. "
        "Una desviación pequeña no prueba robustez entre temporadas o establecimientos.",
        "from pprint import pformat\n\n"
        "from agrofail.report import _tuning_features\n"
        "from agrofail.tuning import tune_models\n\n"
        "tuning_train = _tuning_features(train_selected)\n"
        "tuning_test = _tuning_features(test_selected)\n"
        "tuned = tune_models(tuning_train, train[target],\n"
        "                    categorical_columns=(len(config.NUMERIC_COLUMNS),))\n"
        "stability = [{'name': m.name, 'cv_mean': m.cv_mean, 'cv_std': m.cv_std,\n"
        "              'best_params': m.best_params} for m in tuned]\n"
        "stability_table = pl.DataFrame([\n"
        "    {**row, 'best_params': pformat(row['best_params'])} for row in stability])\n"
        "with pl.Config(tbl_rows=-1, tbl_cols=-1, fmt_str_lengths=200):\n"
        "    display(stability_table)\npprint(stability)",
        [
            _text_output(
                pl.DataFrame(
                    [{**row, "best_params": pformat(row["best_params"])} for row in stability]
                )
            ),
            _text_output(stability),
        ],
    )
    tuned_results = [evaluate_model(model, tuning_test, test[target]) for model in tuned]
    table = compare_models(tuned_results)
    comparison = pl.DataFrame([{"rank": i, **asdict(row)} for i, row in enumerate(table.rows, 1)])
    choice = choose_model(table)
    best = table.rows[0]
    selected = next(model for model in tuned if model.name == choice.name)
    choice_data = asdict(choice)
    choice_data["rationale"]["stability"] = (
        f"Training CV F1 mean={selected.cv_mean:.4f}, std={selected.cv_std:.4f}; "
        "selected on these folds, not an independent audit or domain validation."
    )
    tree = next(model for model in tuned if model.name == "Decision Tree")
    if choice.name == "Decision Tree":
        choice_data["rationale"]["interpretability"] = (
            f"The tuned tree has maximum depth {tree.best_params['classifier__max_depth']}; "
            "inspect its rules before claiming simplicity."
        )
    interpretations["Decision Tree"] = (
        f"su profundidad máxima ajustada de {tree.best_params['classifier__max_depth']} "
        "permite inspeccionar reglas, con complejidad mayor si aumenta la profundidad"
    )
    section(
        "## 9.2. Comparación ajustada en prueba\n\n"
        "Se evalúan los pipelines ajustados con el mismo test y la misma regla F1, "
        "ROC-AUC y accuracy. No se garantiza mejora frente a las líneas base. "
        f"La elección pasa de **{baseline_choice.name}** a **{choice.name}** "
        "(puede conservar la misma familia). La elección final se basa en esta tabla.",
        "tuned_results = [evaluate_model(model, tuning_test, test[target]) for model in tuned]\n"
        "table = compare_models(tuned_results)\n"
        "comparison = pl.DataFrame([{'rank': i, **asdict(row)}\n"
        "                           for i, row in enumerate(table.rows, 1)])\n"
        "display(comparison)",
        [_text_output(comparison)],
    )
    section(
        "## 10. Elección justificada y reflexión técnica\n\n"
        f"Se propone **{choice.name}** ajustado como modelo provisional, no como sistema listo "
        "para producción.\n\n"
        f"- **Rendimiento:** F1={best.f1:.4f}, ROC-AUC={best.roc_auc:.4f}, "
        f"accuracy={best.accuracy:.4f}, precisión={best.precision:.4f} y recall={best.recall:.4f}; "
        "ocupa el primer puesto bajo la regla explícita.\n"
        f"- **Tipos de error:** {best.fn} falsos negativos y {best.fp} falsos positivos. "
        "Una falla omitida puede causar una parada inesperada; una falsa alarma puede "
        "generar inspección innecesaria. No se dispone de costos medidos: F1 es un "
        "compromiso inicial, no una demostración de menor costo.\n"
        f"- **Estabilidad:** F1 medio de validación cruzada={selected.cv_mean:.4f}, "
        f"desviación estándar={selected.cv_std:.4f} en 5 pliegues de entrenamiento. "
        "Esta variación medida no demuestra robustez temporal ni agrícola.\n"
        f"- **Interpretabilidad:** {interpretations[choice.name]}. Esta limitación "
        "debe considerarse al explicar alarmas al equipo de mantenimiento.\n"
        "- **Adecuación al dominio:** sensores y desgaste son relevantes para el "
        "mantenimiento, pero los datos sintéticos industriales no validan uso agrícola.\n\n"
        "La comparación usa test para elegir entre modelos: por ello deja de ser una "
        "auditoría final independiente del elegido. Se necesita validación posterior "
        "con datos nuevos. Se ajustaron hiperparámetros en entrenamiento, no umbrales.",
        "choice = choose_model(table)\n"
        "selected = next(m for m in tuned if m.name == choice.name)\n"
        "choice_data = asdict(choice)\n"
        "choice_data['rationale']['stability'] = (\n"
        "    f'Training CV F1 mean={selected.cv_mean:.4f}, std={selected.cv_std:.4f}; '\n"
        "    'selected on these folds, not an independent audit or domain validation.')\n"
        "if choice.name == 'Decision Tree':\n"
        "    choice_data['rationale']['interpretability'] = (\n"
        '        f"The tuned tree has maximum depth '
        "{selected.best_params['classifier__max_depth']}; \"\n"
        "        'inspect its rules before claiming simplicity.')\n"
        "pprint(choice_data)",
        [_text_output(choice_data)],
    )
    positives = int(test[target].sum())
    section(
        "## 11. Hallazgos y recomendaciones\n\n"
        f"La evaluación incluye {test.height} registros y {positives} fallas "
        f"({positives / test.height:.2%}). El modelo ajustado elegido detecta {best.tp} fallas "
        f"y omite {best.fn}; genera {best.fp} falsas alarmas. Estos conteos permiten "
        "discutir el mantenimiento más directamente que accuracy aislada.\n\n"
        "Se recomienda recopilar registros reales de maquinaria agrícola con fechas, "
        "equipos, condiciones de operación y fallas verificadas; validar por tiempo y "
        "por equipo para evitar fugas y comprobar estabilidad. Antes de desplegar, "
        "cuantificar costos de inspección y parada, acordar una sensibilidad mínima "
        "y evaluar umbrales en validación independiente. Supervisar desbalance, "
        "calibración y deriva de sensores; mantener revisión humana de las alertas. "
        "La síntesis didáctica es viable, pero no prueba eficacia en campo ni causalidad. "
        "Los próximos experimentos no se presentan como resultados ya obtenidos.",
        "pprint({'evaluated_rows': test.height, 'failures': int(test[target].sum()),\n"
        "        'selected_model': choice.name})",
        [
            _text_output(
                {
                    "evaluated_rows": test.height,
                    "failures": positives,
                    "selected_model": choice.name,
                }
            )
        ],
    )
    return cells


def main() -> None:
    """Generate both notebooks by default; --pre/--final restrict regeneration."""
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--pre", action="store_true", help="Generate only preentrega.ipynb")
    mode.add_argument("--final", action="store_true", help="Generate only entrega-final.ipynb")
    args = parser.parse_args()
    if not args.final:
        print(build_notebook())
    if not args.pre:
        print(build_final_notebook())


if __name__ == "__main__":
    main()
