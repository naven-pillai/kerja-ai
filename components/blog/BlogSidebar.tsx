'use client';

import TableOfContentsBox from '@/components/blog/TableOfContentsBox';
import RelatedPosts from '@/components/blog/RelatedPosts';
import NewsletterCTA from '@/components/common/NewsletterCTA';
import type { Heading } from '@/lib/extractHeadingsFromHTML';

type Props = {
  headings: Heading[];
  currentSlug: string;
};

export default function BlogSidebar({ headings, currentSlug }: Props) {
  return (
    <aside className="w-full md:w-1/3 flex flex-col gap-8 sticky top-24 self-start">
      {/* Table of Contents */}
      <TableOfContentsBox headings={headings} />

      {/* Related Posts */}
      <RelatedPosts currentSlug={currentSlug} />

      {/* Newsletter Signup */}
      <NewsletterCTA />
    </aside>
  );
}
