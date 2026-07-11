import test from 'node:test';
import assert from 'node:assert/strict';

import { formatJobLocation } from '../lib/formatLocation.ts';

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
