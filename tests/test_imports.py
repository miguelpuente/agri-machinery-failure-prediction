import importlib
from pathlib import Path

import polars as pl
import pytest


@pytest.mark.parametrize(
    ("module_name", "callable_name"),
    [
        ("agrofail", None),
        ("agrofail.config", None),
        ("agrofail.load", "load_dataset"),
        ("agrofail.eda", "summarise"),
        ("agrofail.clean", "clean"),
        ("agrofail.features", "encode_and_scale"),
        ("agrofail.select", "select_features"),
        ("agrofail.split", "split"),
        ("agrofail.report", "build_notebook"),
    ],
)
def test_public_modules_import(module_name: str, callable_name: str | None) -> None:
    module = importlib.import_module(module_name)
    if callable_name is not None:
        assert callable(getattr(module, callable_name))


def test_package_version() -> None:
    package = importlib.import_module("agrofail")
    assert package.__version__ == "0.1.0"


@pytest.mark.parametrize(
    ("module_name", "callable_name", "task_id"),
    [
        ("load", "load_dataset", "T3"),
        ("eda", "summarise", "T4"),
        ("clean", "clean", "T5"),
        ("features", "encode_and_scale", "T6"),
        ("select", "select_features", "T7"),
        ("split", "split", "T8"),
        ("report", "build_notebook", "T9"),
    ],
)
def test_pipeline_stubs_remain_explicit(module_name: str, callable_name: str, task_id: str) -> None:
    function = getattr(importlib.import_module(f"agrofail.{module_name}"), callable_name)
    if module_name == "load":
        args = (Path("unused.csv"),)
    elif module_name == "report":
        args = (pl.DataFrame(), Path("unused.ipynb"))
    else:
        args = (pl.DataFrame(),)
    with pytest.raises(NotImplementedError, match=rf"TODO\({task_id}\):"):
        function(*args)
