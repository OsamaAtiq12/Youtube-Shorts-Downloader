import logging
import threading
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from app.core.config import Settings, get_settings
from app.schemas.video import (
    DownloadJobStartResponse,
    DownloadJobStatusResponse,
    DownloadRequest,
    ExtractRequest,
    VideoMetadataResponse,
)
from app.services.download_jobs import create_job, get_job, pop_job, update_job
from app.services.ytdlp_service import YtDlpService
from app.utils.file_utils import clean_old_files
from app.utils.validators import validate_youtube_url

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["downloader"])


def get_service(settings: Settings = Depends(get_settings)) -> YtDlpService:
    return YtDlpService(temp_dir=settings.temp_dir)


def _http_exception_detail(exc: HTTPException) -> str:
    d = exc.detail
    if isinstance(d, list):
        return "; ".join(str(x) for x in d)
    return str(d)


def _map_ytdlp_hook_to_job(d: dict[str, Any], job_id: str) -> None:
    if d.get("_app_phase"):
        update_job(
            job_id,
            percent=float(d.get("_app_percent", 90)),
            phase=str(d["_app_phase"]),
        )
        return
    st = d.get("status")
    if st == "downloading":
        total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
        dl = d.get("downloaded_bytes") or 0
        if total and total > 0:
            pct = min(78.0, 78.0 * (float(dl) / float(total)))
        else:
            pct = 18.0
        update_job(job_id, percent=pct, phase="downloading")
    elif st == "finished":
        update_job(job_id, percent=80.0, phase="merging")
    else:
        update_job(job_id, percent=10.0, phase=st or "working")


@router.post("/extract", response_model=VideoMetadataResponse)
def extract_video(
    payload: ExtractRequest,
    service: YtDlpService = Depends(get_service),
) -> VideoMetadataResponse:
    validate_youtube_url(payload.url)
    return service.extract_info(payload.url)


@router.post("/download/start", response_model=DownloadJobStartResponse)
def start_download(
    payload: DownloadRequest,
    settings: Settings = Depends(get_settings),
    service: YtDlpService = Depends(get_service),
) -> DownloadJobStartResponse:
    validate_youtube_url(payload.url)
    clean_old_files(settings.temp_dir, settings.max_file_age_minutes)
    job_id = create_job()

    def worker() -> None:
        try:

            def on_hook(d: dict[str, Any]) -> None:
                _map_ytdlp_hook_to_job(d, job_id)

            path, fname = service.download(payload, on_hook=on_hook)
            update_job(
                job_id,
                percent=99.0,
                phase="ready",
                ready=True,
                done=True,
                file_path=path,
                filename=fname,
            )
        except HTTPException as exc:
            update_job(job_id, error=_http_exception_detail(exc), done=True, ready=False)
        except Exception as exc:
            logger.exception("Download job failed")
            update_job(job_id, error=str(exc), done=True, ready=False)

    threading.Thread(target=worker, daemon=True).start()
    return DownloadJobStartResponse(job_id=job_id)


@router.get("/download/status/{job_id}", response_model=DownloadJobStatusResponse)
def download_status(job_id: str) -> DownloadJobStatusResponse:
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Unknown or expired job")
    return DownloadJobStatusResponse(
        percent=job.percent,
        phase=job.phase,
        done=job.done,
        ready=job.ready,
        error=job.error,
    )


@router.get("/download/file/{job_id}")
def download_file(job_id: str) -> FileResponse:
    job = get_job(job_id)
    if not job or not job.ready or not job.file_path:
        raise HTTPException(status_code=404, detail="File not ready or already downloaded")
    path = job.file_path
    name = job.filename or "video.mp4"
    pop_job(job_id)
    return FileResponse(path=path, filename=name, media_type="video/mp4")
