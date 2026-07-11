import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSavePreferencesRecord,
  canSavePreferencesForPaidRow,
  parseSavePreferencesBody,
  resolveCompletedCheckoutForWebhook,
  verifyCheckoutSession,
  verifyEarlyAccessAttempt,
} from '../lib/payment-route-contracts.ts';

test('parseSavePreferencesBody normalizes a valid preferences payload', () => {
  const result = parseSavePreferencesBody({
    email: ' Alerts@Example.com ',
    job_category: ['Engineering', ''],
    job_location: ['APAC'],
    job_type: ['Full-Time', 'Contract'],
  });

  assert.deepEqual(result, {
    email: 'alerts@example.com',
    jobCategory: ['Engineering'],
    jobLocation: ['APAC'],
    jobType: ['Full-Time', 'Contract'],
  });
});

test('parseSavePreferencesBody rejects invalid preference payloads', () => {
  assert.equal(
    parseSavePreferencesBody({
      email: 'bad-email',
      job_category: ['Engineering'],
      job_location: ['APAC'],
      job_type: ['Full-Time'],
    }),
    null
  );

  assert.equal(
    parseSavePreferencesBody({
      email: 'user@example.com',
      job_category: [],
      job_location: ['APAC'],
      job_type: ['Full-Time'],
    }),
    null
  );
});

test('canSavePreferencesForPaidRow requires active paid access', () => {
  assert.equal(
    canSavePreferencesForPaidRow({
      is_paid: true,
      expires_at: '2099-01-01T00:00:00.000Z',
    }),
    true
  );
  assert.equal(
    canSavePreferencesForPaidRow({
      is_paid: true,
      expires_at: '2020-01-01T00:00:00.000Z',
    }),
    false
  );
});

test('buildSavePreferencesRecord maps normalized preferences to storage fields', () => {
  const record = buildSavePreferencesRecord(
    {
      email: 'user@example.com',
      jobCategory: ['Engineering'],
      jobLocation: ['APAC'],
      jobType: ['Full-Time'],
    },
    '2026-03-22T00:00:00.000Z'
  );

  assert.deepEqual(record, {
    email: 'user@example.com',
    job_category: ['Engineering'],
    job_location: ['APAC'],
    job_type: ['Full-Time'],
    updated_at: '2026-03-22T00:00:00.000Z',
  });
});

test('verifyCheckoutSession returns a customer record for paid alerts sessions', () => {
  const result = verifyCheckoutSession({
    id: 'cs_test_123',
    payment_status: 'paid',
    created: Date.parse('2026-03-22T00:00:00.000Z') / 1000,
    customer_details: { email: 'Buyer@Example.com' },
    metadata: {
      type: 'alerts',
      plan: 'professional',
      interval: 'yearly',
      country: 'MY',
      telegram_chat_id: '12345',
    },
    amount_total: 4900,
    currency: 'myr',
    payment_intent: 'pi_123',
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.deepEqual(result.stripeCustomerRecord, {
    email: 'buyer@example.com',
    plan: 'professional',
    interval: 'yearly',
    is_paid: true,
    expires_at: '2027-03-22T00:00:00.000Z',
    telegram_chat_id: '12345',
  });
  assert.equal(result.body.currency, 'MYR');
  assert.equal(result.body.email, 'buyer@example.com');
  assert.equal(result.body.plan, 'professional');
});

test('verifyCheckoutSession rejects invalid checkout states', () => {
  const unpaid = verifyCheckoutSession({
    id: 'cs_test_123',
    payment_status: 'unpaid',
    metadata: { type: 'alerts', plan: 'professional' },
  });
  assert.deepEqual(unpaid, {
    ok: false,
    status: 402,
    body: {
      ok: false,
      error: 'Not paid',
      payment_status: 'unpaid',
    },
  });

  const missingPlan = verifyCheckoutSession({
    id: 'cs_test_123',
    payment_status: 'paid',
    customer_details: { email: 'user@example.com' },
    metadata: { type: 'alerts' },
  });
  assert.deepEqual(missingPlan, {
    ok: false,
    status: 400,
    body: {
      ok: false,
      error: 'Missing metadata.plan',
    },
  });
});

test('resolveCompletedCheckoutForWebhook ignores paid job sessions and upserts alerts', () => {
  assert.deepEqual(
    resolveCompletedCheckoutForWebhook({
      id: 'cs_test_123',
      payment_status: 'paid',
      metadata: { type: 'paid_job' },
    }),
    { kind: 'ignore' }
  );

  const result = resolveCompletedCheckoutForWebhook({
    id: 'cs_test_456',
    payment_status: 'paid',
    created: Date.parse('2026-03-22T00:00:00.000Z') / 1000,
    customer_details: { email: ' alerts@example.com ' },
    metadata: {
      type: 'alerts',
      plan: 'professional',
      interval: 'monthly',
    },
  });

  assert.equal(result.kind, 'upsert');
  if (result.kind !== 'upsert') return;

  assert.equal(result.email, 'alerts@example.com');
  assert.deepEqual(result.record, {
    email: 'alerts@example.com',
    plan: 'professional',
    interval: 'monthly',
    is_paid: true,
    expires_at: '2026-04-22T00:00:00.000Z',
    telegram_chat_id: null,
  });
});

test('verifyEarlyAccessAttempt respects honeypot, active paid access, and telegram access', () => {
  assert.deepEqual(
    verifyEarlyAccessAttempt({
      email: 'user@example.com',
      website: 'bot-filled',
    }),
    { kind: 'noop' }
  );

  assert.deepEqual(
    verifyEarlyAccessAttempt({
      email: 'User@Example.com',
      paidUser: {
        is_paid: true,
        expires_at: '2099-01-01T00:00:00.000Z',
      },
      telegramUser: null,
    }),
    {
      kind: 'success',
      normalizedEmail: 'user@example.com',
    }
  );

  assert.deepEqual(
    verifyEarlyAccessAttempt({
      email: 'user@example.com',
      paidUser: {
        is_paid: true,
        expires_at: '2020-01-01T00:00:00.000Z',
      },
      telegramUser: {
        telegram_chat_id: '12345',
      },
    }),
    {
      kind: 'success',
      normalizedEmail: 'user@example.com',
    }
  );

  assert.deepEqual(
    verifyEarlyAccessAttempt({
      email: 'user@example.com',
      paidUser: {
        is_paid: true,
        expires_at: '2020-01-01T00:00:00.000Z',
      },
      telegramUser: null,
    }),
    {
      kind: 'error',
      status: 401,
      body: { error: 'Access denied' },
    }
  );
});
