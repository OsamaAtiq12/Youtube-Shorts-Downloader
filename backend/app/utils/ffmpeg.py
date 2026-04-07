"""Resolve FFmpeg executable for yt-dlp: system PATH first, then imageio-ffmpeg (bundled)."""

from __future__ import annotations

import logging
import os
import shutil
import subprocess
from pathlib import Path

logger = logging.getLogger(__name__)

def get_ffmpeg_executable() -> str | None:
    """
    Absolute path to an ffmpeg binary suitable for YoutubeDL's ffmpeg_location.

    yt-dlp joins dirname + 'ffmpeg' when given only a directory. imageio-ffmpeg ships
    e.g. ffmpeg-win-x86_64-v7.1.exe (not ffmpeg.exe), so we must pass the **full exe path**.
    """
    which = shutil.which("ffmpeg")
    if which:
        p = Path(which).resolve()
        if p.is_file():
            logger.debug("FFmpeg on PATH: %s", p)
            return str(p)

    try:
        import imageio_ffmpeg

        exe = imageio_ffmpeg.get_ffmpeg_exe()
        resolved = Path(exe).resolve()
        if resolved.is_file():
            logger.info("Using bundled FFmpeg (imageio-ffmpeg): %s", resolved)
            return str(resolved)
    except Exception as exc:
        logger.warning("Bundled FFmpeg unavailable (pip install imageio-ffmpeg): %s", exc)

    return None


def ensure_ffmpeg_on_path_for_subprocess(ffmpeg_exe: str) -> None:
    """Prepend FFmpeg's directory to PATH so any child processes find ffmpeg/ffprobe."""
    directory = str(Path(ffmpeg_exe).resolve().parent)
    current = os.environ.get("PATH", "")
    if not current.startswith(directory):
        os.environ["PATH"] = directory + os.pathsep + current


def transcode_mp4_h264_aac(src: Path, ffmpeg_exe: str) -> bool:
    """
    Re-encode to H.264 + AAC + yuv420p + faststart so Windows Movies & TV, Edge, etc. play without codec packs.
    YouTube often muxes VP9/AV1 into MP4 — same extension, exotic codecs inside.
    Overwrites `src` in place on success. Returns False if transcode failed (original file kept).
    """
    src = src.resolve()
    tmp = src.with_suffix(".reencode-tmp.mp4")
    cmd = [
        ffmpeg_exe,
        "-y",
        "-hide_banner",
        "-loglevel",
        "warning",
        "-i",
        str(src),
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        str(tmp),
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True, timeout=3600)
    except (subprocess.CalledProcessError, OSError, subprocess.TimeoutExpired) as exc:
        tmp.unlink(missing_ok=True)
        stderr = getattr(exc, "stderr", None) or ""
        logger.warning(
            "H.264/AAC transcode failed (keeping muxed original): %s | %s",
            exc,
            (stderr or str(exc))[:400],
        )
        return False

    try:
        tmp.replace(src)
    except OSError as exc:
        tmp.unlink(missing_ok=True)
        logger.warning("Could not replace file after transcode: %s", exc)
        return False

    logger.info("Transcoded to H.264/AAC for broad player compatibility: %s", src.name)
    return True
