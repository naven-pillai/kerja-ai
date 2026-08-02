/**
 * Company markets, based on where a company is *hiring* — not where it is
 * headquartered. A company belongs to Malaysia if it has an active job located
 * in Malaysia, even if its HQ is in the US. A company hiring in both markets
 * appears under both.
 *
 * job_location is the source of truth, and it is already clean (a text array of
 * 'Malaysia' / 'Singapore'), so this needs none of the free-text normalisation
 * that hq_location would.
 *
 * Deliberately dependency-free so the test runner can load it directly.
 */

export type CompanyCountry = 'Malaysia' | 'Singapore';

export const companyCountries: CompanyCountry[] = ['Malaysia', 'Singapore'];

export function companyCountrySlug(country: CompanyCountry): string {
  return country.toLowerCase();
}

export function companyCountryFromSlug(slug: string): CompanyCountry | null {
  return companyCountries.find((c) => companyCountrySlug(c) === slug) ?? null;
}

/**
 * The markets a company is hiring in, from its active jobs' job_location values.
 * Each job_location is a text array on most rows but tolerates a bare string or
 * null. Returns the markets in canonical order, so a both-markets company reads
 * "Malaysia, Singapore" consistently.
 */
export function hiringCountriesFromJobLocations(
  locations: Array<string[] | string | null | undefined>
): CompanyCountry[] {
  const found = new Set<string>();
  for (const loc of locations) {
    const arr = Array.isArray(loc) ? loc : loc ? [loc] : [];
    for (const l of arr) {
      const trimmed = (l ?? '').trim();
      if (trimmed) found.add(trimmed);
    }
  }
  return companyCountries.filter((c) => found.has(c));
}
