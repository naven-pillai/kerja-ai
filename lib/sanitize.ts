import sanitizeHtml from 'sanitize-html';

const baseOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'a', 'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'code', 'pre', 'blockquote',
    'span', 'div', 'section', 'article', 'figure', 'figcaption',
    'img', 'video', 'iframe',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'srcset', 'sizes', 'loading', 'decoding'],
    iframe: ['src', 'width', 'height', 'title', 'frameborder', 'allow', 'allowfullscreen'],
    video: ['src', 'controls', 'width', 'height', 'poster', 'preload'],
    '*': ['class', 'id', 'style'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
};

export function sanitize(html: string, extra?: sanitizeHtml.IOptions): string {
  return sanitizeHtml(html, { ...baseOptions, ...extra });
}

// True when the string contains real markup (so we render it as HTML rather
// than as escaped plain text). Legacy plain-text values fail this check.
export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

/**
 * True when the value would actually show the reader something.
 *
 * A rich-text editor does not produce an empty string for an empty field — it
 * produces "<p></p>" or "<p>&nbsp;</p>". Those are truthy, so a plain
 * `summary?.trim()` check renders an empty highlighted box on a post whose
 * author cleared the field.
 */
export function hasVisibleContent(value: string | null | undefined): boolean {
  if (!value) return false;

  const text = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text) return true;

  // Media on its own is still something to show, even with no text around it.
  return /<(img|iframe|video)\b/i.test(value);
}
