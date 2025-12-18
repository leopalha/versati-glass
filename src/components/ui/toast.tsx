'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'error' | 'success' | 'info'
}

interface ToastProps extends Omit<Toast, 'id'> {
  onClose: () => void
}

export function Toast({ title, description, action, variant = 'default', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const variantStyles = {
    default: 'bg-background border',
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-md rounded-lg shadow-lg transition-all duration-300',
        variantStyles[variant],
        'animate-in slide-in-from-right-full'
      )}
    >
      <div className="flex-1 p-4">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      <div className="flex border-l border-white/10">
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="flex w-full items-center justify-center rounded-r-lg p-4 transition-colors hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed right-0 top-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-auto sm:top-0 sm:flex-col md:max-w-[420px]">
      {children}
    </div>
  )
}
