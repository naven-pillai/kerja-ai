import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveSalaryCurrency, currencyMap, jobLocations } from '../constants/job-filters.ts';

test('a stored currency always wins', () => {
  assert.equal(resolveSalaryCurrency('MYR', 'Malaysia'), 'MYR');
  assert.equal(resolveSalaryCurrency('SGD', 'Singapore'), 'SGD');
  // Even when it disagrees with the country — the admin set it deliberately.
  assert.equal(resolveSalaryCurrency('SGD', 'Malaysia'), 'SGD');
});

test('falls back to the country when currency is missing', () => {
  // This is the case that rendered "8,000" with no symbol at all.
  assert.equal(resolveSalaryCurrency(null, 'Malaysia'), 'MYR');
  assert.equal(resolveSalaryCurrency(undefined, 'Singapore'), 'SGD');
  assert.equal(resolveSalaryCurrency('', 'Malaysia'), 'MYR');
  assert.equal(resolveSalaryCurrency('   ', 'Singapore'), 'SGD');
});

test('a Singapore job never falls back to ringgit', () => {
  // JobMeta used to hardcode 'MYR', so an SGD salary was labelled RM.
  assert.notEqual(resolveSalaryCurrency(null, 'Singapore'), 'MYR');
  assert.equal(resolveSalaryCurrency(null, 'Singapore'), 'SGD');
});

test('handles the array shape Supabase returns for these columns', () => {
  assert.equal(resolveSalaryCurrency(['MYR'], ['Malaysia']), 'MYR');
  assert.equal(resolveSalaryCurrency(null, ['Singapore']), 'SGD');
});

test('returns null rather than guessing when nothing is known', () => {
  assert.equal(resolveSalaryCurrency(null, null), null);
  assert.equal(resolveSalaryCurrency(null, undefined), null);
  assert.equal(resolveSalaryCurrency(null, 'Atlantis'), null);
});

test('every market we serve can resolve a currency', () => {
  // A new job location without a currency would silently render bare numbers.
  for (const country of jobLocations) {
    assert.ok(currencyMap[country], `${country} has no currency in currencyMap`);
    assert.equal(resolveSalaryCurrency(null, country), currencyMap[country]);
  }
});
