import re

from fastapi import HTTPException, status

YOUTUBE_URL_PATTERN = re.compile(
    r"^(https?://)?(www\.)?(youtube\.com/(shorts/|watch\?v=)|youtu\.be/)[\w-]{6,}",
    re.IGNORECASE,
)


def validate_youtube_url(url: str) -> None:
    if not YOUTUBE_URL_PATTERN.search(url.strip()):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please provide a valid YouTube Shorts/Video URL.",
        )
