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
import { ArrowLeft, Upload, X, Package } from 'lucide-react'
import { HARDWARE_COLORS } from '@/lib/catalog-options'

// Tipos de kits disponíveis
const KIT_TYPES = [
  {
    id: 'BOX_FRONTAL',
    name: 'Kit Box Frontal Simples',
    price: 'R$ 150 - R$ 280',
    components: [
      'Trilho superior',
      'Trilho inferior',
      'Roldanas (2 a 4)',
      'Perfis de acabamento',
      'Borrachas de vedação',
      'Parafusos e buchas',
      'Manual de instalação',
    ],
  },
  {
    id: 'BOX_CANTO',
    name: 'Kit Box de Canto',
    price: 'R$ 200 - R$ 350',
    components: [
      'Trilhos superiores (2)',
      'Perfis de acabamento',
      'Roldanas (4 a 6)',
      'Perfis de 90° (canto)',
      'Borrachas de vedação',
      'Parafusos e buchas',
      'Manual de instalação',
    ],
  },
  {
    id: 'BOX_ROLDANA_APARENTE',
    name: 'Kit Box Roldana Aparente',
    price: 'R$ 300 - R$ 500',
    components: [
      'Trilho U baixo',
      'Roldanas aparentes',
      'Perfis de acabamento',
      'Borrachas de vedação',
      'Parafusos e buchas',
      'Manual de instalação',
    ],
  },
  {
    id: 'ENGENHARIA_BASICO',
    name: 'Kit Engenharia Básico',
    price: 'R$ 120 - R$ 220',
    components: [
      'Trilhos',
      'Roldanas simples',
      'Perfis básicos',
      'Borrachas padrão',
      'Parafusos',
    ],
  },
  {
    id: 'PORTA_PIVOTANTE_VA',
    name: 'Kit Porta Pivotante V/A',
    price: 'R$ 180 - R$ 350',
    components: [
      'Pivô superior',
      'Pivô inferior',
      'Puxador',
      'Fechadura',
      'Contra-fechadura',
      'Batente magnético',
      'Parafusos',
    ],
  },
  {
    id: 'PORTA_PIVOTANTE_JUMBO',
    name: 'Kit Porta Pivotante Jumbo',
    price: 'R$ 280 - R$ 500',
    components: [
      'Pivô superior jumbo',
      'Pivô inferior jumbo',
      'Puxador reforçado',
      'Fechadura',
      'Contra-fechadura',
      'Mola de piso',
      'Batente magnético',
      'Parafusos',
    ],
  },
  {
    id: 'BASCULANTE',
    name: 'Kit Basculante',
    price: 'R$ 80 - R$ 150',
    components: [
      'Suportes basculantes',
      'Trinco com corrente',
      'Perfis de acabamento',
      'Parafusos',
    ],
  },
  {
    id: 'MAXIM_AR',
    name: 'Kit Maxim-ar com Haste',
    price: 'R$ 60 - R$ 120',
    components: [
      'Suportes superiores',
      'Guia de descanso',
      'Haste de abertura',
      'Parafusos',
    ],
  },
  {
    id: 'JANELA_CORRER',
    name: 'Kit Janela de Correr',
    price: 'R$ 100 - R$ 200',
    components: [
      'Trilhos',
      'Roldanas para janela',
      'Escovas vedadoras',
      'Trinco',
      'Parafusos',
    ],
  },
  {
    id: 'PIA',
    name: 'Kit Pia (Armário sob Pia)',
    price: 'R$ 80 - R$ 150',
    components: ['Trilhos', 'Roldanas', 'Puxadores', 'Borrachas', 'Parafusos'],
  },
] as const

export function StepDetailsKits() {
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
  const [kitType, setKitType] = useState(existingItem?.kitType || '')
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
        logger.error('[KITS] Failed to upload images:', { error: errorMsg })

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

    // Validação de tipo de kit
    if (!kitType) {
      toast({
        variant: 'error',
        title: 'Dados incompletos',
        description: 'Selecione o tipo de kit',
      })
      return
    }

    // Construir descrição
    const selectedKit = KIT_TYPES.find((k) => k.id === kitType)
    const descParts = [selectedKit?.name]
    if (color) descParts.push(HARDWARE_COLORS.find((c) => c.id === color)?.name || color)

    const itemData = {
      productId: currentProduct?.id || currentItem?.productId || '',
      productName: currentProduct?.name || currentItem?.productName || '',
      productSlug: currentProduct?.slug || currentItem?.productSlug || '',
      category: 'KITS',
      quantity: parseInt(quantity) || 1,
      color: color || undefined,
      description: description || descParts.filter(Boolean).join(' - '),
      images,
      // Campos específicos de kits
      kitType,
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
        setKitType('')
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

  // Obter kit selecionado
  const selectedKit = KIT_TYPES.find((k) => k.id === kitType)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">
          {isEditing ? 'Editar item' : 'Kits Completos'}
        </h2>
        <p className="text-theme-muted mt-2">Selecione o tipo de kit e a quantidade necessária</p>
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

          {/* Tipo de Kit */}
          <div>
            <label className="text-theme-muted mb-1 block text-sm">Tipo de Kit *</label>
            <Select value={kitType} onValueChange={setKitType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de kit" />
              </SelectTrigger>
              <SelectContent>
                {KIT_TYPES.map((kit) => (
                  <SelectItem key={kit.id} value={kit.id}>
                    {kit.name} ({kit.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conteúdo do Kit (read-only) */}
          {selectedKit && (
            <div className="bg-theme-elevated rounded-lg border border-neutral-700 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Package className="text-accent-500 h-5 w-5" />
                <h3 className="text-theme-primary font-semibold">Conteúdo do Kit</h3>
              </div>
              <ul className="text-theme-muted space-y-1 text-sm">
                {selectedKit.components.map((component, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent-500 mt-1">•</span>
                    <span>{component}</span>
                  </li>
                ))}
              </ul>
              <div className="text-theme-subtle mt-3 text-xs">
                Faixa de preço: {selectedKit.price}
              </div>
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
              placeholder="Informações extras sobre o kit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-theme-muted mb-2 block text-sm">Fotos (opcional)</label>
            <p className="text-theme-subtle mb-3 text-xs">
              Envie fotos do local. Max 5 imagens, 5MB cada.
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
