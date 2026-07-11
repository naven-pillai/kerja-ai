// utils/appendUTM.ts

export function appendUTM(url: string, params: Record<string, string>) {
    try {
      const u = new URL(url);
      Object.entries(params).forEach(([key, value]) => {
        u.searchParams.set(key, value);
      });
      return u.toString();
    } catch (err) {
      return url; // fallback for invalid URLs
    }
  }
  