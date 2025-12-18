'use client'

import { memo } from 'react'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CONTACT } from '@/lib/constants'

interface WhatsAppButtonProps {
  className?: string
}

const DEFAULT_MESSAGE = 'Olá! Gostaria de fazer um orçamento.'

export const WhatsAppButton = memo(function WhatsAppButton({ className }: WhatsAppButtonProps) {
  const url = `https://wa.me/${CONTACT.phoneWhatsApp}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'flex items-center justify-center',
        'h-14 w-14 rounded-full',
        'bg-[#25D366] text-white shadow-lg hover:shadow-xl',
        'transition-all duration-200 hover:scale-110',
        'animate-pulse',
        className
      )}
      aria-label="WhatsApp - Fale conosco"
      title="Fale conosco no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
})
