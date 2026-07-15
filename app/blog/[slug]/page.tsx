import { notFound } from 'next/navigation';
import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { formatDate, truncate, readingTime } from '@/lib/utils';
import { extractHeadingsFromHTML } from '@/lib/extractHeadingsFromHTML';

import BlogContent from '@/components/blog/BlogContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import StructuredDataBlogPost from '@/components/seo/StructuredDataBlogPost';
import ScrollToTopOnRouteChange from '@/components/common/ScrollToTopOnRouteChange';
import NewsletterSidebar from '@/components/common/NewsletterSidebar';
import BlogSummarizeBar from '@/components/summarize/BlogSummarizeBar';
import AuthorBox from '@/components/blog/AuthorBox';
import SocialShareBlog from '@/components/blog/SocialShareBlog';
import LatestJobsBox from '@/components/blog/LatestJobsBox';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';

import Image from 'next/image';
import { Database } from '@/types/supabase';

type PageParams = { slug: string };
type Blog = Database['public']['Tables']['blogs']['Row'];

/* ---------------------------------------------------------
 Cached DB fetch — deduped within a single request
---------------------------------------------------------- */
const getBlog = cache(async (slug: string) => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('blogs')
    .select(
      'id, title, slug, content, featured_image, category, updated_at, created_at, seo_title, seo_description'
    )
    .eq('slug', slug)
    .maybeSingle<Blog>();
  return data;
});

/* ---------------------------------------------------------
 Metadata Generation for SEO
---------------------------------------------------------- */
export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: 'Post Not Found',
      description: 'This blog post could not be found.',
    };
  }

  const blogUrl = `https://kerja-ai.com/blog/${blog.slug}`;
  const featuredImage = blog.featured_image ?? 'https://kerja-ai.com/default-blog-image.png';
  const metaTitle = blog.seo_title || blog.title;
  const metaDescription = blog.seo_description || truncate(blog.content, 160);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: blogUrl },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: blogUrl,
      images: [{ url: featuredImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [featuredImage],
    },
  };
}

/* ---------------------------------------------------------
 Blog Post Page Component
---------------------------------------------------------- */
export default async function BlogSlugPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return notFound();

  const blogUrl = `https://kerja-ai.com/blog/${blog.slug}`;
  const featuredImage = blog.featured_image ?? 'https://kerja-ai.com/default-blog-image.png';
  const metaTitle = blog.seo_title || blog.title;
  const metaDescription = blog.seo_description || truncate(blog.content, 160);

  // Inject heading IDs into HTML for anchor links
  const { updatedHtml } = extractHeadingsFromHTML(blog.content ?? '');
  const mins = readingTime(blog.content);

  return (
    <>
      <ScrollToTopOnRouteChange />
      <ReadingProgressBar />

      <StructuredDataBlogPost
        title={metaTitle}
        description={metaDescription}
        url={blogUrl}
        datePublished={blog.created_at ?? blog.updated_at ?? new Date().toISOString()}
        dateModified={blog.updated_at ?? new Date().toISOString()}
        featuredImage={featuredImage}
        authorName="Kerja AI Team"
      />

      {/* Page body */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

          {/* ── Main article ── */}
          <article className="min-w-0">

            {/* Title */}
            <h1 className="font-body text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              {blog.title}
            </h1>

            {/* Meta block */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              {/* Category + author row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {blog.category && (
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                )}
                <span className="text-xs text-gray-500">·</span>
                <span className="text-xs text-gray-600">
                  Written &amp; Reviewed by{' '}
                  <span className="font-semibold text-gray-800">Naven Pillai</span>
                </span>
              </div>

              {/* Date + reading time row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                <span>Published {formatDate(blog.created_at)}</span>
                {blog.updated_at && blog.updated_at !== blog.created_at && (
                  <>
                    <span>·</span>
                    <span>Updated {formatDate(blog.updated_at)}</span>
                  </>
                )}
                <span>·</span>
                <span>{mins} min read</span>
              </div>
            </div>

            {/* AI Summarize bar */}
            <BlogSummarizeBar slug={blog.slug} title={blog.title} />

            {/* Hero image */}
            <div className="my-8 rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={featuredImage}
                alt={blog.title}
                width={1200}
                height={630}
                quality={75}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Body */}
            <BlogContent content={updatedHtml} />

            {/* Social share */}
            <SocialShareBlog title={blog.title} slug={blog.slug} />

            {/* Author box */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <AuthorBox />
            </div>

            {/* Mobile: Related + Newsletter */}
            <div className="lg:hidden mt-10 space-y-8">
              <RelatedPosts currentSlug={blog.slug} category={blog.category ?? undefined} />
              <NewsletterSidebar />
            </div>
          </article>

          {/* ── Sidebar (desktop only) ── */}
          <aside className="hidden lg:block space-y-6">
            <RelatedPosts currentSlug={blog.slug} category={blog.category ?? undefined} />
            <NewsletterSidebar />
            <LatestJobsBox />
          </aside>

        </div>
      </div>
    </>
  );
}
