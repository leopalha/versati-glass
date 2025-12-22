import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { cookies } from 'next/headers'

/**
 * Debug endpoint to test token extraction in API context
 */
export async function GET(request: NextRequest) {
  try {
    // Get token the same way middleware does
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    })

    // Get all cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    return NextResponse.json({
      hasToken: !!token,
      token: token ? {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        exp: token.exp,
      } : null,
      cookies: allCookies.map(c => ({
        name: c.name,
        valueLength: c.value?.length,
      })),
      secrets: {
        AUTH_SECRET: process.env.AUTH_SECRET ? 'SET' : 'NOT SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get token',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
