'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  showSkeleton?: boolean
  alt: string
}

export function OptimizedImage({
  showSkeleton = true,
  className,
  alt,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {showSkeleton && isLoading && <Skeleton className={className} />}
      <Image
        {...props}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        quality={85}
      />
    </>
  )
}
