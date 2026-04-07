from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "YouTube Shorts Downloader API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    frontend_origin: str = "http://localhost:5000"
    temp_dir: Path = Path("./tmp")
    max_file_age_minutes: int = 30
    #: Re-encode to H.264/AAC for Windows Media Player / Edge (slower). Env: TRANSCODE_COMPAT_MP4
    transcode_compat_mp4: bool = Field(default=True, alias="TRANSCODE_COMPAT_MP4")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
