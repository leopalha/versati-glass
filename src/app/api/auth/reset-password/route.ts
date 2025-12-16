import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const resetSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = resetSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Email invalido' }, { status: 400 })
    }

    const { email } = parsed.data
    const normalizedEmail = email.toLowerCase()

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save token to user (you'd need to add these fields to your schema)
    // For now, we'll just log it
    console.log(`Password reset requested for ${email}`)
    console.log(`Reset token: ${resetToken}`)
    console.log(`Expires: ${resetTokenExpiry}`)

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
