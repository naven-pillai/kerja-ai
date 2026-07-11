import test from 'node:test';
import assert from 'node:assert/strict';
import {
  consumeRateLimit,
  getClientIp,
  getCrossSiteRequestError,
  isRequestOversized,
  normalizeOptionalString,
  normalizeOptionalUrl,
  normalizeStringArray,
} from '../lib/request-security-core.ts';

test('normalizeOptionalString trims and truncates values', () => {
  assert.equal(normalizeOptionalString('  hello world  ', 5), 'hello');
  assert.equal(normalizeOptionalString('   ', 10), null);
  assert.equal(normalizeOptionalString(null, 10), null);
});

test('normalizeOptionalUrl accepts http(s) urls and normalizes missing protocol', () => {
  assert.equal(
    normalizeOptionalUrl('kerja-ai.com/jobs', 200),
    'https://kerja-ai.com/jobs'
  );
  assert.equal(
    normalizeOptionalUrl('https://kerja-ai.com/about', 200),
    'https://kerja-ai.com/about'
  );
  assert.equal(normalizeOptionalUrl('ftp://example.com', 200), null);
});

test('normalizeStringArray filters blanks and caps size', () => {
  assert.deepEqual(
    normalizeStringArray(['  Malaysia ', '', 'Remote', null, 'Engineering'], 2, 20),
    ['Malaysia', 'Remote']
  );
});

test('getClientIp prefers x-forwarded-for', () => {
  const request = new Request('https://kerja-ai.com/api/test', {
    headers: {
      'x-forwarded-for': '203.0.113.10, 10.0.0.1',
      'x-real-ip': '198.51.100.2',
    },
  });

  assert.equal(getClientIp(request), '203.0.113.10');
});

test('getClientIp prefers the platform header over a spoofable x-forwarded-for', () => {
  const request = new Request('https://kerja-ai.com/api/test', {
    headers: {
      // A caller can forge x-forwarded-for to mint a fresh rate-limit bucket.
      'x-forwarded-for': '203.0.113.10, 10.0.0.1',
      'x-vercel-forwarded-for': '198.51.100.2',
    },
  });

  assert.equal(getClientIp(request), '198.51.100.2');
});

test('rejectCrossSiteRequest allows same-origin requests', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://kerja-ai.com';

  const request = new Request('https://kerja-ai.com/api/contact', {
    method: 'POST',
    headers: {
      origin: 'https://kerja-ai.com',
      'sec-fetch-site': 'same-origin',
    },
  });

  assert.equal(getCrossSiteRequestError(request), null);
});

test('rejectCrossSiteRequest blocks mismatched origins', async () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://kerja-ai.com';

  const request = new Request('https://kerja-ai.com/api/contact', {
    method: 'POST',
    headers: {
      origin: 'https://evil.example',
      'sec-fetch-site': 'cross-site',
    },
  });

  assert.equal(getCrossSiteRequestError(request), 'Cross-site requests are not allowed.');
});

test('isRequestOversized detects requests above the configured size', () => {
  const request = new Request('https://kerja-ai.com/api/contact', {
    method: 'POST',
    headers: {
      'content-length': '4097',
    },
  });

  assert.equal(isRequestOversized(request, 4096), true);
});

test('consumeRateLimit reports limited after the max is exceeded', () => {
  const request = new Request('https://kerja-ai.com/api/contact', {
    method: 'POST',
    headers: {
      'x-forwarded-for': '198.51.100.25',
    },
  });

  const namespace = `test-${Date.now()}-${Math.random()}`;

  assert.equal(
    consumeRateLimit(request, {
      namespace,
      max: 2,
      windowMs: 60_000,
    }).limited,
    false
  );

  assert.equal(
    consumeRateLimit(request, {
      namespace,
      max: 2,
      windowMs: 60_000,
    }).limited,
    false
  );

  const result = consumeRateLimit(request, {
    namespace,
    max: 2,
    windowMs: 60_000,
  });

  assert.equal(result.limited, true);
  assert.equal(result.retryAfterSeconds, 60);
});
