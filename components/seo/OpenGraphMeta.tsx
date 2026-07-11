'use client';

import Head from 'next/head';

type Props = {
  title: string;
  description: string;
  /** Large image (e.g., 1200x630) used for Twitter large cards or if you switch to large OG. */
  image?: string;
  /** Small square image (~200x200) to force small FB/LinkedIn preview. */
  smallImage?: string;
  url?: string;
  /** Twitter card size control (Twitter only). */
  twitterCardType?: 'summary' | 'summary_large_image';
  /** 'small' forces FB/LI small preview via 200x200; 'large' uses 1200x630. */
  fbPreviewSize?: 'small' | 'large';
};

export default function OpenGraphMeta({
  title,
  description,
  image = 'https://kerja-ai.com/default-og-image-1200x630.png',
  smallImage = 'https://kerja-ai.com/default-og-image-200x200.png',
  url = 'https://kerja-ai.com',
  twitterCardType = 'summary', // Twitter: 'summary' (small) or 'summary_large_image'
  fbPreviewSize = 'small',     // Facebook/LinkedIn: 'small' by default
}: Props) {
  const isSmall = fbPreviewSize === 'small';

  const ogImage = isSmall ? smallImage : image;
  const ogWidth = isSmall ? '200' : '1200';
  const ogHeight = isSmall ? '200' : '630';

  return (
    <Head>
      {/* Open Graph - Facebook & LinkedIn */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content={ogWidth} />
      <meta property="og:image:height" content={ogHeight} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Kerja-AI" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
    </Head>
  );
}
