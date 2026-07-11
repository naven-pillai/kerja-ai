import { Metadata } from 'next';

export const blogListingMetadata: Metadata = {
  title: 'Latest Remote Work Blogs | Kerja AI',
  description: 'AI careers, salaries and hiring in Malaysia and Singapore — guides on which roles are growing and what they pay in RM and SGD.',
  openGraph: {
    title: 'Latest Remote Work Blogs | Kerja AI',
    description: 'AI careers, salaries and hiring in Malaysia and Singapore — guides on which roles are growing and what they pay in RM and SGD.',
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
