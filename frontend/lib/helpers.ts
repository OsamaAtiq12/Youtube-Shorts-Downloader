import type { FormatOption } from "@/lib/types";

export function formatDuration(seconds: number | null): string {
  if (!seconds) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatBytes(bytes: number | null): string {
  if (!bytes) return "Unknown size";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let idx = 0;
  while (size >= 1024 && idx < units.length - 1) {
    size /= 1024;
    idx += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[idx]}`;
}

export function isAudioFormat(ext: string | null): boolean {
  return ext === "m4a" || ext === "mp3" || ext === "webm";
}

/** Higher resolution first (best effort from resolution string). */
export function sortFormatsByQuality(formats: FormatOption[]): FormatOption[] {
  const score = (f: FormatOption): number => {
    const r = f.resolution || f.format_note || "";
    const m = r.match(/(\d{3,4})/);
    return m ? parseInt(m[1], 10) : 0;
  };
  return [...formats].sort((a, b) => score(b) - score(a));
}

export function guessFilenameExtension(blob: Blob, downloadType: "video" | "audio", fallbackExt: string): string {
  const t = blob.type.toLowerCase();
  if (downloadType === "audio") {
    if (t.includes("mpeg")) return "mp3";
    if (t.includes("mp4") || t.includes("m4a")) return "m4a";
    if (t.includes("webm")) return "webm";
    return fallbackExt || "m4a";
  }
  if (t.includes("mp4")) return "mp4";
  if (t.includes("webm")) return "webm";
  if (t.includes("mpeg")) return "mp3";
  return fallbackExt || "mp4";
}
