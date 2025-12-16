import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border bg-neutral-250 px-4 py-2 text-sm text-white placeholder:text-neutral-500 transition-all duration-200',
            'focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20',
            'disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500',
            error && 'border-error focus:border-error focus:ring-error/20',
            !error && 'border-neutral-300',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
