'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Mail } from 'lucide-react';
import { SUBSCRIBED_COOKIE, looksLikeEmail, newsletterHandoffHref } from '@/lib/newsletterHandoff';

/** Cookies are client-only, and this one can't change while the page is open. */
const noopSubscribe = () => () => {};
const isSubscribed = () => Cookies.get(SUBSCRIBED_COOKIE) === 'true';
const isSubscribedOnServer = () => false;

export default function NewsletterCard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // The cookie is set on /newsletter once the signup actually completes — not
  // here, since this card only hands the email over. Read via
  // useSyncExternalStore so the server snapshot is explicit: no hydration
  // mismatch, no setState in an effect.
  const subscribed = useSyncExternalStore(noopSubscribe, isSubscribed, isSubscribedOnServer);

  // Hands off to /newsletter rather than subscribing here, so the subscriber
  // picks their categories instead of being opted into all four by default.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!looksLikeEmail(email)) {
      setError('Enter a valid email.');
      return;
    }

    router.push(newsletterHandoffHref(email));
  };

  if (subscribed) return null;

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
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
