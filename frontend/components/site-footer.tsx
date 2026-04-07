import Link from "next/link";

const siteName = "YouTube Shorts Downloader";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 py-8 backdrop-blur-sm" role="contentinfo">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-5">
        <p className="text-center text-sm text-slate-500 sm:text-left">
          © {new Date().getFullYear()} {siteName}. For personal use. Respect copyright and platform terms.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm" aria-label="Footer">
          <Link href="/privacy" className="font-medium text-violet-600 hover:text-violet-800 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/" className="text-slate-600 hover:text-slate-900 hover:underline">
            Home
          </Link>
        </nav>
      </div>
    </footer>
  );
}
