'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { getCookie, setCookie } from '@/utils/cookies';
import { looksLikeEmail, newsletterHandoffHref } from '@/lib/newsletterHandoff';

const COOKIE_NAME = 'kr_exit_popup_dismissed';
const COOKIE_DAYS = 90;

const OWN_HOSTS = ['kerja-ai.com', 'www.kerja-ai.com', 'localhost'];

/** Pages where the popup should never appear */
const BLOCKED_PATHS = ['/newsletter', '/newsletter-success', '/login', '/admin'];

/** Internal paths that redirect users off-site (e.g. /apply/[slug]) */
const EXIT_PATHS = ['/apply/'];

function isLeavingSite(anchor: HTMLAnchorElement): boolean {
  const href = anchor.href;
  if (!href) return false;

  try {
    const url = new URL(href, window.location.origin);

    // External domain
    if (!OWN_HOSTS.includes(url.hostname)) return true;

    // Internal redirect routes that take the user off-site
    if (EXIT_PATHS.some((p) => url.pathname.startsWith(p))) return true;

    // target="_blank" links to external sites (catches any we missed)
    if (anchor.target === '_blank' && !OWN_HOSTS.includes(url.hostname)) return true;

    return false;
  } catch {
    return false;
  }
}

export default function ExitIntentPopup() {
  const router = useRouter();
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Stores the external URL the user was heading to
  const pendingUrlRef = useRef<string | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);

    // If the user was heading to an external site, let them go
    if (pendingUrlRef.current) {
      window.open(pendingUrlRef.current, '_blank', 'noopener');
      pendingUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (BLOCKED_PATHS.some((p) => pathname.startsWith(p))) return;
    if (getCookie(COOKIE_NAME)) return;

    let triggered = false;

    // ── Trigger 1: clicks that leave the site ──
    const handleClick = (e: MouseEvent) => {
      if (triggered) return;

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor || !isLeavingSite(anchor)) return;

      // Intercept the navigation
      e.preventDefault();
      e.stopPropagation();
      triggered = true;
      pendingUrlRef.current = anchor.href;
      setVisible(true);
    };

    // ── Trigger 2: tab / page close (mouse toward browser chrome) ──
    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY <= 0) {
        triggered = true;
        pendingUrlRef.current = null;
        setVisible(true);
      }
    };

    // Delay attaching by 5s so nothing fires on initial load
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClick, true);
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pathname]);

  // Hands off to /newsletter rather than subscribing here, so the subscriber
  // picks their categories instead of being opted into all four by default.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!looksLikeEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // If they were heading somewhere, let them go.
    const pendingUrl = pendingUrlRef.current;
    pendingUrlRef.current = null;
    setVisible(false);
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);

    if (pendingUrl) {
      window.open(pendingUrl, '_blank', 'noopener');
    }
    router.push(newsletterHandoffHref(email));
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={dismiss}
    >
      <div
        className="relative w-[95vw] max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close popup"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <p className="text-[#1D4ED8] text-xs font-semibold uppercase tracking-widest">
            Before you go
          </p>

          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
            Don&apos;t miss the best<br className="hidden sm:block" />
            AI and data jobs in Malaysia and Singapore
          </h2>

          <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto">
            Join the <span className="font-semibold text-gray-700">Kerja AI</span> newsletter — the newest AI, machine learning and data roles in Malaysia and Singapore, every week.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 pt-2"
          >
            <input
              type="email"
              required
              aria-label="Email address"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm"
            />

            <button
              type="submit"
              className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 py-3 rounded-full text-sm font-semibold transition cursor-pointer"
            >
              {'Send Me Jobs — It\u2019s Free'}
            </button>
          </form>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={dismiss}
            className="text-xs text-gray-500 hover:text-gray-500 transition cursor-pointer"
          >
            No thanks, I&apos;ll pass
          </button>
        </div>
      </div>
    </div>
  );
}
