"use client";

import { useEffect, useState } from "react";

import type { RecentDownloadItem, VideoQuality } from "@/lib/types";

const STORAGE_KEY = "yt-shorts-recent-downloads";

export function useRecentDownloads() {
  const [items, setItems] = useState<RecentDownloadItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as unknown[];
      const normalized = parsed.map((row) => {
        const r = row as Record<string, unknown>;
        if (r.videoQuality === "1080p" || r.videoQuality === "best") {
          return row as RecentDownloadItem;
        }
        const legacy = r as { formatId?: string };
        const q: VideoQuality = legacy.formatId === "1080p" ? "1080p" : "best";
        return {
          title: String(r.title ?? ""),
          url: String(r.url ?? ""),
          videoQuality: q,
          downloadedAt: String(r.downloadedAt ?? ""),
        } satisfies RecentDownloadItem;
      });
      setItems(normalized);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const addItem = (item: RecentDownloadItem) => {
    setItems((prev) => {
      const updated = [item, ...prev].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { items, addItem, clearAll };
}
