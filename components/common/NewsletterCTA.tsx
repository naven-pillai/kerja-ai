'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { looksLikeEmail, newsletterHandoffHref } from '@/lib/newsletterHandoff';

export default function NewsletterCTA() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Hands off to /newsletter rather than subscribing here, so the subscriber
  // picks their categories instead of being opted into all four by default.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!looksLikeEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    router.push(newsletterHandoffHref(email));
  };

  return (
    <section
      id="newsletter"
      className="relative py-20 overflow-hidden bg-[#1D4ED8]"
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-black/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        {/* Light card */}
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-12 md:px-14 md:py-14 text-center space-y-5">
          <p className="text-[#1D4ED8] text-xs font-semibold uppercase tracking-widest">
            Free Weekly Newsletter
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Stop missing the best <br className="hidden sm:block" />
            AI and data jobs in Malaysia and Singapore.
          </h2>

          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            Every week, <span className="font-semibold text-gray-700">Kerja AI</span> rounds up the newest AI, machine learning and data roles across Malaysia and Singapore — straight to your inbox. No spam.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 pt-2"
          >
            <input
              type="email"
              required
              aria-label="Email address"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-80 px-5 py-3 rounded-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm"
            />

            <button
              type="submit"
              className="w-full sm:w-auto bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-full text-sm font-semibold transition cursor-pointer"
            >
              Send Me Jobs
            </button>
          </form>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <p className="text-xs text-gray-500">
            Next step: pick which roles you want · Once a week · Unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
}
