'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'

const TooltipProvider = TooltipPrimitive.Provider

const TooltipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100 shadow-md',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

/**
 * Compound Tooltip component for easy usage
 */
interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delayDuration = 200,
  className,
}: TooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}

/**
 * NBR Tooltip - Displays technical norm information
 */
interface NBRTooltipProps {
  title: string
  description: string
  nbrReference?: string
  children?: React.ReactNode
  className?: string
}

export function NBRTooltip({
  title,
  description,
  nbrReference,
  children,
  className,
}: NBRTooltipProps) {
  return (
    <Tooltip
      content={
        <div className="max-w-xs space-y-1">
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-neutral-300">{description}</p>
          {nbrReference && (
            <p className="mt-1 text-xs font-medium text-accent-400">{nbrReference}</p>
          )}
        </div>
      }
      side="right"
      delayDuration={300}
      className={className}
    >
      {children || (
        <button
          type="button"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-neutral-700 text-neutral-300 hover:bg-neutral-600 hover:text-white"
          aria-label="Informação sobre norma técnica"
        >
          <Info className="h-3 w-3" />
        </button>
      )}
    </Tooltip>
  )
}

/**
 * Validation Tooltip - Shows validation result with color coding
 */
interface ValidationTooltipProps {
  message: string
  severity: 'info' | 'warning' | 'error'
  recommendation?: string
  nbrReference?: string
  children?: React.ReactNode
}

export function ValidationTooltip({
  message,
  severity,
  recommendation,
  nbrReference,
  children,
}: ValidationTooltipProps) {
  const severityColors = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  }

  const severityBg = {
    info: 'bg-blue-900/20 border-blue-700',
    warning: 'bg-yellow-900/20 border-yellow-700',
    error: 'bg-red-900/20 border-red-700',
  }

  return (
    <Tooltip
      content={
        <div className={cn('max-w-sm space-y-2 rounded p-2', severityBg[severity])}>
          <p className={cn('font-semibold', severityColors[severity])}>{message}</p>
          {recommendation && <p className="text-xs text-neutral-300">{recommendation}</p>}
          {nbrReference && (
            <p className="mt-1 text-xs font-medium text-neutral-400">{nbrReference}</p>
          )}
        </div>
      }
      side="right"
      delayDuration={300}
    >
      {children || (
        <div
          className={cn(
            'ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full',
            severity === 'error' && 'bg-red-500/20 text-red-400',
            severity === 'warning' && 'bg-yellow-500/20 text-yellow-400',
            severity === 'info' && 'bg-blue-500/20 text-blue-400'
          )}
        >
          <Info className="h-3 w-3" />
        </div>
      )}
    </Tooltip>
  )
}

export { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent }
