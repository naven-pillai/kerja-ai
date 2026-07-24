import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { jobCategories, currencyMap } from '@/constants/job-filters';
import { normalizeSubscriberCountry } from '@/constants/newsletter-countries';
import {
  experienceLevels,
  companyTypes,
  workArrangements,
  employmentTypes,
  industries,
  malaysianCities,
  salaryBounds,
  MAX_BONUS_MONTHS,
  isValidOption,
} from '@/constants/salary-submission';
import {
  normalizeOptionalString,
  rejectCrossSiteRequest,
  rejectOversizedRequest,
  rejectRateLimitedRequest,
} from '@/lib/request-security';

const MAX_BODY_BYTES = 8 * 1024;

export async function POST(req: Request) {
  const crossSite = rejectCrossSiteRequest(req);
  if (crossSite) return crossSite;

  const oversized = rejectOversizedRequest(req, MAX_BODY_BYTES);
  if (oversized) return oversized;

  // Tighter than the newsletter's window: one person has one salary to report.
  const rateLimited = rejectRateLimitedRequest(req, {
    namespace: 'salary-submission',
    max: 4,
    windowMs: 60 * 60 * 1000,
  });
  if (rateLimited) return rateLimited;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // Honeypot — report success so bots do not retry with a different shape.
  if (body.website) {
    return NextResponse.json({ message: 'Thanks — your salary has been submitted.' });
  }

  const jobCategory = normalizeOptionalString(body.jobCategory, 80);
  if (!jobCategory || !jobCategories.includes(jobCategory)) {
    return NextResponse.json({ message: 'Please choose a job category.' }, { status: 400 });
  }

  // Same two markets as the rest of the site.
  const country = normalizeSubscriberCountry(body.country);
  if (!country) {
    return NextResponse.json({ message: 'Please choose Malaysia or Singapore.' }, { status: 400 });
  }

  const yearsExperience = normalizeOptionalString(body.yearsExperience, 10);
  if (!isValidOption(experienceLevels, yearsExperience)) {
    return NextResponse.json({ message: 'Please choose your experience level.' }, { status: 400 });
  }

  // Reject non-finite and non-integer before the range check, or NaN slips past
  // a naive comparison and lands in an integer column.
  const salaryRaw = Number(body.monthlySalary);
  const bounds = salaryBounds[country];
  if (!Number.isFinite(salaryRaw) || !Number.isInteger(salaryRaw)) {
    return NextResponse.json(
      { message: 'Enter your monthly salary as a whole number.' },
      { status: 400 }
    );
  }
  if (salaryRaw < bounds.min || salaryRaw > bounds.max) {
    return NextResponse.json(
      {
        message: `That looks off for ${country}. Enter gross monthly pay between ${bounds.min.toLocaleString()} and ${bounds.max.toLocaleString()}.`,
      },
      { status: 400 }
    );
  }

  // Optional context.
  const jobTitle = normalizeOptionalString(body.jobTitle, 120);
  const companyType = normalizeOptionalString(body.companyType, 30);
  const workArrangement = normalizeOptionalString(body.workArrangement, 30);
  const employmentType = normalizeOptionalString(body.employmentType, 30);
  const industry = normalizeOptionalString(body.industry, 40);

  // City is Malaysia-only, and must be one we know — free text would fragment
  // the data into "KL", "kuala lumpur", "K.L." and so on.
  const cityRaw = normalizeOptionalString(body.city, 60);
  const city =
    country === 'Malaysia' && cityRaw && malaysianCities.includes(cityRaw) ? cityRaw : null;

  const bonusRaw =
    body.bonusMonths === '' || body.bonusMonths == null ? null : Number(body.bonusMonths);
  const bonusMonths =
    bonusRaw !== null && Number.isFinite(bonusRaw) && bonusRaw >= 0 && bonusRaw <= MAX_BONUS_MONTHS
      ? bonusRaw
      : null;

  const record = {
    job_category: jobCategory,
    job_title: jobTitle,
    country,
    city,
    years_experience: yearsExperience,
    monthly_salary: salaryRaw,
    currency: currencyMap[country] ?? 'MYR',
    company_type: isValidOption(companyTypes, companyType) ? companyType : null,
    work_arrangement: isValidOption(workArrangements, workArrangement) ? workArrangement : null,
    employment_type: isValidOption(employmentTypes, employmentType) ? employmentType : null,
    industry: isValidOption(industries, industry) ? industry : null,
    bonus_months: bonusMonths,
    status: 'pending',
  };

  const { error } = await getSupabaseAdmin().from('salary_submissions').insert(record);

  if (error) {
    console.error('Salary submission insert failed:', error);
    return NextResponse.json({ message: 'Could not save that. Please try again.' }, { status: 500 });
  }

  // No notification email by design: submissions are reviewed in the admin
  // dashboard's Salaries tab, which is the only place you can actually act on
  // one. A mail per submission would be noise pointing back at that same screen.
  return NextResponse.json({ message: 'Thanks — your salary has been submitted.' });
}
