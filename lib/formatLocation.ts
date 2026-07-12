/**
 * Render a job's location as "City, Country" — or just "Country" when there is
 * no city.
 *
 * City is precision on top of the country, never a peer of it:
 *  - Cities are Malaysia-only. Singapore is a city-state, so its city is always
 *    null and we never render "Singapore, Singapore".
 *  - Fully-remote roles have no office, so they have no city.
 *  - Older jobs predate the city column and have none.
 *
 * Every one of those cases falls back to the country alone.
 */
/**
 * City -> Malaysian state, for schema.org PostalAddress.addressRegion.
 *
 * Google recommends addressLocality + addressRegion + addressCountry together on
 * a JobPosting's jobLocation; region alone is what disambiguates, say, a Subang
 * Jaya role as being in Selangor.
 *
 * Keys must match constants/job-filters.ts `malaysianCities` in kerja-ai-admin —
 * that list is what the admin can actually save.
 */
export const MALAYSIAN_CITY_REGIONS: Record<string, string> = {
  'Kuala Lumpur': 'Federal Territory of Kuala Lumpur',
  'Petaling Jaya': 'Selangor',
  'Cyberjaya': 'Selangor',
  'Subang Jaya': 'Selangor',
  'Shah Alam': 'Selangor',
  'Penang': 'Penang',
  'Johor Bahru': 'Johor',
  'Ipoh': 'Perak',
  'Melaka': 'Melaka',
  'Kuching': 'Sarawak',
  'Kota Kinabalu': 'Sabah',
};

/** The single rule for whether a city may be shown. */
export function shouldShowCity(
  country: string | null | undefined,
  city: string | null | undefined
): boolean {
  return Boolean((city ?? '').trim()) && (country ?? '').trim() === 'Malaysia';
}

export function formatJobLocation(
  country: string | null | undefined,
  city: string | null | undefined
): string {
  const countryName = (country ?? '').trim();
  const cityName = (city ?? '').trim();

  if (!countryName) return cityName;
  if (shouldShowCity(countryName, cityName)) return `${cityName}, ${countryName}`;

  return countryName;
}

/**
 * The location as it should read inside a sentence — a share tweet, say.
 *
 * job_location is a list: a role can be open in more than one country. The same
 * city rule still holds, so:
 *   Malaysia + Kuala Lumpur -> "Kuala Lumpur, Malaysia"
 *   Singapore               -> "Singapore"   (city-state; never "Singapore, Singapore")
 *   Malaysia + Singapore    -> "Malaysia and Singapore"  — a city belongs to only
 *                              one of them, so naming it would misplace the role
 *   nothing on record       -> ""            — the caller drops the phrase entirely
 *                              rather than inventing a location
 */
export function formatShareLocation(
  countries: string | string[] | null | undefined,
  city: string | null | undefined
): string {
  const list = (Array.isArray(countries) ? countries : [countries])
    .map((c) => (c ?? '').trim())
    .filter(Boolean);

  if (list.length === 0) return '';
  if (list.length === 1) return formatJobLocation(list[0], city);
  if (list.length === 2) return `${list[0]} and ${list[1]}`;

  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}
