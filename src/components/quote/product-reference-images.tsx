'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import {
  getImagesForCategory,
  getImagesForSubcategory,
  type ProductImage,
} from '@/lib/product-images'
import { ImageIcon, X, ZoomIn } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { logger } from '@/lib/logger'

interface ProductReferenceImagesProps {
  category: string
  subcategory?: string
  model?: string
  className?: string
  maxImages?: number
  showTitle?: boolean
}

export function ProductReferenceImages({
  category,
  subcategory,
  model,
  className = '',
  maxImages = 4,
  showTitle = true,
}: ProductReferenceImagesProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null)

  // Normalize category to uppercase (catalog uses uppercase)
  const normalizedCategory = category?.toUpperCase() || ''

  // Get relevant images
  const images =
    subcategory || model
      ? getImagesForSubcategory(normalizedCategory, subcategory || model || '')
      : getImagesForCategory(normalizedCategory)

  const displayImages = images.slice(0, maxImages)

  // Debug log
  logger.debug('[PRODUCT-REF-IMAGES] Rendering', {
    originalCategory: category,
    normalizedCategory,
    subcategory,
    model,
    totalImages: images.length,
    displayImages: displayImages.length,
  })

  if (displayImages.length === 0) {
    return null
  }

  return (
    <>
      <Card className={`bg-theme-elevated p-4 ${className}`}>
        {showTitle && (
          <div className="mb-3 flex items-center gap-2">
            <ImageIcon className="text-theme-muted h-5 w-5" />
            <h3 className="text-theme-primary font-semibold">Fotos de Referência</h3>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {displayImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-800 transition-transform hover:scale-105"
              type="button"
            >
              <div className="relative h-full w-full">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  unoptimized
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-6 w-6 text-white" />
              </div>

              {/* Image caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="truncate text-xs text-white">{image.description || image.alt}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-theme-subtle mt-2 text-xs">
          Clique nas imagens para ampliar e ver detalhes
        </p>
      </Card>

      {/* Image zoom modal */}
      <ImageZoomDialog image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  )
}

/**
 * Modal to display zoomed image with details
 */
interface ImageZoomDialogProps {
  image: ProductImage | null
  onClose: () => void
}

function ImageZoomDialog({ image, onClose }: ImageZoomDialogProps) {
  if (!image) return null

  return (
    <AlertDialog open={!!image} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            type="button"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          <AlertDialogTitle className="mb-4 text-xl">{image.alt}</AlertDialogTitle>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-800">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              unoptimized
            />
          </div>

          {image.description && (
            <AlertDialogDescription className="mt-4 text-center">
              {image.description}
            </AlertDialogDescription>
          )}

          <div className="text-theme-subtle mt-2 text-center text-sm">
            Categoria: {image.category}
            {image.subcategory && ` • ${image.subcategory}`}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * Compact inline image carousel (for tight spaces)
 */
interface CompactImageCarouselProps {
  category: string
  subcategory?: string
  maxImages?: number
}

export function CompactImageCarousel({
  category,
  subcategory,
  maxImages = 3,
}: CompactImageCarouselProps) {
  // Normalize category to uppercase
  const normalizedCategory = category?.toUpperCase() || ''

  const images = subcategory
    ? getImagesForSubcategory(normalizedCategory, subcategory)
    : getImagesForCategory(normalizedCategory)

  const displayImages = images.slice(0, maxImages)

  if (displayImages.length === 0) {
    return null
  }

  return (
    <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
      {displayImages.map((image) => (
        <div
          key={image.id}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-800"
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="80px"
            unoptimized
          />
        </div>
      ))}
    </div>
  )
}
