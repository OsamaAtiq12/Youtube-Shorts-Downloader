"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { downloadVideoWithProgress } from "@/lib/api";
import type { DownloadRequest } from "@/lib/types";

/** Progress: 0–100, -1 = indeterminate (unknown total), null = idle */
export function useDownloadVideo() {
  const [progress, setProgress] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: DownloadRequest) => {
      setProgress(0);
      const blob = await downloadVideoWithProgress(payload, (p) => {
        setProgress(p);
      });
      setProgress(100);
      return blob;
    },
    onSettled: () => {
      window.setTimeout(() => setProgress(null), 600);
    },
  });

  return {
    ...mutation,
    /** While downloading: 0–100, -1 indeterminate, or 100 at end; null when idle */
    downloadProgress: mutation.isPending ? progress : null,
  };
}
