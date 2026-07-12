import type { JobWithCompany } from '@/types/custom';

/**
 * Free-text search over a job.
 *
 * Searches everything the card actually shows — title, company, categories,
 * tags, job type, country, city, remote type — not just the title.
 *
 * Two bugs this exists to prevent:
 *
 *  1. Categories and tags being ignored. The homepage quick-search pills push
 *     CATEGORY names ("AI Engineering", "Machine Learning"), and no job is
 *     *titled* that — "Applied AI Engineer" does not contain the substring
 *     "ai engineering". Four of the five pills used to return zero jobs.
 *
 *  2. Matching the whole query as one literal substring, so "data science"
 *     missed a "Data Scientist" role. Every word must appear somewhere (AND),
 *     which is what people expect from a search box.
 */
export function jobMatchesKeyword(job: JobWithCompany, keyword: string): boolean {
  const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  const haystack = [
    job.title,
    job.company?.name,
    ...(job.job_category ?? []),
    ...(job.tags ?? []),
    ...(Array.isArray(job.job_type) ? job.job_type : [job.job_type]),
    ...(Array.isArray(job.job_location) ? job.job_location : [job.job_location]),
    job.city,
    job.remote_type,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return words.every((word) => haystack.includes(word));
}
