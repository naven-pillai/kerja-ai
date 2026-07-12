/**
 * Newsletter groups — the segments a subscriber can opt into.
 *
 * These are DELIBERATELY broader than the 11 job categories in job-filters.ts.
 * With the board at ~14 live jobs, one group per category would mean most weekly
 * sections arrive empty, which is the fastest way to train people to ignore the
 * email. Four groups keep every section populated. They can be split later
 * without disturbing existing subscribers — a new group is additive.
 *
 * `slug` must match the group NAME in MailerLite exactly. Group ids are resolved
 * from these names at runtime (lib/mailerlite.ts), so adding a group in the
 * MailerLite dashboard needs no code change or redeploy.
 */
export type NewsletterGroup = {
  slug: string;
  label: string;
  description: string;
  /** Job categories (from job-filters.ts) that feed this group's digest. */
  jobCategories: string[];
};

export const newsletterGroups: NewsletterGroup[] = [
  {
    slug: 'ai-ml-engineering',
    label: 'AI & ML Engineering',
    description: 'Building and shipping models in production.',
    jobCategories: [
      'AI Engineering',
      'Machine Learning Engineering',
      'Deep Learning Engineering',
      'AI Architecture',
    ],
  },
  {
    slug: 'data-science-research',
    label: 'Data Science & Research',
    description: 'Analysis, experimentation and applied research.',
    jobCategories: ['Data Science', 'AI/ML Research'],
  },
  {
    slug: 'data-engineering',
    label: 'Data Engineering',
    description: 'Pipelines, platforms and the data that feeds the models.',
    jobCategories: ['Data Engineering', 'Data Annotation'],
  },
  {
    slug: 'applied-ai',
    label: 'Applied AI',
    description: 'Computer vision, NLP and prompt engineering roles.',
    jobCategories: ['Computer Vision Engineering', 'NLP Engineering', 'Prompt Engineering'],
  },
];

export const newsletterGroupSlugs = newsletterGroups.map((g) => g.slug);

export function isNewsletterGroupSlug(value: unknown): value is string {
  return typeof value === 'string' && newsletterGroupSlugs.includes(value);
}

/** Which groups should be sent a job in this category. */
export function groupsForJobCategory(category: string): string[] {
  return newsletterGroups
    .filter((g) => g.jobCategories.includes(category))
    .map((g) => g.slug);
}

/**
 * Every job category must land in at least one group, or jobs in it would
 * silently never appear in any digest. Asserted in tests against the real
 * jobCategories list — deliberately not imported here, so this module stays
 * dependency-free.
 */
export function categoriesWithoutGroup(allJobCategories: string[]): string[] {
  return allJobCategories.filter((c) => groupsForJobCategory(c).length === 0);
}
