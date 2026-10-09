import importlib

import pytest


@pytest.mark.parametrize(
    ("module_name", "callable_name"),
    [
        ("agrofail", None),
        ("agrofail.config", None),
        ("agrofail.load", "load_dataset"),
        ("agrofail.eda", "summarise"),
        ("agrofail.clean", "clean"),
        ("agrofail.features", "fit_encode_and_scale"),
        ("agrofail.features", "apply_encode_and_scale"),
        ("agrofail.select", "select_features"),
        ("agrofail.split", "split"),
        ("agrofail.report", "build_notebook"),
        ("agrofail.models", "train_models"),
        ("agrofail.metrics", "evaluate_model"),
    ],
)
def test_public_modules_import(module_name: str, callable_name: str | None) -> None:
    module = importlib.import_module(module_name)
    if callable_name is not None:
        assert callable(getattr(module, callable_name))


def test_package_version() -> None:
    package = importlib.import_module("agrofail")
    assert package.__version__ == "0.1.0"
