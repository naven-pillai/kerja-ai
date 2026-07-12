'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

// ---- Inline icons ----
const IconGoogle = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M21.35 11.1h-9.18v2.98h5.28c-.23 1.5-1.6 4.4-5.28 4.4-3.18 0-5.78-2.62-5.78-5.84s2.6-5.84 5.78-5.84c1.82 0 3.04.77 3.74 1.43l2.56-2.47C16.9 4.2 15 3.3 12.17 3.3 6.98 3.3 2.74 7.56 2.74 12.74S6.98 22.2 12.17 22.2c6.14 0 10.19-4.31 10.19-10.38 0-.7-.08-1.18-.18-1.72z"
    />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M18.244 2H21l-6.5 7.427L22.5 22h-6.756l-4.43-5.77L5.9 22H3l7.07-8.08L1.8 2h6.88l3.98 5.302L18.244 2zm-1.187 18h2.066L7.11 4H5.09l11.967 16z"
    />
  </svg>
);
const IconPerplexity = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const IconChatGPT = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M12 2a5 5 0 0 1 5 5 4.5 4.5 0 0 1 .5 8.96A5 5 0 1 1 7 9.5 4.5 4.5 0 0 1 12 2zm-2 9h4v2h-4v-2zm-1-3h6v2H9V8zm0 8h6v2H9v-2z"
    />
  </svg>
);
const IconClaude = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
    <path d="M7 12h10" stroke="#fff" strokeWidth="2" />
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
    />
  </svg>
);

export type SmartSummarizeBarProps = {
  variant?: 'blog' | 'jobs' | 'custom';
  title?: string;
  articleUrl?: string;
  jobSlug?: string;
  pageUrl?: string;
  note?: string;
  promptOverride?: string;
  hideOnScroll?: boolean;
  className?: string;
};

export default function SmartSummarizeBar({
  variant = 'blog',
  title,
  articleUrl,
  jobSlug,
  pageUrl,
  note,
  promptOverride,
  hideOnScroll = true,
  className = '',
}: SmartSummarizeBarProps) {
  const [clientUrl, setClientUrl] = useState<string | undefined>();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') setClientUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!hideOnScroll) return;
    const handleScroll = () => {
      const y = window.scrollY || 0;
      const goingDown = y > lastY.current && y > 24;
      setHidden(goingDown);
      lastY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll]);

  const resolvedUrl = clientUrl || pageUrl || articleUrl || 'https://kerja-ai.com';
  const defaultNotes = {
    blog: 'from Kerja AI.com (AI & data careers in Malaysia & Singapore)',
    jobs: 'from Kerja AI.com (AI & data jobs in Malaysia & Singapore)',
    custom: 'from Kerja AI.com',
  } as const;

  const computedPrompt = useMemo(() => {
    if (promptOverride) return promptOverride;

    if (variant === 'jobs') {
      if (jobSlug) {
        const url = articleUrl || resolvedUrl || `https://kerja-ai.com/jobs/${jobSlug}`;
        return `Please summarise this job post and extract: role, must-have skills, location, salary range, seniority, and application instructions. URL: ${url}. Note: ${note || defaultNotes.jobs}.`;
      }

      return `Please summarise this page and list the top roles, companies, locations, and salary ranges. Highlight fully remote roles first. URL: ${resolvedUrl}. Note: ${note || defaultNotes.jobs}.`;
    }

    const t = title || 'Post';
    const url = articleUrl || resolvedUrl;
    return `Please summarise this article "${t}": ${url}. Note: ${note || defaultNotes.blog}.`;
  }, [variant, jobSlug, title, articleUrl, resolvedUrl, note, promptOverride]);

  const enc = encodeURIComponent(computedPrompt);
  const links = [
    { name: 'Google', href: `https://www.google.com/search?udm=50&aep=11&q=${enc}`, Icon: IconGoogle },
    { name: 'Grok (X)', href: `https://x.com/i/grok?text=${enc}`, Icon: IconX },
    { name: 'Perplexity', href: `https://www.perplexity.ai/search/new?q=${enc}`, Icon: IconPerplexity },
    { name: 'ChatGPT', href: `https://chat.openai.com/?q=${enc}`, Icon: IconChatGPT },
    { name: 'Claude', href: `https://claude.ai/new?q=${enc}`, Icon: IconClaude },
  ];

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(computedPrompt);
    } catch {
      /* ignore */
    }
  };

  return (
    <aside
      className={clsx(
        'sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-transform duration-300 ease-out',
        hidden ? '-translate-y-14 opacity-90' : 'translate-y-0 opacity-100',
        className
      )}
      role="region"
      aria-label="Share to AI assistants"
    >
      <div className="mx-auto max-w-7xl px-4 py-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center rounded-md bg-indigo-50 text-indigo-700 px-2 py-1 text-xs font-medium">
            ⚡ Quick Summarise
          </span>
          <p className="truncate text-sm text-slate-700">
            {variant === 'jobs'
              ? jobSlug
                ? 'Summarise this job post'
                : 'Summarise today’s AI & data jobs'
              : title || 'Summarise this article'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {links.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300/70 px-3 py-1.5 text-sm font-medium hover:shadow-sm hover:border-slate-400/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title={`Open in ${name}`}
            >
              <Icon />
              <span className="whitespace-nowrap">{name}</span>
            </a>
          ))}

          <button
            type="button"
            onClick={copyText}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1.5 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Copy prompt"
          >
            <IconCopy />
            Copy prompt
          </button>
        </div>
      </div>
    </aside>
  );
}
