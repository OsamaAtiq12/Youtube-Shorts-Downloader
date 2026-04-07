import logging
import os
import re
import time
from pathlib import Path
from typing import Any

import yt_dlp
from fastapi import HTTPException, status

from app.core.config import get_settings
from app.schemas.video import DownloadRequest, FormatOption, VideoMetadataResponse
from app.utils.file_utils import ensure_dir
from app.utils.ffmpeg import ensure_ffmpeg_on_path_for_subprocess, get_ffmpeg_executable, transcode_mp4_h264_aac

logger = logging.getLogger(__name__)

# YouTube: prefer H.264 (avc1) + AAC — Windows Movies & TV often won't play VP9/AV1 inside MP4.
# Fallback chains still merge bestvideo+bestaudio when AVC is unavailable.
FORMAT_BEST_MUX = (
    "bestvideo[vcodec^=avc1]+bestaudio[acodec^=mp4a]/"
    "bestvideo[vcodec*=avc1]+bestaudio[acodec^=mp4a]/"
    "bestvideo[ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/"
    "bestvideo*+bestaudio/"
    "best[ext=mp4][acodec!=none][vcodec!=none]/"
    "best[acodec!=none][vcodec!=none]/best"
)
FORMAT_1080_MUX = (
    "bestvideo[height<=1080][vcodec^=avc1]+bestaudio[acodec^=mp4a]/"
    "bestvideo[width=1080][height<=1920][vcodec^=avc1]+bestaudio[acodec^=mp4a]/"
    "bestvideo[height<=1080]+bestaudio/"
    "bestvideo[width=1080][height<=1920]+bestaudio/"
    "bestvideo[height<=1920][width<=1080]+bestaudio/"
    "bestvideo[height<=1080][width<=1920]+bestaudio/"
) + FORMAT_BEST_MUX


class YtDlpService:
    def __init__(self, temp_dir: Path):
        self.temp_dir = temp_dir
        ensure_dir(self.temp_dir)

    @staticmethod
    def _sanitize_filename(name: str) -> str:
        return re.sub(r'[<>:"/\\|?*]', "", name).strip()[:120] or "download"

    @staticmethod
    def _normalize_format(fmt: dict[str, Any]) -> FormatOption:
        return FormatOption(
            format_id=str(fmt.get("format_id", "")),
            ext=fmt.get("ext"),
            resolution=fmt.get("resolution") or fmt.get("format_note"),
            format_note=fmt.get("format_note"),
            filesize=fmt.get("filesize") or fmt.get("filesize_approx"),
            has_video=fmt.get("vcodec") not in (None, "none"),
            has_audio=fmt.get("acodec") not in (None, "none"),
            vcodec=fmt.get("vcodec"),
            acodec=fmt.get("acodec"),
        )

    def extract_info(self, url: str) -> VideoMetadataResponse:
        options = {"quiet": True, "skip_download": True, "noplaylist": True}
        try:
            with yt_dlp.YoutubeDL(options) as ydl:
                info = ydl.extract_info(url, download=False)
        except yt_dlp.utils.DownloadError as exc:
            logger.exception("yt-dlp extract failed")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to extract metadata: {exc}",
            ) from exc

        if not info:
            raise HTTPException(status_code=404, detail="Video metadata not found")

        formats = [self._normalize_format(fmt) for fmt in info.get("formats", []) if fmt.get("format_id")]
        return VideoMetadataResponse(
            id=str(info.get("id")),
            title=info.get("title") or "Untitled",
            thumbnail=info.get("thumbnail"),
            duration=info.get("duration"),
            uploader=info.get("uploader") or info.get("channel"),
            webpage_url=info.get("webpage_url") or url,
            formats=formats,
        )

    def download(self, payload: DownloadRequest) -> tuple[Path, str]:
        info = self.extract_info(payload.url)
        safe_title = self._sanitize_filename(info.title)
        output_template = str(self.temp_dir / f"{safe_title}-%(id)s.%(ext)s")
        ffmpeg_exe = get_ffmpeg_executable()
        finished_filepaths: list[Path] = []

        if not ffmpeg_exe:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "FFmpeg is required to mux video and audio. Add FFmpeg to your PATH, or run "
                    "`pip install imageio-ffmpeg` in the backend venv and restart the API (bundled binary)."
                ),
            )

        if payload.video_quality == "1080p":
            format_selector = FORMAT_1080_MUX
        else:
            format_selector = FORMAT_BEST_MUX

        options: dict[str, Any] = {
            "quiet": True,
            "noplaylist": True,
            "outtmpl": output_template,
            "format": format_selector,
            "merge_output_format": "mp4",
            "postprocessors": [],
            # Full path required: bundled FFmpeg is named e.g. ffmpeg-win-x86_64-v7.1.exe, not ffmpeg.exe
            "ffmpeg_location": ffmpeg_exe,
        }

        def _on_progress(progress: dict[str, Any]) -> None:
            if progress.get("status") == "finished" and progress.get("filename"):
                finished_filepaths.append(Path(str(progress["filename"])))

        options["progress_hooks"] = [_on_progress]
        download_started_at = time.time()
        old_path = os.environ.get("PATH", "")
        try:
            ensure_ffmpeg_on_path_for_subprocess(ffmpeg_exe)
            with yt_dlp.YoutubeDL(options) as ydl:
                ydl.download([payload.url])
        except yt_dlp.utils.DownloadError as exc:
            logger.exception("yt-dlp download failed")
            msg = re.sub(r"\x1b\[[0-9;]*m", "", str(exc))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Download failed: {msg}",
            ) from exc
        finally:
            os.environ["PATH"] = old_path

        file_path: Path | None = None
        for candidate in reversed(finished_filepaths):
            if candidate.exists() and candidate.is_file() and not candidate.name.endswith(".part"):
                file_path = candidate
                break

        if file_path is None:
            id_matched = [
                f
                for f in self.temp_dir.glob(f"*{info.id}*")
                if f.is_file() and not f.name.endswith(".part")
            ]
            if id_matched:
                file_path = max(id_matched, key=lambda item: item.stat().st_mtime)

        if file_path is None:
            candidate_files = [
                f
                for f in self.temp_dir.glob("*")
                if f.is_file() and not f.name.endswith(".part") and f.stat().st_mtime >= (download_started_at - 1.0)
            ]
            if not candidate_files:
                raise HTTPException(status_code=500, detail="Downloaded file not found")
            file_path = max(candidate_files, key=lambda item: item.stat().st_mtime)

        settings = get_settings()
        if settings.transcode_compat_mp4:
            ok = transcode_mp4_h264_aac(file_path, ffmpeg_exe)
            if not ok:
                logger.info(
                    "Delivering muxed file without transcode. For picky players use VLC, or fix FFmpeg and retry. "
                    "Set TRANSCODE_COMPAT_MP4=0 to skip re-encode attempts."
                )

        return file_path, file_path.name
