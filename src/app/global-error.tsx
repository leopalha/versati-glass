'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Global error:', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          {/* Decorative */}
          <div className="absolute inset-0 overflow-hidden" style={{ position: 'absolute' }}>
            <div
              className="absolute h-80 w-80 rounded-full blur-3xl"
              style={{
                top: '-10rem',
                left: '25%',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
              }}
            />
          </div>

          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Error Icon */}
            <div
              style={{
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '50%',
                  padding: '1.5rem',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h1
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1rem',
              }}
            >
              Erro Critico
            </h1>
            <p
              style={{
                maxWidth: '28rem',
                margin: '0 auto 2rem',
                color: '#9ca3af',
              }}
            >
              Ocorreu um erro critico na aplicacao. Por favor, tente recarregar a pagina.
            </p>

            {error.digest && (
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#4b5563',
                  marginBottom: '2rem',
                }}
              >
                Codigo: {error.digest}
              </p>
            )}

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={reset}
                style={{
                  backgroundColor: '#d4a853',
                  color: 'black',
                  fontWeight: '500',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                Tentar Novamente
              </button>

              <a
                href="/"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #404040',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Voltar ao Inicio
              </a>
            </div>

            {/* WhatsApp Help */}
            <div style={{ marginTop: '3rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                Precisa de ajuda?
              </p>
              <a
                href="https://wa.me/5521982536229"
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp (21) 98253-6229
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
