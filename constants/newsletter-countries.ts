/**
 * The only countries a newsletter subscriber can be in.
 *
 * Kerja AI covers the KL–Singapore corridor and nothing else, so a subscriber
 * anywhere else would get a weekly digest of jobs they cannot apply for. The
 * form offers exactly these two, and — the part that actually enforces it — the
 * subscribe endpoint rejects everything else. The form alone is cosmetic: the
 * endpoint is public, so a POST can carry any country it likes.
 *
 * Must stay in step with `jobLocations` in job-filters.ts (the markets we list
 * jobs for). That is asserted in tests rather than imported, because this file
 * is deliberately dependency-free so the test runner can load it directly.
 */
export const subscriberCountries = ['Malaysia', 'Singapore'];

/** ISO 3166-1 alpha-2 -> country name, for the /api/geo preselect. */
export const subscriberCountryByCode: Record<string, string> = {
  MY: 'Malaysia',
  SG: 'Singapore',
};

/**
 * The canonical country name, or null when it is not a market we serve.
 *
 * Case- and whitespace-insensitive, so "  singapore " from a hand-made request
 * still normalises to "Singapore" rather than being stored as a variant.
 */
export function normalizeSubscriberCountry(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const value = input.trim().toLowerCase();
  return subscriberCountries.find((country) => country.toLowerCase() === value) ?? null;
}
