import csv
from pathlib import Path

import pytest

from agrofail import config


def test_paths() -> None:
    for name in (
        "PROJECT_ROOT",
        "DATA_DIR",
        "RAW_DATA_DIR",
        "PROCESSED_DATA_DIR",
        "RAW_DATASET_PATH",
    ):
        assert isinstance(getattr(config, name), Path)
    assert config.DATA_DIR == config.PROJECT_ROOT / "data"
    assert config.RAW_DATA_DIR == config.DATA_DIR / "raw"
    assert config.PROCESSED_DATA_DIR == config.DATA_DIR / "processed"
    assert config.RAW_DATASET_PATH == config.RAW_DATA_DIR / "ai4i2020.csv"


def test_dataset_metadata_and_split_defaults() -> None:
    assert isinstance(config.RANDOM_STATE, int)
    assert config.RANDOM_STATE == 42
    assert isinstance(config.TEST_SIZE, float)
    assert config.TEST_SIZE == 0.2
    assert config.DATASET_URL.startswith("https://archive.ics.uci.edu/")
    assert config.DATASET_LICENSE == "CC BY 4.0"
    assert "10.24432/C5HS5C" in config.DATASET_CITATION
    assert isinstance(config.TARGET_COLUMN, str)
    assert config.TARGET_COLUMN
    groups = (
        config.FAILURE_MODE_COLUMNS,
        config.ID_COLUMNS,
        config.CATEGORICAL_COLUMNS,
        config.NUMERIC_COLUMNS,
    )
    for columns in groups:
        assert isinstance(columns, tuple)
        assert columns
        assert all(isinstance(column, str) and column for column in columns)
    all_columns = [config.TARGET_COLUMN, *(column for group in groups for column in group)]
    assert len(all_columns) == len(set(all_columns)) == 14


@pytest.mark.skipif(not config.RAW_DATASET_PATH.exists(), reason="Dataset not downloaded")
def test_configured_columns_match_real_csv_header() -> None:
    with config.RAW_DATASET_PATH.open(newline="", encoding="utf-8-sig") as source:
        header = next(csv.reader(source))
    configured = {
        config.TARGET_COLUMN,
        *config.FAILURE_MODE_COLUMNS,
        *config.ID_COLUMNS,
        *config.CATEGORICAL_COLUMNS,
        *config.NUMERIC_COLUMNS,
    }
    assert configured == set(header)
