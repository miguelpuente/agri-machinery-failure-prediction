"""Shared paths and dataset constants verified against the official CSV header."""

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
RAW_DATASET_PATH = RAW_DATA_DIR / "ai4i2020.csv"

RANDOM_STATE = 42
TEST_SIZE = 0.2

TARGET_COLUMN = "Machine failure"
# Failure modes expose target information and must not be used as predictors.
FAILURE_MODE_COLUMNS = ("TWF", "HDF", "PWF", "OSF", "RNF")
ID_COLUMNS = ("UDI", "Product ID")
CATEGORICAL_COLUMNS = ("Type",)
NUMERIC_COLUMNS = (
    "Air temperature [K]",
    "Process temperature [K]",
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]",
)

DATASET_URL = (
    "https://archive.ics.uci.edu/static/public/601/ai4i+2020+predictive+maintenance+dataset.zip"
)
DATASET_LICENSE = "CC BY 4.0"
DATASET_CITATION = (
    "Matzka, S. (2020). AI4I 2020 Predictive Maintenance Dataset. "
    "UCI Machine Learning Repository. https://doi.org/10.24432/C5HS5C"
)
