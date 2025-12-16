'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WhatsAppButtonProps {
  className?: string
}

const WHATSAPP_NUMBER = '+5521982536229'
const DEFAULT_MESSAGE = 'Olá! Gostaria de fazer um orçamento.'

export function WhatsAppButton({ className }: WhatsAppButtonProps) {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`
    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'flex items-center justify-center',
        'h-14 w-14 rounded-full',
        'bg-[#25D366] text-white shadow-lg hover:shadow-xl',
        'transition-all duration-200 hover:scale-110',
        'animate-pulse',
        className
      )}
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  )
}
