'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, ChevronDown, ExternalLink } from 'lucide-react';
import CountryCombobox from '@/components/common/CountryCombobox';
import { getCountryList } from '@/utils/getCountries';

const countries = getCountryList();

type NewsletterIssue = {
  id: string;
  subject: string;
  sentAt: string | null;
  previewUrl: string;
  screenshotUrl: string;
};

type Props = {
  issues: NewsletterIssue[];
};

const faqs = [
  {
    q: 'How often do you send emails?',
    a: 'Once a week. That\'s it. No drip campaigns, no "we missed you" emails, no upsells.',
  },
  {
    q: 'What kind of jobs do you feature?',
    a: 'New AI, machine learning and data roles at companies hiring in Malaysia and Singapore. Every listing is a real opening in the field — nothing scraped, nothing padded with general software jobs.',
  },
  {
    q: 'Is this really free?',
    a: 'Yes. No paid tiers, no premium version. The newsletter is free and always will be.',
  },
  {
    q: 'Can I unsubscribe anytime?',
    a: 'One click. Every email has an unsubscribe link at the bottom. No guilt trips.',
  },
];

export default function NewsletterPageClient({ issues }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/geo')
      .then((r) => r.json())
      .then((d) => {
        if (d.country) {
          const found = countries.find((c) => c.code === d.country);
          if (found) setCountry(found.name);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, location: country, website }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'An error occurred');
        return;
      }

      router.push('/newsletter-success');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 to-white pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1D4ED8]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Mail size={14} className="text-[#1D4ED8]" />
            <span className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
              Free Weekly Newsletter
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            The Kerja-AI newsletter
            <br className="hidden sm:block" />
            <span className="text-[#1D4ED8]"> actually worth opening.</span>
          </h1>

          <p className="mt-5 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            One email a week with new AI, machine learning and data roles across Malaysia and
            Singapore. Real openings only — no filler, no general jobs padding the list.
          </p>

          {/* Inline signup form */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 max-w-lg mx-auto"
          >
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  aria-label="First name"
                  placeholder="First name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] text-sm shadow-sm"
                />
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] text-sm shadow-sm"
                />
              </div>

              <div className="w-full">
                <CountryCombobox
                  selected={country}
                  onChange={setCountry}
                  inputClassName="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8] text-sm shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.98] text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 cursor-pointer shadow-sm"
              >
                {loading ? 'Subscribing...' : 'Subscribe — It\'s Free'}
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm mt-3">{error}</p>
            )}

            <p className="text-xs text-gray-500 mt-3">
              One email a week — new AI and data roles across Malaysia and Singapore. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </section>

      {/* Past Issues — Card Grid */}
      <section className="py-16 md:py-20 bg-gray-50/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Recent issues
            </h2>
            <p className="text-gray-500 mt-2">
              Here&apos;s a taste of what you&apos;ve been missing.
            </p>
          </div>

          {issues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <a
                  key={issue.id}
                  href={issue.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#1D4ED8]/30 hover:shadow-lg transition group"
                >
                  {/* Screenshot */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {issue.screenshotUrl ? (
                      <Image
                        src={issue.screenshotUrl}
                        alt={issue.subject}
                        fill
                        className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Mail size={32} className="text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={14} className="text-[#1D4ED8]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">
                      {issue.sentAt
                        ? new Date(issue.sentAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </p>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[#1D4ED8] transition line-clamp-2">
                      {issue.subject}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              Our first issues are on the way — subscribe to be first in line.
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Common questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 shrink-0 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-gray-50/60">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Don&apos;t job-hunt alone.
          </h2>
          <p className="text-gray-500 mb-8">
            Let us do the digging. You just open your inbox.
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-8 py-3.5 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            Subscribe Now — Free
          </a>
        </div>
      </section>
    </div>
  );
}
