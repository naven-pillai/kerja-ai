import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canGrantEarlyAccess,
  hasActivePaidAccess,
  isValidCheckoutSessionId,
  parseMetadataBoolean,
  requiresCheckoutEmail,
  resolveCheckoutPlan,
} from '../lib/access-verification.ts';

test('isValidCheckoutSessionId accepts Stripe checkout session ids', () => {
  assert.equal(isValidCheckoutSessionId('cs_test_a1b2c3d4'), true);
  assert.equal(isValidCheckoutSessionId('cs_live_ABC_123'), true);
});

test('isValidCheckoutSessionId rejects malformed values', () => {
  assert.equal(isValidCheckoutSessionId('pi_12345'), false);
  assert.equal(isValidCheckoutSessionId('cs test bad'), false);
  assert.equal(isValidCheckoutSessionId(''), false);
});

test('resolveCheckoutPlan prefers metadata and falls back for paid jobs', () => {
  assert.equal(resolveCheckoutPlan('alerts', 'professional'), 'professional');
  assert.equal(resolveCheckoutPlan('paid_job', null), 'paid');
  assert.equal(resolveCheckoutPlan('alerts', null), null);
});

test('parseMetadataBoolean understands true, false, and 1', () => {
  assert.equal(parseMetadataBoolean('true'), true);
  assert.equal(parseMetadataBoolean('false'), false);
  assert.equal(parseMetadataBoolean('1'), true);
  assert.equal(parseMetadataBoolean('yes'), null);
  assert.equal(parseMetadataBoolean(null), null);
});

test('requiresCheckoutEmail only applies to alerts', () => {
  assert.equal(requiresCheckoutEmail('alerts'), true);
  assert.equal(requiresCheckoutEmail('paid_job'), false);
  assert.equal(requiresCheckoutEmail(null), false);
});

test('hasActivePaidAccess requires a paid record and a non-expired window', () => {
  const now = new Date('2026-03-22T00:00:00.000Z');

  assert.equal(
    hasActivePaidAccess({
      isPaid: true,
      expiresAt: '2026-03-23T00:00:00.000Z',
      now,
    }),
    true
  );
  assert.equal(
    hasActivePaidAccess({
      isPaid: true,
      expiresAt: null,
      now,
    }),
    true
  );
  assert.equal(
    hasActivePaidAccess({
      isPaid: true,
      expiresAt: '2026-03-21T00:00:00.000Z',
      now,
    }),
    false
  );
  assert.equal(
    hasActivePaidAccess({
      isPaid: true,
      expiresAt: 'not-a-date',
      now,
    }),
    false
  );
  assert.equal(
    hasActivePaidAccess({
      isPaid: false,
      expiresAt: '2026-03-23T00:00:00.000Z',
      now,
    }),
    false
  );
});

test('canGrantEarlyAccess succeeds if either paid or telegram access exists', () => {
  assert.equal(
    canGrantEarlyAccess({ hasPaidAccess: true, hasTelegramAccess: false }),
    true
  );
  assert.equal(
    canGrantEarlyAccess({ hasPaidAccess: false, hasTelegramAccess: true }),
    true
  );
  assert.equal(
    canGrantEarlyAccess({ hasPaidAccess: false, hasTelegramAccess: false }),
    false
  );
});
