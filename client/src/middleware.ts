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

  if (pathname.includes('.') || pathname.startsWith('/_next')) return NextResponse.next()

  let lng
  const cookie = req.cookies.get(cookieName);
  if (cookie?.value) lng = acceptLanguage.get(cookie.value) ?? undefined;
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  const lngInPath = languages.find(loc => pathname.startsWith(`/${loc}`))

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-pathname", req.nextUrl.pathname)

  if (pathname.startsWith('/app') || (lngInPath && pathname.startsWith(`/${lngInPath}/app`))) {
    if (lngInPath) {
      const cleanPath = pathname.replace(new RegExp(`^/${lngInPath}`), '');
      const response = NextResponse.redirect(new URL(cleanPath, req.url))
      response.cookies.set(cookieName, lngInPath);
      return response;
    }

    const url = req.nextUrl.clone()
    url.pathname = `/${lng}${pathname}`
    requestHeaders.set(headerName, lng)


    const response = NextResponse.rewrite(url, {headers: requestHeaders})
    if (!cookie?.value || cookie.value !== lng) {
      response.cookies.set(cookieName, lng)
    }
    return response
  }

  if (!lngInPath) {
    return NextResponse.redirect(new URL(`/${lng}${pathname}${req.nextUrl.search}`, req.url))
  }

  requestHeaders.set(headerName, lngInPath)
  return NextResponse.next({headers: requestHeaders})
}