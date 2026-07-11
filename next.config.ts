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
    ] as const;

    return legacy.flatMap(([source, destination]) => [
      { source, destination, permanent: true },
      { source: `${source}/`, destination, permanent: true },
    ]);
  },
};

export default nextConfig;
