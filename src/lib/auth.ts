import { PrismaAdapter } from '@auth/prisma-adapter'
import { type NextAuthConfig } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import type { Role } from '@prisma/client'

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

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    newUser: '/registro',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          return null
        }

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })

        if (!user || !user.password) {
          return null
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          return null
        }

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
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.phone = user.phone
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name
        token.phone = session.phone
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.phone = token.phone as string | null | undefined
      }
      return session
    },
    async signIn({ account }) {
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
      console.log(`New user created: ${user.email}`)
    },
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        console.log(`New user signed in: ${user.email}`)
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
