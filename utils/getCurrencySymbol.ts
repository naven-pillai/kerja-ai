// /utils/getCurrencySymbol.ts

const currencySymbolMap: Record<string, string> = {
  AED: 'AED ',
  AUD: 'A$',
  BDT: '৳',
  BHD: 'BHD ',
  BND: 'B$',
  BRL: 'R$',
  CAD: 'C$',
  CHF: 'CHF ',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
  HKD: 'HK$',
  IDR: 'Rp',
  INR: '₹',
  JPY: '¥',
  KRW: '₩',
  LKR: 'Rs ',
  MMK: 'K',
  MOP: 'MOP$',
  MYR: 'RM',
  NZD: 'NZ$',
  PHP: '₱',
  PKR: 'Rs ',
  QAR: 'QAR ',
  SAR: 'SAR ',
  SGD: 'S$',
  THB: '฿',
  TWD: 'NT$',
  USD: '$',
  VND: '₫',
  ZAR: 'R',
};

export function getCurrencySymbol(currencyCode?: string | null): string {
  const code = (currencyCode ?? '').trim().toUpperCase();
  if (!code) return '';

  // Prefer a known symbol/prefix
  const symbol = currencySymbolMap[code];
  if (symbol) return symbol;

  // Fallback: "XXX " (keeps your "no guessing" rule)
  return `${code} `;
}
