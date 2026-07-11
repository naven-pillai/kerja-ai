'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseClient } from '@/lib/supabase-client';

type Blog = {
  id: number;
  title: string;
  slug: string;
  category: string;
  featured_image: string | null;
};

type BlogContentPageProps = {
  imageAspectClasses?: string;
  objectPositionClass?: string;
};

export default function BlogContentPage({
  imageAspectClasses = 'aspect-[16/9] md:aspect-[4/3]',
  objectPositionClass = 'object-center',
}: BlogContentPageProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, category, featured_image')
        .order('date', { ascending: false, nullsFirst: false });

      if (!error) setBlogs(data || []);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Remote Working Insights & Guides
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Dive into our curated resources on remote work, hiring, and productivity across APAC.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-600">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-24 text-gray-600">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group block border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
            >
              {blog.featured_image && (
                <div className={`relative w-full ${imageAspectClasses}`}>
                  <Image
                    src={blog.featured_image}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw,
                           (max-width: 1024px) 50vw,
                           33vw"
                    quality={70}
                    className={`object-cover ${objectPositionClass} group-hover:scale-105 transition-transform duration-300`}
                    priority={false}
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                {blog.category && (
                  <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-md">
                    {blog.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1D4ED8] transition">
                  {blog.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
