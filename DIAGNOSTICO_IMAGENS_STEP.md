# 🔍 DIAGNÓSTICO - IMAGENS NO WIZARD

**Data:** 20/12/2024
**Problema Relatado:** "Imagens na 2 etapa ainda não estão sendo carregadas mapeadamente"

---

## 📍 IDENTIFICAÇÃO DO PROBLEMA

### Qual etapa você está vendo?

O wizard tem 4 etapas:

1. **Step Customer** (Etapa 1) - Dados do cliente
2. **Step Location** (Etapa 2) - CEP e localização ← **NÃO TEM IMAGENS**
3. **Step Details** (Etapa 3) - Detalhes do produto ← **AQUI TEM AS IMAGENS**
4. **Step Accessories** (Etapa 4) - Acessórios

---

## ⚠️ ESCLARECIMENTO IMPORTANTE

### Step Location (Etapa 2) = SEM IMAGENS

A **Etapa 2 (CEP/Localização)** NÃO tem e NÃO deveria ter imagens de produtos!

Ela apenas:

- ✅ Coleta o CEP
- ✅ Busca endereço via API
- ✅ Mostra informações de região
- ✅ Mostra zona de vento
- ❌ **NÃO tem fotos de referência de produtos**

### Step Details (Etapa 3) = COM IMAGENS

A **Etapa 3 (Detalhes do Produto)** é onde aparecem as fotos de referência!

Componente usado:

```tsx
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

## 🔍 POSSÍVEIS PROBLEMAS

### Problema 1: Variável `category` está vazia

**Sintoma:** Card de imagens não aparece

**Causa:** A prop `category` passada para `ProductReferenceImages` pode estar undefined/null

**Como verificar:**

1. Abrir DevTools (F12)
2. Na aba Console, adicionar log temporário:

Em `step-details.tsx`, linha ~727, adicionar:

```tsx
{
  category && (
    <>
      {console.log('🔍 Category:', category, 'Model:', model)}
      <ProductReferenceImages
        category={category}
        subcategory={model}
        maxImages={4}
        showTitle={true}
      />
    </>
  )
}
```

**Resultado esperado no console:**

```
🔍 Category: BOX Model: FRONTAL
```

---

### Problema 2: Mapeamento de categoria incorreto

**Sintoma:** Imagens não aparecem para algumas categorias

**Causa:** Nome da categoria no formulário ≠ nome da categoria no array de imagens

**Exemplo de erro:**

```typescript
// No formulário
category: 'box' // minúsculo ❌

// No array
category: 'BOX' // maiúsculo ✅
```

**Como verificar:**

Em `product-reference-images.tsx`, linha ~39, adicionar:

```tsx
const images =
  subcategory || model
    ? getImagesForSubcategory(category, subcategory || model || '')
    : getImagesForCategory(category)

// 🔍 DEBUG
console.log('📸 ProductReferenceImages:', {
  category,
  subcategory,
  model,
  imagesFound: images.length,
  displayImages: displayImages.length,
})
```

**Resultado esperado:**

```
📸 ProductReferenceImages: {
  category: "BOX",
  subcategory: undefined,
  model: "FRONTAL",
  imagesFound: 22,
  displayImages: 4
}
```

---

### Problema 3: getImagesForCategory retorna vazio

**Sintoma:** Card aparece mas sem imagens

**Causa:** Array da categoria está vazio ou categoria não existe

**Como verificar:**

Em `product-images.ts`, adicionar debug em `getImagesForCategory`:

```typescript
export function getImagesForCategory(category: string): ProductImage[] {
  const allImages = [
    ...BOX_IMAGES,
    ...MIRROR_IMAGES,
    // ... etc
  ]

  const filtered = allImages.filter((img) => img.category === category)

  // 🔍 DEBUG
  console.log('🔎 getImagesForCategory:', {
    requestedCategory: category,
    totalImages: allImages.length,
    filteredImages: filtered.length,
    sample: filtered[0],
  })

  return filtered
}
```

**Resultado esperado:**

```
🔎 getImagesForCategory: {
  requestedCategory: "BOX",
  totalImages: 146,
  filteredImages: 22,
  sample: { id: 'box-1', url: '/images/products/box/...', ... }
}
```

---

## 🎯 TESTE PASSO A PASSO

### Para testar as imagens corretamente:

```
1. Abrir: http://localhost:3000/orcamento

2. ETAPA 1 (Dados do Cliente):
   - Preencher Nome: "Teste"
   - Preencher Email: "teste@teste.com"
   - Preencher Telefone: "(11) 98765-4321"
   - Clicar "Continuar"

3. ETAPA 2 (Localização):
   ❌ NÃO TEM IMAGENS AQUI!
   - Preencher CEP: "01310-100"
   - Aguardar buscar endereço
   - Clicar "Continuar"

4. ETAPA 3 (Detalhes do Produto):
   ✅ AQUI TEM AS IMAGENS!
   - Selecionar Categoria: "BOX"
   - Selecionar Modelo: qualquer
   - 👀 Procurar pelo card "Fotos de Referência"
   - 👀 Ver grid com 3-4 imagens
```

---

## 🔧 SOLUÇÕES RÁPIDAS

### Solução 1: Normalizar nome da categoria

Se a categoria está em minúsculo no formulário, ajustar:

```typescript
// Em step-details.tsx, ao passar para ProductReferenceImages:
<ProductReferenceImages
  category={category?.toUpperCase()}  // ← Forçar maiúsculo
  subcategory={model}
  maxImages={4}
  showTitle={true}
/>
```

### Solução 2: Verificar validação condicional

O componente só renderiza se `category` existe:

```tsx
{category && (  // ← Se category for undefined, não renderiza
  <ProductReferenceImages ... />
)}
```

Verificar se `category` está sendo setada corretamente no store.

### Solução 3: Limpar cache

```bash
# Ctrl+C para parar servidor
rm -rf .next
npm run dev
```

---

## 📊 CHECKLIST DE VERIFICAÇÃO

Marque o que você está vendo:

### Na Etapa 2 (CEP):

- [ ] Vejo o campo de CEP
- [ ] CEP busca endereço corretamente
- [ ] Vejo informações de região/zona de vento
- [ ] **NÃO DEVERIA VER** card de "Fotos de Referência" aqui

### Na Etapa 3 (Detalhes):

- [ ] Vejo seleção de categoria
- [ ] Vejo seleção de modelo/tipo
- [ ] Vejo sliders de medidas
- [ ] **DEVERIA VER** card "Fotos de Referência" aqui
- [ ] Card aparece mas vazio?
- [ ] Card não aparece?
- [ ] Imagens aparecem mas quebradas?

---

## 📞 INFORMAÇÕES NECESSÁRIAS

Para diagnosticar melhor, me informe:

1. **Qual etapa exatamente?**
   - Etapa 1 (dados do cliente)?
   - Etapa 2 (CEP)?
   - Etapa 3 (detalhes do produto)?

2. **O que você vê?**
   - Card "Fotos de Referência" não aparece?
   - Card aparece vazio (sem imagens)?
   - Imagens aparecem mas quebradas?

3. **Qual categoria você selecionou?**
   - BOX?
   - ESPELHOS?
   - PORTAS?
   - Outra?

4. **Console do navegador (F12):**
   - Tem erros em vermelho?
   - Tem avisos de imagem 404?
   - Copie e cole os erros aqui

Com essas informações, posso identificar e corrigir o problema exato!

---

**Criado em:** 20/12/2024
**Objetivo:** Identificar onde exatamente está o problema com as imagens
