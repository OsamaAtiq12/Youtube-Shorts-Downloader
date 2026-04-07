from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from app.core.config import Settings, get_settings
from app.schemas.video import DownloadRequest, ExtractRequest, VideoMetadataResponse
from app.services.ytdlp_service import YtDlpService
from app.utils.file_utils import clean_old_files
from app.utils.validators import validate_youtube_url

router = APIRouter(prefix="/api", tags=["downloader"])


def get_service(settings: Settings = Depends(get_settings)) -> YtDlpService:
    return YtDlpService(temp_dir=settings.temp_dir)


@router.post("/extract", response_model=VideoMetadataResponse)
def extract_video(
    payload: ExtractRequest,
    service: YtDlpService = Depends(get_service),
) -> VideoMetadataResponse:
    validate_youtube_url(payload.url)
    return service.extract_info(payload.url)


@router.post("/download")
def download_video(
    payload: DownloadRequest,
    settings: Settings = Depends(get_settings),
    service: YtDlpService = Depends(get_service),
) -> FileResponse:
    validate_youtube_url(payload.url)
    clean_old_files(settings.temp_dir, settings.max_file_age_minutes)
    file_path, filename = service.download(payload)

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="video/mp4",
    )
