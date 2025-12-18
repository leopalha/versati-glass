'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, MessageCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-center">
      {/* Decorative glass effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-6">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-4 font-display text-3xl font-bold text-white sm:text-4xl">
          Algo deu errado
        </h1>
        <p className="mx-auto mb-2 max-w-md text-neutral-400">
          Desculpe, ocorreu um erro inesperado. Nossa equipe ja foi notificada e estamos trabalhando
          para resolver.
        </p>

        {error.digest && (
          <p className="mb-8 text-xs text-neutral-600">Codigo do erro: {error.digest}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="lg">
            <RefreshCw className="mr-2 h-5 w-5" />
            Tentar Novamente
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Voltar ao Inicio
            </Link>
          </Button>
        </div>

        {/* Help */}
        <div className="mt-12">
          <p className="mb-4 text-sm text-neutral-500">
            Se o problema persistir, entre em contato:
          </p>
          <Link
            href="https://wa.me/5521982536229"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp (21) 98253-6229
          </Link>
        </div>
      </div>
    </div>
  )
}
