'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { looksLikeEmail, newsletterHandoffHref } from '@/lib/newsletterHandoff';

export default function NewsletterSidebar() {
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
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Hero band */}
      <div className="relative bg-gradient-to-br from-[#0b1220] via-[#0d3b3a] to-[#1D4ED8] px-5 pt-5 pb-6">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.25),_transparent_70%)] pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={11} className="text-[#14B8A6]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#14B8A6]">
              Weekly Newsletter
            </span>
          </div>

          <h3 className="text-[15px] font-bold text-white leading-snug">
            AI &amp; data jobs,<br />straight to your inbox
          </h3>

          <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
            New Malaysia and Singapore roles every week.<br />
            Early access. Zero spam.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white px-4 py-4 space-y-2">
        <input
          type="email"
          aria-label="Email address"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition placeholder-gray-400 text-gray-900"
        />

        {error && <p className="text-[11px] text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.98] text-white font-bold py-2.5 rounded-lg text-xs transition-all cursor-pointer mt-1"
        >
          Send Me Jobs →
        </button>

        <p className="text-[10px] text-gray-500 text-center pt-0.5">
          Pick your roles next · Free · Unsubscribe anytime
        </p>
      </form>
    </div>
  );
}
