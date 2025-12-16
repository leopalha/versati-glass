'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
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
      } else {
        toast({
          variant: 'success',
          title: 'Bem-vindo!',
          description: 'Sua conta foi criada com sucesso',
        })
        router.push('/portal')
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
      await signIn('google', { callbackUrl: '/portal' })
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
        <h1 className="mb-2 font-display text-3xl font-bold text-white">
          Criar Conta
        </h1>
        <p className="text-neutral-400">
          Cadastre-se para acompanhar seus pedidos
        </p>
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
          <span className="w-full border-t border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-neutral-150 px-2 text-neutral-500">ou</span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Nome completo"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            type="tel"
            placeholder="Telefone (opcional)"
            {...register('phone')}
            onChange={handlePhoneChange}
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            {...register('password')}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          {errors.password && (
            <p className="mt-1 text-sm text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar senha"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="acceptTerms"
            checked={watch('acceptTerms')}
            onCheckedChange={(checked) =>
              setValue('acceptTerms', checked as boolean)
            }
            disabled={isLoading}
          />
          <label htmlFor="acceptTerms" className="text-sm text-neutral-400">
            Li e aceito os{' '}
            <Link href="/termos" className="text-gold-400 hover:text-gold-300">
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link
              href="/privacidade"
              className="text-gold-400 hover:text-gold-300"
            >
              Politica de Privacidade
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-error">{errors.acceptTerms.message}</p>
        )}

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

      <p className="mt-6 text-center text-sm text-neutral-400">
        Ja tem uma conta?{' '}
        <Link href="/login" className="text-gold-400 hover:text-gold-300">
          Entrar
        </Link>
      </p>
    </Card>
  )
}
