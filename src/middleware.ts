import { NextRequest, NextResponse } from 'next/server';
import { COUNTRY_CODES, DEFAULT_COUNTRY, COUNTRY_COOKIE } from '@/lib/countries';

const AUTH_ROUTES   = ['/dashboard', '/rfq', '/notifications'];
const ADMIN_ROUTES  = ['/admin'];
const SUPER_ROUTES  = ['/superadmin'];
const DEV_ROUTES    = ['/dev'];
const SEO_ROUTES    = ['/dashboard/seo'];
const TRADER_ROUTES = ['/inventory'];
const CONTENT_MANAGER_BLOCKED = ['/dashboard/settings', '/dashboard/users'];

const STATIC_PREFIXES = ['/_next', '/api', '/favicon', '/images', '/og-image', '/logo', '/assets', '/data', '/sw.js', '/manifest.webmanifest'];
const NO_COUNTRY_PAGES = ['/login', '/register', '/unauthorized', '/categories'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static / API routes
  if (STATIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Already on a country route → pass through
  const firstSegment = pathname.split('/')[1];
  if (COUNTRY_CODES.includes(firstSegment)) {
    return NextResponse.next();
  }

  // Get country from cookie or default
  const country = request.cookies.get(COUNTRY_COOKIE)?.value || DEFAULT_COUNTRY;

  // Auth/admin routes — existing logic (no country rewrite)
  const requiresAuth    = AUTH_ROUTES.some((r)   => pathname.startsWith(r));
  const requiresAdmin   = ADMIN_ROUTES.some((r)  => pathname.startsWith(r));
  const requiresSuper   = SUPER_ROUTES.some((r)  => pathname.startsWith(r));
  const requiresDev     = DEV_ROUTES.some((r)    => pathname.startsWith(r));
  const requiresSEO     = SEO_ROUTES.some((r)    => pathname.startsWith(r));
  const requiresTrader  = TRADER_ROUTES.some((r) => pathname.startsWith(r));

  if (requiresAuth || requiresAdmin || requiresSuper || requiresDev || requiresSEO || requiresTrader) {
    const role = request.cookies.get('ats_role')?.value;

    if (!role) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (requiresDev && role !== 'Dev')                                      return NextResponse.redirect(new URL('/unauthorized', request.url));
    if (requiresSuper && role !== 'SuperAdmin' && role !== 'Dev')           return NextResponse.redirect(new URL('/unauthorized', request.url));
    if (requiresAdmin && role !== 'Admin' && role !== 'SuperAdmin' && role !== 'Dev') return NextResponse.redirect(new URL('/unauthorized', request.url));
    if (requiresSEO && role !== 'SEOManager' && role !== 'Admin' && role !== 'SuperAdmin' && role !== 'Dev') return NextResponse.redirect(new URL('/unauthorized', request.url));
    if (requiresTrader && role !== 'Trader' && role !== 'Admin' && role !== 'SuperAdmin' && role !== 'Dev') return NextResponse.redirect(new URL('/unauthorized', request.url));

    if (role === 'ContentManager' && CONTENT_MANAGER_BLOCKED.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // Pages that should never get country prefix
  if (NO_COUNTRY_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Rewrite all public pages to country version
  const url = new URL(`/${country}${pathname}`, request.url);
  url.search = request.nextUrl.search;
  const response = NextResponse.rewrite(url);
  response.headers.set('x-original-path', pathname);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon|images|logo|og-image|assets|data|sw\\.js|manifest\\.webmanifest).*)',
  ],
};
