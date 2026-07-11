// Fix for Next.js 15.3.1 TypeScript issues with App Router pages
// This file ensures TypeScript accepts the correct params shape

import type { ReactNode } from 'react';

declare module 'next' {
  export interface PageProps {
    children?: ReactNode;
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  }
}