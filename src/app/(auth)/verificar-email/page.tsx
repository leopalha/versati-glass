'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'

function VerificarEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const result = await response.json()

        if (response.ok) {
          setStatus('success')
          toast({
            variant: 'success',
            title: 'Email Verificado!',
            description: 'Sua conta foi verificada com sucesso.',
          })
          // Redirecionar para login após 3 segundos
          setTimeout(() => router.push('/login'), 3000)
        } else {
          setStatus('error')
          setErrorMessage(result.error || 'Erro ao verificar email')
        }
      } catch {
        setStatus('error')
        setErrorMessage('Ocorreu um erro ao verificar seu email')
      }
    }

    verifyEmail()
  }, [token, router, toast])

  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Será pego da sessão se logado
      })

      if (response.ok) {
        toast({
          variant: 'success',
          title: 'Email enviado!',
          description: 'Um novo email de verificacao foi enviado.',
        })
      } else {
        toast({
          variant: 'error',
          title: 'Erro',
          description: 'Nao foi possivel enviar o email. Tente novamente.',
        })
      }
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Ocorreu um erro ao enviar o email',
      })
    } finally {
      setIsResending(false)
    }
  }

  // Loading
  if (status === 'loading') {
    return (
      <Card className="w-full max-w-md p-8 text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-accent-500" />
        <h1 className="text-theme-primary mb-2 font-display text-2xl font-bold">Verificando...</h1>
        <p className="text-theme-muted">Aguarde enquanto verificamos seu email</p>
      </Card>
    )
  }

  // Sucesso
  if (status === 'success') {
    return (
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-theme-primary mb-2 font-display text-2xl font-bold">
          Email Verificado!
        </h1>
        <p className="text-theme-muted mb-6">
          Sua conta foi verificada com sucesso.
          <br />
          Voce sera redirecionado para o login...
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Ir para Login</Link>
        </Button>
      </Card>
    )
  }

  // Erro
  if (status === 'error') {
    return (
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-theme-primary mb-2 font-display text-2xl font-bold">
          Verificacao Falhou
        </h1>
        <p className="text-theme-muted mb-6">{errorMessage}</p>
        <div className="space-y-3">
          <Button onClick={handleResendVerification} disabled={isResending} className="w-full">
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Solicitar Novo Email'
            )}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Voltar para Login</Link>
          </Button>
        </div>
      </Card>
    )
  }

  // Sem token (acesso direto à página)
  return (
    <Card className="w-full max-w-md p-8 text-center">
      <div className="bg-accent-500/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <Mail className="h-8 w-8 text-accent-400" />
      </div>
      <h1 className="text-theme-primary mb-2 font-display text-2xl font-bold">
        Verifique seu Email
      </h1>
      <p className="text-theme-muted mb-6">
        Enviamos um email de verificacao para sua conta.
        <br />
        Clique no link do email para verificar.
      </p>
      <div className="space-y-3">
        <Button onClick={handleResendVerification} disabled={isResending} className="w-full">
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Reenviar Email de Verificacao'
          )}
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Voltar para Login</Link>
        </Button>
      </div>
    </Card>
  )
}

export default function VerificarEmailPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent-500" />
        </Card>
      }
    >
      <VerificarEmailContent />
    </Suspense>
  )
}
