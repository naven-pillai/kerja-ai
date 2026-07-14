'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * GA4, opt-in via env. Set NEXT_PUBLIC_GA_ID to Kerja AI's own Measurement ID
 * (Google Analytics -> Admin -> Data streams -> the G-XXXXXXXXXX).
 *
 * Renders nothing when unset, so a fork, a preview deploy or a local run reports
 * nowhere rather than polluting the real property. Same rule as ClickyAnalytics.
 * The id ships in the page source of every GA site and is not a secret, so
 * NEXT_PUBLIC_ is correct.
 *
 * Why this is hand-rolled rather than @next/third-parties' <GoogleAnalytics>:
 * that component calls gtag('config') once and never looks at the route again.
 * On an App Router site almost every visit after the landing page is a
 * client-side navigation, so whether those get counted comes down to a GA4
 * dashboard toggle (Enhanced Measurement -> "page changes based on browser
 * history events"). If that toggle is ever off, the property silently records
 * only the page people land on, and nothing they click through to.
 *
 * So we own it: suppress the automatic page_view and send exactly one ourselves
 * per route change, first paint included. One page_view per route, decided in
 * code, not in a dashboard.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== 'function') return;

    // page_location carries the query string (e.g. /jobs?q=llm), which is worth
    // having — it is how we learn what people search for.
    gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [gaId, pathname]);

  if (!gaId) return null;

  return (
    <>
      <Script
        id="ga-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
