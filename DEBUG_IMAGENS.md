# 🔍 DEBUG - IMAGENS NÃO CARREGAM

**Data:** 21/12/2024
**Problema:** Imagens ainda não aparecem no wizard após todas as correções

---

## ✅ O QUE JÁ FOI FEITO

1. ✅ 141 imagens organizadas em subpastas
2. ✅ Componente `ProductReferenceImages` habilitado (código descomentado)
3. ✅ Arrays `KIT_IMAGES` e `SERVICE_IMAGES` adicionados ao `product-images.ts`
4. ✅ Função `getImagesForCategory` atualizada para incluir novos arrays

---

## 🔍 DIAGNÓSTICO NECESSÁRIO

### Preciso que você me informe:

**1. O card "Fotos de Referência" aparece?**

- [ ] Sim, vejo o card mas está vazio
- [ ] Não, não vejo o card

**2. Qual categoria você testou?**

- BOX? ESPELHOS? KITS? SERVICOS?

**3. Console do navegador (F12)**

- Tem erros em vermelho?
- Tem avisos de imagens 404?
- Copie qualquer mensagem de erro aqui

**4. Servidor dev**

- O comando `npm run dev` está rodando?
- Tem erros no terminal?

---

## 🎯 POSSÍVEIS CAUSAS

### Causa 1: Arrays não estão sendo usados

**Sintoma:** Card não aparece ou aparece vazio

**Solução:**
Verificar se `BOX_IMAGES` realmente tem 4 itens:

```typescript
// Em product-images.ts, linha 28-58
export const BOX_IMAGES: ProductImage[] = [
  // Deveria ter 4 objetos aqui
]
```

### Causa 2: Paths das imagens incorretos

**Sintoma:** Erros 404 no console

**Solução:**
Verificar se arquivo existe:

```
public/images/products/box/box-elegance.jpg
```

### Causa 3: Servidor não foi reiniciado

**Sintoma:** Mudanças não aplicadas

**Solução:**

```bash
# Matar servidor antigo
Ctrl+C

# Reiniciar
npm run dev
```

### Causa 4: getImagesForCategory retorna vazio

**Sintoma:** Card não renderiza

**Solução:**
Adicionar debug temporário em `product-images.ts`:

```typescript
export function getImagesForCategory(category: string): ProductImage[] {
  const allImages = [
    ...BOX_IMAGES,
    ...MIRROR_IMAGES,
    // ...
  ]

  const filtered = allImages.filter((img) => img.category === category)
  console.log('getImagesForCategory', category, 'returned', filtered.length, 'images')
  console.log('First image:', filtered[0])

  return filtered
}
```

---

## 🚀 PRÓXIMA AÇÃO

**Por favor, me forneça as informações acima para eu diagnosticar exatamente o problema!**

Especialmente:

1. Mensagens de erro no console (F12)
2. Qual categoria você testou
3. Se o card aparece ou não

Com essas informações, vou identificar e corrigir o problema rapidamente!
