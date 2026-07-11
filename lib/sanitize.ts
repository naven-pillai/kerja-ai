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
