# 🔍 DEBUG - GUIA DE RESOLUÇÃO DE PROBLEMAS

**Data:** 20/12/2024
**Objetivo:** Diagnosticar e resolver problemas com imagens no wizard

---

## ✅ O QUE JÁ FOI FEITO (100%)

1. ✅ 141 imagens organizadas em 16 subpastas
2. ✅ Componente `ProductReferenceImages` habilitado (código descomentado em 3 locais)
3. ✅ Arrays completos no `product-images.ts` (100% de cobertura)
4. ✅ Função `getImagesForCategory()` atualizada com todos os arrays
5. ✅ Todas as imagens mapeadas com IDs, URLs, alt, category e description

---

## 🎯 TESTES RÁPIDOS

### Teste 1: Verificar se o servidor está rodando

```bash
# Verificar porta 3000
http://localhost:3000

# Se não estiver rodando:
npm run dev
```

**Resultado esperado:** Página inicial carrega normalmente

---

### Teste 2: Navegar até o wizard

```
1. Abrir: http://localhost:3000/orcamento
2. Step 1: Preencher nome, email, telefone → Avançar
3. Step 2: Informar CEP válido → Avançar
4. Step 3: Selecionar CATEGORIA (ex: BOX)
```

**Resultado esperado:**

- Card "Fotos de Referência" aparece
- Grid com 3-4 imagens visíveis
- Imagens carregam automaticamente

---

### Teste 3: Verificar console do navegador

```
1. Abrir DevTools (F12)
2. Ir na aba "Console"
3. Procurar por erros (em vermelho)
```

**Possíveis erros e soluções:**

#### Erro: "404 Not Found - /images/products/..."

**Causa:** Imagem não existe no caminho especificado
**Solução:**

```bash
# Verificar se a imagem existe
ls "public/images/products/box/box-elegance.jpg"

# Se não existir, verificar o nome correto
ls "public/images/products/box/"
```

#### Erro: "Module not found: Can't resolve..."

**Causa:** Importação incorreta no código
**Solução:**

```bash
# Recompilar TypeScript
npm run build

# Reiniciar dev server
Ctrl+C
npm run dev
```

#### Erro: "getImagesForCategory is not a function"

**Causa:** Função não exportada corretamente
**Solução:** Verificar em `src/lib/product-images.ts` se tem:

```typescript
export function getImagesForCategory(category: string): ProductImage[] {
  // ...
}
```

---

## 🔍 DIAGNÓSTICO POR SINTOMA

### Sintoma 1: Card "Fotos de Referência" NÃO aparece

**Possíveis causas:**

1. **Array vazio para a categoria**

   ```typescript
   // Em product-images.ts, verificar se o array tem itens:
   export const BOX_IMAGES: ProductImage[] = [
     // Deveria ter 22 itens aqui
   ]
   ```

   **Solução:** Verificar se o array foi expandido corretamente

2. **Categoria não retorna imagens**

   ```typescript
   // Adicionar debug temporário em getImagesForCategory:
   export function getImagesForCategory(category: string): ProductImage[] {
     const allImages = [...BOX_IMAGES, ...MIRROR_IMAGES, ...]
     const filtered = allImages.filter((img) => img.category === category)
     console.log('🔍 getImagesForCategory:', category, 'returned', filtered.length, 'images')
     console.log('📸 First image:', filtered[0])
     return filtered
   }
   ```

   **Resultado esperado no console:**

   ```
   🔍 getImagesForCategory: BOX returned 22 images
   📸 First image: { id: 'box-1', url: '/images/products/box/...', ... }
   ```

3. **Componente não está montado**
   - Verificar se `ProductReferenceImages` está importado em `step-details.tsx`
   - Verificar se o componente não está sendo escondido por CSS

---

### Sintoma 2: Card aparece MAS está vazio (sem imagens)

**Possíveis causas:**

1. **Imagens comentadas no componente**
   - Verificar `src/components/quote/product-reference-images.tsx` linhas 69-76, 130-143, 188-205
   - Garantir que NÃO tem comentários `{/* ... */}` nas tags `<Image>`

2. **Category não bate**
   ```typescript
   // Em product-reference-images.tsx, adicionar debug:
   const images = getImagesForCategory(selectedCategory)
   console.log('📂 selectedCategory:', selectedCategory)
   console.log('📸 images found:', images.length)
   ```
   **Verificar:** O `selectedCategory` deve ser exatamente igual ao `category` nos arrays
   - Correto: `'BOX'` = `'BOX'` ✅
   - Errado: `'box'` ≠ `'BOX'` ❌

---

### Sintoma 3: Imagens aparecem mas com ícone quebrado (broken image)

**Possíveis causas:**

1. **Path incorreto**

   ```typescript
   // Verificar no array se o path está correto:
   { id: 'box-1', url: '/images/products/box/box-elegance.jpg', ... }
   //                   ↑ Deve começar com /
   //                     ↑ Deve apontar para public/
   ```

2. **Arquivo não existe**

   ```bash
   # Windows
   dir "public\images\products\box\box-elegance.jpg"

   # Linux/Mac
   ls public/images/products/box/box-elegance.jpg
   ```

   **Se não existir:** Ajustar o nome do arquivo ou mover a imagem

3. **Extensão incorreta**
   - Verificar se é `.jpg`, `.jpeg`, `.png` ou `.webp`
   - Verificar se a extensão no código bate com a extensão real do arquivo

---

### Sintoma 4: Apenas ALGUMAS categorias funcionam

**Causa provável:** Arrays não foram todos expandidos

**Solução:**

1. Abrir `src/lib/product-images.ts`
2. Verificar cada array exportado:
   ```typescript
   export const BOX_IMAGES: ProductImage[] = [...]        // ✅ 22 itens
   export const MIRROR_IMAGES: ProductImage[] = [...]     // ✅ 14 itens
   export const DOOR_IMAGES: ProductImage[] = [...]       // ✅ 7 itens
   export const WINDOW_IMAGES: ProductImage[] = [...]     // ✅ 7 itens
   // ... e assim por diante
   ```
3. Contar quantos itens tem cada array
4. Comparar com a tabela esperada:

| Array                | Esperado |
| -------------------- | -------- |
| BOX_IMAGES           | 22       |
| MIRROR_IMAGES        | 14       |
| DOOR_IMAGES          | 7        |
| WINDOW_IMAGES        | 7        |
| GUARD_RAIL_IMAGES    | 10       |
| GLASS_CURTAIN_IMAGES | 9        |
| PERGOLA_IMAGES       | 8        |
| SHELF_IMAGES         | 8        |
| PARTITION_IMAGES     | 10       |
| CLOSURE_IMAGES       | 7        |
| FACHADA_IMAGES       | 4        |
| GLASS_EXAMPLES       | 20       |
| KIT_IMAGES           | 6        |
| SERVICE_IMAGES       | 6        |
| HARDWARE_IMAGES      | 2        |
| PELICULA_IMAGES      | 1        |

---

## 🛠️ FERRAMENTAS DE DEBUG

### Debug 1: Adicionar logs no componente

Editar `src/components/quote/product-reference-images.tsx`:

```typescript
export function ProductReferenceImages({ selectedCategory }: ProductReferenceImagesProps) {
  const images = getImagesForCategory(selectedCategory)

  // 🔍 DEBUG: Adicionar estes logs
  console.log('=== ProductReferenceImages DEBUG ===')
  console.log('selectedCategory:', selectedCategory)
  console.log('images found:', images.length)
  console.log('first 3 images:', images.slice(0, 3))
  console.log('====================================')

  // ... resto do código
}
```

**Abrir console (F12) e verificar a saída**

---

### Debug 2: Verificar arquivos físicos

```bash
# Contar quantas imagens existem por categoria
ls public/images/products/box/ | wc -l           # Deve mostrar 22
ls public/images/products/espelhos/ | wc -l      # Deve mostrar 14
ls public/images/products/vidros/ | wc -l        # Deve mostrar 20

# Windows PowerShell
(Get-ChildItem "public\images\products\box").Count
(Get-ChildItem "public\images\products\espelhos").Count
```

---

### Debug 3: Validar arrays no código

```typescript
// Adicionar no final de product-images.ts:
console.log('=== IMAGE ARRAYS VALIDATION ===')
console.log('BOX_IMAGES:', BOX_IMAGES.length)
console.log('MIRROR_IMAGES:', MIRROR_IMAGES.length)
console.log('DOOR_IMAGES:', DOOR_IMAGES.length)
console.log('WINDOW_IMAGES:', WINDOW_IMAGES.length)
console.log('GUARD_RAIL_IMAGES:', GUARD_RAIL_IMAGES.length)
console.log('GLASS_CURTAIN_IMAGES:', GLASS_CURTAIN_IMAGES.length)
console.log('PERGOLA_IMAGES:', PERGOLA_IMAGES.length)
console.log('SHELF_IMAGES:', SHELF_IMAGES.length)
console.log('PARTITION_IMAGES:', PARTITION_IMAGES.length)
console.log('CLOSURE_IMAGES:', CLOSURE_IMAGES.length)
console.log('FACHADA_IMAGES:', FACHADA_IMAGES.length)
console.log('GLASS_EXAMPLES:', GLASS_EXAMPLES.length)
console.log('KIT_IMAGES:', KIT_IMAGES.length)
console.log('SERVICE_IMAGES:', SERVICE_IMAGES.length)
console.log('HARDWARE_IMAGES:', HARDWARE_IMAGES.length)
console.log('PELICULA_IMAGES:', PELICULA_IMAGES.length)
console.log('===============================')
```

**Resultado esperado:**

```
BOX_IMAGES: 22
MIRROR_IMAGES: 14
DOOR_IMAGES: 7
WINDOW_IMAGES: 7
GUARD_RAIL_IMAGES: 10
GLASS_CURTAIN_IMAGES: 9
PERGOLA_IMAGES: 8
SHELF_IMAGES: 8
PARTITION_IMAGES: 10
CLOSURE_IMAGES: 7
FACHADA_IMAGES: 4
GLASS_EXAMPLES: 20
KIT_IMAGES: 6
SERVICE_IMAGES: 6
HARDWARE_IMAGES: 2
PELICULA_IMAGES: 1
```

---

## 🔧 SOLUÇÕES RÁPIDAS

### Solução 1: Cache do navegador

```
1. Abrir DevTools (F12)
2. Clicar com botão direito no botão de reload
3. Selecionar "Limpar cache e recarregar forçado"

Ou: Ctrl + Shift + R (Windows/Linux)
Ou: Cmd + Shift + R (Mac)
```

---

### Solução 2: Reiniciar servidor dev

```bash
# Matar servidor atual
Ctrl + C

# Limpar cache do Next.js
rm -rf .next

# Reinstalar dependências (se necessário)
npm install

# Reiniciar
npm run dev
```

---

### Solução 3: Verificar importações

Em `step-details.tsx`, garantir que tem:

```typescript
import { ProductReferenceImages } from '@/components/quote/product-reference-images'
```

E no JSX:

```tsx
<ProductReferenceImages selectedCategory={selectedCategory} />
```

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Use esta checklist para garantir que tudo está correto:

- [ ] Servidor dev está rodando (`npm run dev`)
- [ ] Pasta `public/images/products/` existe e tem 16 subpastas
- [ ] Arquivo `src/lib/product-images.ts` foi atualizado
- [ ] Todos os arrays têm o número correto de itens (verificar tabela)
- [ ] Componente `ProductReferenceImages` está descomentado
- [ ] Componente é importado e usado em `step-details.tsx`
- [ ] Console (F12) não mostra erros em vermelho
- [ ] Cache do navegador foi limpo (Ctrl+Shift+R)

---

## 🆘 ÚLTIMOS RECURSOS

### Se NADA funcionar:

1. **Comparar com arquivo de backup**

   ```bash
   git diff src/lib/product-images.ts
   git diff src/components/quote/product-reference-images.tsx
   ```

2. **Reverter e reaplicar**

   ```bash
   git checkout src/lib/product-images.ts
   # Reaplicar manualmente as mudanças
   ```

3. **Usar arquivo gerado**
   - Abrir `image-mappings-generated.ts`
   - Copiar os arrays completos de lá
   - Colar em `product-images.ts`

---

## 📞 INFORMAÇÕES DE SUPORTE

### Arquivos de Referência:

- **Mapeamento gerado:** `image-mappings-generated.ts`
- **Componente:** `src/components/quote/product-reference-images.tsx`
- **Biblioteca:** `src/lib/product-images.ts`
- **Documentação completa:** `EXPANSAO_IMAGENS_COMPLETA.md`

### Comandos Úteis:

```bash
# Verificar estrutura de pastas
tree public/images/products/

# Verificar TypeScript
npx tsc --noEmit

# Verificar build
npm run build

# Limpar tudo e recomeçar
rm -rf .next node_modules
npm install
npm run dev
```

---

**🎯 OBJETIVO FINAL:**

Ao selecionar qualquer categoria no wizard de orçamento (Step 3),
o card "Fotos de Referência" deve aparecer com 3-4 imagens reais da categoria selecionada.

**Se seguiu todos os passos e ainda não funciona, compartilhe:**

1. Qual categoria você testou?
2. O que aparece no console (F12)?
3. O card aparece vazio ou não aparece?
4. Tem erros em vermelho no console?

Com essas informações, posso diagnosticar exatamente o problema!

---

**Criado em:** 20/12/2024
**Última atualização:** 20/12/2024
