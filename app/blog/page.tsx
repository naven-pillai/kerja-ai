import BlogContent from '@/components/blog/BlogContentPage';
import CollectionStructuredData from '@/components/seo/CollectionStructuredData';
import { OG_IMAGES } from '@/lib/seo';

export const metadata = {
  title: 'AI Career Guides for Malaysia & Singapore',
  description: 'Guides on breaking into AI, machine learning and data roles in Malaysia and Singapore — what to learn, what pays, and how AI is reshaping careers here.',
  alternates: { canonical: 'https://kerja-ai.com/blog' },
  openGraph: {
    title: 'AI Career Guides for Malaysia & Singapore',
    description: 'Guides on breaking into AI, machine learning and data roles in Malaysia and Singapore — what to learn, what pays, and how AI is reshaping careers here.',
    url: 'https://kerja-ai.com/blog',
    siteName: 'Kerja AI',
    type: 'website',
    images: OG_IMAGES,
  },
};

export default function BlogPage() {
  return (
    <>
      <CollectionStructuredData
        name="AI Career Guides for Malaysia & Singapore"
        description="Guides on breaking into AI, machine learning and data roles in Malaysia and Singapore."
        path="/blog"
      />
      <BlogContent />
    </>
  );
}
