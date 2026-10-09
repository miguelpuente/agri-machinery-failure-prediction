import math
from pathlib import Path

import polars as pl
import pytest

from agrofail import config, eda
from agrofail.load import load_dataset


@pytest.fixture
def tiny_frame() -> pl.DataFrame:
    return pl.DataFrame(
        {
            config.NUMERIC_COLUMNS[0]: [1.0, 2.0, 3.0, None],
            config.NUMERIC_COLUMNS[1]: [2.0, 4.0, 6.0, 8.0],
            "Type": ["L", None, "H", "L"],
            config.TARGET_COLUMN: [0, 0, 1, 0],
        }
    )


def test_summarise_statistics_and_class_balance(tiny_frame: pl.DataFrame) -> None:
    summary = eda.summarise(tiny_frame)
    assert set(summary) == {"row_count", "column_count", "columns", "numeric", "class_balance"}
    assert summary["row_count"] == 4
    assert summary["column_count"] == 4
    assert summary["columns"] == {
        name: {"dtype": str(dtype), "missing_count": int(tiny_frame[name].null_count())}
        for name, dtype in tiny_frame.schema.items()
    }
    assert summary["columns"][config.NUMERIC_COLUMNS[0]]["missing_count"] == 1
    assert summary["columns"]["Type"]["missing_count"] == 1
    assert summary["numeric"][config.NUMERIC_COLUMNS[0]] == {
        "min": 1.0,
        "max": 3.0,
        "mean": 2.0,
        "median": 2.0,
        "std": 1.0,
    }
    assert summary["class_balance"] == {0: 3, 1: 1}
    assert config.TARGET_COLUMN not in summary["numeric"]


def test_correlation_is_labelled_and_pairwise(tiny_frame: pl.DataFrame) -> None:
    matrix = eda.correlation_matrix(tiny_frame)
    names = list(config.NUMERIC_COLUMNS[:2])
    assert matrix.columns == ["column", *names]
    assert matrix["column"].to_list() == names
    for name in names:
        assert matrix[name].to_list() == pytest.approx([1.0, 1.0])


def test_negative_correlation() -> None:
    first, second = config.NUMERIC_COLUMNS[:2]
    matrix = eda.correlation_matrix(pl.DataFrame({first: [1, 2, 3], second: [6, 4, 2]}))
    assert matrix[first].to_list() == pytest.approx([1.0, -1.0])
    assert matrix[second].to_list() == pytest.approx([-1.0, 1.0])


def test_plots_create_nonempty_files(tiny_frame: pl.DataFrame, tmp_path: Path) -> None:
    output_dir = tmp_path / "plots"
    paths = eda.plot_distributions(tiny_frame, output_dir)
    assert [path.name for path in paths] == [
        "air_temperature_k_histogram.png",
        "process_temperature_k_histogram.png",
    ]
    heatmap = eda.plot_correlation_heatmap(tiny_frame, output_dir)
    assert heatmap == output_dir / "correlation_heatmap.png"
    for path in [*paths, heatmap]:
        assert path.parent == output_dir
        assert path.is_file()
        assert path.stat().st_size > 0


def test_absent_target_and_no_sensors(tmp_path: Path) -> None:
    frame = pl.DataFrame({"Type": ["L", None]})
    summary = eda.summarise(frame)
    assert summary["class_balance"] is None
    assert summary["numeric"] == {}
    assert eda.correlation_matrix(frame).columns == ["column"]
    assert eda.correlation_matrix(frame).height == 0
    assert eda.plot_distributions(frame, tmp_path) == []
    with pytest.raises(ValueError, match="No numeric sensor columns"):
        eda.plot_correlation_heatmap(frame, tmp_path)


def test_empty_sensor_column() -> None:
    name = config.NUMERIC_COLUMNS[0]
    summary = eda.summarise(pl.DataFrame(schema={name: pl.Float64}))
    assert summary["row_count"] == 0
    assert summary["numeric"][name] == dict.fromkeys(["min", "max", "mean", "median", "std"])


def test_nan_counts_and_pairwise_correlation_without_mutation() -> None:
    first, second = config.NUMERIC_COLUMNS[:2]
    frame = pl.DataFrame({first: [1.0, float("nan"), 3.0, None], second: [2.0, 4.0, 6.0, 8.0]})
    original = frame.clone()
    summary = eda.summarise(frame)
    assert summary["columns"][first]["missing_count"] == 2
    assert summary["numeric"][first]["mean"] == 2.0
    assert summary["numeric"][first]["std"] == pytest.approx(math.sqrt(2))
    assert eda.correlation_matrix(frame)[second][0] == pytest.approx(1.0)
    assert frame.equals(original)


def test_undefined_correlations_and_all_missing_plots(tmp_path: Path) -> None:
    first, second = config.NUMERIC_COLUMNS[:2]
    frame = pl.DataFrame({first: [1.0, 1.0, 1.0], second: [None, None, None]})
    summary = eda.summarise(frame)
    assert summary["columns"][second]["missing_count"] == 3
    assert summary["numeric"][second] == dict.fromkeys(["min", "max", "mean", "median", "std"])
    matrix = eda.correlation_matrix(frame)
    for name in (first, second):
        assert all(value is None or math.isnan(value) for value in matrix[name])
    paths = eda.plot_distributions(frame, tmp_path)
    paths.append(eda.plot_correlation_heatmap(frame, tmp_path))
    assert all(path.stat().st_size > 0 for path in paths)


@pytest.mark.skipif(not config.RAW_DATASET_PATH.is_file(), reason="Raw dataset is absent")
def test_real_dataset(tmp_path: Path) -> None:
    frame = load_dataset()
    summary = eda.summarise(frame)
    assert summary["row_count"] == frame.height
    assert sum(summary["class_balance"].values()) == frame.height
    assert eda.correlation_matrix(frame).shape == (5, 6)
    paths = eda.plot_distributions(frame, tmp_path)
    assert len(paths) == 5
    paths.append(eda.plot_correlation_heatmap(frame, tmp_path))
    assert all(path.stat().st_size > 0 for path in paths)
