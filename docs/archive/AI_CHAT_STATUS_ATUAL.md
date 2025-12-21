# 🤖 AI-CHAT - STATUS ATUAL E PRÓXIMOS PASSOS

**Data:** 18 Dezembro 2024
**Análise:** Código existente vs Tasks.md (Sprint AI-CHAT)

---

## 📊 RESUMO EXECUTIVO

### O Que JÁ Existe ✅

**Análise completa revelou que >70% do Sprint AI-CHAT JÁ ESTÁ IMPLEMENTADO!**

Diferente do que está documentado em [tasks.md](docs/tasks.md), o sistema de chat IA **já foi implementado** em sessões anteriores. Vou mapear o que existe vs o que foi planejado.

---

## ✅ IMPLEMENTADO (70%+)

### 1. Database Schema - 100% COMPLETO ✅

**Planejado (tasks.md AC.1.1-AC.1.5):**

```prisma
model AIConversation { ... }
model AIMessage { ... }
model AIImageAnalysis { ... }
```

**Real (prisma/schema.prisma):**

```prisma
model AiConversation {
  id             String                @id @default(cuid())
  sessionId      String                @unique
  userId         String?
  quoteContext   Json?                 // 🔑 Armazena dados extraídos
  status         AiConversationStatus  @default(ACTIVE)
  quoteId        String?               // 🔑 Link para Quote criado
  createdAt      DateTime              @default(now())
  updatedAt      DateTime              @updatedAt

  user           User?                 @relation(...)
  quote          Quote?                @relation(...)
  messages       AiMessage[]

  @@index([sessionId, userId, status])
}

model AiMessage {
  id             String         @id @default(cuid())
  conversationId String
  role           AiMessageRole  // USER, ASSISTANT, SYSTEM
  content        String         @db.Text
  imageUrls      String[]       // 🔑 Suporte a múltiplas imagens
  createdAt      DateTime       @default(now())

  conversation   AiConversation @relation(...)

  @@index([conversationId, createdAt])
}

enum AiConversationStatus { ACTIVE, CONVERTED, ABANDONED, ESCALATED }
enum AiMessageRole { USER, ASSISTANT, SYSTEM }
```

**Status:** ✅ **100% COMPLETO** + extras (quoteId, imageUrls[])

---

### 2. Backend Services - 90% COMPLETO ✅

**Planejado (AC.2.1-AC.2.6):** 6 APIs

**Real:**

#### ✅ Chat Service (src/services/ai.ts - 10,267 bytes)

**Funcionalidades:**

- ✅ Groq API integration (Llama 3.3 70B Versatile)
- ✅ OpenAI GPT-4o Vision integration
- ✅ System prompt with personality "Ana"
- ✅ Extração automática de dados (telefone, email, medidas, produtos)
- ✅ Detecção de escalação para humano
- ✅ Fallback responses quando IA indisponível
- ✅ Análise de imagens com GPT-4 Vision
- ✅ Sugestões de produtos baseadas no catálogo
- ✅ Estruturação de quoteContext (JSON)

**Código:**

```typescript
// src/services/ai.ts (principais funções)
export async function generateAIResponse(prompt, context, images?)
export async function analyzeImage(imageUrl, context?)
export function extractStructuredData(aiResponse)
export function detectEscalation(aiResponse)
```

#### ✅ API Routes (src/app/api/ai/chat/)

**Implementado:**

- ✅ `POST /api/ai/chat` - Enviar mensagem + criar/atualizar conversa
- ✅ `GET /api/ai/chat` - Listar conversas do usuário (com sessão)
- ✅ `POST /api/ai/chat/upload` - Upload de imagens para análise
- ❌ `POST /api/ai/chat/export-quote` - **FALTANDO** (crítico)
- ❌ `GET /api/ai/chat/[id]` - **FALTANDO** (baixa prioridade)

**Funcionalidades Extras:**

- ✅ Gestão de sessão para visitantes anônimos (sessionId)
- ✅ Timeout de 24h para conversas inativas
- ✅ Vinculação automática de userId quando login

---

### 3. Frontend Chat UI - 80% COMPLETO ✅

**Planejado (AC.3.1-AC.3.8):** 8 componentes

**Real:**

#### ✅ Componentes Principais

**src/components/chat/chat-assistido.tsx** (COMPLETO):

- ✅ ChatWindow com mensagens scrolláveis
- ✅ ChatInput com upload de imagens (drag-drop, preview)
- ✅ ChatMessage (user/assistant rendering)
- ✅ Image preview e análise GPT-4 Vision
- ✅ Loading states e animações
- ✅ Interface responsiva (fullscreen mobile, widget desktop)
- ✅ Auto-scroll para última mensagem

**Integração:**

- ✅ Incluído na página `/orcamento` (position: bottom-left)
- ❌ **Faltando:** Botão "Finalizar Orçamento" (crítico)
- ❌ **Faltando:** Transição para wizard (crítico)

---

### 4. Transformer (Bridge AI → Quote) - 100% COMPLETO ✅

**Planejado:** Não estava no plano original!

**Real (src/lib/ai-quote-transformer.ts - 292 linhas):**

```typescript
// Transform AI quoteContext → QuoteStore format
export function transformAiContextToQuoteData(quoteContext): AiQuoteData | null

// Validate if ready for conversion
export function isQuoteContextComplete(quoteContext): boolean

// Get completion percentage (0-100)
export function getQuoteContextCompletion(quoteContext): number

// Transform individual item
export function transformAiItemToQuoteItem(aiItem): QuoteItem
```

**Features:**

- ✅ Category mapping (AI terms → ProductCategory enum)
- ✅ Dimension validation (> 0, < 20m)
- ✅ Product slug generation
- ✅ Customer data transformation
- ✅ Schedule data transformation
- ✅ Completion progress tracking

---

### 5. Quote Store Integration - 100% COMPLETO ✅

**Planejado:** Não estava no plano!

**Real (src/store/quote-store.ts):**

```typescript
interface AiQuoteData {
  items: Array<Omit<QuoteItem, 'id'>>
  customerData?: CustomerData | null
  scheduleData?: ScheduleData | null
}

interface QuoteState {
  // NOVO: Import from AI
  importFromAI: (aiQuoteData: AiQuoteData) => void
}

// Implementation (linha 344)
importFromAI: (aiQuoteData) => {
  const itemsWithIds = aiQuoteData.items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }))

  set({
    items: itemsWithIds,
    customerData: aiQuoteData.customerData || null,
    scheduleData: aiQuoteData.scheduleData || null,
    source: 'WEBSITE',
    step: 4, // Jump to Item Review
    lastActivity: Date.now(),
  })
}
```

**Status:** ✅ Pronto para receber dados do AI Chat!

---

### 6. Validation Schemas - 100% COMPLETO ✅

**Real (src/lib/validations/ai-quote.ts):**

```typescript
// Zod schemas for validating AI-extracted data
export const aiQuoteItemSchema = z.object({
  category: z.enum(['BOX', 'ESPELHOS', 'VIDROS', ...]),
  width: z.number().min(0.01).max(20),
  height: z.number().min(0.01).max(20),
  quantity: z.number().int().min(1).max(100),
  // ... more fields
})

export const aiQuoteContextSchema = z.object({
  items: z.array(aiQuoteItemSchema).min(1).max(50),
  customerData: z.object({ ... }).optional(),
  scheduleData: z.object({ ... }).optional(),
})

export function validateAiQuoteContext(context: unknown) {
  return aiQuoteContextSchema.safeParse(context)
}
```

---

### 7. Admin Dashboard - 100% COMPLETO ✅

**Planejado (AC.6.1-AC.6.7):** 7 features

**Real:**

#### ✅ Admin Pages

**src/app/(admin)/admin/conversas-ia/page.tsx:**

- ✅ Listagem de conversas com filtros
- ✅ Métricas (total, ativas, convertidas, abandonadas)
- ✅ Cards com preview de última mensagem
- ✅ Status badges (ACTIVE, CONVERTED, ESCALATED, ABANDONED)
- ✅ Link para detalhes

**src/app/(admin)/admin/conversas-ia/[id]/page.tsx:**

- ✅ Thread completa da conversa
- ✅ Metadados (sessionId, userId, timestamps)
- ✅ Preview de imagens enviadas
- ✅ QuoteContext JSON (estruturado)
- ✅ Link para quote criado (se convertido)
- ✅ Botão "Criar Orçamento Manualmente" (futuro)

**Sidebar:**

- ✅ Menu item "Chat IA (Site)" adicionado

---

## ❌ NÃO IMPLEMENTADO (30%)

### 1. Export Quote Endpoint - 🔴 CRÍTICO

**Faltando:** `POST /api/ai/chat/export-quote`

**Necessário para:**

- Converter AiConversation.quoteContext → Quote no banco
- Criar Quote automaticamente
- Vincular Quote.id ao AiConversation.quoteId
- Enviar email de confirmação

**Implementação Estimada:** 2-3 horas

---

### 2. Finalize Button no Chat - 🔴 CRÍTICO

**Faltando em:** `src/components/chat/chat-assistido.tsx`

**Necessário:**

```typescript
// Detectar quando quoteContext está completo
const isReadyToFinalize = isQuoteContextComplete(conversation.quoteContext)

// Mostrar botão
{isReadyToFinalize && (
  <Button onClick={handleFinalizeQuote}>
    ✅ Finalizar Orçamento ({completion}% completo)
  </Button>
)}

// Handler
const handleFinalizeQuote = async () => {
  // 1. Transform quoteContext
  const aiQuoteData = transformAiContextToQuoteData(conversation.quoteContext)

  // 2. Import to QuoteStore
  useQuoteStore.getState().importFromAI(aiQuoteData)

  // 3. Close chat
  setIsOpen(false)

  // 4. Redirect to wizard (step 4)
  router.push('/orcamento')
}
```

**Implementação Estimada:** 1-2 horas

---

### 3. Transition Component - 🟡 NICE-TO-HAVE

**Faltando:** `src/components/quote/ai-transition.tsx`

**Funcionalidade:**

- Modal de transição suave entre chat → wizard
- Resumo visual dos itens coletados
- Confirmação do usuário antes de prosseguir

**Implementação Estimada:** 1 hora

---

### 4. Auto-Quote Creation - 🟡 P1

**Faltando:** `POST /api/quotes/from-ai`

**Funcionalidade:**

- Criar Quote no banco automaticamente
- Atualizar AiConversation.quoteId
- Atualizar AiConversation.status = CONVERTED
- Enviar email de confirmação

**Nota:** Existe `src/app/api/quotes/from-ai/` mas está vazio!

**Implementação Estimada:** 2-3 horas

---

### 5. Progress Indicator no Chat - 🟢 P2

**Faltando:**

- Progress bar mostrando % de completude
- Checklist visual (✓ Produto, ✓ Medidas, ✓ Contato)

**Implementação Estimada:** 1 hora

---

### 6. Smart Suggestions - 🟢 P2

**Parcial:**

- ✅ Código existe no `ai.ts` (linha ~150)
- ❌ Não está bem integrado com catálogo real
- ❌ Não mostra cards visuais de produtos

**Implementação Estimada:** 2-3 horas

---

### 7. Price Estimation - 🟢 P2

**Faltando:** `src/lib/pricing.ts`

**Funcionalidade:**

```typescript
export function estimatePriceRange(item: QuoteItem) {
  const area = item.width * item.height
  const basePrice = getPricePerM2(item.category, item.glassType)
  const optionsMultiplier = getOptionsMultiplier(item)

  const estimatedPrice = area * basePrice * optionsMultiplier
  return { min: estimatedPrice * 0.85, max: estimatedPrice * 1.15 }
}
```

**Implementação Estimada:** 2-3 horas

---

## 🎯 PLANO DE AÇÃO PARA COMPLETAR AI-CHAT

### FASE 1: MVP (4-6 horas) - 🔴 CRÍTICO

**Objetivo:** Conectar chat IA ao wizard de orçamento

#### Sprint AC-MVP.1: Finalize Button (2h)

**Arquivos:**

1. `src/components/chat/chat-assistido.tsx` - Adicionar botão + handler
2. `src/hooks/use-ai-chat.ts` (novo) - Lógica de finalização

**Tasks:**

- [ ] Detectar `isQuoteContextComplete()`
- [ ] Mostrar botão "Finalizar Orçamento" quando pronto
- [ ] Handler para chamar `importFromAI()`
- [ ] Fechar chat e redirecionar para `/orcamento`

#### Sprint AC-MVP.2: Export Quote Endpoint (2h)

**Arquivos:**

1. `src/app/api/ai/chat/export-quote/route.ts` (novo)

**Tasks:**

- [ ] Fetch conversation by ID
- [ ] Validate quoteContext with Zod
- [ ] Transform to AiQuoteData
- [ ] Return structured data + validation errors
- [ ] Update conversation status if successful

#### Sprint AC-MVP.3: Testes Manuais (1-2h)

**Fluxo Completo:**

1. Abrir chat na página `/orcamento`
2. Conversar com IA (informar produto, medidas, dados)
3. Ver botão "Finalizar Orçamento" aparecer
4. Clicar e ver wizard abrir no Step 4
5. Revisar itens importados do chat
6. Completar steps 5-7 normalmente
7. Enviar quote

---

### FASE 2: Auto-Quote Creation (3-4h) - 🟡 P1

**Objetivo:** Criar quotes automaticamente no banco

#### Sprint AC-AUTO.1: Quote Creation API (2-3h)

**Arquivo:** `src/app/api/quotes/from-ai/route.ts`

**Tasks:**

- [ ] Fetch AiConversation + quoteContext
- [ ] Transform to Quote format
- [ ] Create Quote in database
- [ ] Link Quote.id to AiConversation.quoteId
- [ ] Update status to CONVERTED
- [ ] Send confirmation email
- [ ] Return quote number and ID

#### Sprint AC-AUTO.2: Admin Manual Conversion (1h)

**Arquivo:** `src/app/(admin)/admin/conversas-ia/[id]/page.tsx`

**Tasks:**

- [ ] Botão "Converter em Orçamento"
- [ ] Handler para chamar `/api/quotes/from-ai`
- [ ] Mostrar sucesso/erro
- [ ] Atualizar UI com link para quote

---

### FASE 3: UX Improvements (3-4h) - 🟢 P2

#### Sprint AC-UX.1: Progress Indicator (1h)

**Tasks:**

- [ ] Hook `useQuoteProgress()` com `getQuoteContextCompletion()`
- [ ] Progress bar no chat header
- [ ] Checklist visual (✓ Produto, ✓ Medidas, ✓ Contato)

#### Sprint AC-UX.2: Transition Modal (1h)

**Tasks:**

- [ ] Componente `ai-transition.tsx`
- [ ] Resumo visual dos itens
- [ ] Animação suave de transição

#### Sprint AC-UX.3: Smart Suggestions (2h)

**Tasks:**

- [ ] Cards visuais de produtos sugeridos
- [ ] Click para adicionar ao carrinho
- [ ] Integração com catálogo real

---

## 🚀 RECOMENDAÇÃO IMEDIATA

**Implementar FASE 1 (MVP) - 4-6 horas:**

1. ✅ Código já existe (70%+)
2. ✅ Transformer pronto
3. ✅ QuoteStore pronto
4. ❌ **Faltam apenas 2 coisas críticas:**
   - Botão "Finalizar Orçamento" no chat
   - Endpoint `/api/ai/chat/export-quote`

**Estimativa:** 4-6 horas para completar MVP funcional

**Resultado:** Chat IA totalmente integrado ao wizard de orçamento!

---

## 📊 COMPARAÇÃO TASKS.MD vs REALIDADE

| Sprint              | Tasks.md    | Realidade  | Gap     |
| ------------------- | ----------- | ---------- | ------- |
| AC.1 (DB Schema)    | ⬜ Planeado | ✅ 100%    | 0%      |
| AC.2 (Backend APIs) | ⬜ Planeado | ✅ 90%     | 10%     |
| AC.3 (Frontend UI)  | ⬜ Planeado | ✅ 80%     | 20%     |
| AC.4 (Vision)       | ⬜ Planeado | ✅ 100%    | 0%      |
| AC.5 (Extraction)   | ⬜ Planeado | ✅ 100%    | 0%      |
| AC.6 (Admin)        | ⬜ Planeado | ✅ 100%    | 0%      |
| AC.7 (Tests)        | ⬜ Planeado | ❌ 0%      | 100%    |
| **TOTAL**           | **0%**      | **✅ 80%** | **20%** |

**Conclusão:** Sprint AI-CHAT está **80% completo** mas marcado como "não iniciado" no tasks.md!

---

## 📝 ARQUIVOS EXISTENTES (Para Referência)

### Backend

- `src/services/ai.ts` - IA service (Groq + OpenAI)
- `src/lib/ai-quote-transformer.ts` - Transformer
- `src/lib/validations/ai-quote.ts` - Validations
- `src/app/api/ai/chat/route.ts` - Chat API
- `src/app/api/ai/chat/upload/route.ts` - Upload API
- `src/app/api/quotes/from-ai/` - **VAZIO** (a implementar)

### Frontend

- `src/components/chat/chat-assistido.tsx` - Chat UI
- `src/app/(admin)/admin/conversas-ia/page.tsx` - Admin list
- `src/app/(admin)/admin/conversas-ia/[id]/page.tsx` - Admin detail

### Store

- `src/store/quote-store.ts` - QuoteStore com `importFromAI()`

### Database

- `prisma/schema.prisma` - AiConversation, AiMessage models

---

**Próximo Passo Recomendado:** Implementar FASE 1 (MVP) para completar integração AI-CHAT → Quote Wizard em 4-6 horas.
