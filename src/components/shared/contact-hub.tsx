'use client'

/**
 * Contact Hub - Unified Widget for AI Chat + WhatsApp
 *
 * Floating widget on the right side of the screen that provides:
 * - AI Chat Assistant (Assistente Versati Glass)
 * - WhatsApp direct contact
 *
 * Features:
 * - Collapsed state: Shows only icons stacked vertically
 * - Expanded state: Shows full chat interface OR WhatsApp options
 * - Integrates with AI-CHAT system (Phases 1-4)
 * - Prepared for Phase 5: WhatsApp context sharing
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Bot, PhoneCall } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatAssistido } from '@/components/chat/chat-assistido'
import Image from 'next/image'

interface ContactHubProps {
  /** Show only on specific pages (default: show everywhere) */
  showOnPages?: 'all' | 'public' | 'orcamento'
}

type ActiveView = 'closed' | 'ai-chat' | 'whatsapp-menu'

export function ContactHub({ showOnPages = 'all' }: ContactHubProps) {
  const [activeView, setActiveView] = useState<ActiveView>('closed')

  // WhatsApp business number (get from env)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'

  const openWhatsApp = (context?: string) => {
    const message = context
      ? `Olá! Estou vindo do site da Versati Glass. ${context}`
      : 'Olá! Estou vindo do site da Versati Glass.'

    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
  }

  return (
    <>
      {/* Main Hub - Fixed Position on Right Side */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence mode="wait">
          {activeView === 'closed' && (
            <motion.div
              key="contact-buttons"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="flex flex-col gap-3"
            >
              {/* AI Chat Button */}
              <motion.button
                onClick={() => setActiveView('ai-chat')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-accent-500 to-gold-500 px-5 py-3 shadow-lg transition-shadow hover:shadow-xl"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/20">
                  <Bot className="h-6 w-6 text-neutral-900" />
                </div>

                {/* Label */}
                <div className="pr-2 text-left">
                  <p className="text-sm font-bold leading-tight text-neutral-900">Assistente</p>
                  <p className="text-xs text-neutral-900/80">Versati Glass</p>
                </div>

                {/* Pulse Animation */}
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
              </motion.button>

              {/* WhatsApp Button */}
              <motion.button
                onClick={() => setActiveView('whatsapp-menu')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 shadow-lg transition-shadow hover:shadow-xl"
              >
                {/* WhatsApp Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>

                {/* Label */}
                <div className="pr-2 text-left">
                  <p className="text-sm font-bold leading-tight text-white">WhatsApp</p>
                  <p className="text-xs text-white/80">Fale conosco</p>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* WhatsApp Menu (quando clica no botão WhatsApp) */}
          {activeView === 'whatsapp-menu' && (
            <motion.div
              key="whatsapp-menu"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-theme-primary border-theme-default w-80 overflow-hidden rounded-2xl border shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-[#25D366] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">WhatsApp</p>
                    <p className="text-xs text-white/80">Escolha uma opção</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveView('closed')}
                  className="rounded-full p-1 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Options */}
              <div className="space-y-2 p-4">
                <button
                  onClick={() => {
                    openWhatsApp('Preciso de ajuda com um orçamento.')
                    setActiveView('closed')
                  }}
                  className="hover:bg-theme-secondary border-theme-default w-full rounded-lg border p-3 text-left transition-colors"
                >
                  <p className="text-sm font-medium text-white">📋 Solicitar Orçamento</p>
                  <p className="text-theme-subtle mt-1 text-xs">Envie detalhes do seu projeto</p>
                </button>

                <button
                  onClick={() => {
                    openWhatsApp('Gostaria de agendar uma visita técnica.')
                    setActiveView('closed')
                  }}
                  className="hover:bg-theme-secondary border-theme-default w-full rounded-lg border p-3 text-left transition-colors"
                >
                  <p className="text-sm font-medium text-white">📅 Agendar Visita</p>
                  <p className="text-theme-subtle mt-1 text-xs">
                    Marque uma visita técnica gratuita
                  </p>
                </button>

                <button
                  onClick={() => {
                    openWhatsApp('Tenho dúvidas sobre produtos.')
                    setActiveView('closed')
                  }}
                  className="hover:bg-theme-secondary border-theme-default w-full rounded-lg border p-3 text-left transition-colors"
                >
                  <p className="text-sm font-medium text-white">❓ Tirar Dúvidas</p>
                  <p className="text-theme-subtle mt-1 text-xs">Pergunte sobre nossos produtos</p>
                </button>

                <button
                  onClick={() => {
                    openWhatsApp()
                    setActiveView('closed')
                  }}
                  className="hover:bg-theme-secondary border-theme-default w-full rounded-lg border p-3 text-left transition-colors"
                >
                  <p className="text-sm font-medium text-white">💬 Conversar</p>
                  <p className="text-theme-subtle mt-1 text-xs">Fale direto com nossa equipe</p>
                </button>
              </div>

              {/* Footer */}
              <div className="bg-theme-secondary p-3 text-center">
                <p className="text-theme-subtle text-xs">
                  Ou use nosso{' '}
                  <button
                    onClick={() => setActiveView('ai-chat')}
                    className="font-medium text-accent-500 hover:text-accent-600"
                  >
                    Assistente IA
                  </button>{' '}
                  para atendimento instantâneo
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Chat Component (quando clica no botão AI) */}
        {activeView === 'ai-chat' && (
          <ChatAssistido onClose={() => setActiveView('closed')} showInitially={true} />
        )}
      </div>
    </>
  )
}
