// lib/utils/slugify.ts

export function slugify(input: unknown): string {
  if (!input) return '';

  // Normalize any input type
  const text = Array.isArray(input)
    ? input.join(' ')
    : typeof input === 'string'
    ? input
    : String(input);

  return text
    .toLowerCase()
    .trim()
    .replace(/\(.*?\)/g, '') // remove text in parentheses
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters except hyphens and spaces
    .replace(/\s+/g, '-') // convert spaces to hyphens
    .replace(/--+/g, '-') // remove duplicate hyphens
    .replace(/^-+|-+$/g, ''); // trim hyphens from start/end
}
