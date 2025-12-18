import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication
const protectedRoutes = ['/portal', '/admin']
const authRoutes = ['/login', '/registro', '/recuperar-senha', '/redefinir-senha']
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Get token (works in edge runtime)
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  })

  // If accessing auth routes while logged in, redirect to appropriate dashboard
  if (isAuthRoute && token) {
    const redirectUrl = token.role === 'ADMIN' || token.role === 'STAFF' ? '/admin' : '/portal'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // If accessing protected routes without session, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing admin routes without admin/staff role
  if (isAdminRoute && token?.role !== 'ADMIN' && token?.role !== 'STAFF') {
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*|_next).*)',
  ],
}
