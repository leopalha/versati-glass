'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Email ou senha incorretos')
      }

      return result
    },
    []
  )

  const loginWithGoogle = useCallback(async (callbackUrl?: string) => {
    await signIn('google', { callbackUrl: callbackUrl || '/portal' })
  }, [])

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }, [router])

  const updateSession = useCallback(
    async (data: Partial<{ name: string; phone: string }>) => {
      await update(data)
    },
    [update]
  )

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    updateSession,
  }
}

export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo)
  }

  return { isLoading, isAuthenticated }
}

export function useRequireAdmin() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (!isLoading && user?.role !== 'ADMIN') {
    router.push('/portal')
  }

  return { isLoading, isAdmin: user?.role === 'ADMIN' }
}
