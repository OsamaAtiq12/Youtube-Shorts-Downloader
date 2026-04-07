"""In-memory download job state for real-time progress (server-side yt-dlp + transcode)."""

from __future__ import annotations

import threading
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

_lock = threading.Lock()
_jobs: dict[str, "DownloadJobState"] = {}


@dataclass
class DownloadJobState:
    percent: float = 0.0
    phase: str = "starting"
    error: str | None = None
    done: bool = False
    ready: bool = False
    file_path: Path | None = None
    filename: str | None = None


def create_job() -> str:
    jid = uuid.uuid4().hex
    with _lock:
        _jobs[jid] = DownloadJobState()
    return jid


def get_job(job_id: str) -> DownloadJobState | None:
    with _lock:
        return _jobs.get(job_id)


def update_job(job_id: str, **kwargs: Any) -> None:
    with _lock:
        st = _jobs.get(job_id)
        if not st:
            return
        for k, v in kwargs.items():
            setattr(st, k, v)


def pop_job(job_id: str) -> DownloadJobState | None:
    with _lock:
        return _jobs.pop(job_id, None)
