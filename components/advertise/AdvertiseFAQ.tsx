'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How fast can my ad go live?',
    a: "Newsletter slots ship on the next Friday send (book by Wednesday). Sidebar banners go live within 24 hours of creative approval. Sponsored blog posts take 5–7 days to write and publish.",
  },
  {
    q: 'Do you accept payment in USD or other currencies?',
    a: 'Yes. Default is MYR via bank transfer or card. USD invoicing is available — just ask when you submit your request.',
  },
  {
    q: 'Can I see results after the campaign?',
    a: 'Yes. For newsletter slots we share open rate and link clicks. For banners we share impressions and CTR. Bundles include a light end-of-campaign summary.',
  },
  {
    q: 'What content do you not accept?',
    a: "We don't run crypto / token sales, gambling, get-rich-quick schemes, multi-level marketing, or anything that doesn't fit an AI, data or careers context for Malaysia and Singapore. If unsure, just ask.",
  },
  {
    q: 'Can I cancel after booking?',
    a: 'Yes — full refund if you cancel before we publish. After the slot runs, we do not refund (the impressions already happened).',
  },
  {
    q: "What if I want something not on the list?",
    a: "Tell us. We've done podcast sponsorships, co-hosted webinars, and exclusive industry reports. Email info@kerja-ai.com with your idea.",
  },
];

export default function AdvertiseFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest mb-2">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Common questions
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-semibold text-gray-900 group-hover:text-[#1D4ED8] transition-colors leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 -mt-1">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
