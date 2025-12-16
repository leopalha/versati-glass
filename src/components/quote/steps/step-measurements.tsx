'use client'

import { useState, useCallback } from 'react'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'
import { ArrowLeft, Upload, X } from 'lucide-react'

export function StepMeasurements() {
  const { items, updateItem, nextStep, prevStep } = useQuoteStore()
  const { toast } = useToast()
  const item = items[0]
  const [uploadingImages, setUploadingImages] = useState(false)

  const [width, setWidth] = useState(item?.width?.toString() || '')
  const [height, setHeight] = useState(item?.height?.toString() || '')
  const [quantity, setQuantity] = useState(item?.quantity?.toString() || '1')
  const [color, setColor] = useState(item?.color || '')
  const [finish, setFinish] = useState(item?.finish || '')
  const [thickness, setThickness] = useState(item?.thickness || '')
  const [description, setDescription] = useState(item?.description || '')
  const [images, setImages] = useState<string[]>(item?.images || [])

  // Color options based on category
  const colorOptions = [
    { value: 'Preto', label: 'Preto' },
    { value: 'Branco', label: 'Branco' },
    { value: 'Inox', label: 'Inox' },
    { value: 'Bronze', label: 'Bronze' },
    { value: 'Dourado', label: 'Dourado' },
  ]

  const finishOptions = [
    { value: 'Liso', label: 'Liso' },
    { value: 'Lapidado', label: 'Lapidado' },
    { value: 'Bisote', label: 'Bisote' },
  ]

  const thicknessOptions = [
    { value: '4mm', label: '4mm' },
    { value: '6mm', label: '6mm' },
    { value: '8mm', label: '8mm' },
    { value: '10mm', label: '10mm' },
  ]

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      if (images.length + files.length > 5) {
        toast({
          variant: 'error',
          title: 'Limite de imagens',
          description: 'Voce pode enviar no maximo 5 imagens',
        })
        return
      }

      setUploadingImages(true)

      try {
        // For now, we'll use base64 encoding. In production, this should be uploaded to a proper storage service
        const newImages: string[] = []
        const fileArray = Array.from(files)

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i]
          if (file.size > 5 * 1024 * 1024) {
            toast({
              variant: 'error',
              title: 'Arquivo muito grande',
              description: `${file.name} excede o limite de 5MB`,
            })
            continue
          }

          const reader = new FileReader()
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })

          newImages.push(base64)
        }

        setImages((prev) => [...prev, ...newImages])
      } catch {
        toast({
          variant: 'error',
          title: 'Erro',
          description: 'Erro ao fazer upload das imagens',
        })
      } finally {
        setUploadingImages(false)
      }
    },
    [images.length, toast]
  )

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    // Validate required fields
    if (!width || !height) {
      toast({
        variant: 'error',
        title: 'Dados incompletos',
        description: 'Informe a largura e altura',
      })
      return
    }

    const widthNum = parseFloat(width)
    const heightNum = parseFloat(height)

    if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
      toast({
        variant: 'error',
        title: 'Medidas invalidas',
        description: 'As medidas devem ser valores positivos',
      })
      return
    }

    updateItem(0, {
      width: widthNum,
      height: heightNum,
      quantity: parseInt(quantity) || 1,
      color: color || undefined,
      finish: finish || undefined,
      thickness: thickness || undefined,
      description: description || `${item?.productName} - ${widthNum}m x ${heightNum}m`,
      images,
    })

    nextStep()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">Medidas e detalhes</h2>
        <p className="text-theme-muted mt-2">Informe as dimensoes e caracteristicas do produto</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Product Name */}
          <div className="bg-theme-elevated rounded-lg p-4">
            <p className="text-theme-muted text-sm">Produto selecionado:</p>
            <p className="text-theme-primary font-display text-lg font-semibold">
              {item?.productName}
            </p>
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="width" className="text-theme-muted mb-1 block text-sm">
                Largura (metros)
              </label>
              <Input
                id="width"
                type="number"
                step="0.01"
                placeholder="Ex: 1.20"
                aria-label="Largura"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="height" className="text-theme-muted mb-1 block text-sm">
                Altura (metros)
              </label>
              <Input
                id="height"
                type="number"
                step="0.01"
                placeholder="Ex: 1.90"
                aria-label="Altura"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="text-theme-muted mb-1 block text-sm">
              Quantidade
            </label>
            <Input
              id="quantity"
              type="number"
              min="1"
              aria-label="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-theme-muted mb-1 block text-sm">Cor da ferragem</label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-theme-muted mb-1 block text-sm">Acabamento</label>
              <Select value={finish} onValueChange={setFinish}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {finishOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-theme-muted mb-1 block text-sm">Espessura</label>
              <Select value={thickness} onValueChange={setThickness}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {thicknessOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-theme-muted mb-1 block text-sm">Observacoes adicionais</label>
            <textarea
              className="bg-theme-elevated text-theme-primary placeholder:text-theme-subtle w-full rounded-lg border border-neutral-600 px-4 py-3 focus:border-accent-500 focus:outline-none"
              rows={3}
              placeholder="Descreva detalhes adicionais do seu pedido..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-theme-muted mb-2 block text-sm">Fotos do local (opcional)</label>
            <p className="text-theme-subtle mb-3 text-xs">
              Envie fotos para ajudar na avaliacao. Max 5 imagens, 5MB cada.
            </p>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 5 && (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-600 p-6 transition-colors hover:border-accent-500">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
                {uploadingImages ? (
                  <span className="text-theme-muted">Enviando...</span>
                ) : (
                  <>
                    <Upload className="text-theme-muted h-5 w-5" />
                    <span className="text-theme-muted">Clique para enviar fotos</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handleContinue}>Continuar</Button>
      </div>
    </div>
  )
}
