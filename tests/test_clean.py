import polars as pl
import pytest
from polars.testing import assert_frame_equal

from agrofail import config
from agrofail.clean import clean, detect_outliers, drop_duplicates, handle_missing
from agrofail.load import load_dataset, validate_schema


def sample_frame() -> pl.DataFrame:
    """Build a small complete predictor frame without dataset I/O."""
    return pl.DataFrame(
        {
            config.TARGET_COLUMN: [0, 1, 0, 1, 0],
            "Type": ["L", "M", "H", "L", "M"],
            **{column: [10.0, 11.0, 12.0, 13.0, 100.0] for column in config.NUMERIC_COLUMNS},
        }
    )


def test_drop_duplicates_preserves_first_occurrence_and_order() -> None:
    df = pl.DataFrame({"value": [2, 1, 2, 3, 1], "label": ["b", "a", "b", "c", "a"]})
    assert_frame_equal(drop_duplicates(df), df[[0, 1, 3]])


def test_handle_missing_drops_target_and_predictor_nulls() -> None:
    df = sample_frame().with_columns(
        pl.Series(config.TARGET_COLUMN, [None, 1, 0, 1, 0]),
        pl.Series("Type", ["L", None, "H", "L", "M"]),
        pl.Series(config.NUMERIC_COLUMNS[0], [10.0, 11.0, None, 13.0, 100.0]),
    )
    assert_frame_equal(handle_missing(df), df[[3, 4]])


def test_handle_missing_does_not_use_identifiers_or_failure_modes() -> None:
    df = sample_frame().with_columns(pl.lit(None).alias("UDI"), pl.lit(None).alias("TWF"))
    assert_frame_equal(handle_missing(df), df)


def test_detect_outliers_uses_strict_linear_iqr_fences() -> None:
    # Q1=0, Q3=4: fences are -6 and 10, so equality is not an outlier.
    df = pl.DataFrame({"sensor": [-7.0, -6.0, 0.0, 0.0, 2.0, 4.0, 4.0, 10.0, 11.0]})
    assert_frame_equal(detect_outliers(df, columns=("sensor",)), df[[0, 8]])


def test_detect_outliers_defaults_to_sensors_not_target_or_ids() -> None:
    df = sample_frame().with_columns(pl.Series("UDI", [1, 2, 3, 4, 100000]))
    assert_frame_equal(detect_outliers(df), df[[4]])


def test_detect_outliers_returns_each_flagged_row_once() -> None:
    df = sample_frame()
    assert detect_outliers(df).height == 1


def test_detect_outliers_ignores_nulls_and_handles_constant_columns() -> None:
    df = pl.DataFrame({"sensor": [None, 2.0, 2.0, 2.0, 2.0, 100.0]})
    assert_frame_equal(detect_outliers(df, columns=("sensor",)), df[[5]])


def test_detect_outliers_handles_all_null_numeric_columns() -> None:
    df = pl.DataFrame({"sensor": pl.Series([None, None], dtype=pl.Float64)})
    assert_frame_equal(detect_outliers(df, columns=("sensor",)), df.clear())


def test_detect_outliers_with_no_columns_flags_nothing() -> None:
    df = sample_frame()
    assert_frame_equal(detect_outliers(df, columns=()), df.clear())


def test_clean_deduplicates_drops_missing_and_preserves_outliers() -> None:
    valid = sample_frame()
    missing = valid[[0]].with_columns(pl.lit(None).cast(pl.Int64).alias(config.TARGET_COLUMN))
    df = pl.concat([valid, valid[[1]], missing])
    assert_frame_equal(clean(df), valid)
    assert clean(df)[config.NUMERIC_COLUMNS[0]][-1] == 100.0


@pytest.mark.parametrize("operation", [clean, drop_duplicates, handle_missing, detect_outliers])
def test_cleaning_helpers_do_not_mutate_input(operation) -> None:
    df = sample_frame()
    original = df.clone()
    operation(df)
    assert_frame_equal(df, original)


def test_empty_frame_retains_schema() -> None:
    df = sample_frame().clear()
    assert_frame_equal(clean(df), df)
    assert_frame_equal(detect_outliers(df), df)


def test_clean_is_idempotent() -> None:
    df = sample_frame()
    assert_frame_equal(clean(clean(df)), clean(df))


@pytest.mark.skipif(not config.RAW_DATASET_PATH.is_file(), reason="Raw dataset is absent")
def test_clean_real_dataset_preserves_schema_and_non_null_target() -> None:
    result = clean(load_dataset())
    validate_schema(result)
    assert result.height > 0
    assert result[config.TARGET_COLUMN].null_count() == 0
