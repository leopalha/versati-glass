/**
 * Sentry Edge Configuration
 *
 * Configura o Sentry para monitoramento de erros em Edge Runtime
 * (Middleware, Edge API Routes, Edge Functions).
 *
 * Referência: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Define sample rate for transactions (performance monitoring)
  // Edge runtime tem limites de CPU, então mantemos baixo
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Adicionar contexto útil aos eventos
  beforeSend(event, hint) {
    // Em desenvolvimento, não enviar para Sentry
    if (process.env.NODE_ENV === 'development') {
      console.error('[Sentry Edge]', hint.originalException || hint.syntheticException)
      return null
    }

    return event
  },
})
