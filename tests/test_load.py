from pathlib import Path

import polars as pl
import pytest

from agrofail import config, load


@pytest.fixture
def dataset() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "UDI": [1, 2],
            "Product ID": ["M14860", "L47181"],
            "Type": ["M", "L"],
            "Air temperature [K]": [298.1, 298.2],
            "Process temperature [K]": [308.6, 308.7],
            "Rotational speed [rpm]": [1551, 1408],
            "Torque [Nm]": [42.8, 46.3],
            "Tool wear [min]": [0, 3],
            "Machine failure": [0, 1],
            "TWF": [0, 1],
            "HDF": [0, 0],
            "PWF": [0, 0],
            "OSF": [0, 0],
            "RNF": [0, 0],
        }
    )


@pytest.mark.parametrize("bom", [False, True])
def test_load_dataset_round_trip(tmp_path: Path, dataset: pl.DataFrame, bom: bool) -> None:
    path = tmp_path / "dataset.csv"
    path.write_text(("\ufeff" if bom else "") + dataset.write_csv(), encoding="utf-8")

    result = load.load_dataset(path)

    assert result.shape == (2, 14)
    assert result.columns == dataset.columns
    assert result.to_dict(as_series=False) == dataset.to_dict(as_series=False)


@pytest.mark.parametrize("use_csv", [False, True])
@pytest.mark.parametrize("invalid_schema", ["missing", "unexpected", "both"])
def test_invalid_schema_names_columns(
    tmp_path: Path, dataset: pl.DataFrame, use_csv: bool, invalid_schema: str
) -> None:
    missing = invalid_schema in ("missing", "both")
    unexpected = invalid_schema in ("unexpected", "both")
    if missing:
        dataset = dataset.drop(config.TARGET_COLUMN)
    if unexpected:
        dataset = dataset.with_columns(pl.lit(0).alias("Unexpected column"))

    with pytest.raises(ValueError) as error:
        if use_csv:
            path = tmp_path / "invalid.csv"
            dataset.write_csv(path)
            load.load_dataset(path)
        else:
            load.validate_schema(dataset)

    message = str(error.value)
    if missing:
        assert "missing" in message.lower()
        assert config.TARGET_COLUMN in message
    if unexpected:
        assert "unexpected" in message.lower()
        assert "Unexpected column" in message


def test_validate_schema_accepts_reordered_columns(dataset: pl.DataFrame) -> None:
    assert load.validate_schema(dataset.select(dataset.columns[::-1])) is None


@pytest.mark.skipif(not config.RAW_DATASET_PATH.exists(), reason="Real dataset is absent")
def test_load_real_dataset() -> None:
    dataset = load.load_dataset()

    assert dataset.shape == (10_000, 14)
    assert config.TARGET_COLUMN in dataset.columns
    assert load.validate_schema(dataset) is None
