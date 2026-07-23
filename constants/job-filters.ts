// Kerja-AI taxonomy — AI/ML & data roles, Malaysia + Singapore.
// jobCategories are written raw into jobs.job_category[] (no DB constraint).
// Slugs are derived at runtime via slugify(), matching kerja-remote's pattern.

export const jobCategories = [
  'AI Engineering',
  'Machine Learning Engineering',
  'Data Science',
  'AI/ML Research',
  'Data Engineering',
  'Computer Vision Engineering',
  'NLP Engineering',
  'Deep Learning Engineering',
  'AI Architecture',
  'Prompt Engineering',
  'Data Annotation',
];

export const jobTypes = [
  'Full-Time',
  'Part-Time',
  'Contract',
  'Freelance',
  'Internship',
];

// Malaysia-first, Singapore second (KL–SG talent corridor). MY/SG only for v1.
export const jobLocations = [
  'Malaysia',
  'Singapore',
];

export const currencyMap: Record<string, string> = {
  Malaysia: 'MYR',
  Singapore: 'SGD',
};

/**
 * The currency a salary should be shown in.
 *
 * A stored `currency` always wins. When it is missing we fall back to the job's
 * country, because a salary printed without a symbol is ambiguous — "8,000"
 * could be RM or SGD, and those are not close. Guessing a fixed default is
 * worse than deriving one: it would print a Singapore salary as RM.
 *
 * Returns null only when we know neither, in which case the number is shown
 * bare rather than mislabelled.
 */
export function resolveSalaryCurrency(
  currency: string | string[] | null | undefined,
  jobLocation: string | string[] | null | undefined
): string | null {
  const stored = Array.isArray(currency) ? currency[0] : currency;
  if (stored && stored.trim()) return stored.trim();

  const country = Array.isArray(jobLocation) ? jobLocation[0] : jobLocation;
  if (!country) return null;

  return currencyMap[country.trim()] ?? null;
}

export const currencyOptions = [
  { code: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { code: 'SGD', label: 'SGD — Singapore Dollar' },
  { code: 'USD', label: 'USD — US Dollar' },
];
