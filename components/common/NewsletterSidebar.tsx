'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCountryList } from '@/utils/getCountries';
import { Sparkles } from 'lucide-react';

const countries = getCountryList();

export default function NewsletterSidebar() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/geo').then((r) => r.json()).then((d) => {
      if (d.country) {
        const found = countries.find((c) => c.code === d.country);
        if (found) setCountry(found.name);
      }
    }).catch(() => {});
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
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Hero band */}
      <div className="relative bg-gradient-to-br from-[#1e0a02] via-[#3b0d00] to-[#1D4ED8] px-5 pt-5 pb-6">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,100,50,0.25),_transparent_70%)] pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={11} className="text-orange-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-300">
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
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <input
          type="text"
          placeholder="First name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition placeholder-gray-400 text-gray-900"
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition placeholder-gray-400 text-gray-900"
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] transition text-gray-900"
        >
          <option value="" disabled>Select your country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.name}>
              {c.label}
            </option>
          ))}
        </select>

        {error && <p className="text-[11px] text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.98] text-white font-bold py-2.5 rounded-lg text-xs transition-all disabled:opacity-60 cursor-pointer mt-1"
        >
          {loading ? 'Subscribing...' : 'Send Me Jobs →'}
        </button>

        <p className="text-[10px] text-gray-400 text-center pt-0.5">
          Free · No spam · Unsubscribe anytime
        </p>
      </form>
    </div>
  );
}
