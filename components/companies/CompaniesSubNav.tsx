import Link from 'next/link';
import { companyCountries, companyCountrySlug, type CompanyCountry } from '@/lib/companyLocation';

/**
 * Tabs across the top of the companies section: All / Malaysia / Singapore.
 * `active` is passed in by each page rather than read from the pathname, so this
 * stays a server component with no client JS.
 */
export default function CompaniesSubNav({ active }: { active: 'all' | CompanyCountry }) {
  const tabs = [
    { key: 'all' as const, label: 'All companies', href: '/companies' },
    ...companyCountries.map((c) => ({
      key: c,
      label: c,
      href: `/companies/${companyCountrySlug(c)}`,
    })),
  ];

  return (
    <nav aria-label="Companies by location" className="mb-8 flex flex-wrap justify-center gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-[#1D4ED8] text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-[#1D4ED8]/40 hover:text-[#1D4ED8]'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
