'use client';

import { useMemo } from 'react';

export function usePagination<T>(items: T[], page: number, perPage: number) {
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / perPage)),
    [items.length, perPage]
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  return { totalPages, paginated };
}
