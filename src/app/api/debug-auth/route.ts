import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

/**
 * Debug Auth API - For debugging authentication issues in production
 * This endpoint shows the entire auth state and tests credentials
 */
export async function GET(request: NextRequest) {
  try {
    // Get all auth-related cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const authCookies = allCookies.filter(c =>
      c.name.includes('auth') ||
      c.name.includes('session') ||
      c.name.includes('csrf') ||
      c.name.includes('next-auth')
    )

    // Get all users (without passwords)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        authProvider: true,
        createdAt: true,
      },
    })

    // Environment check
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      AUTH_SECRET: process.env.AUTH_SECRET ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authCookies: authCookies.map(c => ({ name: c.name, valueLength: c.value?.length })),
      users,
      envCheck,
      requestUrl: request.url,
      hostHeader: request.headers.get('host'),
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json()

    if (action === 'test-credentials') {
      // Test if credentials are valid
      const user = await prisma.user.findUnique({
        where: { email: email?.toLowerCase() },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true,
          authProvider: true,
        },
      })

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' })
      }

      if (!user.password) {
        return NextResponse.json({
          success: false,
          error: 'No password set',
          authProvider: user.authProvider
        })
      }

      const isValid = await bcrypt.compare(password, user.password)

      return NextResponse.json({
        success: isValid,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          authProvider: user.authProvider,
        },
        passwordHashLength: user.password.length,
      })
    }

    if (action === 'list-users') {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          authProvider: true,
          password: true,
        },
      })

      return NextResponse.json({
        users: users.map(u => ({
          ...u,
          hasPassword: !!u.password,
          password: undefined,
        })),
      })
    }

    return NextResponse.json({ error: 'Invalid action' })
  } catch (error) {
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
