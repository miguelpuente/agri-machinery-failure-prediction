import importlib.util
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

import pytest


@pytest.fixture
def downloader(monkeypatch, tmp_path):
    script = Path(__file__).resolve().parents[1] / "scripts" / "download_dataset.py"
    spec = importlib.util.spec_from_file_location("download_dataset", script)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    monkeypatch.setattr(module, "DESTINATION", tmp_path / "raw" / "ai4i2020.csv")

    def forbid_network(*args, **kwargs):
        pytest.fail("Unexpected network access")

    monkeypatch.setattr(module, "urlopen", forbid_network)
    return module


@pytest.fixture
def csv_bytes():
    return b"\xef\xbb\xbfUDI,Product ID\r\n1,M14860\r\n2,L47181\r\n"


def zip_response(csv_bytes, member="ai4i2020.csv"):
    buffer = BytesIO()
    with ZipFile(buffer, "w") as archive:
        archive.writestr("ignored.csv", b"not the dataset")
        archive.writestr(member, csv_bytes)
    return BytesIO(buffer.getvalue())


def test_download_exact_member_and_reuse_cache(downloader, monkeypatch, capsys, csv_bytes):
    calls = []

    def opener(url, *, timeout):
        calls.append((url, timeout))
        return zip_response(csv_bytes)

    monkeypatch.setattr(downloader, "urlopen", opener)
    downloader.main()

    dest = downloader.DESTINATION
    assert dest.read_bytes() == csv_bytes
    assert calls == [(downloader.DATASET_URL, 60)]
    assert capsys.readouterr().out == f"Dataset: {dest}\nRows: 2\n"
    assert list(dest.parent.iterdir()) == [dest]

    def forbid_network(*args, **kwargs):
        pytest.fail("A cached dataset must not trigger a download")

    monkeypatch.setattr(downloader, "urlopen", forbid_network)
    downloader.main()

    assert dest.read_bytes() == csv_bytes
    assert capsys.readouterr().out == (
        f"CSV already exists; skipping download.\nDataset: {dest}\nRows: 2\n"
    )


def test_failed_write_cleans_cache_and_retry_succeeds(downloader, monkeypatch, capsys, csv_bytes):
    calls = []

    def opener(url, *, timeout):
        calls.append(url)
        return zip_response(csv_bytes)

    monkeypatch.setattr(downloader, "urlopen", opener)
    original_write = Path.write_bytes

    def interrupted_write(path, data):
        original_write(path, data[:8])
        raise OSError("Simulated interrupted write")

    with monkeypatch.context() as patch:
        patch.setattr(Path, "write_bytes", interrupted_write)
        with pytest.raises(OSError, match="Simulated interrupted write"):
            downloader.main()

    dest = downloader.DESTINATION
    assert not dest.exists()
    assert list(dest.parent.iterdir()) == []
    assert capsys.readouterr().out == ""

    downloader.main()

    assert calls == [downloader.DATASET_URL, downloader.DATASET_URL]
    assert dest.read_bytes() == csv_bytes
    assert list(dest.parent.iterdir()) == [dest]
    assert capsys.readouterr().out == f"Dataset: {dest}\nRows: 2\n"


def test_wrong_zip_member_does_not_create_cache(downloader, monkeypatch, csv_bytes):
    monkeypatch.setattr(
        downloader, "urlopen", lambda *args, **kwargs: zip_response(csv_bytes, "other.csv")
    )

    with pytest.raises(KeyError, match="ai4i2020.csv"):
        downloader.main()

    assert not downloader.DESTINATION.exists()


def test_destination_and_url_can_be_overridden(downloader, monkeypatch, csv_bytes):
    dest = downloader.DESTINATION.parent / "custom.csv"
    url = "https://example.invalid/dataset.zip"
    calls = []

    def opener(requested_url, *, timeout):
        calls.append((requested_url, timeout))
        return zip_response(csv_bytes)

    monkeypatch.setattr(downloader, "urlopen", opener)
    downloader.main(dest=dest, url=url)

    assert calls == [(url, 60)]
    assert dest.read_bytes() == csv_bytes
    assert not downloader.DESTINATION.exists()
