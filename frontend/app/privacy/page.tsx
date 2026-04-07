import type { Metadata } from "next";
import Link from "next/link";

import { getSiteUrl } from "@/lib/site";

const siteName = "YouTube Shorts Downloader";

const PAGE_DESCRIPTION =
  "Privacy Policy for YouTube Shorts Downloader: how we handle URLs, downloads, local storage, and your data. Last updated April 2026.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: PAGE_DESCRIPTION,
  keywords: [
    "privacy policy",
    "data protection",
    "YouTube downloader privacy",
    "local storage",
    "cookies",
  ],
  authors: [{ name: siteName }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: `Privacy Policy | ${siteName}`,
    description:
      "How we collect, use, and protect information when you use our YouTube Shorts downloader web application.",
    url: "/privacy",
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `Privacy Policy | ${siteName}`,
    description:
      "How we collect, use, and protect information when you use our YouTube Shorts downloader web application.",
  },
};

const lastUpdated = "2026-04-07";

export default function PrivacyPolicyPage() {
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Privacy Policy | ${siteName}`,
    description: PAGE_DESCRIPTION,
    url: `${siteUrl}/privacy`,
    dateModified: lastUpdated,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-5 sm:py-16">
        <nav className="mb-10 text-sm text-slate-600" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-slate-400">
              /
            </li>
            <li className="text-slate-900">Privacy Policy</li>
          </ol>
        </nav>

        <article className="text-slate-700">
          <header className="mb-10 border-b border-slate-200 pb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-sm text-slate-600">
              <time dateTime={lastUpdated}>Last updated: {lastUpdated}</time>
            </p>
          </header>

          <div className="space-y-10 text-[15px] leading-relaxed sm:text-base">
            <section aria-labelledby="overview">
              <h2 id="overview" className="mb-3 text-xl font-semibold text-slate-900">
                1. Overview
              </h2>
              <p>
                This Privacy Policy describes how <strong className="text-slate-900">{siteName}</strong> (“we”, “us”, or
                “our”) handles information when you use our web application (the “Service”). We designed the Service to
                minimize data collection and to keep processing transparent.
              </p>
            </section>

            <section aria-labelledby="collect">
              <h2 id="collect" className="mb-3 text-xl font-semibold text-slate-900">
                2. Information we process
              </h2>
              <p className="mb-3">You may provide or generate the following categories of information:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-slate-900">URLs you submit</strong> — When you paste a YouTube link, that URL is
                  sent to our backend to fetch metadata and to prepare downloads. Do not submit links you are not
                  authorized to access.
                </li>
                <li>
                  <strong className="text-slate-900">Download activity</strong> — File downloads are initiated through our
                  server as part of providing the Service. Temporary files may be created server-side and removed according
                  to server configuration.
                </li>
                <li>
                  <strong className="text-slate-900">Local storage (your device)</strong> — The app may store a short
                  “recent downloads” list in your browser&apos;s <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">localStorage</code>{" "}
                  for convenience. This data stays on your device unless you clear it.
                </li>
                <li>
                  <strong className="text-slate-900">Technical data</strong> — Like most websites, hosting infrastructure
                  may create standard server logs (for example IP address, timestamps, request paths) for security and
                  reliability.
                </li>
              </ul>
            </section>

            <section aria-labelledby="use">
              <h2 id="use" className="mb-3 text-xl font-semibold text-slate-900">
                3. How we use information
              </h2>
              <p className="mb-3">We use information to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide, operate, and maintain the Service (including metadata extraction and downloads)</li>
                <li>Respond to errors, abuse, or technical issues</li>
                <li>Improve performance, security, and user experience</li>
              </ul>
            </section>

            <section aria-labelledby="third">
              <h2 id="third" className="mb-3 text-xl font-semibold text-slate-900">
                4. Third-party services
              </h2>
              <p>
                The Service interacts with YouTube and related infrastructure indirectly through metadata and media
                retrieval libraries. Your use of YouTube content must comply with YouTube&apos;s Terms of Service and
                applicable laws. We do not control YouTube&apos;s policies or data practices.
              </p>
            </section>

            <section aria-labelledby="retention">
              <h2 id="retention" className="mb-3 text-xl font-semibold text-slate-900">
                5. Retention
              </h2>
              <p>
                Server-side temporary files are intended to be short-lived. Browser local history can be cleared by you at
                any time using your browser settings or the in-app controls where available.
              </p>
            </section>

            <section aria-labelledby="rights">
              <h2 id="rights" className="mb-3 text-xl font-semibold text-slate-900">
                6. Your choices and rights
              </h2>
              <p>
                Depending on where you live, you may have rights to access, correct, delete, or restrict processing of
                personal data. Because this Service minimizes collection, there may be little or nothing stored beyond
                standard logs. For requests, contact us using the details below.
              </p>
            </section>

            <section aria-labelledby="children">
              <h2 id="children" className="mb-3 text-xl font-semibold text-slate-900">
                7. Children
              </h2>
              <p>
                The Service is not directed to children under 13, and we do not knowingly collect personal information from
                children.
              </p>
            </section>

            <section aria-labelledby="changes">
              <h2 id="changes" className="mb-3 text-xl font-semibold text-slate-900">
                8. Changes to this policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will revise the “Last updated” date at the top of
                this page when changes are made.
              </p>
            </section>

            <section aria-labelledby="contact">
              <h2 id="contact" className="mb-3 text-xl font-semibold text-slate-900">
                9. Contact
              </h2>
              <p>
                For privacy questions about this Service, please contact the operator of this deployment (your administrator
                or project owner). If you are using a public instance, refer to the contact information published on the
                site.
              </p>
            </section>
          </div>
        </article>

        <p className="mt-12 text-center text-sm text-slate-500">
          <Link href="/" className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
            ← Back to {siteName}
          </Link>
        </p>
      </div>
    </>
  );
}
