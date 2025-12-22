import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { cookies } from 'next/headers'

/**
 * Debug endpoint to test token extraction in API context
 */
export async function GET(request: NextRequest) {
  try {
    // Get all cookies first for debugging
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    // Try different cookie names that NextAuth might use
    const possibleCookieNames = [
      '__Secure-authjs.session-token',
      'authjs.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.session-token',
    ]

    const foundCookies = possibleCookieNames.map(name => ({
      name,
      found: allCookies.some(c => c.name === name),
      value: allCookies.find(c => c.name === name)?.value?.substring(0, 50),
    }))

    // Get the secret being used
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

    // Try to get token with explicit cookie name
    const tokenDefault = await getToken({
      req: request,
      secret,
    })

    // Try with explicit cookie name for secure
    const tokenSecure = await getToken({
      req: request,
      secret,
      cookieName: '__Secure-authjs.session-token',
    })

    // Try with non-secure name
    const tokenNonSecure = await getToken({
      req: request,
      secret,
      cookieName: 'authjs.session-token',
    })

    return NextResponse.json({
      tokenDefault: tokenDefault ? { id: tokenDefault.id, email: tokenDefault.email, role: tokenDefault.role } : null,
      tokenSecure: tokenSecure ? { id: tokenSecure.id, email: tokenSecure.email, role: tokenSecure.role } : null,
      tokenNonSecure: tokenNonSecure ? { id: tokenNonSecure.id, email: tokenNonSecure.email, role: tokenNonSecure.role } : null,
      cookies: allCookies.map(c => ({
        name: c.name,
        valueLength: c.value?.length,
      })),
      foundCookies,
      secrets: {
        AUTH_SECRET_SET: !!process.env.AUTH_SECRET,
        NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
        secretLength: secret?.length,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get token',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
