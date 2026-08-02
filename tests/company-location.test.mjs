import test from 'node:test';
import assert from 'node:assert/strict';

import {
  hiringCountriesFromJobLocations,
  companyCountries,
  companyCountrySlug,
  companyCountryFromSlug,
} from '../lib/companyLocation.ts';

test('a company is in the markets its jobs are located in', () => {
  assert.deepEqual(hiringCountriesFromJobLocations([['Malaysia']]), ['Malaysia']);
  assert.deepEqual(hiringCountriesFromJobLocations([['Singapore']]), ['Singapore']);
});

test('a company hiring in both markets belongs to both', () => {
  assert.deepEqual(
    hiringCountriesFromJobLocations([['Malaysia'], ['Singapore']]),
    ['Malaysia', 'Singapore']
  );
  // A single job listing both, too.
  assert.deepEqual(
    hiringCountriesFromJobLocations([['Malaysia', 'Singapore']]),
    ['Malaysia', 'Singapore']
  );
});

test('order is canonical regardless of job order', () => {
  // Singapore job first must still read Malaysia, Singapore.
  assert.deepEqual(
    hiringCountriesFromJobLocations([['Singapore'], ['Malaysia']]),
    ['Malaysia', 'Singapore']
  );
});

test('a company with no jobs is in no market', () => {
  assert.deepEqual(hiringCountriesFromJobLocations([]), []);
});

test('tolerates the shapes job_location actually arrives in', () => {
  assert.deepEqual(hiringCountriesFromJobLocations(['Malaysia']), ['Malaysia']); // bare string
  assert.deepEqual(hiringCountriesFromJobLocations([null, undefined, []]), []);
  assert.deepEqual(hiringCountriesFromJobLocations([['  Malaysia  ']]), ['Malaysia']); // whitespace
});

test('a market we do not serve is ignored', () => {
  assert.deepEqual(hiringCountriesFromJobLocations([['Indonesia'], ['Malaysia']]), ['Malaysia']);
});

test('country slugs round-trip', () => {
  for (const c of companyCountries) {
    assert.equal(companyCountryFromSlug(companyCountrySlug(c)), c);
  }
  assert.equal(companyCountryFromSlug('indonesia'), null);
});
