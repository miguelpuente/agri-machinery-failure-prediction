"""Assignment section 6: training and test split."""

import numpy as np
import polars as pl
from sklearn.model_selection import train_test_split

from agrofail import config


def split(
    df: pl.DataFrame,
    *,
    test_size: float = config.TEST_SIZE,
    random_state: int = config.RANDOM_STATE,
) -> tuple[pl.DataFrame, pl.DataFrame]:
    """Return reproducible stratified (train, test) frames without mutating input.

    Split BEFORE fitting any learned transformation: fit encoding, scaling and
    any data-driven selection on training rows only, then reuse on test rows.
    ``test_size`` is a fraction strictly between zero and one (e.g. 0.2 or 0.3).
    Stratification preserves target proportions subject to integer rounding.
    Missing targets and insufficient class support raise ValueError; never fall
    back silently to an unstratified split. sklearn supplies feasibility errors.

    Only row indices and target labels cross the NumPy frontier; gathering the
    original Polars rows preserves mixed dtypes, column order and schema. Output
    rows follow sklearn's shuffled order, deterministically for the same seed.
    """
    if config.TARGET_COLUMN not in df.columns:
        raise ValueError(f"Missing required target column: {config.TARGET_COLUMN}")
    target = df[config.TARGET_COLUMN]
    if target.null_count():
        raise ValueError("Cannot stratify a target with missing/null labels")
    if not 0 < test_size < 1:
        raise ValueError("test_size must be a fraction strictly between zero and one")
    train_indices, test_indices = train_test_split(
        np.arange(df.height),
        test_size=test_size,
        random_state=random_state,
        stratify=target.to_numpy(),
    )
    return df[train_indices], df[test_indices]
