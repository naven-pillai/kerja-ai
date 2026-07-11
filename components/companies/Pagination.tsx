'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

function getPageItems(page: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items: Array<number | '...'> = [];
  const left = Math.max(2, page - 1);
  const right = Math.min(totalPages - 1, page + 1);

  items.push(1);

  if (left > 2) items.push('...');

  for (let p = left; p <= right; p++) items.push(p);

  if (right < totalPages - 1) items.push('...');

  items.push(totalPages);

  return items;
}

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  className?: string;
};

export default function Pagination({ page, totalPages, onPageChange, className = '' }: Props) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pageItems = getPageItems(page, totalPages);

  const baseBtn =
    'inline-flex items-center justify-center rounded-xl border text-sm font-semibold transition select-none';
  const enabled =
    'bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-slate-50 cursor-pointer';
  const disabled = 'bg-white border-gray-200 text-gray-500 cursor-not-allowed opacity-60';
  const active = 'bg-gray-900 border-gray-900 text-white cursor-pointer';
  const ghost = 'border-transparent bg-transparent text-gray-500';

  return (
    <nav className={['flex items-center justify-center pt-2', className].join(' ')} aria-label="Pagination">
      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        {/* Prev */}
        <button
          type="button"
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className={[baseBtn, 'h-10 w-10', canPrev ? enabled : disabled].join(' ')}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Pages (desktop) */}
        <div className="hidden sm:flex items-center gap-1.5 px-1">
          {pageItems.map((it, idx) => {
            if (it === '...') {
              return (
                <span key={`dots-${idx}`} className={[baseBtn, ghost, 'h-10 px-3'].join(' ')} aria-hidden="true">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isActive = it === page;
            return (
              <button
                key={it}
                type="button"
                onClick={() => onPageChange(it)}
                className={[baseBtn, 'h-10 min-w-[40px] px-3', isActive ? active : enabled].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                {it}
              </button>
            );
          })}
        </div>

        {/* Mobile: x / total */}
        <div className="sm:hidden px-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{page}</span> / {totalPages}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className={[baseBtn, 'h-10 w-10', canNext ? enabled : disabled].join(' ')}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
