'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

// Clicky is opt-in via env. Set NEXT_PUBLIC_CLICKY_SITE_ID to Kerja-AI's own
// Clicky site id to enable it. Renders nothing if unset (no analytics is far
// better than reporting into the wrong account).
export default function ClickyAnalytics() {
  const pathname = usePathname();
  const siteId = process.env.NEXT_PUBLIC_CLICKY_SITE_ID;

  if (!siteId) return null;
  if (pathname?.startsWith('/admin')) return null;

  return (
    <Script
      id="clicky-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var clicky_site_ids = clicky_site_ids || [];
          clicky_site_ids.push(${Number(siteId)});
          (function() {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.getclicky.com/js";
            document.head.appendChild(s);
          })();
        `,
      }}
    />
  );
}
