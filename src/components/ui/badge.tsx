import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gold-500 text-neutral-0',
        gold: 'border-transparent bg-gold-500 text-neutral-0',
        secondary: 'border-transparent bg-neutral-200 text-white',
        outline: 'text-white border-neutral-300',
        success: 'border-transparent bg-success text-white',
        warning: 'border-transparent bg-warning text-white',
        error: 'border-transparent bg-error text-white',
        info: 'border-transparent bg-info text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
