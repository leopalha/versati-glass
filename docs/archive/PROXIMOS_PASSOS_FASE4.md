# PRÓXIMOS PASSOS - FASE 4 E ALÉM

## 📋 STATUS ATUAL

### ✅ COMPLETO (Fases 1, 2 e 3)

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTAÇÃO CONCLUÍDA                       │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Fase 1: 17 campos condicionais (558 linhas)                 │
│ ✅ Fase 2: 2 formulários específicos (1,050 linhas)            │
│ ✅ Fase 3: Validações NBR + Sugestões (2,614 linhas)           │
│                                                                  │
│ Total: 4,222 linhas | Cobertura: 93% | Commit: ae99ba3         │
└─────────────────────────────────────────────────────────────────┘
```

**Componentes Criados na Fase 3:**

- ✅ `nbr-validations.ts` - Sistema de validações NBR (4 normas)
- ✅ `smart-suggestions.ts` - Engine de 625 sugestões inteligentes
- ✅ `product-images.ts` - Biblioteca de 31 imagens catalogadas
- ✅ `thickness-calculator.tsx` - Calculadora automática NBR 14488
- ✅ `smart-suggestions-panel.tsx` - Painel visual de sugestões
- ✅ `product-reference-images.tsx` - Galeria de fotos
- ✅ `tooltip.tsx` - Tooltips NBR informativos
- ✅ `08-ferragens-kits-flow.spec.ts` - 9 testes E2E

---

## 🎯 FASE 4 - INTEGRAÇÃO VISUAL (PRÓXIMA SESSÃO)

### Objetivo

Integrar os componentes da Fase 3 nos formulários existentes para que os usuários possam usá-los.

### Tempo Estimado

2-3 horas

### Tarefas

#### 1. Integrar no step-details.tsx

**Prioridade**: 🔴 ALTA

- [ ] **Imports**

  ```typescript
  import { ThicknessCalculator } from '@/components/quote/thickness-calculator'
  import { SmartSuggestionsPanel } from '@/components/quote/smart-suggestions-panel'
  import { ProductReferenceImages } from '@/components/quote/product-reference-images'
  import { NBRTooltip } from '@/components/ui/tooltip'
  import { validateDimensions, type GlassApplication } from '@/lib/nbr-validations'
  import type { QuoteContext } from '@/lib/smart-suggestions'
  ```

- [ ] **Criar suggestionContext com useMemo**

  ```typescript
  const suggestionContext: QuoteContext = useMemo(() => ({
    category,
    width: width ? parseFloat(width) : undefined,
    height: height ? parseFloat(height) : undefined,
    glassType,
    model,
    color,
    thickness: thickness ? parseInt(thickness) : undefined,
    // ... todos os campos Phase 1
  }), [category, width, height, glassType, model, color, thickness, ...])
  ```

- [ ] **Adicionar handleApplySuggestion**

  ```typescript
  const handleApplySuggestion = useCallback(
    (field: string, value: string) => {
      const setters = {
        thickness: setThickness,
        glassType: setGlassType,
        model: setModel,
        color: setColor,
        // ... todos os campos
      }
      if (setters[field]) {
        setters[field](value)
        toast({ title: 'Sugestão aplicada!' })
      }
    },
    [toast]
  )
  ```

- [ ] **Adicionar NBRTooltip nos labels**
  - Width: "Dimensões segundo NBR 14718"
  - Height: "Dimensões segundo NBR 14718"
  - Thickness: "Espessura Mínima NBR 14488"

- [ ] **Adicionar ThicknessCalculator**

  ```tsx
  {
    width && height && parseFloat(width) > 0 && parseFloat(height) > 0 && (
      <ThicknessCalculator
        width={parseFloat(width)}
        height={parseFloat(height)}
        application={(category as GlassApplication) || 'JANELA'}
        currentThickness={thickness ? parseInt(thickness) : undefined}
        windZone={windZone}
        onApplyThickness={(t) => setThickness(t.toString())}
      />
    )
  }
  ```

- [ ] **Adicionar SmartSuggestionsPanel**

  ```tsx
  <SmartSuggestionsPanel
    context={suggestionContext}
    onApplySuggestion={handleApplySuggestion}
    maxSuggestions={3}
    minConfidence="medium"
  />
  ```

- [ ] **Adicionar ProductReferenceImages**

  ```tsx
  {
    currentProduct && (
      <ProductReferenceImages
        category={category}
        subcategory={model}
        maxImages={4}
        showTitle={true}
      />
    )
  }
  ```

- [ ] **Validação NBR no handleContinue**

  ```typescript
  if (width && height && thickness) {
    const validation = validateDimensions(
      { width: parseFloat(width), height: parseFloat(height), thickness: parseInt(thickness) },
      (category as GlassApplication) || 'JANELA'
    )

    if (!validation.valid) {
      toast({ variant: 'error', title: validation.message, description: validation.recommendation })
      return
    }

    if (validation.severity === 'warning') {
      toast({ variant: 'warning', title: validation.message })
    }
  }
  ```

**Arquivos a Modificar:**

- `src/components/quote/steps/step-details.tsx`

---

#### 2. Mapear CEP → Zona de Vento

**Prioridade**: 🔴 ALTA

- [ ] **Criar wind-zone-mapping.ts**

  ```typescript
  // src/lib/wind-zone-mapping.ts
  export function getWindZoneFromState(state: string): number {
    const windZones: Record<string, number> = {
      // Zona 1 - Interior
      MG: 1,
      GO: 1,
      MT: 1,
      MS: 1,
      DF: 1,
      TO: 1,
      // Zona 2 - Costa distante
      SP: 2,
      PR: 2,
      SC: 2,
      RS: 2,
      // Zona 3 - Costa próxima
      RJ: 3,
      ES: 3,
      BA: 3,
      SE: 3,
      AL: 3,
      // Zona 4 - Costa exposta
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
    }
    return windZones[state] || 2 // Default: zona 2
  }

  export function getWindZoneFromCEP(cepData: { uf: string }): number {
    return getWindZoneFromState(cepData.uf)
  }
  ```

- [ ] **Adicionar windZone ao store**

  ```typescript
  // src/store/quote-store.ts
  interface QuoteStore {
    windZone: number
    setWindZone: (zone: number) => void
  }

  // No estado inicial
  windZone: 2, // Default
  setWindZone: (zone) => set({ windZone: zone }),
  ```

- [ ] **Atualizar step-location.tsx**

  ```typescript
  import { getWindZoneFromCEP } from '@/lib/wind-zone-mapping'

  const handleCEPSubmit = async () => {
    // ... fetch CEP data ...
    const data = await response.json()

    // Determinar zona de vento
    const zone = getWindZoneFromCEP(data)
    setWindZone(zone)

    logger.info('[CEP] Wind zone determined:', { state: data.uf, zone })

    // ... continue with location save ...
  }
  ```

**Arquivos a Criar:**

- `src/lib/wind-zone-mapping.ts`

**Arquivos a Modificar:**

- `src/store/quote-store.ts`
- `src/components/quote/steps/step-location.tsx`

---

#### 3. Adicionar Imagens nos Cards de Produto

**Prioridade**: 🟡 MÉDIA

- [ ] **Integrar em step-product.tsx**

  ```tsx
  import { CompactImageCarousel } from '@/components/quote/product-reference-images'

  // Dentro do ProductCard
  ;<Card>
    <h3>{product.name}</h3>
    <p>{product.description}</p>

    <CompactImageCarousel category={product.category} subcategory={product.slug} maxImages={3} />

    <Button onClick={() => selectProduct(product)}>Selecionar</Button>
  </Card>
  ```

**Arquivos a Modificar:**

- `src/components/quote/steps/step-product.tsx`

---

#### 4. Instalar Dependência Radix UI Tooltip

**Prioridade**: 🔴 ALTA

- [ ] **Instalar package**

  ```bash
  npm install @radix-ui/react-tooltip
  ```

- [ ] **Atualizar package.json**
  - Verificar se foi adicionado corretamente

---

#### 5. Testes

**Prioridade**: 🟡 MÉDIA

- [ ] **Testar calculadora com diferentes dimensões**
  - 1x2m (box frontal)
  - 2x2m (guarda-corpo)
  - 0.5x1m (janela pequena)

- [ ] **Testar sugestões em diferentes categorias**
  - BOX → deve sugerir temperado
  - PORTAS → deve sugerir puxador e fechadura
  - GUARDA_CORPO → deve sugerir laminado + corrimão

- [ ] **Testar validações NBR**
  - Erro: 6mm com 5m² de área
  - Warning: 8mm com 4m² de área
  - OK: 10mm com 4m² de área

- [ ] **Testar modal de imagens**
  - Clicar em imagem → abre modal
  - Modal mostra imagem grande
  - Fechar modal funciona

- [ ] **Rodar testes E2E**
  ```bash
  npx playwright test e2e/08-ferragens-kits-flow.spec.ts
  ```

---

### Entregáveis da Fase 4

1. ✅ Calculadora de espessura funcionando nos formulários
2. ✅ Sugestões inteligentes aparecendo contextualmente
3. ✅ Tooltips NBR em todos os campos relevantes
4. ✅ Imagens de referência nos cards e formulários
5. ✅ Zona de vento mapeada automaticamente por CEP
6. ✅ Validações NBR bloqueando/alertando dimensões inválidas

---

## 🚀 FASE 5 - FOTOS REAIS (MÉDIO PRAZO)

### Objetivo

Substituir placeholders por fotos reais dos produtos da Versati Glass.

### Tempo Estimado

4-6 horas (incluindo fotografia)

### Tarefas

- [ ] **Fotografar produtos**
  - 📦 BOX: Frontal, Canto, Articulado (3 fotos)
  - 🪞 ESPELHOS: Comum, Bronze, Bisotê, LED (4 fotos)
  - 🚪 PORTAS: Abrir, Correr, Pivotante, Camarão (4 fotos)
  - 🪟 JANELAS: Fixa, Maxim-ar, Basculante, Correr (4 fotos)
  - 🛡️ GUARDA_CORPO: Vidro, Inox, com Corrimão (3 fotos)
  - Outras categorias conforme catálogo

- [ ] **Otimizar fotos**
  - Converter para WebP (melhor compressão)
  - Criar 3 tamanhos: thumb (300px), medium (800px), large (1200px)
  - Comprimir com qualidade 85%
  - Adicionar lazy loading

- [ ] **Atualizar product-images.ts**

  ```typescript
  {
    id: 'box-frontal',
    url: '/images/products/box-frontal.webp', // ← real photo
    alt: 'Box Frontal em Vidro Temperado',
    category: 'BOX',
    subcategory: 'FRONTAL',
    description: 'Box frontal com 1 ou 2 folhas de correr',
  }
  ```

- [ ] **Descomentar componentes Image**
  - Em `product-reference-images.tsx`
  - Remover placeholders
  - Habilitar componente Next.js Image

- [ ] **Testar carregamento**
  - Verificar lazy loading funcionando
  - Testar responsividade em mobile/desktop
  - Medir performance (Lighthouse)

---

## 📊 FASE 6 - TESTES E2E COMPLETOS (MÉDIO PRAZO)

### Objetivo

Expandir cobertura de testes E2E para todos os fluxos críticos.

### Tempo Estimado

3-4 horas

### Tarefas

- [ ] **Criar teste: Quote completo com validação NBR**

  ```typescript
  test('should validate dimensions according to NBR', async ({ page }) => {
    // 1. Tentar criar box com dimensões inválidas (6mm, 5m²)
    // 2. Ver mensagem de erro NBR
    // 3. Ajustar espessura para 10mm
    // 4. Validação passar
    // 5. Completar orçamento
  })
  ```

- [ ] **Criar teste: Calculadora de espessura**

  ```typescript
  test('should calculate thickness automatically', async ({ page }) => {
    // 1. Preencher width: 2m, height: 2m
    // 2. Ver calculadora aparecer
    // 3. Ver recomendação: 10mm
    // 4. Clicar "Aplicar"
    // 5. Campo thickness preenchido automaticamente
  })
  ```

- [ ] **Criar teste: Sugestões inteligentes**

  ```typescript
  test('should show and apply smart suggestions', async ({ page }) => {
    // 1. Selecionar categoria BOX
    // 2. Ver sugestão "Vidro temperado obrigatório"
    // 3. Clicar "Aplicar"
    // 4. Campo glassType preenchido com TEMPERADO
  })
  ```

- [ ] **Criar teste: Imagens de referência**

  ```typescript
  test('should show and zoom product images', async ({ page }) => {
    // 1. Selecionar produto
    // 2. Ver galeria de imagens
    // 3. Clicar em imagem
    // 4. Modal de zoom abre
    // 5. Fechar modal
  })
  ```

- [ ] **Criar teste: Zona de vento por CEP**

  ```typescript
  test('should determine wind zone from CEP', async ({ page }) => {
    // 1. Preencher CEP do Rio de Janeiro (zona 3)
    // 2. Continuar para formulário
    // 3. Calculadora usar zona 3 (vento alto)
    // 4. Espessura recomendada maior
  })
  ```

- [ ] **Atualizar teste de smoke**
  - Adicionar verificação de tooltips NBR
  - Verificar calculadora renderiza
  - Verificar sugestões aparecem

---

## 🎨 FASE 7 - MELHORIAS DE UX (LONGO PRAZO)

### Objetivo

Refinar experiência do usuário com base em feedback.

### Tarefas Potenciais

- [ ] **Animações suaves**
  - Transições entre steps
  - Fade in/out de componentes
  - Loading states

- [ ] **Feedback visual melhorado**
  - Checkmarks em campos validados
  - Progress bar mais detalhado
  - Indicadores de campos obrigatórios

- [ ] **Acessibilidade**
  - ARIA labels completos
  - Navegação por teclado
  - Screen reader friendly

- [ ] **Mobile first**
  - Otimizar formulários para mobile
  - Touch targets maiores
  - Scroll suave

---

## 🤖 FASE 8 - MACHINE LEARNING (BACKLOG)

### Objetivo

Sugestões baseadas em histórico de orçamentos.

### Tarefas Potenciais

- [ ] **Análise de orçamentos anteriores**
  - Produtos frequentemente combinados
  - Padrões de dimensões
  - Preferências por região

- [ ] **Recomendações inteligentes**
  - "Clientes que compraram X também compraram Y"
  - "Dimensões típicas para este produto"
  - "Preço estimado baseado em orçamentos similares"

- [ ] **Previsão de preço**
  - ML model para estimar preço final
  - Considerar: dimensões, produtos, região, urgência

---

## 📈 FASE 9 - INTEGRAÇÃO COM FORNECEDORES (BACKLOG)

### Objetivo

Preços e disponibilidade em tempo real.

### Tarefas Potenciais

- [ ] **API de fornecedores**
  - Integrar com APIs de vidraçarias
  - Obter preços em tempo real
  - Verificar disponibilidade de estoque

- [ ] **Cálculo de prazo**
  - Tempo de produção
  - Tempo de entrega
  - Prazos diferenciados por urgência

- [ ] **Sistema de comparação**
  - Comparar preços de múltiplos fornecedores
  - Exibir opções ao usuário
  - Facilitar seleção

---

## 🗓️ CRONOGRAMA SUGERIDO

### Semana 1-2 (Próximas Sessões)

- ✅ **Fase 4**: Integração Visual (PRIORITÁRIO)
  - Dia 1-2: Integrar step-details.tsx
  - Dia 3: Mapear CEP → Zona de Vento
  - Dia 4: Adicionar imagens nos cards
  - Dia 5: Testes e ajustes

### Semana 3-4

- 📸 **Fase 5**: Fotos Reais
  - Semana 3: Fotografar produtos
  - Semana 4: Otimizar e integrar

### Mês 2

- 🧪 **Fase 6**: Testes E2E Completos
- 🎨 **Fase 7**: Melhorias de UX

### Mês 3+

- 🤖 **Fase 8**: Machine Learning (se aplicável)
- 📈 **Fase 9**: Integração Fornecedores (se aplicável)

---

## ✅ CHECKLIST PARA PRÓXIMA SESSÃO

### Antes de Começar

- [ ] Revisar documentação da Fase 3
  - `SESSAO_18_DEZ_FASE3_COMPLETA.md`
  - `docs/PHASE3_INTEGRATION_GUIDE.md`

- [ ] Verificar ambiente
  - Node.js rodando
  - PostgreSQL ativo
  - Dependências atualizadas

- [ ] Git status limpo
  - Commit da Fase 3 confirmado (ae99ba3)
  - Branch main atualizada

### Durante a Sessão

1. **Instalar @radix-ui/react-tooltip**

   ```bash
   npm install @radix-ui/react-tooltip
   ```

2. **Criar wind-zone-mapping.ts**

3. **Modificar quote-store.ts** (adicionar windZone)

4. **Modificar step-location.tsx** (mapear CEP → zona)

5. **Modificar step-details.tsx** (integrar todos componentes Fase 3)

6. **Testar manualmente**
   - Fluxo completo de orçamento
   - Calculadora funcionando
   - Sugestões aparecem
   - Validações NBR ativas

7. **Commit Fase 4**
   ```bash
   git add -A
   git commit -m "feat(phase4): Integrate NBR validations and smart suggestions in forms"
   ```

---

## 📚 REFERÊNCIAS ÚTEIS

### Documentação Técnica

- [NBR Validations API](d:\VERSATI GLASS\src\lib\nbr-validations.ts)
- [Smart Suggestions Engine](d:\VERSATI GLASS\src\lib\smart-suggestions.ts)
- [Product Images Library](d:\VERSATI GLASS\src\lib\product-images.ts)

### Guias de Integração

- [Integration Guide Phase 3](d:\VERSATI GLASS\docs\PHASE3_INTEGRATION_GUIDE.md)
- [Sessão Completa Fase 3](d:\VERSATI GLASS\SESSAO_18_DEZ_FASE3_COMPLETA.md)

### Testes

- [E2E Tests FERRAGENS/KITS](d:\VERSATI GLASS\e2e\08-ferragens-kits-flow.spec.ts)

### Componentes

- [ThicknessCalculator](d:\VERSATI GLASS\src\components\quote\thickness-calculator.tsx)
- [SmartSuggestionsPanel](d:\VERSATI GLASS\src\components\quote\smart-suggestions-panel.tsx)
- [ProductReferenceImages](d:\VERSATI GLASS\src\components\quote\product-reference-images.tsx)
- [NBRTooltip](d:\VERSATI GLASS\src\components\ui\tooltip.tsx)

---

## 💡 DICAS IMPORTANTES

### Performance

- ⚡ Usar useMemo para suggestionContext (evita recálculos)
- ⚡ Lazy load de imagens (Next.js Image component)
- ⚡ Debounce em campos de input (evita cálculos excessivos)

### UX

- 🎯 Mostrar calculadora só quando há dimensões válidas
- 🎯 Filtrar sugestões já aplicadas (evita repetição)
- 🎯 Exibir tooltips em hover (desktop) e touch (mobile)
- 🎯 Validações não bloqueantes (warnings) vs bloqueantes (errors)

### Manutenção

- 📝 Manter documentação atualizada
- 📝 Adicionar comentários em lógica complexa
- 📝 Seguir padrões de código existentes
- 📝 Testar em diferentes navegadores

---

## 🎯 MÉTRICAS DE SUCESSO

### Fase 4 (Integração Visual)

**Critérios de Aceitação:**

- ✅ Calculadora NBR aparece e funciona corretamente
- ✅ Sugestões aparecem contextualmente (min 1 por categoria)
- ✅ Tooltips NBR exibem informações corretas
- ✅ Imagens de referência carregam (placeholders ok)
- ✅ Zona de vento mapeada corretamente (SP=2, RJ=3, etc)
- ✅ Validações NBR bloqueiam dimensões inválidas
- ✅ 0 erros TypeScript
- ✅ Build executado com sucesso
- ✅ Testes E2E passando (incluindo novos da Fase 3)

**Métricas Quantitativas:**

- Tempo de integração: ≤ 3 horas
- Bugs encontrados: ≤ 5
- Cobertura de testes: ≥ 80%
- Performance (Lighthouse): ≥ 85

---

**Última atualização**: 18 de Dezembro de 2024
**Versão**: 1.0.0
**Status**: ✅ Pronto para Fase 4
**Próximo Milestone**: Integração Visual Completa
