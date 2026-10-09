"""Assignment section 2: exploratory data analysis."""

import re
from pathlib import Path

import polars as pl
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure

from agrofail import config


def _sensor_columns(df: pl.DataFrame) -> list[str]:
    return [name for name in config.NUMERIC_COLUMNS if name in df.columns]


def _sensor_values(df: pl.DataFrame, name: str) -> pl.Series:
    # Treat NaN as missing for analysis without modifying the input frame.
    return df[name].cast(pl.Float64).fill_nan(None)


def summarise(df: pl.DataFrame) -> dict[str, object]:
    """Return dimensions, column quality, sensor statistics and target counts.

    The keys are row_count, column_count, columns, numeric and class_balance.
    Each column has its dtype string and missing_count (nulls plus floating NaNs).
    Numeric statistics cover present config.NUMERIC_COLUMNS only, excluding IDs,
    target and failure-mode flags. Standard deviation uses the sample convention
    (ddof=1); unavailable statistics are None. Class balance maps target values
    (including None) to counts, or is None when the target is absent.
    """
    columns = {}
    for name, dtype in df.schema.items():
        values = df[name]
        missing = values.null_count()
        if dtype.is_float():
            missing += values.is_nan().sum()
        columns[name] = {"dtype": str(dtype), "missing_count": missing}

    numeric = {}
    for name in _sensor_columns(df):
        values = _sensor_values(df, name)
        numeric[name] = {
            "min": values.min(),
            "max": values.max(),
            "mean": values.mean(),
            "median": values.median(),
            "std": values.std(ddof=1),
        }

    balance = None
    if config.TARGET_COLUMN in df.columns:
        counts = df.group_by(config.TARGET_COLUMN).len()
        balance = dict(counts.iter_rows())
    return {
        "row_count": df.height,
        "column_count": df.width,
        "columns": columns,
        "numeric": numeric,
        "class_balance": balance,
    }


def correlation_matrix(df: pl.DataFrame) -> pl.DataFrame:
    """Return Pearson sensor correlations with row labels in the 'column' column.

    Rows and numeric columns follow config.NUMERIC_COLUMNS order, restricted to
    sensors present in df. Nulls and NaNs are excluded pairwise. Undefined
    correlations (constant columns or insufficient pairs) are NaN or null.
    With no sensors, return an empty frame containing only the label column.
    """
    names = _sensor_columns(df)
    result = pl.DataFrame({"column": names}, schema={"column": pl.String})
    if not names:
        return result
    sensors = pl.DataFrame({name: _sensor_values(df, name) for name in names})
    for name in names:
        correlations = [sensors.select(pl.corr(name, other)).item() for other in names]
        result = result.with_columns(pl.Series(name, correlations, dtype=pl.Float64))
    return result


def plot_distributions(df: pl.DataFrame, output_dir: Path, *, language: str = "en") -> list[Path]:
    """Save one PNG histogram per present sensor and return paths in sensor order.

    Create output_dir if necessary. Filenames use lowercase sensor names with
    punctuation replaced by underscores and the suffix '_histogram.png'. Nulls
    and NaNs are omitted, and rendering uses an explicit headless Agg canvas.
    Existing files with the same names are overwritten.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for name in _sensor_columns(df):
        figure = Figure(figsize=(6, 4), layout="constrained")
        FigureCanvasAgg(figure)
        axes = figure.subplots()
        axes.hist(_sensor_values(df, name).drop_nulls().to_numpy(), bins=20)
        axes.set(
            title=f"Distribución de {name}" if language == "es" else f"Distribution of {name}",
            xlabel=name,
            ylabel="Frecuencia" if language == "es" else "Count",
        )
        slug = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")
        path = output_dir / f"{slug}_histogram.png"
        figure.savefig(path)
        paths.append(path)
    return paths


def plot_correlation_heatmap(df: pl.DataFrame, output_dir: Path, *, language: str = "en") -> Path:
    """Save correlation_heatmap.png using Agg and return its path.

    Both axes show sensor names, with a fixed Pearson scale from -1 to 1.
    Undefined correlations are blank. Raise ValueError if no sensor columns are
    present; otherwise create output_dir and overwrite any existing heatmap.
    """
    matrix = correlation_matrix(df)
    names = matrix["column"].to_list()
    if not names:
        raise ValueError("No numeric sensor columns available for a correlation heatmap")
    output_dir.mkdir(parents=True, exist_ok=True)
    figure = Figure(figsize=(8, 7), layout="constrained")
    FigureCanvasAgg(figure)
    axes = figure.subplots()
    image = axes.imshow(matrix.select(names).to_numpy(), vmin=-1, vmax=1, cmap="coolwarm")
    axes.set_xticks(range(len(names)), names, rotation=45, ha="right")
    axes.set_yticks(range(len(names)), names)
    axes.set_title(
        "Correlaciones de Pearson entre sensores"
        if language == "es"
        else "Sensor Pearson correlations"
    )
    figure.colorbar(
        image,
        ax=axes,
        label="Correlación de Pearson" if language == "es" else "Pearson correlation",
    )
    path = output_dir / "correlation_heatmap.png"
    figure.savefig(path)
    return path
