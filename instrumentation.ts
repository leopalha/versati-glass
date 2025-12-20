/**
 * Next.js Instrumentation
 *
 * Este arquivo é executado automaticamente pelo Next.js quando o servidor inicia.
 * Usado para configurar ferramentas de monitoramento como Sentry.
 *
 * Referência: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Sentry é carregado apenas em produção
  // Em desenvolvimento, os erros são logados no console (ver sentry configs)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
    await import('./sentry.edge.config')
  }
}
