'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase-client';
import { formatDate } from '@/lib/utils';

type Blog = {
  id: number;
  title: string;
  slug: string;
  featured_image?: string;
  date: string;
};

type Props = {
  currentSlug: string;
  category?: string;
};

export default function RelatedPosts({ currentSlug, category }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const supabase = createSupabaseClient();

      let query = supabase
        .from('blogs')
        .select('id, title, slug, featured_image, date')
        .neq('slug', currentSlug)
        .order('date', { ascending: false, nullsFirst: false })
        .limit(5);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching related posts:', error);
        return;
      }

      if (data) {
        const sanitized = data.map((blog) => ({
          ...blog,
          featured_image: blog.featured_image ?? undefined,
        }));
        setBlogs(sanitized);
      }
    };

    fetchBlogs();
  }, [currentSlug, category]);

  if (!blogs.length) return null;

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-bold text-gray-900 border-b-4 border-[#1D4ED8] inline-block pb-1 mb-4">
        {category ? 'Related Articles' : 'Latest Articles'}
      </h4>

      <div className="space-y-4">
        {blogs.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-lg overflow-hidden p-3 transition"
          >
            {post.featured_image && (
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  width={80}
                  height={80}
                  quality={60}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="flex flex-col justify-center min-w-0">
              <h5 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-3">
                {post.title}
              </h5>
              <p className="text-xs text-gray-500 mt-1">{formatDate(post.date)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
