import polars as pl
import pytest
from polars.testing import assert_frame_equal

from agrofail import config
from agrofail.clean import clean
from agrofail.load import load_dataset
from agrofail.split import split


def split_frame() -> pl.DataFrame:
    return pl.DataFrame(
        {"row_id": range(20), "Type": ["L", "M"] * 10, config.TARGET_COLUMN: [0] * 10 + [1] * 10}
    )


@pytest.mark.parametrize("test_size,expected", [(0.2, 2), (0.3, 3)])
def test_split_ratio_stratification_disjointness_and_input(test_size: float, expected: int) -> None:
    frame = split_frame()
    original = frame.clone()
    train, test = split(frame, test_size=test_size)
    assert test.height == 2 * expected
    assert train.height == 20 - test.height
    for partition, count in [(test, expected), (train, 10 - expected)]:
        assert partition.filter(pl.col(config.TARGET_COLUMN) == 0).height == count
        assert partition.filter(pl.col(config.TARGET_COLUMN) == 1).height == count
        assert partition.schema == frame.schema
    train_ids, test_ids = set(train["row_id"]), set(test["row_id"])
    assert train_ids.isdisjoint(test_ids)
    assert train_ids | test_ids == set(frame["row_id"])
    assert_frame_equal(frame, original)


def test_split_defaults_and_fixed_seed_are_reproducible() -> None:
    frame = split_frame()
    default = split(frame)
    explicit = split(frame, test_size=config.TEST_SIZE, random_state=config.RANDOM_STATE)
    repeated = split(frame)
    for first, second, third in zip(default, explicit, repeated, strict=True):
        assert_frame_equal(first, second)
        assert_frame_equal(first, third)
    assert default[1].height == 4


def test_split_custom_seed_is_used() -> None:
    frame = split_frame()
    train, test = split(frame, random_state=7)
    again_train, again_test = split(frame, random_state=7)
    assert_frame_equal(train, again_train)
    assert_frame_equal(test, again_test)
    assert not test.equals(split(frame, random_state=42)[1])


@pytest.mark.parametrize("test_size", [0.0, 1.0, -0.1, 1.1])
def test_invalid_ratio_is_rejected(test_size: float) -> None:
    with pytest.raises(ValueError, match="test_size"):
        split(split_frame(), test_size=test_size)


def test_missing_target_is_rejected() -> None:
    with pytest.raises(ValueError, match="Machine failure"):
        split(split_frame().drop(config.TARGET_COLUMN))


def test_null_target_is_rejected() -> None:
    with pytest.raises(ValueError, match="null|missing"):
        split(split_frame().with_columns(pl.lit(None).alias(config.TARGET_COLUMN)))


def test_insufficient_class_support_is_not_silently_unstratified() -> None:
    frame = pl.DataFrame({"row_id": range(5), config.TARGET_COLUMN: [0, 0, 0, 0, 1]})
    with pytest.raises(ValueError, match="least populated class"):
        split(frame)


@pytest.mark.skipif(not config.RAW_DATASET_PATH.exists(), reason="Raw dataset is not available")
def test_real_dataset_split() -> None:
    frame = clean(load_dataset())
    train, test = split(frame)
    assert train.height + test.height == frame.height
    assert test.height / frame.height == pytest.approx(config.TEST_SIZE, abs=1 / frame.height)
    prevalence = frame[config.TARGET_COLUMN].mean()
    for partition in (train, test):
        assert partition[config.TARGET_COLUMN].mean() == pytest.approx(
            prevalence, abs=1 / partition.height
        )
