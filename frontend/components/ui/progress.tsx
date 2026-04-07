"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number | null;
  /** When true, show indeterminate animation (value ignored) */
  indeterminate?: boolean;
  className?: string;
}

export function Progress({ value, indeterminate, className }: ProgressProps) {
  const pct = value == null ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/80",
        className,
      )}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {indeterminate ? (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-violet-400/40 via-indigo-500/60 to-cyan-400/40" />
      ) : (
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      )}
    </div>
  );
}
