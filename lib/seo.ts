/**
 * Shared SEO constants.
 *
 * The og:image trap: Next replaces the whole `openGraph` object when a page
 * declares one — it does not deep-merge with the root layout. So any page that
 * sets `openGraph: { title, description, url }` and omits `images` silently
 * ships with NO og:image, even though the layout defines a default. That is
 * invisible until someone shares the link and gets a bare grey box.
 *
 * The `opengraph-image` file convention does not rescue it either: an explicit
 * openGraph object wins over the file. So every page that declares openGraph
 * must spell out its images, and this is the one place to get them from.
 */
export const SITE_URL = 'https://kerja-ai.com';

export const OG_IMAGE_URL = `${SITE_URL}/default-og-image-1200x630.png`;

export const OG_IMAGES = [
  {
    url: OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt: 'Kerja AI — AI, ML & Data Jobs in Malaysia & Singapore',
  },
];

export const TWITTER_IMAGES = [OG_IMAGE_URL];
