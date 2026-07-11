// middleware.js

import { NextResponse } from 'next/server';

export function middleware(req) {
  const country = req.geo?.country || 'DEFAULT';

  const res = NextResponse.next();

  // Set cookie only if not already set
  if (!req.cookies.get('country')) {
    res.cookies.set('country', country, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|api|static).*)'],
};
