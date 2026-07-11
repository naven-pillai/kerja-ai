// /utils/formatSalary.ts
export type Money = number | string | null | undefined;

export function toNumber(val: Money): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return Number.isFinite(val) ? val : null;

  const cleaned = String(val).replace(/[^\d.]/g, '');
  if (!cleaned) return null;

  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

function formatCompactNumber(n: number): string {
  // 1500 → "1.5K", 1000000 → "1M", 15000000 → "15M"
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

function normalizeCurrency(input?: string | null): string {
  const raw = (input ?? '').trim();
  if (!raw) return '';

  const upper = raw.toUpperCase();

  const alias: Record<string, string> = {
    RM: 'MYR',
    MYR: 'MYR',
    PESO: 'PHP',
    PESOS: 'PHP',
    PHP: 'PHP',
    '₱': 'PHP',
    IDR: 'IDR',
    RP: 'IDR',
    SGD: 'SGD',
    'S$': 'SGD',
    THB: 'THB',
    '฿': 'THB',
    VND: 'VND',
    '₫': 'VND',
    INR: 'INR',
    '₹': 'INR',
    USD: 'USD',
    AUD: 'AUD',
    CAD: 'CAD',
    EUR: 'EUR',
    GBP: 'GBP',
    JPY: 'JPY',
    '¥': 'JPY',
    KRW: 'KRW',
    '₩': 'KRW',
  };

  return alias[upper] ?? upper;
}

function currencyPrefix(code: string): string {
  const map: Record<string, string> = {
    MYR: 'RM',
    IDR: 'Rp',
    SGD: 'S$',
    THB: '฿',
    VND: '₫',
    PHP: '₱',
    INR: '₹',
    JPY: '¥',
    KRW: '₩',
    USD: '$',
    AUD: 'A$',
    CAD: 'C$',
    EUR: '€',
    GBP: '£',
  };

  return map[code] ?? (code ? `${code} ` : '');
}

type FormatSalaryOptions = {
  /** Shorten 1,500 → "1.5K", 1,000,000 → "1M". Default false. */
  compact?: boolean;
};

/**
 * Behavior:
 * - If no salary -> ''
 * - If currency missing -> show numbers only (no symbol)
 * - If currency exists -> show with correct symbol
 * - If options.compact -> shorten with K/M (great for cards/badges)
 */
export function formatSalaryRange(
  min: Money,
  max: Money,
  currency?: string | null,
  options: FormatSalaryOptions = {},
): string {
  const minN = toNumber(min);
  const maxN = toNumber(max);

  if (!minN && !maxN) return '';

  const code = normalizeCurrency(currency);
  const prefix = code ? currencyPrefix(code) : '';
  const numberFn = options.compact ? formatCompactNumber : formatNumber;

  // Helper to format a value with optional prefix
  const fmt = (n: number) => `${prefix}${numberFn(n)}`;

  if (minN && maxN) {
    if (minN === maxN) return code ? fmt(minN) : numberFn(minN);
    return code
      ? `${fmt(minN)}–${fmt(maxN)}`
      : `${numberFn(minN)}–${numberFn(maxN)}`;
  }

  if (minN) return code ? `${fmt(minN)}+` : `${numberFn(minN)}+`;
  return code ? fmt(maxN!) : numberFn(maxN!);
}
