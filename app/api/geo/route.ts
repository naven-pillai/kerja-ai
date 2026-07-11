import { NextResponse } from 'next/server';

const countryToCurrency: Record<string, string> = {
  MY: 'MYR',
  SG: 'SGD',
  PH: 'PHP',
  TH: 'THB',
  VN: 'VND',
  ID: 'IDR',
  HK: 'HKD',
  TW: 'TWD',
  IN: 'INR',
  JP: 'JPY',
  KR: 'KRW',
  AU: 'AUD',
  NZ: 'NZD',
  US: 'USD',
};

export async function GET(req: Request) {
  const h = req.headers;

  // Vercel / Cloudflare / misc
  const country =
    h.get('x-vercel-ip-country') ||
    h.get('cf-ipcountry') ||
    h.get('x-country') ||
    'US';

  const currency = countryToCurrency[country] || 'USD';

  return NextResponse.json({ country, currency });
}
