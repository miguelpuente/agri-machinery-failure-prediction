"""Generate the delivery notebook from the Python pipeline."""

from pathlib import Path

import polars as pl


def build_notebook(df: pl.DataFrame, output_path: Path) -> Path:
    """Build the delivery artifact without using notebooks as work files."""
    raise NotImplementedError("TODO(T9): implement delivery notebook generation")
