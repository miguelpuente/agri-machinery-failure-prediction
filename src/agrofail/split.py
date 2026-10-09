"""Assignment section 6: training and test split."""

import polars as pl


def split(df: pl.DataFrame) -> tuple[pl.DataFrame, pl.DataFrame]:
    """Separate the dataset into reproducible training and test partitions."""
    raise NotImplementedError("TODO(T8): implement training and test split")
