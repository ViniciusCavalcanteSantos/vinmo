import {NextRequest, NextResponse} from 'next/server'
import acceptLanguage from 'accept-language'
import {cookieName, fallbackLng, headerName, languages} from '@/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // Avoid matching for static files, API routes, etc.
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.indexOf('icon') > -1 || pathname.indexOf('chrome') > -1) return NextResponse.next()

  let lng
  const cookie = req.cookies.get(cookieName);
  if (cookie?.value) lng = acceptLanguage.get(cookie.value) ?? undefined;
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  const lngInPath = languages.find(loc => pathname.startsWith(`/${loc}`))
  const headers = new Headers(req.headers)
  headers.set(headerName, lngInPath || lng)

  if (
    !lngInPath &&
    !pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${pathname}${req.nextUrl.search}`, req.url))
  }

  const referer = req.headers.get('referer')
  if (referer) {
    const refererUrl = new URL(referer)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next({headers})
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next({headers})
}