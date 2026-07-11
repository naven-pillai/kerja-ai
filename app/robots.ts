import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Explicitly allow Next.js static assets. Blocking /_next/static/ has
        // previously caused sitewide "Discovered – currently not indexed" failures.
        allow: ['/', '/_next/static/', '/api/geo'],
        disallow: [
          '/private/',
          '/api/',
          '/post-success',
          '/newsletter-success',
          '/blog/preview',
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
