import { type NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import type { Role } from '@prisma/client'
import { logger } from '@/lib/logger'

declare module 'next-auth' {
  interface User {
    role: Role
    phone?: string | null
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      role: Role
      phone?: string | null
    }
  }
  interface JWT {
    id: string
    role: Role
    phone?: string | null
  }
}

const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
})

// Check if Google OAuth is properly configured (not mock values)
const isGoogleConfigured =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !process.env.GOOGLE_CLIENT_ID.includes('mock') &&
  process.env.GOOGLE_CLIENT_ID.endsWith('.apps.googleusercontent.com')

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    newUser: '/registro',
  },
  providers: [
    // Only add Google provider if properly configured
    ...(isGoogleConfigured
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        logger.debug('[AUTH] Starting authorization', { email: credentials?.email })

        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          logger.error('[AUTH] Validation failed', parsed.error)
          return null
        }

        const { email, password } = parsed.data
        logger.debug('[AUTH] Credentials validated', { email })

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })

        if (!user || !user.password) {
          logger.error('[AUTH] User not found or no password', {
            email: email.toLowerCase(),
            found: !!user,
          })
          return null
        }

        logger.debug('[AUTH] User found', { email: user.email, hasPassword: !!user.password })

        const isValidPassword = await bcrypt.compare(password, user.password)
        logger.debug('[AUTH] Password comparison result', { isValid: isValidPassword })

        if (!isValidPassword) {
          logger.error('[AUTH] Invalid password')
          return null
        }

        logger.debug('[AUTH] Authentication successful', { userId: user.id, email: user.email })
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: null,
          role: user.role,
          phone: user.phone,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      logger.debug('[AUTH] JWT callback', { hasUser: !!user, trigger })

      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.phone = user.phone
        logger.debug('[AUTH] JWT - User added to token', { userId: user.id, role: user.role })
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name
        token.phone = session.phone
      }

      return token
    },
    async session({ session, token }) {
      logger.debug('[AUTH] Session callback', { hasToken: !!token })

      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.phone = token.phone as string | null | undefined
        logger.debug('[AUTH] Session created', { userId: session.user.id, role: session.user.role })
      }
      return session
    },
    async signIn({ user, account }) {
      logger.debug('[AUTH] SignIn callback', { provider: account?.provider, userId: user?.id })

      // Allow OAuth sign in
      if (account?.provider !== 'credentials') {
        return true
      }
      // Credentials sign in handled in authorize
      return true
    },
  },
  events: {
    async createUser({ user }) {
      // Log new user creation
      logger.debug(`New user created: ${user.email}`)
    },
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        logger.debug(`New user signed in: ${user.email}`)
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
