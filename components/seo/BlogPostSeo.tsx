import { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase-server';

type Props = {
  params: { slug: string };
};

export async function generateBlogPostMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();

  const { data: blog } = await supabase
    .from('blogs')
    .select('title, slug, category, featured_image, updated_at, content, seo_title, seo_description')
    .eq('slug', params.slug)
    .single();

  if (!blog) {
    return {
      title: 'Blog Post Not Found | Kerja AI',
      description: 'This blog post does not exist or has been removed.',
    };
  }

  const metaTitle = blog.seo_title || blog.title;
  const metaDescription = blog.seo_description || truncate(blog.content, 160);
  const ogImage = blog.featured_image || 'https://kerja-ai.com/default-og-image.png';
  const blogUrl = `https://kerja-ai.com/blog/${blog.slug}`;

  return {
    title: `${metaTitle} | Kerja AI`,
    description: metaDescription,
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: `${metaTitle} | Kerja AI`,
      description: metaDescription,
      url: blogUrl,
      siteName: 'Kerja AI',
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} | Kerja AI`,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

/* Helper: Truncate long content to create fallback meta description */
function truncate(str: string | null, length: number) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length - 3) + '...' : str;
}
