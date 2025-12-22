import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

/**
 * Test Login API - For debugging authentication issues
 * This endpoint tests the login flow step by step
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const results: Record<string, unknown> = {
      step1_input: { email, passwordLength: password?.length },
    }

    // Step 1: Find user
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

    results.step2_userFound = !!user
    if (!user) {
      results.error = 'User not found'
      return NextResponse.json(results)
    }

    results.step3_userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      authProvider: user.authProvider,
    }

    // Step 2: Check password
    if (!user.password) {
      results.error = 'User has no password (probably Google user)'
      return NextResponse.json(results)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    results.step4_passwordValid = isValidPassword

    if (!isValidPassword) {
      results.error = 'Invalid password'
      return NextResponse.json(results)
    }

    results.success = true
    results.message = 'Login would succeed - credentials are valid'

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
