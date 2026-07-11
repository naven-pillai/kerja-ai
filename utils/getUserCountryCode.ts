export async function getUserCountryCode(): Promise<string> {
  try {
    const res = await fetch('/api/geo', { cache: 'no-store' });
    const data = await res.json();
    return data.country || 'DEFAULT';
  } catch {
    return 'DEFAULT';
  }
}

export async function getUserCurrencyCode(): Promise<string> {
  try {
    const res = await fetch('/api/geo', { cache: 'no-store' });
    const data = await res.json();
    return (data.currency || 'USD').toUpperCase();
  } catch {
    return 'USD';
  }
}
