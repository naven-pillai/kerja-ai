import test from 'node:test';
import assert from 'node:assert/strict';

import { formatJobLocation, formatShareLocation } from '../lib/formatLocation.ts';

test('shows the city beside the country for Malaysian roles', () => {
  assert.equal(formatJobLocation('Malaysia', 'Kuala Lumpur'), 'Kuala Lumpur, Malaysia');
  assert.equal(formatJobLocation('Malaysia', 'Johor Bahru'), 'Johor Bahru, Malaysia');
});

test('falls back to the country alone when no city is set', () => {
  assert.equal(formatJobLocation('Malaysia', null), 'Malaysia');
  assert.equal(formatJobLocation('Malaysia', undefined), 'Malaysia');
  assert.equal(formatJobLocation('Malaysia', ''), 'Malaysia');
  assert.equal(formatJobLocation('Malaysia', '   '), 'Malaysia');
});

test('never renders "Singapore, Singapore" — Singapore is a city-state', () => {
  assert.equal(formatJobLocation('Singapore', null), 'Singapore');
  // Even if a Singapore row somehow carried a city, it must not be shown.
  assert.equal(formatJobLocation('Singapore', 'Singapore'), 'Singapore');
  assert.equal(formatJobLocation('Singapore', 'Jurong'), 'Singapore');
});

test('degrades safely on missing data', () => {
  assert.equal(formatJobLocation(null, null), '');
  assert.equal(formatJobLocation(undefined, 'Kuala Lumpur'), 'Kuala Lumpur');
});

// formatShareLocation — what the "Share this job" tweet says. The tweet used to
// read "in Malaysia/Singapore" for every job, whatever country it was in.

test('share text names the real country, with the city when there is one', () => {
  assert.equal(formatShareLocation(['Malaysia'], 'Kuala Lumpur'), 'Kuala Lumpur, Malaysia');
  assert.equal(formatShareLocation(['Malaysia'], 'Penang'), 'Penang, Malaysia');
});

test('share text says just Singapore — never "Singapore, Singapore"', () => {
  assert.equal(formatShareLocation(['Singapore'], null), 'Singapore');
  // Even if a city somehow got saved against Singapore, the city rule suppresses it.
  assert.equal(formatShareLocation(['Singapore'], 'Singapore'), 'Singapore');
});

test('a Malaysian job with no city on record falls back to the country', () => {
  assert.equal(formatShareLocation(['Malaysia'], null), 'Malaysia');
  assert.equal(formatShareLocation(['Malaysia'], '  '), 'Malaysia');
});

test('a genuinely two-country role names both, and drops the city', () => {
  // The city belongs to one of them, so naming it would misplace the role.
  assert.equal(formatShareLocation(['Malaysia', 'Singapore'], 'Kuala Lumpur'), 'Malaysia and Singapore');
});

test('no location on record yields no phrase, rather than a guess', () => {
  assert.equal(formatShareLocation([], 'Kuala Lumpur'), '');
  assert.equal(formatShareLocation(null, null), '');
  assert.equal(formatShareLocation(undefined, undefined), '');
});

test('accepts a bare string as well as a list', () => {
  assert.equal(formatShareLocation('Singapore', null), 'Singapore');
  assert.equal(formatShareLocation('Malaysia', 'Cyberjaya'), 'Cyberjaya, Malaysia');
});
