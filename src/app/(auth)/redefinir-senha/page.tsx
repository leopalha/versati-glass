'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'

const resetSchema = z
  .object({
    password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  })

type ResetFormData = z.infer<typeof resetSchema>

function RedefinirSenhaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  useEffect(() => {
    if (!token) {
      toast({
        variant: 'error',
        title: 'Token invalido',
        description: 'O link de recuperacao e invalido ou expirou.',
      })
    }
  }, [token, toast])

  const onSubmit = async (data: ResetFormData) => {
    if (!token) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast({
          variant: 'success',
          title: 'Senha alterada!',
          description: 'Sua senha foi redefinida com sucesso.',
        })
        // Redirecionar para login após 3 segundos
        setTimeout(() => router.push('/login'), 3000)
      } else {
        toast({
          variant: 'error',
          title: 'Erro',
          description: result.error || 'Erro ao redefinir senha',
        })
      }
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Ocorreu um erro ao processar sua solicitacao',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Token inválido
  if (!token) {
    return (
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-theme-primary mb-2 font-display text-2xl font-bold">Link Invalido</h1>
        <p className="text-theme-muted mb-6">
          O link de recuperacao de senha e invalido ou expirou.
          <br />
          Solicite um novo link.
        </p>
        <Button asChild className="w-full">
          <Link href="/recuperar-senha">Solicitar Novo Link</Link>
        </Button>
      </Card>
    )
  }

  // Sucesso
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-theme-primary mb-2 font-display text-2xl font-bold">Senha Alterada!</h1>
        <p className="text-theme-muted mb-6">
          Sua senha foi redefinida com sucesso.
          <br />
          Voce sera redirecionado para o login...
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ir para Login
          </Link>
        </Button>
      </Card>
    )
  }

  // Formulário
  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <h1 className="text-theme-primary mb-2 font-display text-3xl font-bold">Nova Senha</h1>
        <p className="text-theme-muted">Digite sua nova senha abaixo</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nova senha"
            {...register('password')}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
        </div>

        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar nova senha"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redefinindo...
            </>
          ) : (
            'Redefinir Senha'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-accent-400 hover:text-accent-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Login
        </Link>
      </div>
    </Card>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent-500" />
        </Card>
      }
    >
      <RedefinirSenhaContent />
    </Suspense>
  )
}
