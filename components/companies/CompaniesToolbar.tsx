'use client';

import CompaniesFilterToggle from './CompaniesFilterToggle';
import CompanySearchAutocomplete from './CompanySearchAutocomplete';
import type { SortOption } from './CompaniesDirectoryClient';

type Company = {
  id: string;
  name: string;
  isHiring: boolean;
  jobCount: number;
};

type Props = {
  companies: Company[];
  baseCompanies: Company[];
  enableSearch: boolean;
  maxSuggestions: number;

  filter: 'all' | 'hiring';
  setFilter: (v: 'all' | 'hiring') => void;
  hiringCount: number;

  query: string;
  setQuery: (v: string) => void;

  sort: SortOption;
  setSort: (v: SortOption) => void;

  industryFilter: string;
  setIndustryFilter: (v: string) => void;
  sizeFilter: string;
  setSizeFilter: (v: string) => void;
  regionFilter: string;
  setRegionFilter: (v: string) => void;
  policyFilter: string;
  setPolicyFilter: (v: string) => void;

  industries: string[];
  sizes: string[];
  regions: string[];
  policies: string[];

  showingCount: number;
  onReset: () => void;
};

const selectClass =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] cursor-pointer';

export default function CompaniesToolbar({
  companies,
  baseCompanies,
  enableSearch,
  maxSuggestions,
  filter,
  setFilter,
  hiringCount,
  query,
  setQuery,
  sort,
  setSort,
  industryFilter,
  setIndustryFilter,
  sizeFilter,
  setSizeFilter,
  regionFilter,
  setRegionFilter,
  policyFilter,
  setPolicyFilter,
  industries,
  sizes,
  regions,
  policies,
  showingCount,
  onReset,
}: Props) {
  const hasActiveFilters =
    query.trim().length > 0 ||
    filter !== 'all' ||
    industryFilter !== '' ||
    sizeFilter !== '' ||
    regionFilter !== '' ||
    policyFilter !== '' ||
    sort !== 'alpha-asc';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      {/* Row 1: filter toggle + search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CompaniesFilterToggle
          filter={filter}
          onChange={setFilter}
          total={companies.length}
          hiringCount={hiringCount}
        />

        {enableSearch && (
          <CompanySearchAutocomplete
            baseCompanies={baseCompanies}
            query={query}
            setQuery={setQuery}
            maxSuggestions={maxSuggestions}
          />
        )}
      </div>

      {/* Row 2: attribute filters + sort */}
      <div className="flex flex-wrap gap-2 items-center">
        {industries.length > 0 && (
          <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className={selectClass}>
            <option value="">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        )}

        {sizes.length > 0 && (
          <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className={selectClass}>
            <option value="">All Sizes</option>
            {sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        {regions.length > 0 && (
          <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className={selectClass}>
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}

        {policies.length > 0 && (
          <select value={policyFilter} onChange={(e) => setPolicyFilter(e.target.value)} className={selectClass}>
            <option value="">All Policies</option>
            {policies.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        )}

        <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className={selectClass}>
          <option value="alpha-asc">A → Z</option>
          <option value="alpha-desc">Z → A</option>
          <option value="most-jobs">Most Jobs</option>
        </select>
      </div>

      {/* Row 3: count + reset */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing <span className="font-semibold text-gray-900">{showingCount}</span> /{' '}
          <span className="font-semibold text-gray-900">{companies.length}</span>
          {filter === 'hiring' ? ' (Hiring now)' : ''}
          {query.trim() ? ` for "${query.trim()}"` : ''}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg px-2 py-1 font-semibold text-gray-700 hover:text-[#1D4ED8] hover:bg-slate-100 transition"
          >
            Reset all
          </button>
        )}
      </div>
    </div>
  );
}
