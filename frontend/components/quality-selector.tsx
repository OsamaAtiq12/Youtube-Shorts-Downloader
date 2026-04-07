"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VideoQuality } from "@/lib/types";

interface QualitySelectorProps {
  value: VideoQuality;
  onChange: (q: VideoQuality) => void;
  disabled?: boolean;
}

const OPTIONS: { id: VideoQuality; title: string; desc: string }[] = [
  {
    id: "1080p",
    title: "1080p",
    desc: "Up to Full HD — best match for vertical Shorts (1080×1920) and normal 1080p. Video + audio muxed.",
  },
  {
    id: "best",
    title: "Best quality",
    desc: "Highest video + best audio YouTube offers for this clip, combined into one MP4.",
  },
];

export function QualitySelector({ value, onChange, disabled }: QualitySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-semibold text-slate-800">Video quality</label>
      </div>
      <p className="text-xs leading-relaxed text-slate-500">
        Downloads are always <strong className="text-slate-700">video with audio</strong> in one file. The API merges streams with{" "}
        <strong className="text-slate-700">FFmpeg</strong> (bundled via <code className="rounded bg-slate-100 px-1">imageio-ffmpeg</code> or your system{" "}
        <code className="rounded bg-slate-100 px-1">PATH</code>).
      </p>
      <ul className="space-y-2">
        {OPTIONS.map((opt) => {
          const active = value === opt.id;
          return (
            <li key={opt.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(opt.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
                  active
                    ? "border-violet-500/60 bg-gradient-to-br from-violet-50 to-indigo-50/80 shadow-md shadow-violet-500/10"
                    : "border-slate-200/90 bg-white hover:border-violet-300/60 hover:bg-slate-50/90",
                  disabled && "pointer-events-none opacity-60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    active ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white",
                  )}
                >
                  {active ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                </span>
                <div>
                  <p className="font-medium text-slate-900">{opt.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{opt.desc}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
