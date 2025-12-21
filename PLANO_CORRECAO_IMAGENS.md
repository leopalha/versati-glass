# 🖼️ PLANO DE CORREÇÃO - IMAGENS NO WIZARD DE ORÇAMENTO

**Data:** 20/12/2024
**Problema Identificado:** Imagens de referência no Step 3 do wizard estão desabilitadas com placeholders

---

## 📊 DIAGNÓSTICO COMPLETO

### Problema Principal

O componente `ProductReferenceImages` está **IMPLEMENTADO** mas com as imagens **COMENTADAS** (linhas 73-81 e 139-148).

```tsx
// Código atual (DESABILITADO):
;<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-800">
  <ImageIcon className="h-12 w-12 text-neutral-600" />
</div>
{
  /* Uncomment when images are ready:
<Image src={image.url} alt={image.alt} fill className="object-cover" ... />
*/
}
```

### Status das Imagens

#### ✅ IMAGENS EXISTENTES (parcial)

**Categorias com imagens em `public/images/products/`:**

1. **BOX** - ✅ 22+ imagens
   - `box-articulado-2.jpg`, `box-elegance.jpg`, `box-frontal-simples.jpg`, etc.
   - Subpasta: `box/box-de-vidro-para-banheiro-2.webp`

2. **ESPELHOS** - ✅ 14+ imagens
   - `espelho-bisotado.jpg`, `espelho-led.jpg`, etc.
   - Subpasta: `espelhos/` (7 imagens de referência)

3. **CORTINAS_VIDRO** - ✅ 8+ imagens
   - `cortina-europeu.jpg`, `cortina-automatizada.jpg`, etc.
   - Subpasta: `cortinas-vidro/` (2 imagens)

4. **GUARDA_CORPO** - ✅ 9+ imagens
   - `guarda-corpo-autoportante.jpg`, `guarda-corpo-spider.jpg`, etc.
   - Subpasta: `guarda-corpo/` (2 imagens)

5. **DIVISORIAS** - ✅ 9+ imagens
   - `divisoria-escritorio.jpg`, `divisoria-acustica.jpg`, etc.
   - Subpasta: `divisorias/` (4 imagens)

6. **PORTAS** - ✅ 7+ imagens
   - `porta-pivotante.jpg`, `porta-correr.jpg`, `porta-abrir.jpg`, etc.

7. **JANELAS** - ✅ 6+ imagens
   - `janela-maxim-ar.jpg`, `janela-correr.jpg`, etc.
   - Subpasta: `janelas/` (1 imagem)

8. **FECHAMENTOS** - ✅ 7+ imagens
   - `fechamento-sacada.jpg`, `fechamento-area-gourmet.jpg`, etc.
   - Subpasta: `fechamentos/` (1 imagem)

9. **PERGOLADOS** - ✅ 5+ imagens
   - `pergolado-inox.jpg`, `cobertura-laminado.jpg`, etc.
   - Subpasta: `pergolados/` (2 imagens)

10. **TAMPOS_PRATELEIRAS** - ✅ 4+ imagens
    - `tampo-mesa.jpg`, `prateleira.jpg`, etc.
    - Subpasta: `tampos/` (4 imagens)

11. **VIDROS** - ✅ 9+ imagens
    - `vidro-temperado-8mm.jpg`, `vidro-laminado-8mm.jpg`, etc.
    - Subpasta: `vidros/` (precisa criar)

12. **KITS** - ✅ 6 imagens
    - `kit-box-elegance.jpg`, `kit-pivotante.jpg`, etc.

13. **SERVICOS** - ✅ 6 imagens
    - `instalacao.jpg`, `manutencao-preventiva.jpg`, `troca-vidro.jpg`, etc.

14. **FERRAGENS** - ⚠️ 2 imagens apenas
    - `mola-piso.jpg`, `puxador-tubular.jpg`
    - **FALTAM:** dobradiças, trilhos, roldanas, vedações, etc.

#### ❌ PROBLEMA 1: Mapeamento Incorreto em `product-images.ts`

O arquivo `src/lib/product-images.ts` define apenas **40 imagens** referenciadas, mas há **120+ imagens reais** em `public/images/products/`.

**Exemplos de imagens NÃO mapeadas:**

- `box-articulado-2.jpg` ✗
- `box-elegance.jpg` ✗
- `espelho-bisotado.jpg` ✗
- `porta-pivotante.jpg` ✗
- `janela-maxim-ar.jpg` ✗
- `divisoria-escritorio.jpg` ✗
- E mais 80+ imagens...

#### ❌ PROBLEMA 2: Estrutura de Pastas Inconsistente

**Padrão esperado:** `public/images/products/{categoria}/`
**Realidade:** Mistura de imagens na raiz + subpastas

```
public/images/products/
├── box-articulado-2.jpg          ← Na raiz (❌)
├── espelho-led.jpg                ← Na raiz (❌)
├── box/
│   └── box-de-vidro-para-banheiro-2.webp  ← Subpasta (✓)
├── espelhos/
│   └── espelho-grande-13.webp     ← Subpasta (✓)
└── ...
```

---

## 🎯 PLANO DE AÇÃO (5 Etapas)

### ETAPA 1: Habilitar Imagens Existentes (RÁPIDO - 15min)

**Objetivo:** Fazer as imagens existentes aparecerem no wizard

**Ações:**

1. ✅ Descomentar código de exibição em `ProductReferenceImages`
2. ✅ Atualizar `product-images.ts` para mapear imagens da raiz
3. ✅ Testar no wizard step 3

**Arquivos a modificar:**

- `src/components/quote/product-reference-images.tsx` (linhas 73-81, 139-148)
- `src/lib/product-images.ts` (adicionar 80+ imagens faltantes)

---

### ETAPA 2: Reorganizar Estrutura de Pastas (MÉDIO - 30min)

**Objetivo:** Organizar todas as imagens por categoria

**Ações:**

1. Criar subpastas faltantes:

   ```
   public/images/products/
   ├── box/ (já existe ✓)
   ├── espelhos/ (já existe ✓)
   ├── vidros/ (CRIAR)
   ├── portas/ (CRIAR)
   ├── janelas/ (já existe ✓)
   ├── kits/ (CRIAR)
   ├── servicos/ (CRIAR)
   └── ferragens/ (CRIAR)
   ```

2. Mover imagens da raiz para subpastas:

   ```bash
   mv public/images/products/box-*.jpg public/images/products/box/
   mv public/images/products/espelho-*.jpg public/images/products/espelhos/
   mv public/images/products/vidro-*.jpg public/images/products/vidros/
   # etc...
   ```

3. Atualizar `product-images.ts` com novos paths

---

### ETAPA 3: Completar Imagens Faltantes (LONGO - 2h)

**Categorias que PRECISAM de mais imagens:**

1. **FERRAGENS** (CRÍTICO - só 2 imagens)
   - **Faltam:** dobradiças, trilhos, roldanas, puxadores diversos, fechaduras, etc.
   - **Ação:** Buscar/criar 10-15 imagens de ferragens

2. **VIDROS** (precisa mais variedade)
   - **Faltam:** vidros específicos (aramado, insulado, autolimpante, etc.)
   - **Ação:** Adicionar 5-10 imagens de tipos de vidro

3. **PORTAS** (precisa mais modelos)
   - **Faltam:** porta camarão, porta automática, variações
   - **Ação:** Adicionar 3-5 imagens

4. **FACHADAS** (categoria nova)
   - Já tem pasta `fachadas/` com 3 imagens ✓
   - **Ação:** Mapear no `product-images.ts`

---

### ETAPA 4: Adicionar Subcategory Mapping (MÉDIO - 45min)

**Problema:** O wizard passa `subcategory` ou `model`, mas `product-images.ts` não filtra por isso corretamente.

**Exemplo:**

```tsx
// No wizard:
<ProductReferenceImages
  category="BOX"
  subcategory="ELEGANCE" // ← Não está funcionando!
/>

// Expected: Mostrar só imagens do Box Elegance
// Atual: Mostra TODAS as imagens de BOX (22 imagens)
```

**Ações:**

1. Adicionar campo `subcategory` em cada imagem do mapeamento
2. Atualizar função `getImagesForSubcategory()` para filtrar corretamente
3. Testar filtro por modelo/subcategoria

---

### ETAPA 5: Otimização e Melhorias (OPCIONAL - 1h)

**Melhorias de UX:**

1. Lazy loading de imagens (já tem com Next/Image)
2. Placeholder blur enquanto carrega
3. Fallback para categoria quando subcategoria não tem imagens
4. Adicionar mais imagens por categoria (target: 5-8 por categoria)

---

## 📋 RESUMO EXECUTIVO

### Estado Atual

- ✅ Componente implementado
- ✅ 120+ imagens existem fisicamente
- ❌ Imagens **comentadas** no código (placeholders)
- ❌ Apenas 40/120 imagens mapeadas
- ❌ Estrutura de pastas desorganizada

### Impacto

- **Wizard de orçamento:** Cliente não vê fotos de referência
- **UX comprometida:** Dificulta escolha de produtos
- **Conversão:** Afeta confiança do cliente

### Solução Rápida (15 min)

1. Descomentar código de imagens
2. Adicionar 80 imagens faltantes ao mapeamento
3. Deploy

### Solução Completa (4-5h)

1. Reorganizar todas as pastas
2. Adicionar imagens faltantes (ferragens, etc.)
3. Implementar subcategory mapping
4. Otimizações de performance
5. Testes completos

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

**Escolha um caminho:**

### Opção A: QUICK FIX (Recomendado para agora)

```bash
1. Descomentar imagens no ProductReferenceImages
2. Atualizar product-images.ts com 80 imagens da raiz
3. Testar no wizard
4. Commit e deploy
```

**Tempo: 15-20 minutos**
**Resultado: Imagens aparecem no wizard (80% funcional)**

### Opção B: SOLUÇÃO COMPLETA

```bash
1. Executar Etapas 1-5 completas
2. Reorganizar tudo
3. Adicionar imagens faltantes
4. Testes E2E
```

**Tempo: 4-5 horas**
**Resultado: Sistema 100% funcional e organizado**

---

## 📊 MÉTRICAS DE SUCESSO

Após correção, verificar:

- [ ] Imagens aparecem no Step 3 do wizard
- [ ] Cada categoria mostra 3-5 fotos de referência
- [ ] Subcategory filtering funciona
- [ ] Imagens carregam rápido (< 2s)
- [ ] Fallback funciona quando não há imagens

---

**Qual caminho você prefere seguir?** Opção A (quick fix) ou Opção B (solução completa)?
