import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCheckoutExpiry,
  getCheckoutCustomerEmail,
  normalizeCheckoutEmail,
} from '../lib/stripe-checkout.ts';

test('normalizeCheckoutEmail trims and lowercases values', () => {
  assert.equal(normalizeCheckoutEmail(' User@Example.COM '), 'user@example.com');
  assert.equal(normalizeCheckoutEmail(''), null);
  assert.equal(normalizeCheckoutEmail(null), null);
});

test('getCheckoutCustomerEmail prefers customer details and normalizes the result', () => {
  assert.equal(
    getCheckoutCustomerEmail({
      customer_details: { email: ' Buyer@Example.com ' },
      customer: { email: 'fallback@example.com' },
    }),
    'buyer@example.com'
  );
});

test('getCheckoutCustomerEmail falls back to expanded customer email', () => {
  assert.equal(
    getCheckoutCustomerEmail({
      customer_details: { email: null },
      customer: { email: 'Account@Example.com' },
    }),
    'account@example.com'
  );
  assert.equal(
    getCheckoutCustomerEmail({
      customer_details: { email: null },
      customer: { deleted: true },
    }),
    null
  );
  assert.equal(
    getCheckoutCustomerEmail({
      customer_details: { email: null },
      customer: 'cus_123',
    }),
    null
  );
});

test('calculateCheckoutExpiry uses the checkout creation date and interval', () => {
  assert.equal(
    calculateCheckoutExpiry({
      createdUnix: Date.parse('2026-03-22T00:00:00.000Z') / 1000,
      interval: 'yearly',
    }),
    '2027-03-22T00:00:00.000Z'
  );
  assert.equal(
    calculateCheckoutExpiry({
      createdUnix: Date.parse('2026-03-22T00:00:00.000Z') / 1000,
      interval: 'monthly',
    }),
    '2026-04-22T00:00:00.000Z'
  );
});

test('calculateCheckoutExpiry falls back to the provided current time', () => {
  assert.equal(
    calculateCheckoutExpiry({
      createdUnix: null,
      interval: 'yearly',
      now: new Date('2026-03-22T00:00:00.000Z'),
    }),
    '2027-03-22T00:00:00.000Z'
  );
});
