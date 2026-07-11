'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Mail } from 'lucide-react';

const faqs = [
  {
    question: 'What is Kerja-AI?',
    answer:
      'The job board for AI, machine learning and data careers in Malaysia and Singapore. Not a general board \u2014 you won\u2019t find retail or admin roles here, only AI, ML and data work. Think of JobStreet\u2019s territory narrowed to one field that\u2019s growing fast.',
  },
  {
    question: 'Is it really free?',
    answer:
      'For job seekers, completely \u2014 no account wall, no paywall, no premium tier. For employers, posting a role is free right now too. There\u2019s no paid plan waiting behind it.',
  },
  {
    question: 'Is this only for Malaysia?',
    answer:
      'No. It\u2019s Malaysia and Singapore, and that pairing is the whole point. Plenty of Malaysians weigh an RM offer in KL against an SGD one across the border, so the Singapore roles here are written for people making exactly that comparison.',
  },
  {
    question: 'Are these real jobs, or scraped listings?',
    answer:
      'Real openings at companies actually hiring for AI, ML and data roles in Malaysia or Singapore. We\u2019re not mass-scraping the internet and hoping. If a role isn\u2019t genuine AI, ML or data work in one of the two countries, it doesn\u2019t go up.',
  },
  {
    question: 'How is this different from JobStreet or Hiredly?',
    answer:
      'Those are general boards \u2014 thousands of roles across every industry, with AI and data jobs buried somewhere inside. Kerja-AI does one thing: AI, ML and data careers in MY and SG. You skip the filtering and see only what\u2019s relevant to you.',
  },
  {
    question: 'What roles count as AI and data here?',
    answer:
      'Eleven categories: AI Engineering, Machine Learning Engineering, Data Science, AI/ML Research, Data Engineering, Computer Vision, NLP, Deep Learning, AI Architecture, Prompt Engineering and Data Annotation. If your work sits in that space, there\u2019s a lane for it.',
  },
  {
    question: 'I\u2019m a fresh grad worried AI is closing doors. Is this for me?',
    answer:
      'Yes \u2014 you\u2019re exactly who I built it for. AI is reshaping the job market, but it\u2019s also creating the roles listed here. TalentCorp projects around 120 emerging roles as AI and digitalisation reshape work over the next few years, and this board is where those show up.',
  },
  {
    question: 'Do I need an account to apply?',
    answer:
      'No. Hit apply and you go straight to the company\u2019s own application page. No sign-up wall, no middleman sitting between you and the employer.',
  },
  {
    question: 'How do I hear about new roles?',
    answer:
      'Subscribe to the weekly newsletter at kerja-ai.com/newsletter. One email a week with new AI and data roles across Malaysia and Singapore \u2014 free, no spam, one-click unsubscribe.',
  },
  {
    question: 'Why should I care about Singapore roles if I\u2019m in Malaysia?',
    answer:
      'Because the KL\u2013Singapore corridor is real money. An SGD salary can be worth far more than its RM equivalent even after cost of living, and Singapore hires a lot of Malaysian AI and data talent. Seeing both sides on one board makes that decision concrete instead of hypothetical.',
  },
  {
    question: 'How current is the salary information?',
    answer:
      'Where we show pay, it\u2019s context for the role \u2014 RM or SGD ranges to anchor a negotiation, not a promise. Salary data is never exact, but a realistic baseline beats walking in blind.',
  },
  {
    question: 'I\u2019m hiring. How do I post a role?',
    answer:
      'Go to kerja-ai.com/post-job and post it free. Your listing reaches people specifically looking for AI, ML and data work in Malaysia and Singapore \u2014 not the whole internet, just the audience that matches.',
  },
  {
    question: 'Can I partner with Kerja-AI?',
    answer:
      'If you\u2019re building something for AI and data professionals in MY or SG \u2014 a tool, a community, a course \u2014 I\u2019m open to it. Email info@kerja-ai.com and tell me what you have in mind.',
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
            The honest answers on what Kerja-AI is, who it&apos;s for, and how
            it&apos;s different from a general job board.
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
