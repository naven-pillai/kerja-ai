import BlogContent from '@/components/blog/BlogContentPage';

export const metadata = {
  title: 'Remote Work & Hiring Insights | Kerja-AI',
  description: 'Get expert insights, guides, and updates on remote working, hiring, and productivity — tailored for APAC professionals.',
  alternates: { canonical: 'https://kerja-ai.com/blog' },
  openGraph: {
    title: 'Remote Work & Hiring Insights | Kerja-AI',
    description: 'Get expert insights, guides, and updates on remote working, hiring, and productivity — tailored for APAC professionals.',
    url: 'https://kerja-ai.com/blog',
    siteName: 'Kerja-AI',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
