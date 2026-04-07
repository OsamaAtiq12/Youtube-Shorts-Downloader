"use client";

import { Download, Loader2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  onDownload: () => void;
  isLoading: boolean;
  disabled: boolean;
  /** 0–100, -1 = indeterminate, null = idle */
  downloadProgress: number | null;
}

export function DownloadButton({ onDownload, isLoading, disabled, downloadProgress }: DownloadButtonProps) {
  const showBar = isLoading;
  const indeterminate = downloadProgress === -1 || downloadProgress === null;
  const pct = downloadProgress === null || downloadProgress === -1 ? null : downloadProgress;
  const label =
    isLoading && pct !== null && pct >= 0 && pct < 100
      ? `Downloading… ${pct}%`
      : isLoading
        ? "Finishing…"
        : "Download video";

  return (
    <div className="space-y-4">
      <Button
        className="w-full min-h-11 rounded-xl shadow-premium"
        onClick={onDownload}
        disabled={disabled || isLoading}
        type="button"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
        {label}
      </Button>
      {showBar ? (
        <div className="space-y-2">
          <Progress value={pct} indeterminate={indeterminate} />
          <p className="text-center text-xs text-slate-500">
            {indeterminate ? "Receiving file…" : `Transfer ${pct ?? 0}%`}
          </p>
        </div>
      ) : null}
    </div>
  );
}
