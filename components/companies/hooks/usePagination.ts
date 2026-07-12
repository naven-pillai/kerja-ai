'use client';

import { useMemo } from 'react';

/**
 * Returns the clamped page alongside the slice.
 *
 * The caller used to hold an unclamped `page` in state and correct it from an
 * effect after the filters changed — which meant one frame was painted showing
 * page 7 of a 3-page result (i.e. nothing) before it snapped back. Clamping
 * here makes the out-of-range page unrepresentable instead of correcting it
 * after the fact.
 */
export function usePagination<T>(items: T[], page: number, perPage: number) {
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / perPage)),
    [items.length, perPage]
  );

  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, safePage, perPage]);

  return { totalPages, paginated, page: safePage };
}
