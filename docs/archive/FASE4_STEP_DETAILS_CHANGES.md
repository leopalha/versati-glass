# Mudanças para step-details.tsx - Fase 4

## STATUS: Para aplicar manualmente

Devido a conflitos com linter/formatter, as mudanças abaixo devem ser aplicadas manualmente no arquivo `src/components/quote/steps/step-details.tsx`.

---

## 1. IMPORTS (Após linha 52)

**Localização**: Após `} from '@/lib/catalog-options'` e antes de `export function StepDetails()`

```typescript
// Phase 3 - NBR Validations & Smart Suggestions
import { validateDimensions } from '@/lib/nbr-validations'
import type { QuoteContext, Suggestion } from '@/lib/smart-suggestions'
import { ThicknessCalculator } from '@/components/quote/thickness-calculator'
import { SmartSuggestionsPanel } from '@/components/quote/smart-suggestions-panel'
import { ProductReferenceImages } from '@/components/quote/product-reference-images'
```

---

## 2. ADD locationData TO useQuoteStore (Linha ~55)

**Antes**:

```typescript
const {
  currentItem,
  addItem,
  updateItem,
  editingIndex,
  // ...
} = useQuoteStore()
```

**Depois**:

```typescript
const {
  currentItem,
  locationData, // ADD THIS - Phase 3
  addItem,
  updateItem,
  editingIndex,
  // ...
} = useQuoteStore()
```

---

## 3. CREATE suggestionContext (Após linha ~85, após `const category = ...`)

**NOTA**: Verificar quais state variables existem no componente (glassTexture, hasteSize, etc.) e incluir apenas os que existem.

```typescript
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
    // Adicione Phase 1 conditional fields SE EXISTIREM no componente
    // glassTexture,
    // hasteSize,
    // etc...
  }),
  [category, width, height, glassType, model, color, thickness, finish, glassColor]
)
```

---

## 4. ADD handleApplySuggestion (Após outros handlers)

```typescript
// Phase 3: Handle applying suggestions
const handleApplySuggestion = useCallback(
  (suggestion: Suggestion) => {
    switch (suggestion.field) {
      case 'thickness':
        setThickness(suggestion.value)
        break
      case 'glassType':
        setGlassType(suggestion.value)
        break
      case 'finish':
        setFinish(suggestion.value)
        break
      case 'color':
        setColor(suggestion.value)
        break
      case 'glassColor':
        setGlassColor(suggestion.value)
        break
      case 'model':
        setModel(suggestion.value)
        break
      case 'finishLine':
        setFinishLine(suggestion.value)
        break
      case 'ledTemp':
        setLedTemp(suggestion.value)
        break
      case 'shape':
        setShape(suggestion.value)
        break
      case 'bisoteWidth':
        setBisoteWidth(suggestion.value)
        break
      // Adicione mais cases conforme necessário
    }

    toast({
      title: 'Sugestão aplicada',
      description: suggestion.reason,
    })
  },
  [toast]
)
```

---

## 5. ADD NBR VALIDATION to handleContinue

**Localização**: Dentro da função `handleContinue`, ANTES de criar `newItem`

```typescript
const handleContinue = () => {
  // ... validações existentes ...

  // Phase 3: NBR Validation (ADD BEFORE creating newItem)
  if (width && height && thickness && category) {
    const w = parseFloat(width)
    const h = parseFloat(height)
    const t = parseInt(thickness)

    const validation = validateDimensions({ width: w, height: h, thickness: t }, category as any)

    if (!validation.valid) {
      toast({
        variant: 'destructive',
        title: 'Dimensões não atendem às normas NBR',
        description: validation.message,
      })
      return // Block submission
    }

    if (validation.warning) {
      toast({
        title: 'Atenção',
        description: validation.warning,
      })
    }
  }

  // Continue with creating newItem...
  const newItem = {
    // ...
  }
}
```

---

## 6. ADD showDimensions HELPER (Se não existir)

**Localização**: Após `const category = ...`

```typescript
const showDimensions = category !== 'SERVICOS' && category !== 'FERRAGENS' && category !== 'KITS'
```

---

## 7. ADD ThicknessCalculator JSX

**Localização**: Após os inputs de width/height

**Procurar por**: `<Input id="height" .../>`

**Adicionar DEPOIS**:

```tsx
{
  /* Phase 3: Thickness Calculator */
}
{
  showDimensions && width && height && parseFloat(width) > 0 && parseFloat(height) > 0 && (
    <ThicknessCalculator
      width={parseFloat(width)}
      height={parseFloat(height)}
      application={category as any}
      currentThickness={thickness ? parseInt(thickness) : undefined}
      windZone={locationData?.windZone || 2}
      onApplyThickness={(t) => setThickness(t.toString())}
    />
  )
}
```

---

## 8. ADD SmartSuggestionsPanel JSX

**Localização**: Após TODOS os campos do formulário, antes dos botões

```tsx
{
  /* Phase 3: Smart Suggestions */
}
;<SmartSuggestionsPanel
  context={suggestionContext}
  onApplySuggestion={handleApplySuggestion}
  maxSuggestions={3}
  minConfidence="medium"
/>
```

---

## 9. ADD ProductReferenceImages JSX

**Localização**: Após upload de imagens ou no início do formulário

```tsx
{
  /* Phase 3: Product Reference Images */
}
{
  category && (
    <ProductReferenceImages
      category={category}
      subcategory={model}
      maxImages={4}
      showTitle={true}
    />
  )
}
```

---

## VERIFICAÇÃO FINAL

Após aplicar todas as mudanças:

```bash
# TypeScript
npx tsc --noEmit | grep step-details

# Build (para testar)
pnpm build

# Se OK, commit
git add src/components/quote/steps/step-details.tsx
git commit -m "feat(phase4): Complete visual integration of Phase 3 components in step-details"
```

---

**Arquivo preparado por**: Claude Code
**Data**: 18 Dez 2024
**Referência**: PROXIMOS_PASSOS_FASE4_CONTINUACAO.md
