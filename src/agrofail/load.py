"""Assignment section 1: dataset selection and loading."""

from pathlib import Path

import polars as pl

from agrofail import config


def validate_schema(df: pl.DataFrame) -> None:
    """Check column names, regardless of order; raise ValueError for schema mismatches."""
    expected = {
        *config.ID_COLUMNS,
        *config.CATEGORICAL_COLUMNS,
        *config.NUMERIC_COLUMNS,
        config.TARGET_COLUMN,
        *config.FAILURE_MODE_COLUMNS,
    }
    actual = set(df.columns)
    missing = sorted(expected - actual)
    unexpected = sorted(actual - expected)
    if missing or unexpected:
        raise ValueError(
            f"Invalid dataset schema: missing columns: {missing}; unexpected columns: {unexpected}"
        )


def load_dataset(path: Path = config.RAW_DATASET_PATH) -> pl.DataFrame:
    """Read a UTF-8 CSV and validate its column names before returning the dataset.

    Defaults to the configured raw dataset path. Raises ValueError when expected
    columns are missing or unexpected columns are present.
    """
    df = pl.read_csv(path)
    validate_schema(df)
    return df
