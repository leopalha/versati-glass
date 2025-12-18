# GUIA DE INTEGRAÇÃO - FASE 3: Validações NBR + Sugestões Inteligentes

## 📋 VISÃO GERAL

Este guia mostra como integrar os componentes da Fase 3 nos formulários de orçamento existentes.

**Componentes Disponíveis**:

- ✅ ThicknessCalculator - Calculadora automática NBR 14488
- ✅ SmartSuggestionsPanel - Sugestões contextuais inteligentes
- ✅ ProductReferenceImages - Galeria de fotos de referência
- ✅ NBRTooltip / ValidationTooltip - Tooltips informativos
- ✅ nbr-validations - Funções de validação programáticas

---

## 🎯 INTEGRAÇÃO NO STEP-DETAILS.TSX

### 1. Imports Necessários

Adicione no topo do arquivo `src/components/quote/steps/step-details.tsx`:

```typescript
// Fase 3 - NBR Validations & Smart Suggestions
import { ThicknessCalculator } from '@/components/quote/thickness-calculator'
import { SmartSuggestionsPanel } from '@/components/quote/smart-suggestions-panel'
import { ProductReferenceImages } from '@/components/quote/product-reference-images'
import { NBRTooltip } from '@/components/ui/tooltip'
import {
  validateDimensions,
  calculateThickness,
  getGlassTypeRecommendations,
  type GlassApplication,
} from '@/lib/nbr-validations'
import type { QuoteContext } from '@/lib/smart-suggestions'
```

### 2. Preparar Contexto para Sugestões

Dentro do componente, crie o objeto de contexto:

```typescript
export function StepDetails() {
  // ... existing state variables ...

  // Build context for smart suggestions
  const suggestionContext: QuoteContext = useMemo(
    () => ({
      category,
      width: width ? parseFloat(width) : undefined,
      height: height ? parseFloat(height) : undefined,
      glassType,
      model,
      color,
      thickness: thickness ? parseInt(thickness) : undefined,
      finish,
      // Phase 1 conditional fields
      glassTexture,
      hasteSize,
      pivotPosition,
      handleType,
      lockType,
      hasHandrail,
      handrailType,
      pergolaStructure,
      pergolaFixing,
      pergolaSlope,
      shelfType,
      shelfSupportType,
      shelfSupportMaterial,
      partitionSystem,
      closingType,
      closingSystem,
      serviceUrgency,
    }),
    [
      category,
      width,
      height,
      glassType,
      model,
      color,
      thickness,
      finish,
      glassTexture,
      hasteSize,
      pivotPosition,
      handleType,
      lockType,
      hasHandrail,
      handrailType,
      pergolaStructure,
      pergolaFixing,
      pergolaSlope,
      shelfType,
      shelfSupportType,
      shelfSupportMaterial,
      partitionSystem,
      closingType,
      closingSystem,
      serviceUrgency,
    ]
  )

  // Handler to apply suggestions
  const handleApplySuggestion = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case 'thickness':
          setThickness(value)
          break
        case 'glassType':
          setGlassType(value)
          break
        case 'model':
          setModel(value)
          break
        case 'color':
          setColor(value)
          break
        case 'handleType':
          setHandleType(value)
          break
        case 'lockType':
          setLockType(value)
          break
        // ... add more cases for all fields
        default:
          logger.warn(`Unknown suggestion field: ${field}`)
      }

      toast({
        title: 'Sugestão aplicada!',
        description: `Campo ${field} atualizado`,
      })
    },
    [toast]
  )

  // ... rest of component ...
}
```

### 3. Adicionar Calculadora de Espessura

Adicione após os campos de width/height, antes do campo de thickness:

```tsx
{
  /* Width Input */
}
;<div>
  <label htmlFor="width" className="text-theme-muted mb-1 block text-sm">
    Largura (metros) *
    <NBRTooltip
      title="Dimensões segundo NBR 14718"
      description="Largura deve respeitar os limites da norma de acordo com a espessura do vidro"
      nbrReference="NBR 14718"
    />
  </label>
  <Input
    id="width"
    type="number"
    step="0.01"
    min="0"
    value={width}
    onChange={(e) => setWidth(e.target.value)}
  />
</div>

{
  /* Height Input */
}
;<div>
  <label htmlFor="height" className="text-theme-muted mb-1 block text-sm">
    Altura (metros) *
    <NBRTooltip
      title="Dimensões segundo NBR 14718"
      description="Altura deve respeitar os limites da norma de acordo com a espessura do vidro"
      nbrReference="NBR 14718"
    />
  </label>
  <Input
    id="height"
    type="number"
    step="0.01"
    min="0"
    value={height}
    onChange={(e) => setHeight(e.target.value)}
  />
</div>

{
  /* Thickness Calculator - appears when dimensions are entered */
}
{
  width && height && parseFloat(width) > 0 && parseFloat(height) > 0 && (
    <ThicknessCalculator
      width={parseFloat(width)}
      height={parseFloat(height)}
      application={(category as GlassApplication) || 'JANELA'}
      currentThickness={thickness ? parseInt(thickness) : undefined}
      windZone={2} // TODO: Get from CEP/location
      onApplyThickness={(t) => setThickness(t.toString())}
      className="col-span-1 sm:col-span-2"
    />
  )
}

{
  /* Thickness Select */
}
;<div>
  <label className="text-theme-muted mb-1 block text-sm">
    Espessura *
    <NBRTooltip
      title="Espessura Mínima NBR 14488"
      description="Espessura calculada automaticamente com base nas dimensões, aplicação e zona de vento"
      nbrReference="NBR 14488"
    />
  </label>
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
```

### 4. Adicionar Painel de Sugestões

Adicione após todos os campos do formulário, antes dos botões de ação:

```tsx
{
  /* Smart Suggestions Panel */
}
;<SmartSuggestionsPanel
  context={suggestionContext}
  onApplySuggestion={handleApplySuggestion}
  maxSuggestions={3}
  minConfidence="medium"
  className="col-span-1 sm:col-span-2"
/>
```

### 5. Adicionar Imagens de Referência

Adicione logo após o nome do produto ou no início do formulário:

```tsx
{
  /* Product Reference Images */
}
{
  currentProduct && (
    <ProductReferenceImages
      category={category}
      subcategory={model}
      maxImages={4}
      showTitle={true}
      className="col-span-1 sm:col-span-2"
    />
  )
}
```

### 6. Adicionar Validação no Submit

Atualize a função `handleContinue`:

```typescript
const handleContinue = () => {
  // ... existing validations ...

  // NBR Validation (Phase 3)
  if (width && height && thickness) {
    const dimValidation = validateDimensions(
      {
        width: parseFloat(width),
        height: parseFloat(height),
        thickness: parseInt(thickness),
      },
      (category as GlassApplication) || 'JANELA'
    )

    if (!dimValidation.valid) {
      toast({
        variant: 'error',
        title: dimValidation.message,
        description: dimValidation.recommendation,
      })
      return
    }

    if (dimValidation.severity === 'warning') {
      toast({
        variant: 'warning',
        title: dimValidation.message,
        description: dimValidation.recommendation,
      })
      // Allow to continue but warn user
    }
  }

  // ... rest of submit logic ...
}
```

---

## 🎯 INTEGRAÇÃO NO STEP-PRODUCT.TSX

### Adicionar Imagens no Grid de Produtos

Em `src/components/quote/steps/step-product.tsx`:

```typescript
import { CompactImageCarousel } from '@/components/quote/product-reference-images'

// Inside ProductCard component
<Card>
  <h3>{product.name}</h3>
  <p>{product.description}</p>

  {/* Add image carousel */}
  <CompactImageCarousel
    category={product.category}
    subcategory={product.slug}
    maxImages={3}
  />

  <Button onClick={() => selectProduct(product)}>
    Selecionar
  </Button>
</Card>
```

---

## 🎯 INTEGRAÇÃO NA STEP-LOCATION (CEP → ZONA DE VENTO)

### Mapear CEP para Zona de Vento

Crie em `src/lib/wind-zone-mapping.ts`:

```typescript
/**
 * Map Brazilian states to wind zones based on NBR 16259
 */
export function getWindZoneFromState(state: string): number {
  const windZones: Record<string, number> = {
    // Zona 1 - Interior (Baixo vento)
    MG: 1,
    GO: 1,
    MT: 1,
    MS: 1,
    DF: 1,

    // Zona 2 - Costa distante (Vento médio)
    SP: 2,
    PR: 2,
    SC: 2,
    RS: 2,

    // Zona 3 - Costa próxima (Vento alto)
    RJ: 3,
    ES: 3,
    BA: 3,
    SE: 3,
    AL: 3,

    // Zona 4 - Costa exposta (Vento muito alto)
    PE: 4,
    PB: 4,
    RN: 4,
    CE: 4,
    PI: 4,
    MA: 4,
    PA: 4,
    AP: 4,
    AM: 4,
    RR: 4,
    RO: 4,
    AC: 4,
    TO: 1, // Interior
  }

  return windZones[state] || 2 // Default: zona 2
}

/**
 * Extract state from CEP using ViaCEP API response
 */
export function getWindZoneFromCEP(cepData: { uf: string }): number {
  return getWindZoneFromState(cepData.uf)
}
```

### Salvar Zona de Vento no Store

Em `src/store/quote-store.ts`, adicione:

```typescript
interface QuoteStore {
  // ... existing fields ...
  windZone: number
  setWindZone: (zone: number) => void
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      // ... existing state ...
      windZone: 2, // Default

      setWindZone: (zone) => set({ windZone: zone }),

      // ... rest of store ...
    })
    // ... persist config ...
  )
)
```

### Atualizar Step-Location

Em `step-location.tsx`, após obter dados do CEP:

```typescript
const handleCEPSubmit = async () => {
  // ... fetch CEP data ...

  const data = await response.json()

  // Save wind zone (Phase 3)
  const zone = getWindZoneFromCEP(data)
  setWindZone(zone)

  logger.info('[CEP] Wind zone determined:', { state: data.uf, zone })

  // ... continue with location save ...
}
```

### Usar Zona de Vento no Calculador

Em `step-details.tsx`:

```typescript
const { windZone } = useQuoteStore()

// ...

<ThicknessCalculator
  width={parseFloat(width)}
  height={parseFloat(height)}
  application={category as GlassApplication}
  currentThickness={thickness ? parseInt(thickness) : undefined}
  windZone={windZone}  // ← Use from store instead of hardcoded 2
  onApplyThickness={(t) => setThickness(t.toString())}
/>
```

---

## 📚 EXEMPLO COMPLETO DE INTEGRAÇÃO

### step-details.tsx (trechos chave)

```typescript
'use client'

import { useState, useCallback, useMemo } from 'react'
import { useQuoteStore } from '@/store/quote-store'
// ... existing imports ...

// Phase 3 imports
import { ThicknessCalculator } from '@/components/quote/thickness-calculator'
import { SmartSuggestionsPanel } from '@/components/quote/smart-suggestions-panel'
import { ProductReferenceImages } from '@/components/quote/product-reference-images'
import { NBRTooltip } from '@/components/ui/tooltip'
import { validateDimensions, type GlassApplication } from '@/lib/nbr-validations'
import type { QuoteContext } from '@/lib/smart-suggestions'

export function StepDetails() {
  const {
    currentItem,
    addItem,
    windZone,  // Phase 3
    // ... other store values ...
  } = useQuoteStore()

  // ... existing state ...

  // Phase 3: Build context for suggestions
  const suggestionContext: QuoteContext = useMemo(() => ({
    category,
    width: width ? parseFloat(width) : undefined,
    height: height ? parseFloat(height) : undefined,
    glassType,
    model,
    color,
    thickness: thickness ? parseInt(thickness) : undefined,
    // ... all other fields ...
  }), [category, width, height, glassType, model, color, thickness /* ... */])

  // Phase 3: Apply suggestions handler
  const handleApplySuggestion = useCallback((field: string, value: string) => {
    // Map field to setter
    const setters: Record<string, (v: string) => void> = {
      thickness: setThickness,
      glassType: setGlassType,
      model: setModel,
      color: setColor,
      handleType: setHandleType,
      // ... all fields ...
    }

    if (setters[field]) {
      setters[field](value)
      toast({ title: 'Sugestão aplicada!', description: `${field} atualizado` })
    }
  }, [toast])

  // Phase 3: Validate before submit
  const handleContinue = () => {
    // ... existing validations ...

    // NBR Dimension validation
    if (width && height && thickness) {
      const dimValidation = validateDimensions(
        { width: parseFloat(width), height: parseFloat(height), thickness: parseInt(thickness) },
        (category as GlassApplication) || 'JANELA'
      )

      if (!dimValidation.valid) {
        toast({ variant: 'error', title: dimValidation.message, description: dimValidation.recommendation })
        return
      }

      if (dimValidation.severity === 'warning') {
        toast({ variant: 'warning', title: dimValidation.message })
      }
    }

    // ... rest of submit ...
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Product name */}
      <Card>
        <h2>{currentProduct?.name}</h2>

        {/* Phase 3: Reference images */}
        <ProductReferenceImages
          category={category}
          subcategory={model}
          maxImages={4}
          showTitle={true}
        />

        <div className="space-y-4">
          {/* Width */}
          <div>
            <label>
              Largura (metros) *
              <NBRTooltip
                title="Dimensões segundo NBR 14718"
                description="Largura deve respeitar os limites da norma"
                nbrReference="NBR 14718"
              />
            </label>
            <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>

          {/* Height */}
          <div>
            <label>
              Altura (metros) *
              <NBRTooltip
                title="Dimensões segundo NBR 14718"
                description="Altura deve respeitar os limites da norma"
                nbrReference="NBR 14718"
              />
            </label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>

          {/* Phase 3: Thickness Calculator */}
          {width && height && parseFloat(width) > 0 && parseFloat(height) > 0 && (
            <ThicknessCalculator
              width={parseFloat(width)}
              height={parseFloat(height)}
              application={(category as GlassApplication) || 'JANELA'}
              currentThickness={thickness ? parseInt(thickness) : undefined}
              windZone={windZone}
              onApplyThickness={(t) => setThickness(t.toString())}
            />
          )}

          {/* Thickness Select */}
          <div>
            <label>
              Espessura *
              <NBRTooltip
                title="Espessura Mínima NBR 14488"
                description="Calculada automaticamente com base nas dimensões"
                nbrReference="NBR 14488"
              />
            </label>
            <Select value={thickness} onValueChange={setThickness}>
              {/* options */}
            </Select>
          </div>

          {/* ... other fields ... */}

          {/* Phase 3: Smart Suggestions */}
          <SmartSuggestionsPanel
            context={suggestionContext}
            onApplySuggestion={handleApplySuggestion}
            maxSuggestions={3}
            minConfidence="medium"
          />
        </div>
      </Card>

      {/* Buttons */}
      <div className="mt-8 flex justify-between">
        <Button onClick={handleBack}>Voltar</Button>
        <Button onClick={handleContinue}>Continuar</Button>
      </div>
    </div>
  )
}
```

---

## ✅ CHECKLIST DE INTEGRAÇÃO

### Step Details

- [ ] Importar componentes da Fase 3
- [ ] Criar `suggestionContext` com useMemo
- [ ] Adicionar `handleApplySuggestion`
- [ ] Adicionar NBRTooltip nos labels de width/height/thickness
- [ ] Adicionar ThicknessCalculator após campos de dimensão
- [ ] Adicionar SmartSuggestionsPanel após formulário
- [ ] Adicionar ProductReferenceImages no topo
- [ ] Adicionar validação NBR no handleContinue

### Step Location

- [ ] Criar `wind-zone-mapping.ts`
- [ ] Adicionar `windZone` ao store
- [ ] Mapear CEP → Estado → Zona de Vento
- [ ] Salvar windZone no store após validar CEP

### Step Product

- [ ] Adicionar CompactImageCarousel nos cards de produto

### Testing

- [ ] Testar calculadora com diferentes dimensões
- [ ] Testar sugestões em diferentes categorias
- [ ] Testar validações NBR (erro, warning, ok)
- [ ] Testar imagens de referência (modal de zoom)
- [ ] Rodar testes E2E completos

---

## 🐛 TROUBLESHOOTING

### "Cannot find module '@radix-ui/react-tooltip'"

```bash
npm install @radix-ui/react-tooltip
```

### Tooltips não aparecem

- Verificar que TooltipProvider está wrapping o app
- Verificar z-index do tooltip (deve ser > 50)

### Calculadora retorna espessura muito alta

- Verificar se width/height estão em metros (não cm)
- Verificar windZone (1-4)
- Verificar application (algumas exigem mais espessura)

### Sugestões não aparecem

- Verificar que context está populado corretamente
- Verificar minConfidence (tentar 'low' para testar)
- Verificar se campos já estão preenchidos (sugestões filtradas)

### Imagens não carregam

- Imagens são placeholders no momento
- Para adicionar imagens reais:
  1. Colocar fotos em `public/images/products/`
  2. Atualizar URLs em `product-images.ts`
  3. Descomentar componentes `<Image>` nos componentes

---

## 📞 SUPORTE

Para dúvidas ou problemas:

1. Consultar documentação completa em `SESSAO_18_DEZ_FASE3_COMPLETA.md`
2. Ver exemplos de uso em `e2e/08-ferragens-kits-flow.spec.ts`
3. Revisar código dos componentes em `src/components/quote/`

---

**Última atualização**: 18 de Dezembro de 2024
**Versão**: 1.0.0
**Status**: ✅ Pronto para integração
