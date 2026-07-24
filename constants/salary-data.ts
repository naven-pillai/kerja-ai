/**
 * Salary benchmarks — AI, ML and data roles in Malaysia and Singapore.
 *
 * ── Why only four categories ────────────────────────────────────────────────
 * Kerja AI lists eleven job categories, but only four have salary data that
 * survives scrutiny in these two markets: Data Science, Data Engineering,
 * Machine Learning Engineering and AI Engineering. Those appear in real
 * reported-pay datasets (NodeFlair, Jobstreet, PayScale) and recruiter surveys
 * (Robert Walters, Morgan McKinley, Michael Page, Hays), and the sources
 * broadly agree with each other.
 *
 * The other seven — AI/ML Research, Computer Vision, NLP, Deep Learning, AI
 * Architecture, Prompt Engineering, Data Annotation — are too niche for
 * Malaysian or Singaporean salary surveys. The only figures available come from
 * modelled-extrapolation sites and SEO blogs, and they do not hold up: ERI puts
 * an NLP Engineer in Malaysia at ~RM187k/year, nearly double Jobstreet's
 * observed Data Scientist figure in the same market, and Indeed returns a
 * Malaysian prompt engineer at "RM69,115 per month". Publishing those would be
 * inventing numbers people negotiate their pay with, so we publish nothing for
 * those categories until real local data exists.
 *
 * ── Units ───────────────────────────────────────────────────────────────────
 * Monthly, gross, in local currency. Monthly is how pay is quoted in both
 * markets, and it matches how job listings on this site store salary. Annual
 * equivalents are derived for display (x12) rather than stored twice.
 *
 * ── Method ──────────────────────────────────────────────────────────────────
 * Bands are anchored on observed reported pay (NodeFlair medians and ranges,
 * Jobstreet advertised ranges, PayScale experience curves) and cross-checked
 * against recruiter guides. Where sources disagreed we favoured observed data
 * over modelled data. Blog figures were excluded entirely.
 *
 * Last reviewed: July 2026.
 */

export interface SalaryBand {
  /** Gross monthly pay, local currency. */
  min: number;
  max: number;
}

export interface SalaryByLevel {
  /** 0–2 years. */
  entry: SalaryBand;
  /** 3–5 years. */
  mid: SalaryBand;
  /** 6+ years, including lead. */
  senior: SalaryBand;
  /** Full market band, entry floor to senior ceiling. */
  overall: SalaryBand;
}

function band(
  entry: [number, number],
  mid: [number, number],
  senior: [number, number]
): SalaryByLevel {
  return {
    entry: { min: entry[0], max: entry[1] },
    mid: { min: mid[0], max: mid[1] },
    senior: { min: senior[0], max: senior[1] },
    overall: { min: entry[0], max: senior[1] },
  };
}

/**
 * The roles we publish salary data for.
 *
 * Named for the job, not the field — people search "data scientist salary",
 * not "data science salary", and a pay band describes a person's role rather
 * than a discipline.
 *
 * `jobCategory` keeps each role tied to the board's taxonomy, so a salary page
 * can still link to the matching jobs and a test can still assert the category
 * is real. It is a subset of jobCategories, on purpose — see the note above.
 *
 * `jobCategorySlug` is that category's /job-categories/ URL. Stored rather than
 * derived because this file stays dependency-free for the test runner; a test
 * asserts it matches what slugify() produces, so the two cannot drift.
 */
export const salaryRoles = [
  {
    slug: 'data-scientist',
    name: 'Data Scientist',
    jobCategory: 'Data Science',
    jobCategorySlug: 'data-science',
  },
  {
    slug: 'data-engineer',
    name: 'Data Engineer',
    jobCategory: 'Data Engineering',
    jobCategorySlug: 'data-engineering',
  },
  {
    slug: 'machine-learning-engineer',
    name: 'Machine Learning Engineer',
    jobCategory: 'Machine Learning Engineering',
    jobCategorySlug: 'machine-learning-engineering',
  },
  {
    slug: 'ai-engineer',
    name: 'AI Engineer',
    jobCategory: 'AI Engineering',
    jobCategorySlug: 'ai-engineering',
  },
] as const;

export type SalaryRole = (typeof salaryRoles)[number];
export type SalaryRoleSlug = SalaryRole['slug'];

export const salaryCountries = ['Malaysia', 'Singapore'] as const;
export type SalaryCountry = (typeof salaryCountries)[number];

export const currencyByCountry: Record<SalaryCountry, { code: string; prefix: string }> = {
  Malaysia: { code: 'MYR', prefix: 'RM' },
  Singapore: { code: 'SGD', prefix: 'S$' },
};

// ─────────────────────────────────────────────────────────────────────────────
// MALAYSIA — MYR / month
//
// Anchors:
//   Data Science      NodeFlair MY median RM9,000 (range RM3,750–15,000);
//                     Jobstreet MY advertised average RM6,250–8,750;
//                     Glassdoor KL RM4,000–8,000 with 90th pct RM13,433.
//   Data Engineering  NodeFlair MY median RM9,000 (range RM3,750–14,500);
//                     Jobstreet MY average RM5,750–8,250; PayScale MY
//                     experience curve (<1yr ~RM3,300/mo, 1–4yr ~RM4,600/mo,
//                     senior base RM95k–134k/yr ≈ RM7,900–11,200/mo).
//   ML Engineering    Jobstreet MY RM4,800–8,500; Indeed MY average RM7,328.
//   AI Engineering    No direct observed dataset. Set just above the ML band to
//                     reflect the AI premium that Michael Page MY 2026 (20–40%
//                     uplift when changing jobs into AI) and NodeFlair's
//                     AI-skills premium both report. Blog claims of
//                     RM18,000–55,000/mo were rejected — they are inconsistent
//                     with every observed dataset for this market.
// ─────────────────────────────────────────────────────────────────────────────
const malaysia: Record<SalaryRoleSlug, SalaryByLevel> = {
  'data-scientist':             band([4_000, 6_500], [6_500, 10_000], [10_000, 15_000]),
  'data-engineer':              band([3_800, 6_000], [6_000, 9_500],  [9_500, 14_500]),
  'machine-learning-engineer':  band([4_500, 7_000], [7_000, 11_000], [11_000, 16_000]),
  'ai-engineer':                band([5_000, 7_500], [7_500, 12_000], [12_000, 18_000]),
};

// ─────────────────────────────────────────────────────────────────────────────
// SINGAPORE — SGD / month
//
// Anchors:
//   Data Science      NodeFlair SG median S$8,500 (range S$4,500–16,875), lead
//                     data scientist median S$25,000; Robert Walters SG entry
//                     S$60–85k/yr, mid S$100–145k/yr, senior/lead S$180–250k/yr.
//   Data Engineering  NodeFlair SG median S$8,000 (range S$4,600–15,000), lead
//                     data engineer median S$16,000; junior average ≈S$6,950/mo;
//                     senior S$11,000–15,000/mo.
//   ML Engineering    Robert Walters SG AI/ML curve: junior ≈S$65k/yr, mid
//                     ≈S$105k/yr, senior ≈S$150k/yr, lead S$180k+/yr; general
//                     AI/ML band S$6,500–12,500/mo.
//   AI Engineering    Morgan McKinley SG AI/ML Engineer S$100–170k/yr
//                     (≈S$8,300–14,200/mo), market range S$5,400–18,300/mo.
// ─────────────────────────────────────────────────────────────────────────────
const singapore: Record<SalaryRoleSlug, SalaryByLevel> = {
  'data-scientist':             band([4_500, 7_000], [7_500, 12_000], [12_000, 20_000]),
  'data-engineer':              band([4_600, 7_000], [7_000, 11_000], [11_000, 16_000]),
  'machine-learning-engineer':  band([5_000, 7_500], [8_000, 12_500], [12_500, 19_000]),
  'ai-engineer':                band([5_400, 8_000], [8_500, 14_000], [14_000, 20_000]),
};

export const salaryData: Record<SalaryCountry, Record<SalaryRoleSlug, SalaryByLevel>> = {
  Malaysia: malaysia,
  Singapore: singapore,
};

/** Shown on every page — readers should be able to check our working. */
export const salarySources: Record<SalaryCountry, { name: string; url: string }[]> = {
  Malaysia: [
    { name: 'NodeFlair — Malaysia salaries', url: 'https://nodeflair.com/salaries/malaysia-data-scientist-salary' },
    { name: 'Jobstreet Malaysia — salary insights', url: 'https://my.jobstreet.com/career-advice/role/data-scientist/salary' },
    { name: 'PayScale — Data Engineer, Malaysia', url: 'https://www.payscale.com/research/MY/Job=Data_Engineer/Salary' },
    { name: 'Michael Page Malaysia — Salary Guide 2026', url: 'https://www.michaelpage.com.my/salary-guide' },
    { name: 'Hays Asia — Salary Guide', url: 'https://www.hays.com.my/salary-guide' },
  ],
  Singapore: [
    { name: 'NodeFlair — Singapore salaries', url: 'https://nodeflair.com/salaries/singapore-data-scientist-salary' },
    { name: 'Robert Walters Singapore — Salary Survey 2026', url: 'https://www.robertwalters.com.sg/our-services/salary-survey.html' },
    { name: 'Morgan McKinley Singapore — AI/ML Engineer guide', url: 'https://www.morganmckinley.com/sg/salary-guide/data/ai-ml-engineer/singapore' },
    { name: 'Jobstreet Singapore — salary insights', url: 'https://sg.jobstreet.com/career-advice/role/data-engineer/salary' },
    { name: 'Hays Asia — Salary Guide', url: 'https://www.hays.com.sg/salary-guide' },
  ],
};

/** Plain-English note on what a reader is looking at. */
export const METHODOLOGY_NOTE =
  'Gross monthly pay, before EPF/CPF and tax, for permanent roles. Bands are ' +
  'built from reported-pay datasets and recruiter salary guides, not from ' +
  'listings on this site — we do not yet have enough salary-disclosing job ' +
  'ads to publish our own figures. Individual offers vary with company size, ' +
  'funding stage, and whether the employer is a local firm or a multinational.';

export function slugifyCountry(country: string): string {
  return country.toLowerCase();
}

export function roleFromSlug(slug: string): SalaryRole | null {
  return salaryRoles.find((r) => r.slug === slug) ?? null;
}

/**
 * The old category-based URLs (/salary/data-science) that shipped before roles.
 * Kept so next.config can redirect them rather than leaving live pages to 404.
 */
export const legacyCategorySlugToRoleSlug: Record<string, SalaryRoleSlug> = {
  'data-science': 'data-scientist',
  'data-engineering': 'data-engineer',
  'machine-learning-engineering': 'machine-learning-engineer',
  'ai-engineering': 'ai-engineer',
};

export function countryFromSlug(slug: string): SalaryCountry | null {
  return salaryCountries.find((c) => slugifyCountry(c) === slug) ?? null;
}

/** "RM6,500" / "S$8,000". */
export function formatMonthly(amount: number, country: SalaryCountry): string {
  return `${currencyByCountry[country].prefix}${amount.toLocaleString('en-US')}`;
}
