/**
 * Sentry Server Configuration
 *
 * Configura o Sentry para monitoramento de erros no servidor (server-side).
 *
 * Referência: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Define sample rate for transactions (performance monitoring)
  // 1.0 = 100% of transactions, 0.1 = 10%
  // Ajustar para 0.1 em produção para reduzir custos
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Capturar erros não tratados
  integrations: [
    // Prisma integration (se disponível)
    Sentry.prismaIntegration(),
  ],

  // Ignora erros conhecidos que não são acionáveis
  ignoreErrors: [
    // Prisma errors esperados
    'P2002', // Unique constraint violation (esperado em alguns casos)
    'P2025', // Record not found (esperado quando deletando)
    // Next.js expected errors
    'NEXT_NOT_FOUND',
    'NEXT_REDIRECT',
  ],

  // Adicionar contexto útil aos eventos
  beforeSend(event, hint) {
    // Em desenvolvimento, não enviar para Sentry
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry Server]', hint.originalException || hint.syntheticException)
      return null
    }

    // Adicionar informações úteis ao evento
    if (event.request) {
      // Remover informações sensíveis
      if (event.request.headers) {
        delete event.request.headers['authorization']
        delete event.request.headers['cookie']
      }
    }

    return event
  },
})
