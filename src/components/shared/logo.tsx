'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  className?: string
  variant?: 'default' | 'white'
  showText?: boolean
}

// Gold color is always used for the logo across all themes
const LOGO_GOLD = '#C9A962'

export const Logo = memo(function Logo({
  className,
  variant = 'default',
  showText = true,
}: LogoProps) {
  // Filtro CSS para transformar logo preto em dourado ou branco
  const filter =
    variant === 'white'
      ? 'brightness(0) invert(1)' // Branco
      : 'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)' // Dourado

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="/logo-symbol.png"
        alt="Versati Glass"
        className="h-full w-auto"
        style={{ filter }}
      />
      {showText && (
        <span
          className="font-sans text-xl font-light uppercase tracking-[0.25em]"
          style={{ color: variant === 'white' ? '#FFFFFF' : LOGO_GOLD }}
        >
          Versati Glass
        </span>
      )}
    </div>
  )
})

// Componente separado para o ícone (favicon/app icon)
export const LogoIcon = memo(function LogoIcon({
  className,
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  // Filtro CSS baseado na cor solicitada
  const filter =
    color === '#FFFFFF' || color === 'white'
      ? 'brightness(0) invert(1)' // Branco
      : 'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)' // Dourado

  return (
    <img src="/logo-symbol.png" alt="Versati Glass Icon" className={className} style={{ filter }} />
  )
})
