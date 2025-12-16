'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'white'
  showText?: boolean
}

// Gold color is always used for the logo across all themes
const LOGO_GOLD = '#C9A962'

export function Logo({ className, variant = 'default', showText = true }: LogoProps) {
  // Logo is always gold, except when explicitly set to white
  const strokeColor = variant === 'white' ? '#FFFFFF' : LOGO_GOLD

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Opção 1: Minimalista - V e G separados com traços limpos */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Borda externa com cantos arredondados */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="8"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />

        {/* V - simples e limpo */}
        <path
          d="M8 14L16 34L24 14"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* G - formato clássico com barra */}
        <path
          d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
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
}

// Componente separado para o ícone (favicon/app icon)
export function LogoIcon({
  className,
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="2" width="44" height="44" rx="8" stroke={color} strokeWidth="2" fill="none" />
      <path
        d="M8 14L16 34L24 14"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
