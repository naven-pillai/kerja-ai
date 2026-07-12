'use client';

import { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { Copy, Check } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';

type Props = {
  job: {
    title: string;
    slug: string;
    companyName?: string;
  };
};

const platforms = [
  {
    name: 'LinkedIn',
    icon: FaLinkedinIn,
    iconBg: 'bg-[#0a66c2]',
    getHref: (url: string, _tweet: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    icon: FaFacebookF,
    iconBg: 'bg-[#1877f2]',
    getHref: (url: string, _tweet: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'X (Twitter)',
    icon: FaXTwitter,
    iconBg: 'bg-[#0f172a]',
    getHref: (url: string, tweet: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(tweet)}`,
  },
];

export default function SocialShare({ job }: Props) {
  const tweetText = job.companyName
    ? `${job.companyName} is hiring a ${job.title} in Malaysia/Singapore. Apply here:`
    : `${job.title} role open in Malaysia/Singapore. Apply here:`;
  const [copied, setCopied] = useState(false);

  // Built from the canonical origin rather than window.location.origin, which
  // was only readable after mount — so the share links rendered empty on the
  // server and for the first paint.
  const jobUrl = `${SITE_URL}/jobs/${job.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jobUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
          Share this Job
        </p>

        {/* Platform buttons */}
        <div className="space-y-2">
          {platforms.map(({ name, icon: Icon, iconBg, getHref }) => (
            <a
              key={name}
              href={getHref(jobUrl, tweetText)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <span className={`${iconBg} w-7 h-7 rounded-md flex items-center justify-center shrink-0`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                Share on {name}
              </span>
              <span className="ml-auto text-gray-300 group-hover:text-gray-500 text-xs">→</span>
            </a>
          ))}
        </div>
      </div>

      {/* Copy link */}
      <div className="px-4 pb-4">
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all cursor-pointer group"
        >
          <span className="flex-1 text-[11px] text-gray-500 truncate text-left">
            {jobUrl || 'Loading...'}
          </span>
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold shrink-0 transition-colors ${
              copied ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-600'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
