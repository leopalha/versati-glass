'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'

const resetSchema = z.object({
  email: z.string().email('Email invalido'),
})

type ResetFormData = z.infer<typeof resetSchema>

export default function RecuperarSenhaPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        toast({
          variant: 'error',
          title: 'Erro',
          description: 'Ocorreu um erro ao enviar o email',
        })
      }
    } catch {
      // Always show success to prevent email enumeration
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md p-8 text-center">
        <div className="bg-accent-500/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <Mail className="h-8 w-8 text-accent-400" />
        </div>
        <h1 className="text-theme-primary mb-2 font-display text-2xl font-bold">Email Enviado!</h1>
        <p className="text-theme-muted mb-6">
          Se o email estiver cadastrado, voce recebera as instrucoes para redefinir sua senha.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Login
          </Link>
        </Button>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <h1 className="text-theme-primary mb-2 font-display text-3xl font-bold">Recuperar Senha</h1>
        <p className="text-theme-muted">
          Digite seu email para receber as instrucoes de recuperacao
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input type="email" placeholder="Email" {...register('email')} disabled={isLoading} />
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Email'
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
