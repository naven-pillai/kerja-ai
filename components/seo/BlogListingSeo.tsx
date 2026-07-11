import { Metadata } from 'next';

export const blogListingMetadata: Metadata = {
  title: 'Latest Remote Work Blogs | Kerja AI',
  description: 'Discover the latest insights on remote jobs, productivity tools, and career growth across Southeast Asia.',
  openGraph: {
    title: 'Latest Remote Work Blogs | Kerja AI',
    description: 'Discover the latest insights on remote jobs, productivity tools, and career growth across Southeast Asia.',
    url: 'https://kerja-ai.com/blog',
    siteName: 'Kerja AI',
    images: [
      {
        url: 'https://kerja-ai.com/og-image-blog.png',
        width: 1200,
        height: 630,
        alt: 'Kerja AI Blog',
      },
    ],
    type: 'website',
  },
  alternates: {
    canonical: 'https://kerja-ai.com/blog',
  },
};
