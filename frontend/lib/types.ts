export type VideoQuality = "1080p" | "best";

export interface FormatOption {
  format_id: string;
  ext: string | null;
  resolution: string | null;
  format_note: string | null;
  filesize: number | null;
  has_video: boolean;
  has_audio: boolean;
  vcodec: string | null;
  acodec: string | null;
}

export interface VideoMetadataResponse {
  id: string;
  title: string;
  thumbnail: string | null;
  duration: number | null;
  uploader: string | null;
  webpage_url: string;
  formats: FormatOption[];
}

export interface ExtractRequest {
  url: string;
}

export interface DownloadRequest {
  url: string;
  video_quality: VideoQuality;
}

export interface RecentDownloadItem {
  title: string;
  url: string;
  videoQuality: VideoQuality;
  downloadedAt: string;
}
