'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Mail } from 'lucide-react';

const faqs = [
  {
    question: 'What is Kerja-AI.com?',
    answer:
      'A remote and hybrid job board built for Southeast Asia. We list verified remote and hybrid roles open to talent in Malaysia, Singapore, Philippines, Indonesia, and the rest of APAC. We also review remote work tools and publish salary data \u2014all focused on this region.',
  },
  {
    question: 'What does "kerja-ai" mean?',
    answer:
      'In Malay, "kerja" means work. So kerja-ai = remote work. The name reflects where we started and who we built this for.',
  },
  {
    question: 'What kind of jobs are listed here?',
    answer:
      'Mostly tech, design, marketing, product, and customer success roles \u2014the kind of work that can be done remotely. You\u2019ll find a mix of fully remote jobs (open to anywhere), hybrid roles, and APAC-specific ones that match your timezone.',
  },
  {
    question: 'How do I find jobs open to my country?',
    answer:
      'Use the location filter on the jobs page. Select your country (e.g. Malaysia, Philippines) or pick "APAC" to see everything in the region. There is also a Work Setup filter for 100% Remote or Hybrid. Every listing shows which locations the company hires from.',
  },
  {
    question: 'Are these jobs verified?',
    answer:
      'Yes. Every listing is checked before it goes live \u2014we verify the company is real, the work setup is accurately labelled 100% Remote or Hybrid, and applications are actually open. No scraped junk, no bait-and-switch listings.',
  },
  {
    question: 'Do I need an account to apply?',
    answer:
      'No. Click "Apply" and you go straight to the company\u2019s application page. No sign-up wall, no middleman.',
  },
  {
    question: 'How do I hear about new jobs?',
    answer:
      'Subscribe to our weekly newsletter at kerja-ai.com/newsletter \u2014we send hand-picked APAC remote and hybrid jobs every week. Free, no spam, unsubscribe any time.',
  },
  {
    question: 'What\u2019s the Remote Work Tools section?',
    answer:
      'We review tools that remote workers use daily \u2014project management, communication, VPNs, payroll, design tools \u2014and rate them specifically for how well they work in APAC. Pricing, latency, local payment methods, customer support hours. The stuff global review sites don\u2019t cover.',
  },
  {
    question: 'How do salary guides work?',
    answer:
      'We publish remote salary data broken down by role and location. So you can see what a remote software engineer in Malaysia typically earns vs one in Singapore. It\u2019s not perfect \u2014salary data never is \u2014but it gives you a realistic baseline for negotiations.',
  },
  {
    question: 'How are taxes handled for remote workers in APAC?',
    answer:
      'It depends on how you\u2019re hired. Full-time employees usually have taxes handled by the company or an EOR (Employer of Record). Contractors and freelancers handle their own taxes locally. If you\u2019re unsure, talk to a tax advisor in your country \u2014don\u2019t wing it.',
  },
  {
    question: 'How do I spot a remote job scam?',
    answer:
      'Red flags: vague job descriptions, Gmail or Yahoo email addresses, requests for money upfront, "guaranteed" high pay for no experience. If it feels too good to be true, it probably is. We vet every listing on Kerja-AI, but stay sharp on other platforms.',
  },
  {
    question: 'I\u2019m an employer. How do I post a job?',
    answer:
      'Head to kerja-ai.com/post-job. You can post a free listing or go featured for more visibility. Featured jobs appear at the top of search results and get highlighted across the site.',
  },
  {
    question: 'Can I partner with Kerja-AI?',
    answer:
      'If you\u2019re building something for remote workers in APAC \u2014tools, communities, education \u2014we\u2019re open to partnerships. Drop us a message at info@kerja-ai.com.',
  },
];

export default function FAQPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-14 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#1D4ED8] mb-4">
            FAQ
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Questions we get asked a lot
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            About the platform, remote work in APAC, and how things work here.
          </p>
        </div>
      </section>

      {/* FAQ list */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-start justify-between gap-4 py-5 text-left group"
              >
                <span className="text-[15px] font-semibold text-gray-900 group-hover:text-[#1D4ED8] transition-colors leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <p className="text-sm text-gray-500 leading-relaxed pb-5 -mt-1">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <div className="border border-gray-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Still got questions?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            We reply within 1-2 business days.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#1D4ED8] text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#c62806] transition"
          >
            <Mail className="w-4 h-4" />
            Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}
