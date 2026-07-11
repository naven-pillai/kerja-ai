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

export const currencyOptions = [
  { code: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { code: 'SGD', label: 'SGD — Singapore Dollar' },
  { code: 'USD', label: 'USD — US Dollar' },
];
