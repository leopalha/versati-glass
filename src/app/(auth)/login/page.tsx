'use client'

import { logger, getErrorMessage } from '@/lib/logger'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'

const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Get callbackUrl from query params (used when redirected from protected route)
  const callbackUrlParam = searchParams.get('callbackUrl')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  // Helper function to get redirect URL based on user role
  const getRedirectUrl = (role: string, callbackUrl?: string | null): string => {
    // Always prioritize role-based redirect
    const roleBasedUrl = role === 'ADMIN' || role === 'STAFF' ? '/admin' : '/portal'

    // If there's a specific callbackUrl (user was redirected from a protected page)
    // and it's not a base portal/admin route, use the specific callback
    if (callbackUrl && !callbackUrl.match(/^\/(portal|admin)$/)) {
      // But ensure admin doesn't go to /portal/* and customer doesn't go to /admin/*
      if (callbackUrl.startsWith('/admin') && role !== 'ADMIN' && role !== 'STAFF') {
        return '/portal'
      }
      if (callbackUrl.startsWith('/portal') && (role === 'ADMIN' || role === 'STAFF')) {
        return '/admin'
      }
      return callbackUrl
    }

    return roleBasedUrl
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      logger.debug('[LOGIN] Attempting login with:', { email: data.email })

      // Validate credentials first
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      logger.debug('[LOGIN] SignIn result:', result)

      if (result?.error && result?.error !== 'Configuration') {
        logger.error('[LOGIN] SignIn error:', result.error)
        toast({
          variant: 'error',
          title: 'Erro ao entrar',
          description: 'Email ou senha incorretos',
        })
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Login successful - poll for session before redirecting
        logger.debug('[LOGIN] Login successful, polling for session...')

        let attempts = 0
        const maxAttempts = 10
        const pollInterval = 300

        const checkSession = async (): Promise<void> => {
          attempts++
          logger.debug(`[LOGIN] Checking session (attempt ${attempts}/${maxAttempts})`)

          const session = await getSession()

          if (session?.user) {
            // Get the correct redirect URL based on user role
            const redirectUrl = getRedirectUrl(session.user.role, callbackUrlParam)
            logger.debug(
              `[LOGIN] Session confirmed, user role: ${session.user.role}, redirecting to: ${redirectUrl}`
            )

            toast({
              variant: 'success',
              title: 'Login realizado!',
              description: `Bem-vindo(a), ${session.user.name || 'usuário'}!`,
            })

            // Small delay to show toast before redirect
            setTimeout(() => {
              window.location.href = redirectUrl
            }, 500)
            return
          }

          if (attempts < maxAttempts) {
            setTimeout(() => checkSession(), pollInterval)
          } else {
            logger.error('[LOGIN] Session polling timeout, forcing redirect to /portal')
            window.location.href = '/portal'
          }
        }

        // Start polling
        await checkSession()
      }
    } catch (error) {
      logger.error('[LOGIN] Login failed:', error)

      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Ocorreu um erro ao fazer login',
      })
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      // For Google OAuth, redirect to /portal - middleware will handle role-based redirect
      // If user is admin, middleware will redirect to /admin automatically
      const redirectUrl = callbackUrlParam || '/portal'
      logger.debug('[LOGIN] Starting Google sign-in with redirect:', redirectUrl)
      await signIn('google', { callbackUrl: redirectUrl })
    } catch (error) {
      // ARCH-P1-2: Standardized error handling
      const errorMsg = getErrorMessage(error)
      logger.error('[LOGIN] Google sign-in failed:', { error: errorMsg })

      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Erro ao conectar com Google',
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <h1 className="text-theme-primary mb-2 font-display text-3xl font-bold">Entrar</h1>
        <p className="text-theme-muted">Acesse sua conta para acompanhar seus pedidos</p>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="mb-6 w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Continuar com Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="border-theme-default w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-theme-secondary text-theme-subtle px-2">ou</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-theme-primary mb-1 block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu email"
            aria-label="Email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="password" className="text-theme-primary mb-1 block text-sm font-medium">
            Senha
          </label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            aria-label="Senha"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
            disabled={isLoading}
          />
          <button
            type="button"
            className="hover:text-theme-primary absolute right-3 top-[38px] -translate-y-1/2 text-neutral-600"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar senha digitada' : 'Mostrar senha digitada'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="text-right">
          <Link href="/recuperar-senha" className="text-sm text-accent-400 hover:text-accent-300">
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>

      <p className="text-theme-muted mt-6 text-center text-sm">
        Nao tem uma conta?{' '}
        <Link href="/registro" className="text-accent-400 hover:text-accent-300">
          Cadastre-se
        </Link>
      </p>
    </Card>
  )
}

function LoginLoading() {
  return (
    <Card className="w-full max-w-md p-8">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent-400" />
      </div>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}
