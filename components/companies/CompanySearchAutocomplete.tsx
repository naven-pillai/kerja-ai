'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

type Company = {
  id: string;
  name: string;
  isHiring: boolean;
  jobCount: number;
};

type Props = {
  baseCompanies: Company[];
  query: string;
  setQuery: (v: string) => void;
  maxSuggestions: number;
};

export default function CompanySearchAutocomplete({
  baseCompanies,
  query,
  setQuery,
  maxSuggestions,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const starts = baseCompanies.filter((c) => c.name.toLowerCase().startsWith(q));
    const includes = baseCompanies
      .filter((c) => !c.name.toLowerCase().startsWith(q))
      .filter((c) => c.name.toLowerCase().includes(q));

    return [...starts, ...includes].slice(0, maxSuggestions);
  }, [baseCompanies, query, maxSuggestions]);

  function clearQueryOnly() {
    setQuery('');
    setOpen(false);
    setActiveIndex(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function selectSuggestion(name: string) {
    setQuery(name);
    setOpen(false);
    setActiveIndex(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  // Reset the highlighted suggestion whenever the query changes. Adjusted
  // during render rather than in an effect, which would leave the old row
  // highlighted for one paint against the new suggestion list.
  const [lastQuery, setLastQuery] = useState(query);
  if (lastQuery !== query) {
    setLastQuery(query);
    setActiveIndex(-1);
  }

  return (
    <div className="w-full lg:w-[420px]" ref={wrapperRef}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open && e.key !== 'Escape') setOpen(true);

            if (e.key === 'Escape') {
              setOpen(false);
              setActiveIndex(-1);
              return;
            }

            if (e.key === 'ArrowDown') {
              if (suggestions.length === 0) return;
              e.preventDefault();
              setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
              return;
            }

            if (e.key === 'ArrowUp') {
              if (suggestions.length === 0) return;
              e.preventDefault();
              setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
              return;
            }

            if (e.key === 'Enter') {
              if (activeIndex >= 0 && suggestions[activeIndex]) {
                e.preventDefault();
                selectSuggestion(suggestions[activeIndex].name);
              }
              return;
            }
          }}
          placeholder="Search companies…"
          className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] placeholder:text-gray-500"
        />

        {!!query.trim() && (
          <button
            type="button"
            onClick={clearQueryOnly}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 hover:text-gray-900 hover:bg-slate-100 transition"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {open && suggestions.length > 0 && query.trim().length >= 2 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
              <Sparkles className="h-3.5 w-3.5" />
              Suggestions
              <span className="ml-auto">↑ ↓ Enter</span>
            </div>

            <ul className="max-h-72 overflow-auto">
              {suggestions.map((c, idx) => {
                const isActive = idx === activeIndex;
                const isHiring = c.isHiring && c.jobCount > 0;

                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectSuggestion(c.name)}
                      className={[
                        'w-full text-left px-4 py-3 text-sm flex items-center justify-between',
                        isActive ? 'bg-slate-50' : 'bg-white',
                        'hover:bg-slate-50 transition',
                      ].join(' ')}
                    >
                      <span className="font-medium text-gray-900">{c.name}</span>

                      {isHiring && (
                        <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Hiring now
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
