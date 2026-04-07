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

/** Download progress: 0–100, or -1 when total size is unknown (indeterminate). */
export function downloadVideoWithProgress(
  payload: DownloadRequest,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/api/download`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "blob";

    xhr.onprogress = (event) => {
      if (!onProgress) return;
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      } else if (event.loaded > 0) {
        onProgress(-1);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as Blob);
        return;
      }
      const blob = xhr.response as Blob;
      blob
        .text()
        .then((text) => {
          try {
            const json = JSON.parse(text) as { detail?: string };
            reject(new Error(json.detail ?? text ?? "Download failed"));
          } catch {
            reject(new Error(text || "Download failed"));
          }
        })
        .catch(reject);
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onabort = () => reject(new Error("Aborted"));
    xhr.send(JSON.stringify(payload));
  });
}
