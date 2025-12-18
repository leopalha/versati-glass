'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CONSENT_KEY = 'versati-cookie-consent'
const CONSENT_VERSION = '1.0'

interface ConsentState {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  version: string
  timestamp: number
}

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true, // Always true - required
    analytics: false,
    marketing: false,
    version: CONSENT_VERSION,
    timestamp: 0,
  })

  useEffect(() => {
    // Check if consent was already given
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as ConsentState
      // Show banner if version changed
      if (parsed.version !== CONSENT_VERSION) {
        setShowBanner(true)
      } else {
        // Apply stored consent
        applyConsent(parsed)
      }
    } else {
      // First visit - show banner after delay
      const timer = setTimeout(() => setShowBanner(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const applyConsent = (consentState: ConsentState) => {
    // Enable/disable analytics
    if (consentState.analytics) {
      // Google Analytics
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: unknown }).gtag) {
        ;(window as unknown as { gtag: (cmd: string, key: string, val: unknown) => void }).gtag(
          'consent',
          'update',
          {
            analytics_storage: 'granted',
          }
        )
      }
    }

    // Enable/disable marketing
    if (consentState.marketing) {
      // Meta Pixel, etc.
      if (typeof window !== 'undefined' && (window as unknown as { fbq?: unknown }).fbq) {
        ;(window as unknown as { fbq: (cmd: string, action: string) => void }).fbq(
          'consent',
          'grant'
        )
      }
    }
  }

  const saveConsent = (consentState: ConsentState) => {
    const state = { ...consentState, timestamp: Date.now() }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
    applyConsent(state)
    setShowBanner(false)
  }

  const acceptAll = () => {
    const fullConsent: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    }
    saveConsent(fullConsent)
  }

  const acceptNecessary = () => {
    const necessaryOnly: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    }
    saveConsent(necessaryOnly)
  }

  const savePreferences = () => {
    saveConsent(consent)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-4xl rounded-lg border border-neutral-700 bg-neutral-900 p-4 shadow-xl sm:p-6">
        {!showDetails ? (
          // Simple banner
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Cookie className="mt-1 h-5 w-5 shrink-0 text-gold-500" />
              <div>
                <p className="text-sm text-white">
                  Usamos cookies para melhorar sua experiencia, analisar o trafego e personalizar
                  anuncios.{' '}
                  <Link href="/privacidade" className="text-gold-500 underline">
                    Saiba mais
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="text-xs"
              >
                Personalizar
              </Button>
              <Button variant="outline" size="sm" onClick={acceptNecessary} className="text-xs">
                Apenas Necessarios
              </Button>
              <Button size="sm" onClick={acceptAll} className="text-xs">
                Aceitar Todos
              </Button>
            </div>
          </div>
        ) : (
          // Detailed preferences
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-white">
                Preferencias de Cookies
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-start justify-between rounded-lg border border-neutral-700 p-3">
                <div>
                  <h4 className="font-medium text-white">Cookies Necessarios</h4>
                  <p className="text-sm text-neutral-400">
                    Essenciais para o funcionamento do site. Nao podem ser desativados.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.necessary}
                  disabled
                  className="mt-1 h-5 w-5 rounded"
                />
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between rounded-lg border border-neutral-700 p-3">
                <div>
                  <h4 className="font-medium text-white">Cookies de Analytics</h4>
                  <p className="text-sm text-neutral-400">
                    Nos ajudam a entender como voce usa o site para melhorar a experiencia.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                  className="mt-1 h-5 w-5 rounded"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between rounded-lg border border-neutral-700 p-3">
                <div>
                  <h4 className="font-medium text-white">Cookies de Marketing</h4>
                  <p className="text-sm text-neutral-400">
                    Usados para exibir anuncios relevantes em outras plataformas.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                  className="mt-1 h-5 w-5 rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={acceptNecessary}>
                Apenas Necessarios
              </Button>
              <Button size="sm" onClick={savePreferences}>
                Salvar Preferencias
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
