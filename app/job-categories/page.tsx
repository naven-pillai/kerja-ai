import type { Metadata } from 'next';
import Link from 'next/link';
import { jobCategories } from '@/constants/job-filters';
import { slugify } from '@/utils/slugify';
import { OG_IMAGES } from '@/lib/seo';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

export const metadata: Metadata = {
  title: 'AI & Data Job Categories in Malaysia & Singapore',
  description:
    'Browse the 11 AI, machine learning and data job categories on Kerja AI — from AI Engineering to Data Science, hiring across Malaysia and Singapore.',
  alternates: { canonical: `${BASE_URL}/job-categories` },
  openGraph: {
    title: 'AI & Data Job Categories - Kerja AI',
    description: 'Explore all 11 AI, machine learning and data job categories hiring across Malaysia and Singapore.',
    url: `${BASE_URL}/job-categories`,
    type: 'website',
    images: OG_IMAGES,
  },
};

const categoryDescriptions: Record<string, string> = {
  'AI Engineering': 'Ship AI features into production — models, APIs, and the glue that ties them together.',
  'Machine Learning Engineering': 'Build, train, and deploy ML models that run reliably at scale.',
  'Data Science': 'Turn messy data into decisions — modelling, experiments, and analysis.',
  'AI/ML Research': 'Push the frontier — novel models, papers, and applied research roles.',
  'Data Engineering': 'Build the pipelines and warehouses every AI and ML team runs on.',
  'Computer Vision Engineering': 'Teach machines to see — detection, recognition, and image pipelines.',
  'NLP Engineering': 'Work on language models, search, and text that machines actually understand.',
  'Deep Learning Engineering': 'Design and train neural networks for vision, language, and beyond.',
  'AI Architecture': 'Design the systems and infrastructure that AI products are built on.',
  'Prompt Engineering': 'Shape how LLMs behave — prompts, evals, and production guardrails.',
  'Data Annotation': 'Label and quality-check the data that trains every model.',
};

export default function CategoriesIndexPage() {
  return (
    <main className="bg-[#f8f7f4] min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Job Categories</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            AI &amp; Data Jobs by <span className="text-[#1D4ED8]">Category</span>
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl">
            AI is reshaping Malaysian and Singaporean careers. These are the eleven AI, machine learning and data categories where the new roles are showing up.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobCategories.map((cat) => (
            <Link
              key={cat}
              href={`/job-categories/${slugify(cat)}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-[#1D4ED8]/30 hover:shadow-sm transition"
            >
              <h2 className="font-bold text-gray-900 group-hover:text-[#1D4ED8] transition mb-1">
                {cat}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                {categoryDescriptions[cat] ?? `${cat} roles across Malaysia and Singapore.`}
              </p>
              <span className="mt-3 inline-block text-xs font-semibold text-[#1D4ED8]">
                View jobs →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: 'Job Categories', item: `${BASE_URL}/job-categories` },
            ],
          }),
        }}
      />
    </main>
  );
}
