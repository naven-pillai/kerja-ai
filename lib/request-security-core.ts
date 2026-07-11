export type RateLimitOptions = {
  namespace: string;
  max: number;
  windowMs: number;
  keyParts?: Array<string | null | undefined>;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalRateLimitStore = globalThis as typeof globalThis & {
  __kerjaRemoteRateLimitStore?: Map<string, RateLimitEntry>;
};

function getRateLimitStore() {
  if (!globalRateLimitStore.__kerjaRemoteRateLimitStore) {
    globalRateLimitStore.__kerjaRemoteRateLimitStore = new Map();
  }

  return globalRateLimitStore.__kerjaRemoteRateLimitStore;
}

function toOrigin(value: string | null): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins(request: Request) {
  const origins = new Set<string>();
  const envOrigin = toOrigin(process.env.NEXT_PUBLIC_SITE_URL ?? null);
  const requestOrigin = toOrigin(request.url);

  if (envOrigin) origins.add(envOrigin);
  if (requestOrigin) origins.add(requestOrigin);

  return origins;
}

export function getCrossSiteRequestError(request: Request) {
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && !['same-origin', 'same-site', 'none'].includes(secFetchSite)) {
    return 'Cross-site requests are not allowed.';
  }

  const allowedOrigins = getAllowedOrigins(request);
  if (allowedOrigins.size === 0) return null;

  const origin = toOrigin(request.headers.get('origin'));
  if (origin && !allowedOrigins.has(origin)) {
    return 'Cross-site requests are not allowed.';
  }

  const refererOrigin = toOrigin(request.headers.get('referer'));
  if (refererOrigin && !allowedOrigins.has(refererOrigin)) {
    return 'Cross-site requests are not allowed.';
  }

  return null;
}

export function isRequestOversized(request: Request, maxBytes: number) {
  const contentLengthHeader = request.headers.get('content-length');
  if (!contentLengthHeader) return false;

  const contentLength = Number(contentLengthHeader);
  if (!Number.isFinite(contentLength)) return false;

  return contentLength > maxBytes;
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cloudflareIp = request.headers.get('cf-connecting-ip');
  if (cloudflareIp) return cloudflareIp.trim();

  return 'unknown';
}

export function consumeRateLimit(request: Request, options: RateLimitOptions) {
  const store = getRateLimitStore();
  const now = Date.now();

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }

  const normalizedParts = (options.keyParts ?? [])
    .map((part) => String(part ?? '').trim().toLowerCase())
    .filter(Boolean);

  const key = [options.namespace, getClientIp(request), ...normalizedParts].join(':');
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return { limited: false as const };
  }

  if (existing.count >= options.max) {
    return {
      limited: true as const,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  store.set(key, existing);
  return { limited: false as const };
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeOptionalString(value: unknown, maxLength = 500) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return trimmed.slice(0, maxLength);
}

export function normalizeRequiredString(value: unknown, maxLength = 500) {
  return normalizeOptionalString(value, maxLength);
}

export function normalizeStringArray(value: unknown, maxItems = 20, maxLength = 100) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => normalizeOptionalString(item, maxLength))
    .filter((item): item is string => Boolean(item))
    .slice(0, maxItems);
}

export function normalizeOptionalUrl(value: unknown, maxLength = 500) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const hasExplicitScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
    const url = new URL(hasExplicitScheme ? trimmed : `https://${trimmed}`);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString().slice(0, maxLength);
  } catch {
    return null;
  }
}
