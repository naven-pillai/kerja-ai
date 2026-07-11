'use client';

import Link from 'next/link';

type Props = {
  blog: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
  };
};

export default function BlogCard({ blog }: Props) {
  return (
    <Link href={`/blog/${blog.slug}`} className="block p-6 border rounded-lg hover:shadow-md transition">
      <h2 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h2>
      <p className="text-sm text-gray-600">{blog.excerpt.slice(0, 100)}...</p>
    </Link>
  );
}
