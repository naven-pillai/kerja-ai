'use client';

import { useEffect, useMemo, useState } from 'react';
import CompanyCard from './CompanyCard';
import CompaniesToolbar from './CompaniesToolbar';
import Pagination from './Pagination';
import { usePagination } from './hooks/usePagination';

type Company = {
  id: string;
  name: string;
  logoUrl: string;
  companySlug: string;
  isHiring: boolean;
  jobCount: number;
  tagline?: string | null;
  industry?: string | null;
  company_size?: string | null;
  hq_location?: string | null;
  remote_policy?: string | null;
};

export type SortOption = 'alpha-asc' | 'alpha-desc' | 'most-jobs';

type Props = {
  companies: Company[];
  enableSearch?: boolean;
  defaultFilter?: 'all' | 'hiring';
  maxSuggestions?: number;
};

const PER_PAGE = 25;

export default function CompaniesDirectoryClient({
  companies,
  enableSearch = true,
  defaultFilter = 'all',
  maxSuggestions = 8,
}: Props) {
  const [filter, setFilter] = useState<'all' | 'hiring'>(defaultFilter);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>('alpha-asc');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [policyFilter, setPolicyFilter] = useState('');

  const hiringCount = useMemo(
    () => companies.filter((c) => c.isHiring && c.jobCount > 0).length,
    [companies]
  );

  // Derive unique filter values from data
  const industries = useMemo(() => {
    const vals = companies.map((c) => c.industry).filter(Boolean) as string[];
    return [...new Set(vals)].sort();
  }, [companies]);

  const regions = useMemo(() => {
    const vals = companies.map((c) => c.hq_location).filter(Boolean) as string[];
    return [...new Set(vals)].sort();
  }, [companies]);

  const policies = useMemo(() => {
    const vals = companies.map((c) => c.remote_policy).filter(Boolean) as string[];
    return [...new Set(vals)].sort();
  }, [companies]);

  const sizes = useMemo(() => {
    const order = ['1–50', '51–200', '201–500', '501–1,000', '1,000+'];
    const vals = companies.map((c) => c.company_size).filter(Boolean) as string[];
    const unique = [...new Set(vals)];
    return unique.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [companies]);

  const baseCompanies = useMemo(() => {
    return filter === 'hiring'
      ? companies.filter((c) => c.isHiring && c.jobCount > 0)
      : companies;
  }, [companies, filter]);

  const filtered = useMemo(() => {
    let result = baseCompanies;

    const q = query.trim().toLowerCase();
    if (q) result = result.filter((c) => c.name.toLowerCase().includes(q));
    if (industryFilter) result = result.filter((c) => c.industry === industryFilter);
    if (sizeFilter) result = result.filter((c) => c.company_size === sizeFilter);
    if (regionFilter) result = result.filter((c) => c.hq_location === regionFilter);
    if (policyFilter) result = result.filter((c) => c.remote_policy === policyFilter);

    return result;
  }, [baseCompanies, query, industryFilter, sizeFilter, regionFilter, policyFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === 'alpha-desc') return arr.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'most-jobs') return arr.sort((a, b) => b.jobCount - a.jobCount);
    return arr.sort((a, b) => a.name.localeCompare(b.name)); // alpha-asc default
  }, [filtered, sort]);

  const { totalPages, paginated } = usePagination(sorted, page, PER_PAGE);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [filter, query, industryFilter, sizeFilter, regionFilter, policyFilter, sort]);

  useEffect(() => setFilter(defaultFilter), [defaultFilter]);

  function resetAll() {
    setFilter('all');
    setQuery('');
    setSort('alpha-asc');
    setIndustryFilter('');
    setSizeFilter('');
    setRegionFilter('');
    setPolicyFilter('');
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <CompaniesToolbar
        companies={companies}
        baseCompanies={baseCompanies}
        enableSearch={enableSearch}
        maxSuggestions={maxSuggestions}
        filter={filter}
        setFilter={setFilter}
        hiringCount={hiringCount}
        query={query}
        setQuery={setQuery}
        onReset={resetAll}
        showingCount={sorted.length}
        sort={sort}
        setSort={setSort}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
        sizeFilter={sizeFilter}
        setSizeFilter={setSizeFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        policyFilter={policyFilter}
        setPolicyFilter={setPolicyFilter}
        industries={industries}
        sizes={sizes}
        regions={regions}
        policies={policies}
      />

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-semibold text-gray-900">No companies match that.</p>
          <p className="mt-1 text-gray-600">Try clearing a filter or your search to see more.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {paginated.map((company) => (
              <CompanyCard
                key={company.id}
                company={{
                  id: company.id,
                  name: company.name,
                  logoUrl: company.logoUrl || '/images/company-placeholder.png',
                  companySlug: company.companySlug,
                  tagline: company.tagline ?? null,
                  industry: company.industry ?? null,
                  isHiring: company.isHiring,
                  jobCount: company.jobCount,
                }}
                logoSize={64}
              />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
