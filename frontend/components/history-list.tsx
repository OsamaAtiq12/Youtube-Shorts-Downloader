import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import type { RecentDownloadItem } from "@/lib/types";

interface HistoryListProps {
  items: RecentDownloadItem[];
  onClear: () => void;
}

export function HistoryList({ items, onClear }: HistoryListProps) {
  if (!items.length) {
    return <EmptyState title="No downloads yet" description="Your recent downloads will appear here." />;
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-end border-b border-slate-100 pb-3">
        <Button size="sm" variant="ghost" className="text-slate-600" onClick={onClear}>
          Clear all
        </Button>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={`${item.downloadedAt}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <p className="line-clamp-1 font-medium text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-500">
              {new Date(item.downloadedAt).toLocaleString()} • {item.videoQuality === "1080p" ? "1080p" : "Best"}{" "}
              · video+audio
            </p>
            <p className="line-clamp-1 text-xs text-slate-500">{item.url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
