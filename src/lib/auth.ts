import { type NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
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
  adapter: PrismaAdapter(prisma) as any,
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
            authorization: {
              params: {
                prompt: 'select_account', // Always show account selector
              },
            },
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
    async redirect({ url, baseUrl }) {
      // If URL starts with base, check if it's a simple redirect
      if (url.startsWith(baseUrl)) {
        return url
      }
      // For relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Default fallback
      return baseUrl
    },
    async jwt({ token, user, trigger, session, account }) {
      logger.debug('[AUTH] JWT callback', {
        hasUser: !!user,
        trigger,
        provider: account?.provider,
        currentTokenRole: token.role,
      })

      // Initial sign in - user object is available
      if (user) {
        // For OAuth users, fetch role from database
        if (account?.provider === 'google') {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email?.toLowerCase() },
            select: { id: true, role: true, phone: true },
          })

          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
            token.phone = dbUser.phone
            logger.debug('[AUTH] JWT - Google user role set', {
              userId: dbUser.id,
              role: dbUser.role,
            })
          } else {
            // New Google user - default to CUSTOMER
            token.role = 'CUSTOMER'
            logger.debug('[AUTH] JWT - New Google user, defaulting to CUSTOMER')
          }
        } else {
          // For credentials users - role comes from authorize()
          token.id = user.id as string
          token.role = user.role
          token.phone = user.phone
          logger.debug('[AUTH] JWT - Credentials user role set', {
            userId: user.id,
            role: user.role,
          })
        }
      }

      // Ensure role is always set - fallback to database lookup if missing
      if (!token.role && token.email) {
        logger.debug('[AUTH] JWT - Role missing, fetching from database...')
        const dbUser = await prisma.user.findUnique({
          where: { email: (token.email as string).toLowerCase() },
          select: { id: true, role: true, phone: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.phone = dbUser.phone
          logger.debug('[AUTH] JWT - Role fetched from DB as fallback', {
            userId: dbUser.id,
            role: dbUser.role,
          })
        }
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name
        token.phone = session.phone
      }

      logger.debug('[AUTH] JWT - Final token state', { userId: token.id, role: token.role })
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
    async signIn({ user, account, profile }) {
      logger.debug('[AUTH] SignIn callback', {
        provider: account?.provider,
        userId: user?.id,
        email: user?.email,
      })

      // Handle OAuth sign in (Google)
      if (account?.provider === 'google') {
        try {
          // Check if user exists in our database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email?.toLowerCase() },
          })

          if (!existingUser) {
            // Create new user with CUSTOMER role
            await prisma.user.create({
              data: {
                email: user.email!.toLowerCase(),
                name: user.name || 'Usuário Google',
                role: 'CUSTOMER',
                emailVerified: new Date(),
                authProvider: 'GOOGLE',
              },
            })
            logger.debug('[AUTH] New Google user created', { email: user.email })
          } else {
            logger.debug('[AUTH] Existing Google user found', {
              email: user.email,
              role: existingUser.role,
            })
          }
        } catch (error) {
          logger.error('[AUTH] Error handling Google sign in', { error })
          return false
        }
      }

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
