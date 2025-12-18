import { memo } from 'react'
import { cn } from '@/lib/utils'

const Skeleton = memo(function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-neutral-800', className)} {...props} />
})

export { Skeleton }
