/**
 * Fields for the anonymous salary form.
 *
 * One list, used by both the form and the API route — a value the form can
 * offer but the server rejects (or vice versa) is the kind of mismatch that
 * only shows up in production.
 *
 * Nothing here identifies a person: no name, no email, no company name. The
 * AI/data market in these two countries is small, and company + exact title +
 * exact salary would single someone out. Company *type* keeps the data useful
 * for analysis without that risk.
 *
 * Deliberately dependency-free so the test runner can load it directly.
 */

export const experienceLevels = [
  { value: '0-2', label: '0–2 years (entry)' },
  { value: '3-5', label: '3–5 years (mid)' },
  { value: '6-9', label: '6–9 years (senior)' },
  { value: '10+', label: '10+ years (lead / principal)' },
];

export const companyTypes = [
  { value: 'startup', label: 'Startup' },
  { value: 'sme', label: 'Local SME' },
  { value: 'mnc', label: 'Multinational (MNC)' },
  { value: 'government', label: 'Government / GLC' },
  { value: 'consultancy', label: 'Consultancy / agency' },
];

export const workArrangements = [
  { value: 'onsite', label: 'Onsite' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Fully remote' },
];

export const employmentTypes = [
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
];

/**
 * A fixed list rather than free text: "fintech", "Fintech", "Financial
 * Technology" and "banking" would otherwise become four segments of one.
 * A data scientist in banking and one in edtech are not paid alike, so this is
 * one of the more useful things we can ask for.
 */
export const industries = [
  { value: 'technology', label: 'Technology / Software' },
  { value: 'banking', label: 'Banking & Financial Services' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'ecommerce', label: 'E-commerce & Retail' },
  { value: 'telco', label: 'Telecommunications' },
  { value: 'healthcare', label: 'Healthcare & Pharma' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'logistics', label: 'Logistics & Supply Chain' },
  { value: 'government', label: 'Government & Public Sector' },
  { value: 'consulting', label: 'Consulting & Professional Services' },
  { value: 'education', label: 'Education' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'other', label: 'Other' },
];

/** Malaysia only — Singapore is a city-state, same rule as the rest of the site. */
export const malaysianCities = [
  'Kuala Lumpur',
  'Petaling Jaya',
  'Cyberjaya',
  'Subang Jaya',
  'Shah Alam',
  'Penang',
  'Johor Bahru',
  'Ipoh',
  'Melaka',
  'Kuching',
  'Kota Kinabalu',
];

/**
 * Sanity bounds on gross monthly pay, in local currency.
 *
 * The floor rejects an obvious mis-entry; the ceiling catches the common one —
 * someone typing their annual salary into a monthly field. Both are wide enough
 * not to reject a real outlier.
 */
export const salaryBounds: Record<string, { min: number; max: number }> = {
  Malaysia: { min: 1_000, max: 100_000 },
  Singapore: { min: 1_500, max: 100_000 },
};

export const MAX_BONUS_MONTHS = 24;

/**
 * A type guard, not a boolean check: callers pass a `string | null` from
 * normalizeOptionalString, and narrowing it here is what lets a validated value
 * satisfy a NOT NULL column without a cast.
 */
export function isValidOption(options: { value: string }[], value: unknown): value is string {
  return typeof value === 'string' && options.some((o) => o.value === value);
}
