"""Assignment section 3: conservative, non-mutating data cleaning.

Keep the first exact duplicate, then discard rows with null targets or predictors.
Complete-case deletion avoids fabricating sensor readings and fitting imputation
statistics before a later train/test split. The official dataset has no nulls;
if a future dataset does, inspect the loss of rows and possible selection bias.

Outlier policy: report only. IQR fences are statistical flags, not physical
validity limits. Extreme sensor readings may describe real machine failures,
so neither cap nor discard them without domain evidence. Use ``detect_outliers``
to inspect these rows separately; ``clean`` deliberately retains their values.
Identifiers and failure-mode labels are not predictors and are not imputed.
"""

from collections.abc import Sequence

import polars as pl

from agrofail import config


def drop_duplicates(df: pl.DataFrame) -> pl.DataFrame:
    """Remove exact whole-row duplicates, keeping the first in original row order."""
    return df.unique(keep="first", maintain_order=True)


def handle_missing(df: pl.DataFrame) -> pl.DataFrame:
    """Drop rows with null targets or configured predictors, without imputation.

    Requires the target and all configured categorical/numeric predictor columns.
    Nulls in identifiers, failure modes or other columns do not remove a row.
    This rule treats Polars nulls as missing, not floating-point NaN values.
    """
    return df.drop_nulls(
        subset=[config.TARGET_COLUMN, *config.CATEGORICAL_COLUMNS, *config.NUMERIC_COLUMNS]
    )


def detect_outliers(
    df: pl.DataFrame, columns: Sequence[str] = config.NUMERIC_COLUMNS
) -> pl.DataFrame:
    """Report rows outside any column's Q1 - 1.5*IQR or Q3 + 1.5*IQR fences.

    Use linear-interpolated quartiles of non-null observations, with strict
    comparisons (values on a fence are retained). Defaults to sensor columns,
    excluding targets, identifiers and failure modes. A zero IQR flags values
    differing from the quartiles; empty/all-null columns flag nothing. Null
    observations themselves are not outliers. Return each flagged row once in
    input order with its original schema and values, without modifying input.
    """
    flags: list[pl.Expr] = []
    for column in columns:
        values = df[column]
        q1 = values.quantile(0.25, interpolation="linear")
        q3 = values.quantile(0.75, interpolation="linear")
        if q1 is None or q3 is None:
            continue
        iqr = q3 - q1
        flags.append((pl.col(column) < q1 - 1.5 * iqr) | (pl.col(column) > q3 + 1.5 * iqr))
    if not flags:
        return df.clear()
    return df.filter(pl.any_horizontal(flags).fill_null(False))


def clean(df: pl.DataFrame) -> pl.DataFrame:
    """Deduplicate, drop null targets/predictors, and retain all sensor outliers.

    Apply section 3's report-only outlier policy: no capping or removal. Call
    ``detect_outliers`` on the result for inspection when needed. Preserve
    column names, dtypes and surviving row order; do not mutate the input.
    Encoding, scaling, feature selection and splitting belong to later stages.
    """
    return handle_missing(drop_duplicates(df))
