// lib/slugify.ts

export function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')    // Remove all non-word characters
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/--+/g, '-')        // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
  }
  