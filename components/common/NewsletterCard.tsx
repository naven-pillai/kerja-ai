'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Mail } from 'lucide-react';

export default function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (Cookies.get('kr_subscribed') === 'true') {
      setSubmitted(true);
      return;
    }
    fetch('/api/geo').then((r) => r.json()).then((d) => {
      if (d.country) setCountry(d.country);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, location: country }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }

      Cookies.set('kr_subscribed', 'true', { expires: 365 });
      setSubmitted(true);
    } catch {
      setError('Unexpected error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return null;

  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-blue-200 bg-gradient-to-r from-blue-50/60 to-white">
      <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
        <Mail className="w-5 h-5 text-blue-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">Get weekly remote job alerts</p>
        <p className="text-xs text-gray-500 mt-0.5">New AI &amp; data jobs in Malaysia and Singapore. No spam.</p>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0">
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
          type="email"
          value={email}
          required
          aria-label="Email address"
          placeholder="Your email"
          onChange={(e) => setEmail(e.target.value)}
          className="hidden sm:block w-48 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 whitespace-nowrap"
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
