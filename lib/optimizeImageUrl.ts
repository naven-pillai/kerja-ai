const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

/**
 * Rewrites Supabase storage image URLs to go through Next.js image optimization.
 * For non-Supabase URLs, returns them unchanged.
 */
export function getOptimizedImageUrl(
  src: string,
  width: number = 800,
  quality: number = 75
): string {
  if (!src) return src;

  // Only optimize Supabase storage URLs
  if (!src.includes('supabase.co/storage/')) return src;

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/**
 * Processes blog HTML content to route inline <img> tags through
 * Next.js image optimization, adding responsive srcset and lazy loading.
 */
export function optimizeBlogContentImages(html: string): string {
  if (!html) return html;

  // Match <img> tags with Supabase storage URLs
  return html.replace(
    /<img\s+([^>]*?)src=["'](https:\/\/[^"']*supabase\.co\/storage\/[^"']+)["']([^>]*?)\/?>/gi,
    (_match, before, src, after) => {
      const encodedSrc = encodeURIComponent(src);

      // Generate srcset for responsive sizes
      const widths = [480, 800, 1200];
      const srcset = widths
        .map((w) => `/_next/image?url=${encodedSrc}&w=${w}&q=75 ${w}w`)
        .join(', ');

      // Preserve existing attributes but add optimization
      const cleanBefore = before.replace(/loading=["'][^"']*["']/gi, '').trim();
      const cleanAfter = after
        .replace(/loading=["'][^"']*["']/gi, '')
        .replace(/decoding=["'][^"']*["']/gi, '')
        .trim();

      return `<img ${cleanBefore} src="/_next/image?url=${encodedSrc}&w=800&q=75" srcset="${srcset}" sizes="(max-width: 768px) 100vw, 800px" loading="lazy" decoding="async" ${cleanAfter}>`;
    }
  );
}
