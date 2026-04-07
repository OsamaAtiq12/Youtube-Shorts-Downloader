import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging import setup_logging
from app.routers.downloader import router as downloader_router
from app.routers.health import router as health_router
from app.utils.file_utils import ensure_dir
from app.utils.ffmpeg import get_ffmpeg_executable

setup_logging()
logger = logging.getLogger(__name__)
settings = get_settings()
ensure_dir(settings.temp_dir)

_ff = get_ffmpeg_executable()
if _ff:
    logger.info("FFmpeg available for muxing: %s", _ff)
else:
    logger.warning(
        "FFmpeg not found — install FFmpeg on PATH or `pip install imageio-ffmpeg` in this venv.",
    )

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(downloader_router)
