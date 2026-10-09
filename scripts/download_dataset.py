"""Download the UCI dataset once; reuse an existing CSV without network access."""

import csv
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen
from zipfile import ZipFile

DATASET_URL = (
    "https://archive.ics.uci.edu/static/public/601/ai4i+2020+predictive+maintenance+dataset.zip"
)
DESTINATION = Path(__file__).resolve().parents[1] / "data" / "raw" / "ai4i2020.csv"


def main() -> None:
    """Save only the expected CSV member and report its number of data rows."""
    if DESTINATION.exists():
        print("CSV already exists; skipping download.")
    else:
        with urlopen(DATASET_URL, timeout=60) as response:
            archive_bytes = response.read()
        with ZipFile(BytesIO(archive_bytes)) as archive:
            csv_bytes = archive.read("ai4i2020.csv")
        DESTINATION.parent.mkdir(parents=True, exist_ok=True)
        DESTINATION.write_bytes(csv_bytes)

    with DESTINATION.open(newline="", encoding="utf-8-sig") as source:
        reader = csv.reader(source)
        next(reader)
        row_count = sum(1 for _ in reader)
    print(f"Dataset: {DESTINATION}")
    print(f"Rows: {row_count}")


if __name__ == "__main__":
    main()
