'use client';

import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { SITE_URL } from '@/lib/seo';

export type SocialShareBlogProps = {
  title: string;
  slug: string;
};

export default function SocialShareBlog({ title, slug }: SocialShareBlogProps) {
  // Deliberately the canonical URL, not window.location.href. The old code
  // started from the canonical and then overwrote it on mount with whatever was
  // in the address bar — so anyone sharing from a link that carried ?utm=… or
  // any other query string propagated it to every reader.
  const encodedUrl = encodeURIComponent(`${SITE_URL}/blog/${slug}`);
  const encodedTitle = encodeURIComponent(`Check out this article: ${title}`);

  const socialLinks = [
    {
      label: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF className="w-4 h-4" />,
      bg: 'bg-[#1877F2]/10 text-[#1877F2]',
    },
    {
      label: 'X',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <FaXTwitter className="w-4 h-4" />,
      bg: 'bg-black/10 text-black',
    },
    {
      label: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <FaLinkedinIn className="w-4 h-4" />,
      bg: 'bg-[#0A66C2]/10 text-[#0A66C2]',
    },
  ];

  return (
    <div className="mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-4">
      <div className="space-y-1">
        <h4 className="text-lg font-semibold text-gray-900">Enjoyed this article?</h4>
        <p className="text-sm text-muted-foreground">Share it with your network:</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all hover:opacity-80 ${link.bg}`}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
