import math

import polars as pl
import pytest
from polars.testing import assert_frame_equal

from agrofail import config
from agrofail.clean import clean
from agrofail.load import load_dataset
from agrofail.select import select_features


def selection_frame() -> pl.DataFrame:
    return pl.DataFrame(
        {
            **{column: [1.0, 2.0, 3.0, 4.0] for column in config.NUMERIC_COLUMNS},
            "Type_L": [1, 0, 1, 0],
            "Type_M": [0, 1, 0, 1],
            config.TARGET_COLUMN: [0, 0, 0, 1],
            "UDI": [1, 2, 3, 4],
            "Product ID": ["L1", "M2", "L3", "M4"],
            **{column: [0, 0, 0, 1] for column in config.FAILURE_MODE_COLUMNS},
            "derived_without_evidence": [1, 2, 3, 4],
        }
    )


def test_selection_preserves_predictors_target_rows_and_input() -> None:
    frame = selection_frame()
    original = frame.clone()
    result = select_features(frame)
    assert result.columns == [*config.NUMERIC_COLUMNS, "Type_L", "Type_M", config.TARGET_COLUMN]
    assert_frame_equal(result, frame.select(result.columns))
    assert_frame_equal(frame, original)


def test_rationale_accounts_for_every_column_and_records_evidence() -> None:
    from agrofail.select import selection_rationale

    frame = selection_frame()
    rationale = selection_rationale(frame)
    assert set(rationale.kept) == set(select_features(frame).columns)
    assert set(rationale.kept) | set(rationale.dropped) == set(frame.columns)
    assert not set(rationale.kept) & set(rationale.dropped)
    assert all(rationale.kept.values()) and all(rationale.dropped.values())
    assert all("identifier" in rationale.dropped[column] for column in config.ID_COLUMNS)
    assert all("leakage" in rationale.dropped[column] for column in config.FAILURE_MODE_COLUMNS)
    assert "evidence" in rationale.dropped["derived_without_evidence"]
    assert "target" in rationale.kept[config.TARGET_COLUMN]
    assert rationale.variances[config.NUMERIC_COLUMNS[0]] == pytest.approx(1.25)
    pair = (config.NUMERIC_COLUMNS[0], config.NUMERIC_COLUMNS[1])
    assert rationale.correlations[pair] == pytest.approx(1.0)
    assert any("redundancy" in note for note in rationale.notes)


def test_constant_sensor_is_reported_without_learning_a_global_drop_rule() -> None:
    from agrofail.select import selection_rationale

    frame = selection_frame().with_columns(pl.lit(0.0).alias(config.NUMERIC_COLUMNS[0]))
    rationale = selection_rationale(frame)
    assert rationale.variances[config.NUMERIC_COLUMNS[0]] == 0.0
    assert config.NUMERIC_COLUMNS[0] in rationale.kept
    pair = (config.NUMERIC_COLUMNS[0], config.NUMERIC_COLUMNS[1])
    assert rationale.correlations[pair] is None


def test_raw_type_is_retained_for_later_train_fitted_encoding() -> None:
    frame = (
        selection_frame()
        .drop("Type_L", "Type_M")
        .with_columns(pl.Series("Type", ["L", "M", "L", "M"]))
    )
    result = select_features(frame)
    assert result.columns == [*config.NUMERIC_COLUMNS, "Type", config.TARGET_COLUMN]


def test_unverified_type_prefixed_feature_is_not_an_indicator() -> None:
    frame = selection_frame().with_columns(pl.Series("Type_derived", [2, 3, 4, 5]))
    assert "Type_derived" not in select_features(frame).columns


def test_selection_requires_target() -> None:
    with pytest.raises(ValueError, match="Machine failure"):
        select_features(selection_frame().drop(config.TARGET_COLUMN))


def test_empty_selection_preserves_schema_and_reports_unavailable_evidence() -> None:
    from agrofail.select import selection_rationale

    frame = selection_frame().clear()
    assert_frame_equal(select_features(frame), select_features(selection_frame()).clear())
    rationale = selection_rationale(frame)
    assert all(value is None for value in rationale.variances.values())
    assert all(value is None or math.isfinite(value) for value in rationale.correlations.values())


@pytest.mark.skipif(not config.RAW_DATASET_PATH.exists(), reason="Raw dataset is not available")
def test_real_dataset_selection() -> None:
    frame = clean(load_dataset())
    result = select_features(frame)
    assert result.shape == (frame.height, len(config.NUMERIC_COLUMNS) + 2)
    assert result.columns == [*config.NUMERIC_COLUMNS, "Type", config.TARGET_COLUMN]
