import Link from 'next/link';
import Image from 'next/image';
import { createSupabasePublicClient } from '@/lib/supabase-public';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

type Blog = {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  featured_image?: string;
};

type Props = {
  imageAspectClasses?: string;
};

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length < 3) return '—';
  const [year, month, day] = parts;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[parseInt(month, 10) - 1];
  if (!monthName) return '—';
  return `${monthName} ${parseInt(day, 10)}, ${year}`;
}

export default async function LatestBlogSection({
  imageAspectClasses = 'aspect-[16/9] md:aspect-[4/3]',
}: Props) {
  const supabase = createSupabasePublicClient();

  const { data } = await supabase
    .from('blogs')
    .select('id, title, slug, category, date, featured_image')
    .order('date', { ascending: false, nullsFirst: false })
    .limit(6);

  const blogs: Blog[] = (data ?? []).map((blog) => ({
    ...blog,
    date: blog.date ?? '',
    featured_image: blog.featured_image ?? undefined,
  }));

  if (blogs.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          AI Careers, Explained
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Guides on AI and data careers, salary benchmarks, and what the AI shift means for Malaysia and Singapore.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group block border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
            >
              <div className={`relative w-full ${imageAspectClasses}`}>
                {blog.featured_image ? (
                  <Image
                    src={blog.featured_image}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={70}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
                    <DocumentTextIcon className="w-10 h-10 text-[#1D4ED8]/40" />
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3 text-left">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  {blog.category && (
                    <span className="bg-blue-100 text-[#1D4ED8] px-2 py-1 rounded-md">
                      {blog.category}
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    {formatDate(blog.date)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1D4ED8] transition leading-snug">
                  {blog.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-block bg-[#1D4ED8] text-white text-base font-semibold px-6 py-3 rounded-lg hover:bg-[#1E40AF] transition"
          >
            Read All Guides
          </Link>
        </div>
      </div>
    </section>
  );
}
