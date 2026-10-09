"""Generate the delivery notebook from the Python pipeline."""

import base64
from pathlib import Path
from pprint import pformat

import nbformat
import polars as pl

from agrofail import config, eda
from agrofail.clean import clean, detect_outliers, drop_duplicates
from agrofail.features import apply_encode_and_scale, fit_encode_and_scale
from agrofail.load import load_dataset, validate_schema
from agrofail.select import select_features, selection_rationale
from agrofail.split import split

_DATASET_PAGE = "https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset"
_DEFAULT_OUTPUT = config.PROJECT_ROOT / "notebooks" / "preentrega.ipynb"


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
        "En esta Pre-Entrega no se entrena ningún modelo.",
        "for name, frame in [('train', train), ('test', test)]:\n"
        "    counts = eda.summarise(frame)['class_balance']\n"
        "    pprint({name: {'shape': frame.shape, 'class_counts': counts,\n"
        "                   'class_proportions': {label: count / frame.height\n"
        "                                         for label, count in counts.items()}}})",
        [_text_output({"train": _balance(train), "test": _balance(test)})],
    )
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


def main() -> None:
    """Regenerate the course delivery notebook from the local official CSV."""
    print(build_notebook())


if __name__ == "__main__":
    main()
