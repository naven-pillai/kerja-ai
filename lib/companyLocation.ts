import { MALAYSIAN_CITY_REGIONS } from '@/lib/formatLocation';

/**
 * Which of our two markets a company's hq_location refers to.
 *
 * hq_location is free text and inconsistent — "Kuala Lumpur, Malaysia",
 * "Singapore, Singapore", a bare "Kuala Lumpur", plus plenty of foreign HQs
 * (USA, UK, China…). This collapses it to Malaysia or Singapore, or null for a
 * market we do not serve. Shared so the directory filter, the country pages and
 * the sub-nav all agree on where a company sits.
 */
const MALAYSIAN_CITIES = Object.keys(MALAYSIAN_CITY_REGIONS).map((c) => c.toLowerCase());

export type CompanyCountry = 'Malaysia' | 'Singapore';

export const companyCountries: CompanyCountry[] = ['Malaysia', 'Singapore'];

export function hqCountry(loc?: string | null): CompanyCountry | null {
  if (!loc) return null;
  const s = loc.toLowerCase();
  if (s.includes('malaysia')) return 'Malaysia';
  if (s.includes('singapore')) return 'Singapore';
  // Entries that name only a city, e.g. a bare "Kuala Lumpur".
  if (MALAYSIAN_CITIES.some((city) => s.includes(city))) return 'Malaysia';
  return null;
}

export function companyCountrySlug(country: CompanyCountry): string {
  return country.toLowerCase();
}

export function companyCountryFromSlug(slug: string): CompanyCountry | null {
  return companyCountries.find((c) => companyCountrySlug(c) === slug) ?? null;
}
