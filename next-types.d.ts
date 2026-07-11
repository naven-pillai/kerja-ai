// This file overrides Next.js type definitions to fix the typing issue
import React from 'react';

declare module 'next' {
  export interface PageProps {
    params?: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}

// This ensures the PageProps interface doesn't require params to be a Promise
declare global {
  namespace NodeJS {
    interface Process {
      // Add anything needed by the process global
    }
  }
}