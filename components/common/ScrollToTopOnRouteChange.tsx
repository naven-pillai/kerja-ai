'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' }); // or 'smooth' if preferred
  }, [pathname]);

  return null;
}