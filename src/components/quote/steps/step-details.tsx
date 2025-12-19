'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
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
import {
  GLASS_TYPES,
  GLASS_COLORS,
  GLASS_THICKNESSES,
  MIRROR_COLORS,
  MIRROR_THICKNESSES,
  MIRROR_TYPES,
  EDGE_FINISHES,
  BISOTE_WIDTHS,
  LED_TEMPERATURES,
  BOX_MODELS,
  BOX_FINISH_LINES,
  HARDWARE_COLORS,
  DOOR_TYPES,
  WINDOW_TYPES,
  GUARD_RAIL_SYSTEMS,
  GLASS_CURTAIN_SYSTEMS,
  SERVICE_TYPES,
  SHAPES,
  GLASS_TEXTURES,
  MAXIM_AR_HASTE_SIZES,
  PIVOT_POSITIONS,
  HANDLE_TYPES,
  LOCK_TYPES,
  HANDRAIL_TYPES,
  PERGOLA_STRUCTURES,
  PERGOLA_FIXING_SYSTEMS,
  PERGOLA_SLOPES,
  SHELF_SUPPORT_TYPES,
  SHELF_SUPPORT_MATERIALS,
  PARTITION_SYSTEMS,
  CLOSING_TYPES,
  CLOSING_SYSTEMS,
  SERVICE_URGENCY,
} from '@/lib/catalog-options'
// Phase 3 - NBR Validations & Smart Suggestions
import { validateDimensions } from '@/lib/nbr-validations'
import type { QuoteContext } from '@/lib/smart-suggestions'
import { ThicknessCalculator } from '@/components/quote/thickness-calculator'
import { SmartSuggestionsPanel } from '@/components/quote/smart-suggestions-panel'
import { ProductReferenceImages } from '@/components/quote/product-reference-images'
import { DimensionSlider } from '@/components/quote/dimension-slider'


export function StepDetails() {
  const {
    currentItem,
    locationData, // Phase 3
    addItem,
    updateItem,
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

  // Category can come from editing item or current product
  const category = existingItem?.category || currentProduct?.category || currentItem?.category

  // Phase 3: Helper for showing dimensions
  const showDimensions = category !== 'SERVICOS' && category !== 'FERRAGENS' && category !== 'KITS'

  const [uploadingImages, setUploadingImages] = useState(false)

  // Estados do formulário - inicializa com valores existentes se estiver editando
  const [width, setWidth] = useState(existingItem?.width?.toString() || '')
  const [height, setHeight] = useState(existingItem?.height?.toString() || '')
  const [quantity, setQuantity] = useState(existingItem?.quantity?.toString() || '1')
  const [color, setColor] = useState(existingItem?.color || '')
  const [finish, setFinish] = useState(existingItem?.finish || '')
  const [thickness, setThickness] = useState(existingItem?.thickness || '')
  const [glassType, setGlassType] = useState(existingItem?.glassType || '')
  const [glassColor, setGlassColor] = useState(existingItem?.glassColor || '')
  const [model, setModel] = useState(existingItem?.model || '')
  const [finishLine, setFinishLine] = useState(existingItem?.finishLine || '')
  const [ledTemp, setLedTemp] = useState(existingItem?.ledTemp || '')
  const [shape, setShape] = useState(existingItem?.shape || '')
  const [bisoteWidth, setBisoteWidth] = useState(existingItem?.bisoteWidth || '')
  const [description, setDescription] = useState(existingItem?.description || '')
  const [images, setImages] = useState<string[]>(existingItem?.images || [])

  // Novos campos condicionais (Fase 1)
  const [glassTexture, setGlassTexture] = useState('')
  const [hasteSize, setHasteSize] = useState('')
  const [pivotPosition, setPivotPosition] = useState('')
  const [handleType, setHandleType] = useState('')
  const [lockType, setLockType] = useState('')
  const [hasHandrail, setHasHandrail] = useState(false)
  const [handrailType, setHandrailType] = useState('')
  const [pergolaStructure, setPergolaStructure] = useState('')
  const [pergolaFixing, setPergolaFixing] = useState('')
  const [pergolaSlope, setPergolaSlope] = useState('')
  const [shelfType, setShelfType] = useState('')
  const [shelfSupportType, setShelfSupportType] = useState('')
  const [shelfSupportMaterial, setShelfSupportMaterial] = useState('')
  const [partitionSystem, setPartitionSystem] = useState('')
  const [closingType, setClosingType] = useState('')
  const [closingSystem, setClosingSystem] = useState('')
  const [serviceUrgency, setServiceUrgency] = useState('')
  // Phase 3: Context for smart suggestions
  const suggestionContext = useMemo<QuoteContext>(
    () => ({
      category: category || '',
      width: width ? parseFloat(width) : undefined,
      height: height ? parseFloat(height) : undefined,
      glassType,
      model,
      color,
      thickness: thickness ? parseInt(thickness) : undefined,
      finish,
      glassColor,
      glassTexture,
      hasteSize,
    }),
    [category, width, height, glassType, model, color, thickness, finish, glassColor, glassTexture, hasteSize]
  )


  // Opções de cor de ferragem baseadas na categoria
  const hardwareColorOptions = useMemo(() => {
    if (category === 'ESPELHOS') {
      return [] // Espelhos não têm ferragem
    }
    return HARDWARE_COLORS
  }, [category])

  // Opções de espessura baseadas na categoria
  const thicknessOptions = useMemo(() => {
    if (category === 'ESPELHOS') {
      return MIRROR_THICKNESSES.map((t) => ({
        value: t.value,
        label: `${t.value} - ${t.application}`,
      }))
    }
    if (category === 'BOX' || category === 'CORTINAS_VIDRO') {
      return GLASS_THICKNESSES.filter((t) => ['8MM', '10MM'].includes(t.id)).map((t) => ({
        value: t.value,
        label: t.value,
      }))
    }
    if (category === 'GUARDA_CORPO') {
      return GLASS_THICKNESSES.filter((t) => ['10MM', '12MM', '15MM', '19MM'].includes(t.id)).map(
        (t) => ({ value: t.value, label: t.value })
      )
    }
    if (category === 'PORTAS' || category === 'DIVISORIAS') {
      return GLASS_THICKNESSES.filter((t) => ['8MM', '10MM', '12MM'].includes(t.id)).map((t) => ({
        value: t.value,
        label: t.value,
      }))
    }
    if (category === 'JANELAS') {
      return GLASS_THICKNESSES.filter((t) => ['6MM', '8MM'].includes(t.id)).map((t) => ({
        value: t.value,
        label: t.value,
      }))
    }
    return GLASS_THICKNESSES.map((t) => ({ value: t.value, label: t.value }))
  }, [category])

  // Opções de acabamento baseadas na categoria
  const finishOptions = useMemo(() => {
    if (category === 'ESPELHOS') {
      return EDGE_FINISHES.filter((f) => ['LAPIDADO', 'BISOTE'].includes(f.id)).map((f) => ({
        value: f.id,
        label: f.name,
      }))
    }
    return EDGE_FINISHES.map((f) => ({ value: f.id, label: f.name }))
  }, [category])

  // Opções de tipo de vidro baseadas na categoria
  const glassTypeOptions = useMemo(() => {
    if (category === 'BOX') {
      return GLASS_TYPES.filter((g) =>
        ['TEMPERADO', 'JATEADO', 'ACIDATO', 'SERIGRAFADO'].includes(g.id)
      )
    }
    if (category === 'GUARDA_CORPO' || category === 'PERGOLADOS') {
      return GLASS_TYPES.filter((g) =>
        ['LAMINADO', 'LAMINADO_TEMPERADO', 'TEMPERADO', 'CONTROLE_SOLAR'].includes(g.id)
      )
    }
    if (category === 'JANELAS') {
      return GLASS_TYPES.filter((g) => ['TEMPERADO', 'IMPRESSO'].includes(g.id))
    }
    return GLASS_TYPES
  }, [category])

  // Cores do vidro
  const glassColorOptions = useMemo(() => {
    if (category === 'ESPELHOS') {
      return MIRROR_COLORS.map((c) => ({ value: c.id, label: c.name }))
    }
    return GLASS_COLORS.map((c) => ({ value: c.id, label: c.name }))
  }, [category])

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
        // ARCH-P1-2: Standardized error handling
        const errorMsg = getErrorMessage(error)
        logger.error('[DETAILS] Failed to upload images:', { error: errorMsg })

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
  // Phase 3: Handle applying suggestions
  const handleApplySuggestion = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case 'thickness':
          setThickness(value)
          break
        case 'glassType':
          setGlassType(value)
          break
        case 'finish':
          setFinish(value)
          break
        case 'color':
          setColor(value)
          break
        case 'glassColor':
          setGlassColor(value)
          break
        case 'model':
          setModel(value)
          break
        case 'finishLine':
          setFinishLine(value)
          break
        case 'ledTemp':
          setLedTemp(value)
          break
        case 'shape':
          setShape(value)
          break
        case 'bisoteWidth':
          setBisoteWidth(value)
          break
      }

      toast({
        title: 'Sugestão aplicada',
        description: `Campo "${field}" atualizado para "${value}"`,
      })
    },
    [toast]
  )


  const handleContinue = () => {
    // FQ.4.2: Validação de quantidade mínima
    const quantityNum = parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum < 1) {
      toast({
        variant: 'error',
        title: 'Quantidade invalida',
        description: 'A quantidade deve ser no minimo 1',
      })
      return
    }

    // FQ.4.1: Validação de medidas (exceto para serviços)
    if (category !== 'SERVICOS') {
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

      // FQ.4.1: Validação de valores numéricos positivos
      if (isNaN(widthNum) || isNaN(heightNum)) {
        toast({
          variant: 'error',
          title: 'Medidas invalidas',
          description: 'Largura e altura devem ser valores numericos',
        })
        return
      }

      if (widthNum <= 0 || heightNum <= 0) {
        toast({
          variant: 'error',
          title: 'Medidas invalidas',
          description: 'Largura e altura devem ser maiores que zero',
        })
        return
      }

      // FQ.4.1: Validação de limites razoáveis (evitar erros de digitação)
      if (widthNum > 20 || heightNum > 20) {
        toast({
          variant: 'error',
          title: 'Medidas muito grandes',
          description: 'Largura e altura devem ser menores que 20 metros. Verifique os valores.',
        })
        return
      }
    }

    const widthNum = parseFloat(width) || 0
    const heightNum = parseFloat(height) || 0

    // Phase 3: NBR Validation (BEFORE creating newItem)
    if (width && height && thickness && category) {
      const w = parseFloat(width)
      const h = parseFloat(height)
      const t = parseInt(thickness)

      const validation = validateDimensions(
        { width: w, height: h, thickness: t },
        category as any
      )

      if (!validation.valid) {
        toast({
          variant: 'error',
          title: 'Dimensões não atendem às normas NBR',
          description: validation.message,
        })
        return // Block submission
      }

      if (validation.severity === 'warning') {
        toast({
          variant: 'warning',
          title: 'Atenção',
          description: validation.message,
        })
      }
    }

    // Construir descrição detalhada
    const descParts = [currentItem?.productName]
    if (widthNum && heightNum) descParts.push(`${widthNum}m x ${heightNum}m`)
    if (model) descParts.push(BOX_MODELS.find((m) => m.id === model)?.name || model)
    if (glassType) descParts.push(GLASS_TYPES.find((g) => g.id === glassType)?.name || glassType)
    if (glassColor)
      descParts.push(GLASS_COLORS.find((c) => c.id === glassColor)?.name || glassColor)
    if (thickness) descParts.push(thickness)

    const itemData = {
      productId: currentProduct?.id || currentItem?.productId || '',
      productName: currentProduct?.name || currentItem?.productName || '',
      productSlug: currentProduct?.slug || currentItem?.productSlug || '',
      category: category || '',
      width: widthNum,
      height: heightNum,
      quantity: parseInt(quantity) || 1,
      color: color || undefined,
      finish: finish || undefined,
      thickness: thickness || undefined,
      glassType: glassType || undefined,
      glassColor: glassColor || undefined,
      model: model || undefined,
      finishLine: finishLine || undefined,
      ledTemp: ledTemp || undefined,
      shape: shape || undefined,
      bisoteWidth: bisoteWidth || undefined,
      description: description || descParts.filter(Boolean).join(' - '),
      images,
      // New conditional fields (Phase 1)
      glassTexture: glassTexture || undefined,
      hasteSize: hasteSize || undefined,
      pivotPosition: pivotPosition || undefined,
      handleType: handleType || undefined,
      lockType: lockType || undefined,
      hasHandrail: hasHandrail || undefined,
      handrailType: handrailType || undefined,
      pergolaStructure: pergolaStructure || undefined,
      pergolaFixing: pergolaFixing || undefined,
      pergolaSlope: pergolaSlope || undefined,
      shelfType: shelfType || undefined,
      shelfSupportType: shelfSupportType || undefined,
      shelfSupportMaterial: shelfSupportMaterial || undefined,
      partitionSystem: partitionSystem || undefined,
      closingType: closingType || undefined,
      closingSystem: closingSystem || undefined,
      serviceUrgency: serviceUrgency || undefined,
    }

    if (isEditing) {
      // Atualizar item existente
      saveEditItem(itemData)
    } else {
      // Adicionar novo item ao carrinho
      addItem(itemData)

      // Check if there are more products to detail
      if (allProductsDetailed()) {
        // All products have been detailed, clear queue and go to cart
        logger.debug('All products detailed, going to cart')
        setProductsToDetail([])
        clearSelectedProducts()
        nextStep() // → Step 4 (Cart/Review)
      } else {
        // More products to detail, advance to next product
        logger.debug(`Product ${productNumber} of ${totalProducts} detailed, moving to next`)
        nextProductToDetail()

        // Clear form for next product
        setWidth('')
        setHeight('')
        setQuantity('1')
        setColor('')
        setFinish('')
        setThickness('')
        setGlassType('')
        setGlassColor('')
        setModel('')
        setFinishLine('')
        setLedTemp('')
        setShape('')
        setBisoteWidth('')
        setDescription('')
        setImages([])
        // Clear new conditional fields
        setGlassTexture('')
        setHasteSize('')
        setPivotPosition('')
        setHandleType('')
        setLockType('')
        setHasHandrail(false)
        setHandrailType('')
        setPergolaStructure('')
        setPergolaFixing('')
        setPergolaSlope('')
        setShelfType('')
        setShelfSupportType('')
        setShelfSupportMaterial('')
        setPartitionSystem('')
        setClosingType('')
        setClosingSystem('')
        setServiceUrgency('')

        // Stay in Step 3 to detail next product
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

  // Validação: deve ter produto para detalhar (seja do queue ou editando)
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

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">
          {isEditing ? 'Editar item' : 'Detalhes do produto'}
        </h2>
        <p className="text-theme-muted mt-2">Informe as dimensoes e caracteristicas do produto</p>
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


          {/* Phase 3: Product Reference Images */}
          {category && (
            <ProductReferenceImages
              category={category}
              subcategory={model}
              maxImages={4}
              showTitle={true}
            />
          )}

          {/* Measurements - Seletores Híbridos com Slider */}
          {category !== 'SERVICOS' && (
            <div className="space-y-6">
              <DimensionSlider
                id="width"
                label="Largura"
                value={width}
                onChange={setWidth}
                min={0.3}
                max={6.0}
                step={0.05}
                unit="m"
                presets={[0.5, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]}
                showPresets={true}
              />
              <DimensionSlider
                id="height"
                label="Altura"
                value={height}
                onChange={setHeight}
                min={0.3}
                max={6.0}
                step={0.05}
                unit="m"
                presets={[0.5, 1.0, 1.5, 1.8, 2.0, 2.2, 2.5, 3.0]}
                showPresets={true}
              />
            </div>
          )}


          {/* Phase 3: Thickness Calculator */}
          {showDimensions && width && height && parseFloat(width) > 0 && parseFloat(height) > 0 && (
            <ThicknessCalculator
              width={parseFloat(width)}
              height={parseFloat(height)}
              application={category as any}
              currentThickness={thickness ? parseInt(thickness) : undefined}
              windZone={locationData?.windZone || 2}
              onApplyThickness={(t) => setThickness(t.toString())}
            />
          )}

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

          {/* Opções específicas por categoria */}

          {/* BOX: Modelo e Linha de Acabamento */}
          {category === 'BOX' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Modelo do Box</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOX_MODELS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Linha de Acabamento</label>
                <Select value={finishLine} onValueChange={setFinishLine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a linha" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOX_FINISH_LINES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* PORTAS: Tipo de Porta + Campos Condicionais */}
          {category === 'PORTAS' && (
            <div className="space-y-4">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Tipo de Porta</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOOR_TYPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Se for Pivotante, mostrar posição do pivô */}
              {model === 'PIVOTANTE' && (
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Posição do Pivô</label>
                  <Select value={pivotPosition} onValueChange={setPivotPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a posição" />
                    </SelectTrigger>
                    <SelectContent>
                      {PIVOT_POSITIONS.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name} - {opt.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Tipo de Puxador (para todas as portas) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Tipo de Puxador</label>
                  <Select value={handleType} onValueChange={setHandleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o puxador" />
                    </SelectTrigger>
                    <SelectContent>
                      {HANDLE_TYPES.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de Fechadura (para todas as portas) */}
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Tipo de Fechadura</label>
                  <Select value={lockType} onValueChange={setLockType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a fechadura" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCK_TYPES.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                          {opt.description && ` - ${opt.description}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* JANELAS: Tipo de Janela + Campos Condicionais */}
          {category === 'JANELAS' && (
            <div className="space-y-4">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Tipo de Janela</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {WINDOW_TYPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Se for Maxim-Ar, mostrar tamanho da haste */}
              {model === 'MAXIM_AR' && (
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Tamanho da Haste</label>
                  <Select value={hasteSize} onValueChange={setHasteSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAXIM_AR_HASTE_SIZES.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name} - {opt.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Se tipo de vidro for Impresso, mostrar textura */}
              {glassType === 'IMPRESSO' && (
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Textura do Vidro</label>
                  <Select value={glassTexture} onValueChange={setGlassTexture}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a textura" />
                    </SelectTrigger>
                    <SelectContent>
                      {GLASS_TEXTURES.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name} - {opt.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* GUARDA_CORPO: Sistema de Fixação + Corrimão */}
          {category === 'GUARDA_CORPO' && (
            <div className="space-y-4">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Sistema de Fixacao</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sistema" />
                  </SelectTrigger>
                  <SelectContent>
                    {GUARD_RAIL_SYSTEMS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Checkbox para corrimão */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasHandrail"
                  checked={hasHandrail}
                  onChange={(e) => {
                    setHasHandrail(e.target.checked)
                    if (!e.target.checked) setHandrailType('') // Reset se desmarcar
                  }}
                  className="h-4 w-4 rounded border-neutral-600 bg-theme-elevated text-accent-500 focus:ring-accent-500"
                />
                <label htmlFor="hasHandrail" className="text-theme-primary text-sm">
                  Incluir Corrimão
                </label>
              </div>

              {/* Se tiver corrimão, mostrar tipo */}
              {hasHandrail && (
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Tipo de Corrimão</label>
                  <Select value={handrailType} onValueChange={setHandrailType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {HANDRAIL_TYPES.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name} - {opt.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* CORTINAS_VIDRO: Sistema */}
          {category === 'CORTINAS_VIDRO' && (
            <div>
              <label className="text-theme-muted mb-1 block text-sm">Sistema de Abertura</label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sistema" />
                </SelectTrigger>
                <SelectContent>
                  {GLASS_CURTAIN_SYSTEMS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* PERGOLADOS: Estrutura, Fixação, Inclinação */}
          {category === 'PERGOLADOS' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Estrutura</label>
                <Select value={pergolaStructure} onValueChange={setPergolaStructure}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERGOLA_STRUCTURES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Sistema de Fixação</label>
                <Select value={pergolaFixing} onValueChange={setPergolaFixing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERGOLA_FIXING_SYSTEMS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Inclinação</label>
                <Select value={pergolaSlope} onValueChange={setPergolaSlope}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERGOLA_SLOPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ESPELHOS: Tipo, Formato, LED */}
          {category === 'ESPELHOS' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Tipo de Espelho</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MIRROR_TYPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Formato</label>
                <Select value={shape} onValueChange={setShape}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHAPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {model === 'LED' && (
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Temperatura do LED</label>
                  <Select value={ledTemp} onValueChange={setLedTemp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {LED_TEMPERATURES.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {finish === 'BISOTE' && (
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Largura do Bisote</label>
                  <Select value={bisoteWidth} onValueChange={setBisoteWidth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {BISOTE_WIDTHS.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.value} - {opt.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* TAMPOS_PRATELEIRAS: Tipo, Formato, Suporte */}
          {category === 'TAMPOS_PRATELEIRAS' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Tipo</label>
                <Select value={shelfType} onValueChange={setShelfType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TAMPO">Tampo de Mesa</SelectItem>
                    <SelectItem value="PRATELEIRA">Prateleira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Formato</label>
                <Select value={shape} onValueChange={setShape}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHAPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Se for prateleira, mostrar suporte */}
              {shelfType === 'PRATELEIRA' && (
                <>
                  <div>
                    <label className="text-theme-muted mb-1 block text-sm">Tipo de Suporte</label>
                    <Select value={shelfSupportType} onValueChange={setShelfSupportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHELF_SUPPORT_TYPES.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-theme-muted mb-1 block text-sm">Material do Suporte</label>
                    <Select value={shelfSupportMaterial} onValueChange={setShelfSupportMaterial}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHELF_SUPPORT_MATERIALS.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* DIVISORIAS: Sistema */}
          {category === 'DIVISORIAS' && (
            <div>
              <label className="text-theme-muted mb-1 block text-sm">Sistema de Divisória</label>
              <Select value={partitionSystem} onValueChange={setPartitionSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sistema" />
                </SelectTrigger>
                <SelectContent>
                  {PARTITION_SYSTEMS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* FECHAMENTOS: Tipo e Sistema */}
          {category === 'FECHAMENTOS' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Tipo de Fechamento</label>
                <Select value={closingType} onValueChange={setClosingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLOSING_TYPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Sistema de Fechamento</label>
                <Select value={closingSystem} onValueChange={setClosingSystem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sistema" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLOSING_SYSTEMS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* SERVICOS: Tipo de Serviço + Urgência */}
          {category === 'SERVICOS' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Tipo de Servico</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o servico" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Urgência</label>
                <Select value={serviceUrgency} onValueChange={setServiceUrgency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_URGENCY.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name} - {opt.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Tipo de Vidro (para categorias que usam) */}
          {[
            'BOX',
            'PORTAS',
            'JANELAS',
            'GUARDA_CORPO',
            'CORTINAS_VIDRO',
            'PERGOLADOS',
            'DIVISORIAS',
            'FECHAMENTOS',
            'VIDROS',
            'TAMPOS_PRATELEIRAS',
          ].includes(category || '') && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Tipo de Vidro</label>
                <Select value={glassType} onValueChange={setGlassType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {glassTypeOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Cor do Vidro</label>
                <Select value={glassColor} onValueChange={setGlassColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {glassColorOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Cor de Espelho (para categoria ESPELHOS) */}
          {category === 'ESPELHOS' && (
            <div>
              <label className="text-theme-muted mb-1 block text-sm">Cor do Espelho</label>
              <Select value={glassColor} onValueChange={setGlassColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cor" />
                </SelectTrigger>
                <SelectContent>
                  {glassColorOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Opções comuns: Espessura, Acabamento, Cor da Ferragem */}
          {category !== 'SERVICOS' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Acabamento de Borda</label>
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
              {hardwareColorOptions.length > 0 && category !== 'ESPELHOS' && (
                <div>
                  <label className="text-theme-muted mb-1 block text-sm">Cor da Ferragem</label>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {hardwareColorOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

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


          {/* Phase 3: Smart Suggestions */}
          <SmartSuggestionsPanel
            context={suggestionContext}
            onApplySuggestion={handleApplySuggestion}
            maxSuggestions={3}
            minConfidence="medium"
          />
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
