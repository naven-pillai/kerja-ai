// components/seo/JobPostingStructuredData.tsx
import { countrySchemaMap } from '@/lib/countryMap';
import { shouldShowCity, MALAYSIAN_CITY_REGIONS } from '@/lib/formatLocation';

/**
 * Build a schema.org PostalAddress for one country.
 *
 * Adds addressLocality (+ addressRegion) when we actually know the city. This is
 * what lets Google Jobs surface a listing for "AI jobs in Kuala Lumpur" rather
 * than only for country-level searches.
 *
 * Deliberately NOT added for fully-remote roles: a 100% remote job has no
 * office, so claiming a physical locality would misrepresent it (Google expects
 * TELECOMMUTE + applicantLocationRequirements for those instead).
 */
function buildAddress(country: string, city: string | null | undefined, isFullyRemote: boolean) {
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressCountry: country,
  };

  if (!isFullyRemote && shouldShowCity(country, city)) {
    const cityName = (city ?? '').trim();
    address.addressLocality = cityName;

    const region = MALAYSIAN_CITY_REGIONS[cityName];
    if (region) address.addressRegion = region;
  }

  return address;
}

// Strip HTML tags and decode basic entities for schema plain-text fields
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Normalize job type to Google-accepted employmentType values
const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  'full-time': 'FULL_TIME',
  'full_time': 'FULL_TIME',
  'fulltime': 'FULL_TIME',
  'full time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  'part_time': 'PART_TIME',
  'parttime': 'PART_TIME',
  'part time': 'PART_TIME',
  'contract': 'CONTRACTOR',
  'contractor': 'CONTRACTOR',
  'freelance': 'CONTRACTOR',
  'temporary': 'TEMPORARY',
  'temp': 'TEMPORARY',
  'internship': 'INTERN',
  'intern': 'INTERN',
  'volunteer': 'VOLUNTEER',
  'per diem': 'PER_DIEM',
  'per_diem': 'PER_DIEM',
};

function normalizeEmploymentType(value: string | null | undefined): string {
  if (!value) return 'FULL_TIME';
  const key = value.toLowerCase().trim();
  return EMPLOYMENT_TYPE_MAP[key] ?? 'FULL_TIME';
}

// Returns null if the token maps to worldwide/global (omit requirements)
// Returns string[] of country names otherwise
function resolveToCountries(token: string): string[] | null {
  if (!token) return [];
  const key = token.trim().toLowerCase();
  const mapped = (countrySchemaMap as Record<string, string | string[] | null>)?.[key];
  if (mapped === null) return null; // worldwide — caller should omit requirements
  if (mapped === undefined) return [token]; // unknown token, use as-is
  return Array.isArray(mapped) ? mapped : [mapped];
}

// Returns null if any token resolves to worldwide
function expandJobLocationToCountries(jobLocation: string | string[]): string[] | null {
  const tokens = Array.isArray(jobLocation)
    ? jobLocation
    : jobLocation.split(',').map(s => s.trim()).filter(Boolean);

  const result: string[] = [];
  for (const token of tokens) {
    const resolved = resolveToCountries(token);
    if (resolved === null) return null; // worldwide
    result.push(...resolved);
  }
  return result;
}

export default function JobPostingStructuredData({
  title,
  description,
  datePosted,
  validThrough,
  employmentType,
  hiringOrganization,
  jobLocation, // string | string[]
  city,
  applyUrl,
  salary,
  remoteType,
}: {
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType: string;
  hiringOrganization: {
    name: string;
    logo: string;
    url: string;
  };
  jobLocation: string | string[]; // ⬅️ updated
  /** Malaysian city, if set. Feeds addressLocality/addressRegion. */
  city?: string | null;
  applyUrl: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  /** '100% Remote' | 'Hybrid' | 'Onsite'. Only '100% Remote' is fully remote. */
  remoteType?: string | null;
}) {
  // Google only allows jobLocationType=TELECOMMUTE (and its companion
  // applicantLocationRequirements) for fully-remote roles. Hybrid and onsite
  // roles must advertise a physical jobLocation instead, or the listing is invalid.
  const isFullyRemote = remoteType === '100% Remote';
  // Ensure validThrough is always in the future — default to 60 days from datePosted
  let safeValidThrough = validThrough;
  if (!validThrough || validThrough <= datePosted) {
    const posted = new Date(datePosted);
    posted.setDate(posted.getDate() + 60);
    safeValidThrough = posted.toISOString();
  }

  const cleanDescription = stripHtml(description);

  // Build the base schema
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description: cleanDescription || title,
    datePosted,
    validThrough: safeValidThrough,
    employmentType: normalizeEmploymentType(employmentType),
    hiringOrganization: {
      '@type': 'Organization',
      name: hiringOrganization.name,
      sameAs: hiringOrganization.url,
      logo: hiringOrganization.logo,
    },
    directApply: true,
    url: applyUrl,
  };

  if (isFullyRemote) {
    schema.jobLocationType = 'TELECOMMUTE';
  }

  // Salary info — handle full range, min-only, or max-only
  if (salary && salary.currency) {
    const hasMin = salary.min > 0;
    const hasMax = salary.max > 0;

    if (hasMin && hasMax) {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: salary.currency,
        value: {
          '@type': 'QuantitativeValue',
          minValue: salary.min,
          maxValue: salary.max,
          unitText: 'MONTH',
        },
      };
    } else if (hasMin || hasMax) {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: salary.currency,
        value: {
          '@type': 'QuantitativeValue',
          value: hasMin ? salary.min : salary.max,
          unitText: 'MONTH',
        },
      };
    }
  }

  // Normalize jobLocation into countries
  const raw = typeof jobLocation === 'string' ? jobLocation.trim() : jobLocation;
  const countries = raw && (Array.isArray(raw) ? raw.length > 0 : raw.length > 0)
    ? expandJobLocationToCountries(raw)
    : null;

  if (countries !== null && countries.length > 0) {
    // Deduplicate while preserving order
    const seen = new Set<string>();
    const uniqueCountries = countries
      .map(c => c.trim())
      .filter(c => {
        if (!c) return false;
        const key = c.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    if (uniqueCountries.length === 1) {
      if (isFullyRemote) {
        schema.applicantLocationRequirements = { '@type': 'Country', name: uniqueCountries[0] };
      }
      schema.jobLocation = {
        '@type': 'Place',
        address: buildAddress(uniqueCountries[0], city, isFullyRemote),
      };
    } else if (uniqueCountries.length > 1) {
      if (isFullyRemote) {
        schema.applicantLocationRequirements = uniqueCountries.map(c => ({ '@type': 'Country', name: c }));
      }
      // buildAddress only attaches the city to Malaysia, so a multi-country job
      // can't leak a Malaysian city onto its Singapore Place.
      schema.jobLocation = uniqueCountries.map(c => ({
        '@type': 'Place',
        address: buildAddress(c, city, isFullyRemote),
      }));
    }
  } else {
    // Location unset — Google requires applicantLocationRequirements for
    // TELECOMMUTE roles only. Default to Kerja-AI's two markets.
    const apacDefault = ['Malaysia', 'Singapore'];
    if (isFullyRemote) {
      schema.applicantLocationRequirements = apacDefault.map(c => ({ '@type': 'Country', name: c }));
    }
    schema.jobLocation = apacDefault.map(c => ({
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressCountry: c },
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
