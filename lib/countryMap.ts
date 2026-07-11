// lib/countryMap.ts
// Keys are lowercase. Values are full country names as expected by Google's Country schema.
// Regional terms map to arrays of countries. 'worldwide' maps to null (omit requirements).

export const countrySchemaMap: Record<string, string | string[] | null> = {
  // Regional terms
  'worldwide':    null,
  'global':       null,
  'remote':       null,
  'apac':         ['Malaysia', 'Singapore', 'Philippines', 'Indonesia', 'Thailand', 'Vietnam', 'Hong Kong', 'Taiwan', 'Australia', 'New Zealand', 'Japan', 'South Korea'],
  'sea':          ['Malaysia', 'Singapore', 'Philippines', 'Indonesia', 'Thailand', 'Vietnam'],
  'asean':        ['Malaysia', 'Singapore', 'Philippines', 'Indonesia', 'Thailand', 'Vietnam', 'Myanmar', 'Cambodia', 'Laos', 'Brunei'],
  'asia':         ['Malaysia', 'Singapore', 'Philippines', 'Indonesia', 'Thailand', 'Vietnam', 'Hong Kong', 'Taiwan', 'Japan', 'South Korea', 'India'],

  // Individual countries — full names
  'malaysia':     'Malaysia',
  'singapore':    'Singapore',
  'philippines':  'Philippines',
  'indonesia':    'Indonesia',
  'thailand':     'Thailand',
  'vietnam':      'Vietnam',
  'hong kong':    'Hong Kong',
  'taiwan':       'Taiwan',
  'australia':    'Australia',
  'new zealand':  'New Zealand',
  'japan':        'Japan',
  'south korea':  'South Korea',
  'india':        'India',
  'myanmar':      'Myanmar',
  'cambodia':     'Cambodia',
  'bangladesh':   'Bangladesh',
  'pakistan':     'Pakistan',
  'sri lanka':    'Sri Lanka',
  'nepal':        'Nepal',
};
