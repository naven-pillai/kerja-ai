import type { Metadata } from 'next';
import Link from 'next/link';
import { jobCategories } from '@/constants/job-filters';
import { slugify } from '@/utils/slugify';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kerja-ai.com';

export const metadata: Metadata = {
  title: 'Remote & Hybrid Jobs by Category | Tech, Marketing, Design & More | Kerja-AI',
  description:
    'Browse remote and hybrid job categories across Southeast Asia and APAC — from software engineering and design to marketing, finance, and more.',
  alternates: { canonical: `${BASE_URL}/job-categories` },
  openGraph: {
    title: 'Remote & Hybrid Jobs by Category | Kerja-AI',
    description: 'Find remote and hybrid jobs by role — software, marketing, design, finance, HR, and more across APAC.',
    url: `${BASE_URL}/job-categories`,
    type: 'website',
  },
};

const categoryDescriptions: Record<string, string> = {
  'Full-Stack Development': 'End-to-end web development roles across the stack.',
  'Front-End Engineering': 'UI/UX-focused engineering and browser-based development.',
  'Back-End Engineering': 'Server-side, APIs, databases, and infrastructure.',
  Design: 'Product, UI/UX, graphic, and brand design roles.',
  Marketing: 'Growth, content, performance, and brand marketing.',
  'Digital Marketing': 'SEO, SEM, social media, and paid acquisition roles.',
  Sales: 'Business development, account executive, and sales ops.',
  'Customer Support': 'Support, helpdesk, and client success roles.',
  'Customer Success': 'Onboarding, retention, and customer relationship roles.',
  'Human Resource': 'Recruitment, people ops, and HR management.',
  Finance: 'Accounting, FP&A, treasury, and financial analysis.',
  'Data Science': 'ML, analytics, and data modelling roles.',
  'Data Analysis': 'Business intelligence, reporting, and insights roles.',
  'Product Management': 'Product strategy, roadmapping, and execution.',
  'Project Management': 'Project delivery, coordination, and operations.',
  'Artificial Intelligence (AI)': 'AI/ML engineering, prompt engineering, and LLM roles.',
  Copywriting: 'Content writing, UX copy, and editorial roles.',
  Writing: 'Technical writing, journalism, and content creation.',
  'Web Design': 'Website design, Webflow, and visual design roles.',
  Legal: 'Legal counsel, compliance, and contract management.',
  Cybersecurity: 'Security engineering, pen testing, and compliance.',
  'DevOps / SysAdmin': 'Infrastructure, CI/CD, cloud, and reliability.',
  'Software Development': 'General software engineering and coding roles.',
  'Software Engineering': 'Broad software engineering across languages and stacks.',
  'Business Development': 'Partnerships, growth, and BD strategy roles.',
  Operations: 'Business operations, logistics, and process improvement.',
  'Market Research': 'Consumer insights, competitive analysis, and research.',
  'Mobile Engineering': 'iOS, Android, and cross-platform mobile development.',
  'Customer Service': 'Frontline support and customer-facing roles.',
  'App Development': 'Native and cross-platform app development.',
};

export default function CategoriesIndexPage() {
  return (
    <main className="bg-[#f8f7f4] min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Job Categories</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Remote &amp; Hybrid Jobs by <span className="text-[#1D4ED8]">Category</span>
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl">
            Find the right remote or hybrid role for your skills. Browse all job categories available across Southeast Asia and APAC.
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
              <p className="text-xs text-gray-400 leading-relaxed">
                {categoryDescriptions[cat] ?? `Remote ${cat.toLowerCase()} jobs across APAC.`}
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
