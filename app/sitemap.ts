import type { MetadataRoute } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { jobLocations, jobCategories, jobTypes } from '@/constants/job-filters';
import { slugify as locSlugify } from '@/lib/slugify';
import { slugify as catSlugify } from '@/utils/slugify';
import { SITE } from '@/config/site';
import { salaryRoles, salaryCountries, slugifyCountry } from '@/constants/salary-data';

const BASE = SITE.url;

// Tier 1: top entry pages for jobs and blog (highest priority)
const topRoutes: MetadataRoute.Sitemap = [
  { url: BASE,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
  { url: `${BASE}/jobs`,                lastModified: new Date(), changeFrequency: 'hourly',  priority: 1.0 },
  { url: `${BASE}/blog`,                lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
];

// Tier 2: SEO landing pages (taxonomies)
const taxonomyRootRoutes: MetadataRoute.Sitemap = [
  { url: `${BASE}/salary`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/job-location`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/job-categories`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/job-types`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/companies`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
];

// Tier 3: low-frequency static pages
const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${BASE}/post-job`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/newsletter`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.5 },
  { url: `${BASE}/about`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE}/faq`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE}/contact`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${BASE}/privacy-policy`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  { url: `${BASE}/terms-conditions`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
];

// Programmatic taxonomy pages — these are SEO landing pages, mid-priority
const locationRoutes: MetadataRoute.Sitemap = jobLocations.map((loc) => ({
  url: `${BASE}/job-location/${locSlugify(loc)}`,
  lastModified: new Date(),
  changeFrequency: 'daily',
  priority: 0.7,
}));

const categoryRoutes: MetadataRoute.Sitemap = jobCategories.map((cat) => ({
  url: `${BASE}/job-categories/${catSlugify(cat)}`,
  lastModified: new Date(),
  changeFrequency: 'daily',
  priority: 0.7,
}));

const jobTypeRoutes: MetadataRoute.Sitemap = jobTypes.map((type) => ({
  url: `${BASE}/job-types/${locSlugify(type)}`,
  lastModified: new Date(),
  changeFrequency: 'daily',
  priority: 0.7,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServerClient();

  const [jobsRes, blogsRes, companiesRes] = await Promise.all([
    supabase
      .from('jobs')
      .select('slug, created_at, expires_at')
      .eq('status', 'published')
      .lte('goes_public_at', new Date().toISOString())
      .not('goes_public_at', 'is', null),

    supabase
      .from('blogs')
      .select('slug, created_at, updated_at')
      .eq('status', 'published'),

    supabase
      .from('companies')
      .select('slug, updated_at'),
  ]);

  const now = new Date();

  // Tier 1 priority: individual job listings — highest crawl priority
  const jobRoutes: MetadataRoute.Sitemap = (jobsRes.data ?? [])
    .filter((j) => !j.expires_at || new Date(j.expires_at) > now)
    .map((j) => ({
      url: `${BASE}/jobs/${j.slug}`,
      lastModified: new Date(j.created_at ?? now),
      changeFrequency: 'daily',
      priority: 1.0,
    }));

  // Tier 1 priority: blog posts
  const blogRoutes: MetadataRoute.Sitemap = (blogsRes.data ?? []).map((b) => ({
    url: `${BASE}/blog/${b.slug}`,
    lastModified: new Date(b.updated_at ?? b.created_at ?? now),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const companyRoutes: MetadataRoute.Sitemap = (companiesRes.data ?? []).map((c) => ({
    url: `${BASE}/companies/${c.slug}`,
    lastModified: new Date(c.updated_at ?? now),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  // Order matters: Google prioritizes URLs that appear earlier in the sitemap.
  // Jobs and blog posts come first to direct crawl budget there.
  // Salary pages are fully static (four categories x two countries, plus the
  // per-category hub), so they can be enumerated without touching the database.
  const salaryRoutes: MetadataRoute.Sitemap = salaryRoles.flatMap((role) => {
    const roleSlug = role.slug;
    return [
      {
        url: `${BASE}/salary/${roleSlug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      ...salaryCountries.map((country) => ({
        url: `${BASE}/salary/${roleSlug}/${slugifyCountry(country)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ];
  });

  return [
    ...topRoutes,
    ...jobRoutes,
    ...blogRoutes,
    ...taxonomyRootRoutes,
    ...locationRoutes,
    ...categoryRoutes,
    ...jobTypeRoutes,
    ...companyRoutes,
    ...salaryRoutes,
    ...staticRoutes,
  ];
}
