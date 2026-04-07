/** Public site URL for canonical links, Open Graph, JSON-LD, sitemap (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5000";
  return raw.replace(/\/$/, "");
}
