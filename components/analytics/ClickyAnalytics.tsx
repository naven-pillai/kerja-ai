'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function ClickyAnalytics() {
  const pathname = usePathname();

  // ✅ Type-safe check
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <Script
      id="clicky-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var clicky_site_ids = clicky_site_ids || [];
          clicky_site_ids.push(101430879);
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
