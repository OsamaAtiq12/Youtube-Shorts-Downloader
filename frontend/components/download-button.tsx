"use client";

import { Download, Loader2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const PHASE_LABEL: Record<string, string> = {
  starting: "Starting…",
  downloading: "Downloading from YouTube…",
  merging: "Combining video and audio…",
  transcoding: "Making sure it plays smoothly…",
  finalizing: "Almost done…",
  ready: "Preparing file…",
  transfer: "Sending to your browser…",
  complete: "Done",
  working: "Working…",
};

interface DownloadButtonProps {
  onDownload: () => void;
  isLoading: boolean;
  disabled: boolean;
  /** 0–100 */
  downloadProgress: number | null;
  /** Server-reported phase key */
  downloadPhase?: string;
}

export function DownloadButton({
  onDownload,
  isLoading,
  disabled,
  downloadProgress,
  downloadPhase = "",
}: DownloadButtonProps) {
  const showBar = isLoading;
  const pct =
    downloadProgress === null || downloadProgress === -1 ? null : downloadProgress;
  const indeterminate = pct === null && isLoading;
  const phaseLabel = PHASE_LABEL[downloadPhase] ?? (downloadPhase ? downloadPhase : "");

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
            {indeterminate
              ? "Starting…"
              : phaseLabel
                ? `${phaseLabel} · ${pct ?? 0}%`
                : `Progress ${pct ?? 0}%`}
          </p>
        </div>
      ) : null}
    </div>
  );
}
