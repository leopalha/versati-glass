'use client'

import { useState, useCallback } from 'react'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logger, getErrorMessage } from '@/lib/logger'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { HARDWARE_COLORS } from '@/lib/catalog-options'

// Tipos de ferragens disponíveis
const HARDWARE_TYPES = [
  { id: 'DOBRADICA', name: 'Dobradiça', hasCode: true },
  { id: 'PIVO', name: 'Pivô', hasCode: true },
  { id: 'FECHADURA', name: 'Fechadura/Trinco', hasCode: true },
  { id: 'CONTRA_FECHADURA', name: 'Contra-Fechadura', hasCode: true },
  { id: 'ROLDANA', name: 'Roldana', hasCode: false },
  { id: 'TRILHO', name: 'Trilho', hasCode: false },
  { id: 'PUXADOR', name: 'Puxador', hasCode: false },
  { id: 'BOTAO', name: 'Botão/Fixador', hasCode: false },
  { id: 'MOLA', name: 'Mola', hasCode: false },
  { id: 'ACESSORIO', name: 'Acessório de Acabamento', hasCode: false },
] as const

// Códigos específicos por tipo
const HARDWARE_CODES = {
  DOBRADICA: [
    { code: '1101', name: 'Superior sem pino' },
    { code: '1101J', name: 'Superior jumbo' },
    { code: '1103', name: 'Inferior' },
    { code: '1103J', name: 'Inferior jumbo' },
    { code: '1110', name: 'Suporte basculante grande' },
    { code: '1230', name: 'Suporte basculante pequeno' },
  ],
  PIVO: [
    { code: '1013', name: 'Inferior' },
    { code: '1201', name: 'Superior' },
    { code: '1201A', name: 'Superior ajustável' },
  ],
  FECHADURA: [
    { code: '1500', name: 'Trinco simples' },
    { code: '1520', name: 'Fechadura central' },
    { code: '1523', name: 'Trinco basculante' },
    { code: '1560', name: 'Livre/Ocupado' },
    { code: '1800', name: 'Trinco janela correr' },
  ],
  CONTRA_FECHADURA: [
    { code: '1504', name: 'Vidro/Alvenaria' },
    { code: '1506', name: 'Vidro/Vidro' },
    { code: '1589', name: 'Guia de descanso maxim-ar' },
  ],
}

export function StepDetailsFerragens() {
  const {
    currentItem,
    addItem,
    editingIndex,
    saveEditItem,
    cancelEditItem,
    nextStep,
    prevStep,
    items,
    selectedProducts,
    clearSelectedProducts,
    productsToDetail,
    currentProductIndex,
    getCurrentProductToDetail,
    nextProductToDetail,
    allProductsDetailed,
    setProductsToDetail,
  } = useQuoteStore()
  const { toast } = useToast()

  const isEditing = editingIndex !== null
  const existingItem = isEditing ? items[editingIndex] : null

  // Get current product being detailed
  const currentProduct = isEditing ? null : getCurrentProductToDetail()
  const totalProducts = productsToDetail.length
  const productNumber = currentProductIndex + 1

  const [uploadingImages, setUploadingImages] = useState(false)

  // Estados do formulário
  const [hardwareType, setHardwareType] = useState(existingItem?.hardwareType || '')
  const [hardwareCode, setHardwareCode] = useState(existingItem?.hardwareCode || '')
  const [quantity, setQuantity] = useState(existingItem?.quantity?.toString() || '1')
  const [color, setColor] = useState(existingItem?.color || '')
  const [description, setDescription] = useState(existingItem?.description || '')
  const [images, setImages] = useState<string[]>(existingItem?.images || [])

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
      } catch (error) {
        const errorMsg = getErrorMessage(error)
        logger.error('[FERRAGENS] Failed to upload images:', { error: errorMsg })

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
    // Validação de quantidade mínima
    const quantityNum = parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum < 1) {
      toast({
        variant: 'error',
        title: 'Quantidade invalida',
        description: 'A quantidade deve ser no minimo 1',
      })
      return
    }

    // Validação de tipo de ferragem
    if (!hardwareType) {
      toast({
        variant: 'error',
        title: 'Dados incompletos',
        description: 'Selecione o tipo de ferragem',
      })
      return
    }

    // Validação de código (se aplicável)
    const selectedType = HARDWARE_TYPES.find((t) => t.id === hardwareType)
    if (selectedType?.hasCode && !hardwareCode) {
      toast({
        variant: 'error',
        title: 'Dados incompletos',
        description: 'Selecione o código/modelo da ferragem',
      })
      return
    }

    // Construir descrição
    const selectedTypeName = HARDWARE_TYPES.find((t) => t.id === hardwareType)?.name
    const selectedCodeName = hardwareCode
      ? HARDWARE_CODES[hardwareType as keyof typeof HARDWARE_CODES]?.find(
          (c) => c.code === hardwareCode
        )?.name
      : null

    const descParts = [selectedTypeName]
    if (selectedCodeName) descParts.push(`${hardwareCode} - ${selectedCodeName}`)
    if (color) descParts.push(HARDWARE_COLORS.find((c) => c.id === color)?.name || color)

    const itemData = {
      productId: currentProduct?.id || currentItem?.productId || '',
      productName: currentProduct?.name || currentItem?.productName || '',
      productSlug: currentProduct?.slug || currentItem?.productSlug || '',
      category: 'FERRAGENS',
      quantity: parseInt(quantity) || 1,
      color: color || undefined,
      description: description || descParts.filter(Boolean).join(' - '),
      images,
      // Campos específicos de ferragens
      hardwareType,
      hardwareCode: hardwareCode || undefined,
    }

    if (isEditing) {
      saveEditItem(itemData)
    } else {
      addItem(itemData)

      if (allProductsDetailed()) {
        logger.debug('All products detailed, going to cart')
        setProductsToDetail([])
        clearSelectedProducts()
        nextStep()
      } else {
        logger.debug(`Product ${productNumber} of ${totalProducts} detailed, moving to next`)
        nextProductToDetail()

        // Clear form for next product
        setHardwareType('')
        setHardwareCode('')
        setQuantity('1')
        setColor('')
        setDescription('')
        setImages([])
      }
    }
  }

  const handleBack = () => {
    prevStep()
  }

  const handleCancel = () => {
    if (isEditing) {
      cancelEditItem()
    }
  }

  const productToDisplay = isEditing ? existingItem : currentProduct

  if (!productToDisplay || (!isEditing && !currentProduct)) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-6">
          <div className="space-y-4 text-center">
            <p className="text-theme-primary text-lg font-medium">Nenhum produto para detalhar</p>
            <p className="text-theme-muted">
              Por favor, volte e selecione produtos antes de continuar.
            </p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Obter códigos disponíveis para o tipo selecionado
  const availableCodes =
    hardwareType && HARDWARE_CODES[hardwareType as keyof typeof HARDWARE_CODES]
      ? HARDWARE_CODES[hardwareType as keyof typeof HARDWARE_CODES]
      : []

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">
          {isEditing ? 'Editar item' : 'Ferragens Avulsas'}
        </h2>
        <p className="text-theme-muted mt-2">
          Informe o tipo, código e quantidade das ferragens
        </p>
        {!isEditing && totalProducts > 0 && (
          <p className="mt-2 text-sm font-medium text-accent-400">
            Produto {productNumber} de {totalProducts}
          </p>
        )}
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Product Name */}
          <div className="bg-theme-elevated rounded-lg p-4">
            <p className="text-theme-muted text-sm">Produto selecionado:</p>
            <p className="text-theme-primary font-display text-lg font-semibold">
              {currentProduct?.name || currentItem?.productName || productToDisplay.productName}
            </p>
          </div>

          {/* Tipo de Ferragem */}
          <div>
            <label className="text-theme-muted mb-1 block text-sm">Tipo de Ferragem *</label>
            <Select value={hardwareType} onValueChange={setHardwareType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {HARDWARE_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Código/Modelo (condicional) */}
          {hardwareType && HARDWARE_TYPES.find((t) => t.id === hardwareType)?.hasCode && (
            <div>
              <label className="text-theme-muted mb-1 block text-sm">Código/Modelo *</label>
              <Select value={hardwareCode} onValueChange={setHardwareCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o código" />
                </SelectTrigger>
                <SelectContent>
                  {availableCodes.map((code) => (
                    <SelectItem key={code.code} value={code.code}>
                      {code.code} - {code.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantidade e Cor */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quantity" className="text-theme-muted mb-1 block text-sm">
                Quantidade *
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

            <div>
              <label className="text-theme-muted mb-1 block text-sm">Acabamento/Cor</label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {HARDWARE_COLORS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
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
              placeholder="Detalhes adicionais sobre a ferragem..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-theme-muted mb-2 block text-sm">Fotos (opcional)</label>
            <p className="text-theme-subtle mb-3 text-xs">
              Envie fotos da ferragem. Max 5 imagens, 5MB cada.
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
        </div>
        <Button onClick={handleContinue}>
          {isEditing
            ? 'Salvar Alteracoes'
            : allProductsDetailed()
              ? 'Adicionar e Ir pro Carrinho'
              : `Próximo Produto (${productNumber}/${totalProducts})`}
        </Button>
      </div>
    </div>
  )
}
