// utils/getCountries.ts
import countries from 'i18n-iso-countries';
import emojiFlags from 'emoji-flags';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const PRIORITY_CODES = ['MY', 'SG', 'PH', 'ID', 'TH', 'VN', 'HK', 'TW', 'IN', 'AU', 'NZ', 'JP', 'KR'];

export function getCountryList() {
  const countryNames = countries.getNames('en', { select: 'official' });

  const countryArray = Object.entries(countryNames).map(([code, name]) => {
    const emoji = emojiFlags.countryCode(code)?.emoji || '';
    return {
      code,
      name,
      label: `${emoji} ${name}`,
      priority: PRIORITY_CODES.includes(code) ? 1 : 0,
    };
  });

  return countryArray.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.name.localeCompare(b.name);
  });
}
