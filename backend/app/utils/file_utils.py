from datetime import datetime, timedelta, timezone
from pathlib import Path


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def clean_old_files(path: Path, max_file_age_minutes: int) -> None:
    if not path.exists():
        return

    cutoff = datetime.now(timezone.utc) - timedelta(minutes=max_file_age_minutes)
    for file_path in path.iterdir():
        if not file_path.is_file():
            continue
        mtime = datetime.fromtimestamp(file_path.stat().st_mtime, tz=timezone.utc)
        if mtime < cutoff:
            file_path.unlink(missing_ok=True)
