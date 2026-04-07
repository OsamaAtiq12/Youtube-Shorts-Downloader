"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { downloadVideoWithRealtimeProgress } from "@/lib/api";
import type { DownloadRequest } from "@/lib/types";

/** Progress: 0–100, -1 = indeterminate (unused), null = idle */
export function useDownloadVideo() {
  const [progress, setProgress] = useState<number | null>(null);
  const [phase, setPhase] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (payload: DownloadRequest) => {
      setProgress(0);
      setPhase("starting");
      const blob = await downloadVideoWithRealtimeProgress(payload, (pct, ph) => {
        setProgress(pct);
        setPhase(ph);
      });
      setProgress(100);
      setPhase("complete");
      return blob;
    },
    onSettled: () => {
      window.setTimeout(() => {
        setProgress(null);
        setPhase("");
      }, 600);
    },
  });

  return {
    ...mutation,
    downloadProgress: mutation.isPending ? progress : null,
    downloadPhase: mutation.isPending ? phase : "",
  };
}
