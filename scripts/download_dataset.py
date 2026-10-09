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


def main(dest: Path | None = None, url: str = DATASET_URL) -> None:
    """Save the expected CSV and report its number of data rows.

    Publish the cache atomically by replacing it only after a sibling temporary
    file is fully written. Remove the temporary file if writing or replacing fails.
    """
    if dest is None:
        dest = DESTINATION
    if dest.exists():
        print("CSV already exists; skipping download.")
    else:
        with urlopen(url, timeout=60) as response:
            archive_bytes = response.read()
        with ZipFile(BytesIO(archive_bytes)) as archive:
            csv_bytes = archive.read("ai4i2020.csv")
        dest.parent.mkdir(parents=True, exist_ok=True)
        temporary = dest.with_suffix(".part")
        try:
            temporary.write_bytes(csv_bytes)
            temporary.replace(dest)
        finally:
            temporary.unlink(missing_ok=True)

    with dest.open(newline="", encoding="utf-8-sig") as source:
        reader = csv.reader(source)
        next(reader)
        row_count = sum(1 for _ in reader)
    print(f"Dataset: {dest}")
    print(f"Rows: {row_count}")


if __name__ == "__main__":
    main()
