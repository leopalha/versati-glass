'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Verificar limite
    if (images.length + files.length > maxImages) {
      setError(`Máximo de ${maxImages} imagens permitidas`)
      return
    }

    setUploading(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Verificar tipo
        if (!file.type.startsWith('image/')) {
          setError('Apenas imagens são permitidas')
          continue
        }

        // Verificar tamanho (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setError('Imagem muito grande (máximo 5MB)')
          continue
        }

        // Upload para API
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Erro ao fazer upload')
        }

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      onChange([...images, ...uploadedUrls])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer upload'
      setError(message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)

    if (images.length + files.length > maxImages) {
      setError(`Máximo de ${maxImages} imagens permitidas`)
      return
    }

    // Simular seleção de arquivo
    const dt = new DataTransfer()
    files.forEach((file) => dt.items.add(file))

    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files
      await handleFileSelect({
        target: fileInputRef.current,
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-4">
      {/* Grid de imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-600 bg-neutral-900"
            >
              <Image src={url} alt={`Imagem ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs font-medium text-white">Principal</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Área de upload */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-600 bg-neutral-900 p-8 text-center transition-colors hover:border-gold-500 hover:bg-neutral-800"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <>
              <Loader2 className="mb-3 h-12 w-12 animate-spin text-gold-500" />
              <p className="text-sm font-medium text-white">Fazendo upload...</p>
            </>
          ) : (
            <>
              <ImageIcon className="mb-3 h-12 w-12 text-neutral-500" />
              <p className="mb-2 text-sm font-medium text-white">
                Arraste imagens ou clique para selecionar
              </p>
              <p className="mb-4 text-xs text-neutral-400">
                PNG, JPG ou WEBP (máx. 5MB cada) • {images.length}/{maxImages} imagens
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Selecionar Imagens
              </Button>
            </>
          )}
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Ajuda */}
      <p className="text-xs text-neutral-400">
        A primeira imagem será usada como miniatura principal do produto.
        {images.length > 0 && ' Arraste para reordenar (em breve).'}
      </p>
    </div>
  )
}
