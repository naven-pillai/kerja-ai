// components/seo/TwitterCardMeta.tsx
'use client';

import { usePathname } from 'next/navigation';

type Props = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  cardType?: 'summary' | 'summary_large_image'; // Optional override
};

export default function TwitterCardMeta({
  title,
  description,
  image,
  url,
  cardType,
}: Props) {
  const pathname = usePathname();

  // Automatically determine card type based on route
  const autoCardType: 'summary' | 'summary_large_image' =
    pathname?.startsWith('/blog') ? 'summary_large_image' : 'summary';

  const resolvedCardType = cardType || autoCardType;

  const safeTitle = title || 'Kerja-AI | AI & Data Jobs in Malaysia & Singapore';
  const safeDescription =
    description || 'Discover verified remote jobs curated for talents across Malaysia and APAC.';
  const safeImage = image || 'https://kerja-ai.com/default-og-image.png';
  const safeUrl = url || `https://kerja-ai.com${pathname || ''}`;

  return (
    <>
      <meta name="twitter:card" content={resolvedCardType} />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={safeImage} />
      <meta name="twitter:url" content={safeUrl} />
    </>
  );
}
