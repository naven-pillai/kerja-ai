export function formatApplyUrl({
    url,
    jobTitle,
  }: {
    url: string;
    jobTitle: string;
  }): string {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url.trim());

    if (isEmail) {
      const subject = encodeURIComponent(`Application for ${jobTitle}`);
      return `mailto:${url.trim()}?subject=${subject}`;
    }

    try {
      const u = new URL(url.trim());
      for (const key of [...u.searchParams.keys()]) {
        if (key.startsWith('utm_')) u.searchParams.delete(key);
      }
      return u.toString();
    } catch {
      return url.trim();
    }
  }
  