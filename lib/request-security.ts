import { NextResponse } from 'next/server';
import {
  consumeRateLimit,
  getClientIp,
  getCrossSiteRequestError,
  isRequestOversized,
  isValidEmail,
  normalizeOptionalString,
  normalizeOptionalUrl,
  normalizeRequiredString,
  normalizeStringArray,
  type RateLimitOptions,
} from '@/lib/request-security-core';

export {
  getClientIp,
  isValidEmail,
  normalizeOptionalString,
  normalizeOptionalUrl,
  normalizeRequiredString,
  normalizeStringArray,
  type RateLimitOptions,
};

export function rejectCrossSiteRequest(request: Request) {
  const error = getCrossSiteRequestError(request);
  if (!error) return null;

  return NextResponse.json({ error }, { status: 403 });
}

export function rejectOversizedRequest(request: Request, maxBytes: number) {
  if (!isRequestOversized(request, maxBytes)) return null;

  return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
}

export function rejectRateLimitedRequest(request: Request, options: RateLimitOptions) {
  const result = consumeRateLimit(request, options);
  if (!result.limited) return null;

  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSeconds),
      },
    }
  );
}
