import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75],
    minimumCacheTTL: 2592000, // 30 days — cache optimised images longer
    remotePatterns: [
      {
        // Kerja-AI Supabase project storage (public bucket objects). Pinned to
        // the project ref so the image optimizer isn't an open proxy.
        protocol: 'https',
        hostname: 'igmtoqxfbjcsxnaqtyrc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'kerja-ai.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/mailerlite-screenshots-prod/**',
      },
    ],
  },
  // Disable automatic trailing-slash normalization so our explicit redirects below
  // can fire in a single hop. Without this, `/foo/` becomes a 2-hop chain
  // (auto-strip → user redirect), which Google reports as "No Follow Attribute".
  skipTrailingSlashRedirect: true,
  async headers() {
    // NOTE: there is deliberately no script-src CSP here. The app serves an inline
    // ld+json block, TinyMCE and Vercel Speed Insights, so a script-src policy needs
    // a nonce emitted from middleware — adding one blind would break the page. The
    // frame-ancestors policy below is script-agnostic and safe to set on its own.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // No OAuth popups on the public site, so full same-origin isolation is safe.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // No includeSubDomains/preload: not every kerja-ai.com subdomain is
          // confirmed HTTPS-only, and both directives are painful to unwind.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
        ],
      },
    ];
  },
  async redirects() {
    // Each redirect is duplicated for its trailing-slash variant so they fire
    // in a single hop instead of chaining through Next.js's auto-normalization.
    const legacy = [
      // Alternate taxonomy URL shapes → canonical programmatic URLs
      ['/job-category/:slug', '/job-categories/:slug'],
      ['/job-type/:slug',     '/job-types/:slug'],
      ['/location',           '/job-location'],
      ['/location/:slug',     '/job-location/:slug'],
      ['/categories',         '/job-categories'],
      ['/categories/:slug',   '/job-categories/:slug'],
      // Common inbound company path alias
      ['/remote-companies',       '/companies'],
      ['/remote-companies/:slug', '/companies/:slug'],
      // Salary pages moved from the field to the role — "data scientist salary"
      // is what people search, not "data science salary". These shipped live and
      // are in the sitemap, so they redirect rather than 404.
      ['/salary/data-science',                  '/salary/data-scientist'],
      ['/salary/data-science/:country',         '/salary/data-scientist/:country'],
      ['/salary/data-engineering',              '/salary/data-engineer'],
      ['/salary/data-engineering/:country',     '/salary/data-engineer/:country'],
      ['/salary/machine-learning-engineering',          '/salary/machine-learning-engineer'],
      ['/salary/machine-learning-engineering/:country', '/salary/machine-learning-engineer/:country'],
      ['/salary/ai-engineering',                '/salary/ai-engineer'],
      ['/salary/ai-engineering/:country',       '/salary/ai-engineer/:country'],
    ] as const;

    return legacy.flatMap(([source, destination]) => [
      { source, destination, permanent: true },
      { source: `${source}/`, destination, permanent: true },
    ]);
  },
};

export default nextConfig;
