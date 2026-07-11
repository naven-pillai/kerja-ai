import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function truncate(str: string | null | undefined, length: number): string {
  if (!str) return '';
  return str.length > length ? str.substring(0, length - 3) + '...' : str;
}

export function readingTime(content: string | null | undefined): number {
  if (!content) return 1;
  const words = content.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
