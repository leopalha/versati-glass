'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/toast/use-toast'
import { formatPhone } from '@/lib/utils'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
    email: z.string().email('Email invalido'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Voce deve aceitar os termos de uso',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
          </div>
        </Card>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/portal'
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: 'error',
          title: 'Erro ao cadastrar',
          description: result.error || 'Ocorreu um erro ao criar sua conta',
        })
        return
      }

      // Auto login after registration
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        toast({
          variant: 'success',
          title: 'Conta criada!',
          description: 'Faca login para continuar',
        })
        router.push('/login')
      } else if (signInResult?.ok) {
        toast({
          variant: 'success',
          title: 'Bem-vindo!',
          description: 'Sua conta foi criada com sucesso',
        })
        // Redirect to the page the user came from (or portal)
        router.push(redirectUrl)
        router.refresh()
      }
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Ocorreu um erro ao criar sua conta',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: redirectUrl })
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Erro ao conectar com Google',
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('phone', formatted)
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <h1 className="text-theme-primary mb-2 font-display text-3xl font-bold">Criar Conta</h1>
        <p className="text-theme-muted">Cadastre-se para acompanhar seus pedidos</p>
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-theme-primary mb-1 block text-sm font-medium">
            Nome completo
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Digite seu nome completo"
            aria-label="Nome completo"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-error" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

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

        <div>
          <label htmlFor="phone" className="text-theme-primary mb-1 block text-sm font-medium">
            Telefone <span className="text-theme-subtle">(opcional)</span>
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="(21) 98253-6229"
            aria-label="Telefone"
            {...register('phone')}
            onChange={handlePhoneChange}
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="text-theme-primary mb-1 block text-sm font-medium">
            Senha
          </label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 6 caracteres"
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

        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="text-theme-primary mb-1 block text-sm font-medium"
          >
            Confirmar senha
          </label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Digite a senha novamente"
            aria-label="Confirmar senha"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          <button
            type="button"
            className="hover:text-theme-primary absolute right-3 top-[38px] -translate-y-1/2 text-neutral-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'
            }
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="mt-1 text-sm text-error" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="acceptTerms"
            checked={watch('acceptTerms')}
            onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
            disabled={isLoading}
          />
          <label htmlFor="acceptTerms" className="text-theme-muted text-sm">
            Li e aceito os{' '}
            <Link href="/termos" className="text-accent-400 hover:text-accent-300">
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link href="/privacidade" className="text-accent-400 hover:text-accent-300">
              Politica de Privacidade
            </Link>
          </label>
        </div>
        {errors.acceptTerms && <p className="text-sm text-error">{errors.acceptTerms.message}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar Conta'
          )}
        </Button>
      </form>

      <p className="text-theme-muted mt-6 text-center text-sm">
        Ja tem uma conta?{' '}
        <Link href="/login" className="text-accent-400 hover:text-accent-300">
          Entrar
        </Link>
      </p>
    </Card>
  )
}
