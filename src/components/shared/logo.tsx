import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'default' | 'white'
}

export function Logo({ className, variant = 'default' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* V */}
        <path
          d="M8 8L14 28L20 8"
          stroke={variant === 'white' ? '#FFFFFF' : '#C9A962'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* G */}
        <path
          d="M26 8C22 8 20 10 20 14C20 18 22 20 26 20H32M26 20C26 20 26 24 26 28C26 30 28 32 32 32"
          stroke={variant === 'white' ? '#FFFFFF' : '#C9A962'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Borda externa */}
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="8"
          stroke={variant === 'white' ? '#FFFFFF' : '#C9A962'}
          strokeWidth="2"
        />
      </svg>
      <span className={cn(
        'font-display text-2xl font-semibold',
        variant === 'white' ? 'text-white' : 'text-gold-500'
      )}>
        Versati Glass
      </span>
    </div>
  )
}
