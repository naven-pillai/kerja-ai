'use client';

import '@/app/styles/blog-post.css';
import { sanitize } from '@/lib/sanitize';
import { optimizeBlogContentImages } from '@/lib/optimizeImageUrl';

type Props = {
  content: string;
};

export default function BlogContent({ content }: Props) {
  const cleanHTML = sanitize(content?.trim() ?? '');

  if (!cleanHTML) {
    return <div className="text-gray-500 italic">No content available.</div>;
  }

  // Route inline Supabase images through Next.js optimization
  const optimizedHTML = optimizeBlogContentImages(cleanHTML);

  return (
    <article
      className="blog-post"
      dangerouslySetInnerHTML={{ __html: optimizedHTML }}
    />
  );
}
