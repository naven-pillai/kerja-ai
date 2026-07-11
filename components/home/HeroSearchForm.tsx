'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const QUICK_SEARCHES = [
  { term: 'AI Engineering',    bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   hover: 'hover:bg-blue-100' },
  { term: 'Machine Learning',  bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
  { term: 'Data Science',      bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-200',   hover: 'hover:bg-pink-100' },
  { term: 'Data Engineering',  bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',hover: 'hover:bg-emerald-100' },
  { term: 'Prompt Engineering',bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  hover: 'hover:bg-amber-100' },
];

export default function HeroSearchForm() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  const handleQuickSearch = (term: string) => {
    router.push(`/jobs?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl mx-auto mb-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'AI Engineer', 'Data Scientist', or a company..."
            className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1D4ED8] text-white px-5 py-3.5 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition shrink-0"
        >
          Search
        </button>
      </form>

      {/* Quick search pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {QUICK_SEARCHES.map(({ term, bg, text, border, hover }) => (
          <button
            key={term}
            onClick={() => handleQuickSearch(term)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition cursor-pointer ${bg} ${text} ${border} ${hover}`}
          >
            {term}
          </button>
        ))}
      </div>
    </>
  );
}
