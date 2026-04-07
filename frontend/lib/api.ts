import { DownloadRequest, ExtractRequest, VideoMetadataResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function parseError(response: Response): Promise<never> {
  let message = "Request failed";
  try {
    const json = (await response.json()) as { detail?: string };
    if (json.detail) message = json.detail;
  } catch {
    message = response.statusText || message;
  }
  throw new Error(message);
}

export async function extractVideo(payload: ExtractRequest): Promise<VideoMetadataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response);
  return (await response.json()) as VideoMetadataResponse;
}

interface JobStatus {
  percent: number;
  phase: string;
  done: boolean;
  ready: boolean;
  error: string | null;
}

/**
 * Real-time progress:
 * 1) Polls server while yt-dlp downloads / muxes / transcodes (0–99%).
 * 2) XHR GET on `/api/download/file/{job_id}` for the final byte transfer (99–100%).
 */
export function downloadVideoWithRealtimeProgress(
  payload: DownloadRequest,
  onProgress?: (percent: number, phase: string) => void,
): Promise<Blob> {
  return (async () => {
    const start = await fetch(`${API_BASE_URL}/api/download/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!start.ok) await parseError(start);
    const { job_id } = (await start.json()) as { job_id: string };

    const pollMs = 120;
    const deadline = Date.now() + 25 * 60 * 1000;

    while (Date.now() < deadline) {
      const r = await fetch(`${API_BASE_URL}/api/download/status/${job_id}`);
      if (!r.ok) {
        throw new Error("Could not read download status");
      }
      const s = (await r.json()) as JobStatus;
      if (s.error) {
        throw new Error(s.error);
      }
      onProgress?.(Math.min(99, Math.round(s.percent)), s.phase);
      if (s.done && s.ready) {
        break;
      }
      if (s.done && !s.ready) {
        throw new Error(s.error || "Download failed");
      }
      await new Promise((res) => setTimeout(res, pollMs));
    }

    if (Date.now() >= deadline) {
      throw new Error("Download timed out");
    }

    return await new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${API_BASE_URL}/api/download/file/${job_id}`);
      xhr.responseType = "blob";

      xhr.onprogress = (event) => {
        if (!onProgress) return;
        if (event.lengthComputable && event.total > 0) {
          const t = 99 + (event.loaded / event.total) * 1;
          onProgress(Math.min(100, Math.round(t)), "transfer");
        } else {
          onProgress(99, "transfer");
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100, "complete");
          resolve(xhr.response as Blob);
          return;
        }
        xhr.response
          .text()
          .then((text: string) => {
            try {
              const json = JSON.parse(text) as { detail?: string };
              reject(new Error(json.detail ?? "File download failed"));
            } catch {
              reject(new Error(text || "File download failed"));
            }
          })
          .catch(() => reject(new Error("File download failed")));
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send();
    });
  })();
}
