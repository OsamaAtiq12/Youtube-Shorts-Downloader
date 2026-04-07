import Image from "next/image";
import { Clock3, ExternalLink, PlayCircle, Sparkles, Tv } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/helpers";
import type { VideoMetadataResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MetadataCardProps {
  data?: VideoMetadataResponse;
  loading?: boolean;
  className?: string;
}

export function MetadataCard({ data, loading, className }: MetadataCardProps) {
  if (loading) {
    return (
      <Card
        className={cn(
          "h-full min-h-[280px] overflow-hidden border-slate-200/90 bg-white/95 shadow-lg shadow-slate-200/40",
          className,
        )}
      >
        <CardContent className="p-0">
          <div className="grid h-full min-h-[280px] gap-0 md:grid-cols-[minmax(0,200px)_1fr]">
            <div className="relative aspect-[9/16] max-h-[min(340px,50vh)] w-full md:aspect-auto md:max-h-none md:min-h-[280px]">
              <Skeleton className="absolute inset-0 h-full w-full rounded-none md:rounded-l-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent md:rounded-l-2xl" />
            </div>
            <div className="flex flex-col justify-center space-y-4 p-5 sm:p-6">
              <Skeleton className="h-7 w-full max-w-md" />
              <Skeleton className="h-4 w-3/4 max-w-sm" />
              <div className="flex flex-wrap gap-2 pt-1">
                <Skeleton className="h-9 w-32 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card
        className={cn(
          "h-full min-h-[280px] overflow-hidden border-2 border-dashed border-slate-200/90 bg-gradient-to-br from-slate-50/90 via-violet-50/30 to-indigo-50/40 shadow-inner",
          className,
        )}
      >
        <CardContent className="h-full p-0">
          <div className="grid h-full min-h-[280px] gap-0 md:grid-cols-[minmax(0,200px)_1fr]">
            <div
              className={cn(
                "relative flex aspect-[9/16] max-h-[min(340px,50vh)] w-full items-center justify-center md:aspect-auto md:max-h-none md:min-h-[280px]",
                "bg-gradient-to-b from-slate-100 via-violet-100/50 to-indigo-100/60",
              )}
            >
              <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.5) 1px, transparent 0)", backgroundSize: "20px 20px" }} />
              <div className="relative flex flex-col items-center gap-3 px-4 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 shadow-lg shadow-violet-500/10 ring-1 ring-violet-200/60">
                  <PlayCircle className="h-9 w-9 text-violet-600" strokeWidth={1.5} />
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Thumbnail</span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Step 2 — Preview
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Nothing to show yet</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  Paste a YouTube Shorts or video link above, then tap <span className="font-medium text-slate-800">Fetch Video Info</span>. The
                  title, thumbnail, channel, and length will show up here.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                  Supports Shorts, <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">watch?v=</code>, and{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">youtu.be</code>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  After preview loads, pick a format on the right to download.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "h-full min-h-[280px] overflow-hidden border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100",
        className,
      )}
    >
      <CardContent className="h-full p-0">
        <div className="grid h-full min-h-[280px] gap-0 md:grid-cols-[minmax(0,220px)_1fr]">
          <div className="relative aspect-[9/16] max-h-[min(380px,52vh)] w-full overflow-hidden bg-slate-900 md:aspect-auto md:max-h-none md:min-h-[300px]">
            {data.thumbnail ? (
              <Image
                src={data.thumbnail}
                alt={data.title}
                fill
                sizes="(max-width: 768px) 100vw, 220px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-sm text-slate-400">No thumbnail</div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
            {data.duration != null && data.duration > 0 ? (
              <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 font-mono text-xs font-medium text-white backdrop-blur-sm">
                {formatDuration(data.duration)}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-4 p-5 sm:p-6">
            <div>
              <h3 className="line-clamp-3 text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">{data.title}</h3>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-900 ring-1 ring-violet-100">
                  <Tv className="h-4 w-4 shrink-0 text-violet-600" />
                  <span className="line-clamp-1">{data.uploader || "Unknown channel"}</span>
                </span>
                {data.duration != null && data.duration > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 ring-1 ring-slate-200/80 md:hidden">
                    <Clock3 className="h-4 w-4 text-slate-500" />
                    {formatDuration(data.duration)}
                  </span>
                ) : null}
              </div>
            </div>

            <a
              href={data.webpage_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-violet-600 transition hover:text-violet-700"
            >
              Open on YouTube
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
