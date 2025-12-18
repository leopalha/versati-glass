'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, MessageCircle, Copy, Check } from 'lucide-react'
import QRCode from 'qrcode'

interface WhatsAppTransferCardProps {
  phoneNumber: string
  sessionId: string
  conversationId: string
  onClose?: () => void
}

export function WhatsAppTransferCard({
  phoneNumber,
  sessionId,
  conversationId,
  onClose,
}: WhatsAppTransferCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // WhatsApp business number (configure in .env)
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5521999999999'

  // Generate deep link with session context
  const deepLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá! Estava conversando no site (Sessão: ${sessionId.slice(0, 8)}). Quero continuar por aqui.`
  )}`

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(deepLink, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      setQrCodeUrl(url)
      setShowQR(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying link:', error)
    }
  }

  const openWhatsApp = () => {
    window.open(deepLink, '_blank')
  }

  return (
    <Card className="mx-auto max-w-md border-green-200 bg-gradient-to-br from-green-50 to-white p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">Continuar no WhatsApp?</h3>
          <p className="mt-1 text-sm text-gray-600">
            Continue essa conversa no WhatsApp para resposta mais rápida!
          </p>

          <div className="mt-4 space-y-2">
            {/* Desktop: Direct link */}
            <Button onClick={openWhatsApp} className="w-full bg-green-600 hover:bg-green-700">
              <MessageCircle className="mr-2 h-4 w-4" />
              Abrir no WhatsApp
            </Button>

            {/* Mobile: QR Code */}
            <Button onClick={generateQRCode} variant="outline" className="w-full">
              <QrCode className="mr-2 h-4 w-4" />
              {showQR ? 'Esconder QR Code' : 'Mostrar QR Code'}
            </Button>

            {/* Copy Link */}
            <Button onClick={copyLink} variant="ghost" className="w-full text-sm">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Link
                </>
              )}
            </Button>
          </div>

          {/* QR Code Display */}
          {showQR && qrCodeUrl && (
            <div className="mt-4 rounded-lg border-2 border-green-200 bg-white p-4">
              <p className="mb-2 text-center text-xs text-gray-600">Escaneie com seu celular:</p>
              <img
                src={qrCodeUrl}
                alt="QR Code WhatsApp"
                className="mx-auto w-full max-w-[200px]"
              />
              <p className="mt-2 text-center text-xs text-gray-500">
                Sessão: {sessionId.slice(0, 12)}...
              </p>
            </div>
          )}

          {/* Info */}
          <p className="mt-3 text-xs text-gray-500">💡 Seu histórico de conversa será preservado</p>

          {onClose && (
            <button
              onClick={onClose}
              className="mt-2 text-xs text-gray-400 underline hover:text-gray-600"
            >
              Continuar no site
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
