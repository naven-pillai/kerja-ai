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
export function formatJobLocation(
  country: string | null | undefined,
  city: string | null | undefined
): string {
  const countryName = (country ?? '').trim();
  const cityName = (city ?? '').trim();

  if (!countryName) return cityName;
  if (cityName && countryName === 'Malaysia') return `${cityName}, ${countryName}`;

  return countryName;
}
