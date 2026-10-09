import numpy as np
import polars as pl
import pytest
from polars.testing import assert_frame_equal

from agrofail import config
from agrofail.clean import clean
from agrofail.features import apply_encode_and_scale, fit_encode_and_scale
from agrofail.load import load_dataset


def sensor_frame(values: list[float], categories: list[str]) -> pl.DataFrame:
    return pl.DataFrame(
        {
            "UDI": list(range(len(values))),
            "Product ID": [f"product-{i}" for i in range(len(values))],
            "Type": categories,
            **{column: values for column in config.NUMERIC_COLUMNS},
            **{column: [1] * len(values) for column in config.FAILURE_MODE_COLUMNS},
            config.TARGET_COLUMN: pl.Series([i % 2 for i in range(len(values))], dtype=pl.Int8),
        }
    )


def test_fit_apply_round_trip() -> None:
    train = sensor_frame([1.0, 3.0], ["L", "M"])
    transformer = fit_encode_and_scale(train)
    result = apply_encode_and_scale(train, transformer)

    expected_columns = [*config.NUMERIC_COLUMNS, "Type_L", "Type_M", config.TARGET_COLUMN]
    assert result.columns == expected_columns
    assert transformer.output_columns == tuple(expected_columns)
    assert result.shape == (2, 8)
    np.testing.assert_allclose(
        result.select(config.NUMERIC_COLUMNS).to_numpy(), [[-1] * 5, [1] * 5]
    )
    np.testing.assert_array_equal(result.select("Type_L", "Type_M").to_numpy(), [[1, 0], [0, 1]])
    assert result[config.TARGET_COLUMN].equals(train[config.TARGET_COLUMN])


def test_apply_uses_training_parameters_without_refitting() -> None:
    train = sensor_frame([1.0, 3.0], ["L", "M"])
    other = sensor_frame([5.0, 7.0], ["M", "L"])
    transformer = fit_encode_and_scale(train)
    means = transformer.scaler.mean_.copy()
    scales = transformer.scaler.scale_.copy()
    categories = [values.copy() for values in transformer.encoder.categories_]

    result = apply_encode_and_scale(other, transformer)

    np.testing.assert_allclose(result.select(config.NUMERIC_COLUMNS).to_numpy(), [[3] * 5, [5] * 5])
    np.testing.assert_array_equal(result.select("Type_L", "Type_M").to_numpy(), [[0, 1], [1, 0]])
    np.testing.assert_array_equal(transformer.scaler.mean_, means)
    np.testing.assert_array_equal(transformer.scaler.scale_, scales)
    for actual, expected in zip(transformer.encoder.categories_, categories, strict=True):
        np.testing.assert_array_equal(actual, expected)
    assert transformer.scaler.n_samples_seen_ == 2


def test_unseen_category_is_all_zero_without_new_columns() -> None:
    transformer = fit_encode_and_scale(sensor_frame([1.0, 3.0], ["L", "M"]))
    result = apply_encode_and_scale(sensor_frame([5.0], ["H"]), transformer)

    assert result.columns == list(transformer.output_columns)
    np.testing.assert_array_equal(result.select("Type_L", "Type_M").to_numpy(), [[0, 0]])


def test_removes_identifiers_and_leakage_preserves_target_and_inputs() -> None:
    train = sensor_frame([1.0, 3.0], ["L", "M"])
    other = sensor_frame([5.0], ["L"])
    original_train, original_other = train.clone(), other.clone()
    transformer = fit_encode_and_scale(train)
    result = apply_encode_and_scale(other, transformer)

    assert not set((*config.ID_COLUMNS, *config.FAILURE_MODE_COLUMNS)) & set(result.columns)
    assert result[config.TARGET_COLUMN].equals(other[config.TARGET_COLUMN])
    assert_frame_equal(train, original_train)
    assert_frame_equal(other, original_other)


def test_constant_sensor_and_single_category_remain_finite() -> None:
    train = sensor_frame([4.0, 4.0], ["L", "L"])
    transformer = fit_encode_and_scale(train)
    result = apply_encode_and_scale(train, transformer)

    np.testing.assert_array_equal(
        result.select(config.NUMERIC_COLUMNS).to_numpy(), np.zeros((2, 5))
    )
    assert result["Type_L"].to_list() == [1.0, 1.0]
    other = apply_encode_and_scale(sensor_frame([6.0], ["L"]), transformer)
    np.testing.assert_allclose(other.select(config.NUMERIC_COLUMNS).to_numpy(), [[2] * 5])


def test_only_configured_predictors_are_transformed() -> None:
    train = sensor_frame([1.0, 3.0], ["L", "M"]).with_columns(pl.lit(99).alias("extra"))
    transformer = fit_encode_and_scale(train)
    # Identifiers and failure modes need not be supplied when applying to another partition.
    other = train.drop(*config.ID_COLUMNS, *config.FAILURE_MODE_COLUMNS)
    result = apply_encode_and_scale(other, transformer)
    assert "extra" not in result.columns
    assert result.columns == list(transformer.output_columns)


def test_empty_apply_preserves_output_schema() -> None:
    train = sensor_frame([1.0, 3.0], ["L", "M"])
    transformer = fit_encode_and_scale(train)
    result = apply_encode_and_scale(train.clear(), transformer)
    assert_frame_equal(result, apply_encode_and_scale(train, transformer).clear())


def test_empty_training_frame_is_rejected() -> None:
    with pytest.raises(ValueError, match="empty"):
        fit_encode_and_scale(sensor_frame([1.0], ["L"]).clear())


@pytest.mark.parametrize("operation", ["fit", "apply"])
def test_missing_target_is_rejected(operation: str) -> None:
    train = sensor_frame([1.0, 3.0], ["L", "M"])
    missing = train.drop(config.TARGET_COLUMN)
    with pytest.raises(ValueError, match="Machine failure"):
        if operation == "fit":
            fit_encode_and_scale(missing)
        else:
            apply_encode_and_scale(missing, fit_encode_and_scale(train))


@pytest.mark.parametrize("value", [None, float("nan"), float("inf")])
@pytest.mark.parametrize("operation", ["fit", "apply"])
def test_invalid_sensor_values_are_rejected(value: float | None, operation: str) -> None:
    train = sensor_frame([1.0, 3.0], ["L", "M"])
    invalid = train.with_columns(pl.lit(value, dtype=pl.Float64).alias(config.NUMERIC_COLUMNS[0]))
    with pytest.raises(ValueError, match="finite|missing"):
        if operation == "fit":
            fit_encode_and_scale(invalid)
        else:
            apply_encode_and_scale(invalid, fit_encode_and_scale(train))


def test_null_category_is_not_learned_as_a_category() -> None:
    train = sensor_frame([1.0, 3.0], ["L", "M"]).with_columns(pl.lit(None).alias("Type"))
    with pytest.raises(ValueError, match="missing"):
        fit_encode_and_scale(train)


@pytest.mark.skipif(not config.RAW_DATASET_PATH.exists(), reason="Raw dataset is not available")
def test_real_dataset_has_expected_columns_and_finite_features() -> None:
    # Transformation smoke test only, not a model evaluation or a pre-split fit recipe.
    frame = clean(load_dataset())
    transformer = fit_encode_and_scale(frame)
    result = apply_encode_and_scale(frame, transformer)

    assert result.columns == [
        *config.NUMERIC_COLUMNS,
        "Type_H",
        "Type_L",
        "Type_M",
        config.TARGET_COLUMN,
    ]
    assert result.height == frame.height
    assert result[config.TARGET_COLUMN].equals(frame[config.TARGET_COLUMN])
    assert np.isfinite(result.drop(config.TARGET_COLUMN).to_numpy()).all()
