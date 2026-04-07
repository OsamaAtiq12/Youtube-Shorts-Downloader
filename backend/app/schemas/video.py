from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ExtractRequest(BaseModel):
    url: str = Field(min_length=5, max_length=500)


class FormatOption(BaseModel):
    format_id: str
    ext: str | None = None
    resolution: str | None = None
    format_note: str | None = None
    filesize: int | None = None
    has_video: bool
    has_audio: bool
    vcodec: str | None = None
    acodec: str | None = None


class VideoMetadataResponse(BaseModel):
    id: str
    title: str
    thumbnail: str | None = None
    duration: int | None = None
    uploader: str | None = None
    webpage_url: str
    formats: list[FormatOption]


VideoQuality = Literal["1080p", "best"]


class DownloadRequest(BaseModel):
    url: str = Field(min_length=5, max_length=500)
    """Muxed MP4 with video + audio. Requires FFmpeg on the server."""
    video_quality: VideoQuality = "best"


class DownloadHistoryItem(BaseModel):
    title: str
    url: str
    video_quality: str
    downloaded_at: datetime
