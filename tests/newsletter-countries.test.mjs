import test from 'node:test';
import assert from 'node:assert/strict';

import {
  subscriberCountries,
  subscriberCountryByCode,
  normalizeSubscriberCountry,
} from '../constants/newsletter-countries.ts';
import { jobLocations } from '../constants/job-filters.ts';

test('subscriber countries match the markets we list jobs for', () => {
  // If these drift, we either take subscribers we have no jobs for, or turn
  // away people in a market we just launched.
  assert.deepEqual([...subscriberCountries].sort(), [...jobLocations].sort());
});

test('accepts the two markets we serve', () => {
  assert.equal(normalizeSubscriberCountry('Malaysia'), 'Malaysia');
  assert.equal(normalizeSubscriberCountry('Singapore'), 'Singapore');
});

test('rejects every other country', () => {
  // The two that actually got through before this existed.
  assert.equal(normalizeSubscriberCountry('Indonesia'), null);
  assert.equal(normalizeSubscriberCountry('India'), null);
  assert.equal(normalizeSubscriberCountry('United States'), null);
  assert.equal(normalizeSubscriberCountry('Thailand'), null);
});

test('normalises case and whitespace rather than storing a variant', () => {
  assert.equal(normalizeSubscriberCountry('  singapore '), 'Singapore');
  assert.equal(normalizeSubscriberCountry('MALAYSIA'), 'Malaysia');
});

test('rejects missing and non-string input', () => {
  assert.equal(normalizeSubscriberCountry(''), null);
  assert.equal(normalizeSubscriberCountry('   '), null);
  assert.equal(normalizeSubscriberCountry(null), null);
  assert.equal(normalizeSubscriberCountry(undefined), null);
  assert.equal(normalizeSubscriberCountry(42), null);
  assert.equal(normalizeSubscriberCountry(['Malaysia']), null);
});

test('rejects near-misses that would sneak past a loose check', () => {
  assert.equal(normalizeSubscriberCountry('Malaysian'), null);
  assert.equal(normalizeSubscriberCountry('West Malaysia'), null);
  assert.equal(normalizeSubscriberCountry('Singapore, Malaysia'), null);
});

test('the geo code map only points at countries we serve', () => {
  for (const [code, name] of Object.entries(subscriberCountryByCode)) {
    assert.ok(subscriberCountries.includes(name), `${code} maps to unserved "${name}"`);
  }
});
