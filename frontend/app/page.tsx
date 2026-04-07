"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DownloadButton } from "@/components/download-button";
import { HistoryList } from "@/components/history-list";
import { MetadataCard } from "@/components/metadata-card";
import { QualitySelector } from "@/components/quality-selector";
import { SectionHeader } from "@/components/section-header";
import { UrlForm } from "@/components/url-form";
import { Card, CardContent } from "@/components/ui/card";
import { useDownloadVideo } from "@/hooks/useDownloadVideo";
import { useExtractVideo } from "@/hooks/useExtractVideo";
import { useRecentDownloads } from "@/hooks/useRecentDownloads";
import type { VideoQuality } from "@/lib/types";
import type { ExtractFormValues } from "@/lib/validators";

export default function HomePage() {
  const [videoQuality, setVideoQuality] = useState<VideoQuality>("1080p");
  const [lastUrl, setLastUrl] = useState<string>("");

  const extractMutation = useExtractVideo();
  const downloadMutation = useDownloadVideo();
  const history = useRecentDownloads();

  const metadata = extractMutation.data;
  const hasMetadata = Boolean(metadata);

  const handleExtract = (values: ExtractFormValues) => {
    setLastUrl(values.url);
    extractMutation.mutate(
      { url: values.url },
      {
        onSuccess: () => toast.success("Metadata fetched successfully"),
        onError: (error: Error) => toast.error(error.message),
      },
    );
  };

  const handleDownload = () => {
    if (!lastUrl || !metadata) return;

    downloadMutation.mutate(
      {
        url: lastUrl,
        video_quality: videoQuality,
      },
      {
        onSuccess: (blob) => {
          const safeTitle = metadata.title.replace(/[<>:"/\\|?*]+/g, "").slice(0, 80);
          const filename = `${safeTitle}.mp4`;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          URL.revokeObjectURL(link.href);

          history.addItem({
            title: metadata.title,
            url: lastUrl,
            videoQuality,
            downloadedAt: new Date().toISOString(),
          });
          toast.success("Download ready");
        },
        onError: (error: Error) => toast.error(error.message),
      },
    );
  };

  const canDownload = Boolean(hasMetadata && lastUrl);

  return (
    <main className="relative flex-1 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-violet-50/40">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-10 sm:px-5 sm:py-14">
        <section className="mb-8 text-center sm:mb-10">
          <p className="mb-3 inline-flex rounded-full border border-violet-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-700 shadow-sm backdrop-blur-sm">
            Fast · Private · No clutter
          </p>
          <h1 className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            YouTube Shorts Downloader
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Fetch a Short, choose 1080p or best quality, and get one MP4 with video and audio.
          </p>
        </section>

        <div className="flex flex-col gap-6 sm:gap-8">
          <Card className="border-slate-200/80 bg-white/90 shadow-premium backdrop-blur-sm transition-shadow hover:shadow-lg">
            <CardContent className="p-5 sm:p-6">
              <SectionHeader title="1. Paste URL" subtitle="Shorts, watch pages, and youtu.be links are supported." />
              <UrlForm onSubmit={handleExtract} isLoading={extractMutation.isPending} />
            </CardContent>
          </Card>

          <section className="flex flex-col gap-3 sm:gap-4">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
              <SectionHeader title="2. Preview" className="mb-0" />
              <SectionHeader
                title="3. Quality & download"
                subtitle="Video + audio in one MP4 (FFmpeg via backend dependency or PATH)."
                className="mb-0"
              />
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
              <div className="flex min-h-0">
                <MetadataCard data={metadata} loading={extractMutation.isPending} className="w-full" />
              </div>

              <Card className="flex min-h-[280px] flex-col border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                <CardContent className="flex flex-1 flex-col gap-6 p-5 sm:p-6">
                  {hasMetadata ? (
                    <>
                      <QualitySelector
                        value={videoQuality}
                        onChange={setVideoQuality}
                        disabled={downloadMutation.isPending}
                      />
                      <DownloadButton
                        onDownload={handleDownload}
                        disabled={!canDownload}
                        isLoading={downloadMutation.isPending}
                        downloadProgress={downloadMutation.downloadProgress}
                      />
                    </>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-10 text-center sm:py-12">
                      <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                        Fetch video info in step 1 to choose quality and download.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="flex flex-col gap-3 sm:gap-4">
            <SectionHeader title="Recent downloads" subtitle="Saved only in this browser." />
            <HistoryList items={history.items} onClear={history.clearAll} />
          </section>
        </div>
      </div>
    </main>
  );
}
