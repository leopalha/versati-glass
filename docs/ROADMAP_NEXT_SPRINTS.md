# Roadmap - Próximos Sprints

**Data:** 17 Dezembro 2024
**Status:** Planejamento em andamento
**Contexto:** Continuação do Sprint AI-CHAT (Fases 1-4 completas)

---

## 📋 Visão Geral

Após completar com sucesso as Fases 1-4 do Sprint AI-CHAT + Contact Hub, temos 3 iniciativas principais para os próximos sprints:

1. **Sprint FASE-5:** WhatsApp Integration (Cross-Channel Context)
2. **Sprint STEPS-6-7:** Payment & Conclusion Flow
3. **Sprint MELHORIAS:** Incremental Improvements (Catalog, Pricing, Prompts)

---

## 🎯 SPRINT FASE-5: WhatsApp Integration

**Duração Estimada:** 5-6 dias
**Prioridade:** Alta (preparação já feita no Contact Hub)
**Objetivo:** Unificar contexto entre Web Chat (AI) e WhatsApp Business

### Contexto

Atualmente temos:

- ✅ Contact Hub com botões AI Chat + WhatsApp
- ✅ Sistema de IA conversacional (AiConversation)
- ✅ Sistema WhatsApp separado (Conversation)
- ❌ **GAP:** Nenhuma integração entre os dois sistemas

### Objetivo Final

Cliente pode:

1. Iniciar conversa no Web Chat (site)
2. Coletar dados estruturados com IA
3. Clicar "WhatsApp" no Contact Hub
4. Continuar conversa no WhatsApp **com contexto completo**
5. IA no WhatsApp "lembra" tudo que foi dito no site
6. Admin vê timeline unificada de todas interações

### Benefício Esperado

- **+10-15%** conversão (cliente não precisa repetir informações)
- **-30%** tempo de atendimento humano
- **Melhor UX:** Transição suave entre canais

---

## 📐 FASE 5 - Plano Detalhado

### P5.1: Database Schema Updates (0.5 dia)

**Objetivo:** Adicionar campos de linking entre AiConversation ↔ Conversation

**Arquivo:** `prisma/schema.prisma`

**Mudanças:**

```prisma
model AiConversation {
  id                     String              @id @default(cuid())
  sessionId              String              @unique
  userId                 String?
  status                 ConversationStatus
  quoteContext           Json?
  quoteId                String?             @unique

  // NOVO: Link para WhatsApp
  whatsappConversationId String?             @unique

  messages               AiMessage[]
  quote                  Quote?              @relation(fields: [quoteId], references: [id])
  user                   User?               @relation(fields: [userId], references: [id])

  // NOVA: Relação bidirecional
  whatsappConversation   Conversation?       @relation("WebToWhatsApp", fields: [whatsappConversationId], references: [id])

  createdAt              DateTime            @default(now())
  updatedAt              DateTime            @updatedAt

  @@index([sessionId])
  @@index([userId])
  @@index([whatsappConversationId])
}

model Conversation {
  id              String              @id @default(cuid())
  phoneNumber     String
  customerName    String?
  userId          String?
  status          ConversationStatus  @default(ACTIVE)
  metadata        Json?

  // NOVO: Link para Web Chat
  websiteChatId   String?             @unique

  messages        Message[]
  user            User?               @relation(fields: [userId], references: [id])

  // NOVA: Relação bidirecional
  websiteChat     AiConversation?     @relation("WebToWhatsApp", fields: [websiteChatId], references: [sessionId])

  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  @@unique([phoneNumber, createdAt])
  @@index([phoneNumber])
  @@index([userId])
  @@index([websiteChatId])
}
```

**Tarefas:**

- [ ] Atualizar `prisma/schema.prisma` com campos acima
- [ ] Gerar migration: `pnpm prisma migrate dev --name add_cross_channel_linking`
- [ ] Aplicar em desenvolvimento
- [ ] Validar com Prisma Studio
- [ ] Atualizar TypeScript types: `pnpm db:generate`

**Entregas:**

- ✅ Campo `whatsappConversationId` em AiConversation
- ✅ Campo `websiteChatId` em Conversation
- ✅ Relações bidirecionais configuradas
- ✅ Indexes para performance

---

### P5.2: Unified Context Service (1.5 dias)

**Objetivo:** Criar serviço que mescla contexto de ambos os canais

**Arquivo:** `src/services/unified-context.ts` (NOVO - ~350 linhas)

**Interface Principal:**

```typescript
export interface UnifiedCustomerContext {
  // Identificação
  customerId?: string
  phoneNumber?: string
  sessionId?: string

  // Conversas
  webChat?: AiConversation & { messages: AiMessage[] }
  whatsappChat?: Conversation & { messages: Message[] }

  // Status
  hasLinkedConversations: boolean
  isActiveOnWeb: boolean
  isActiveOnWhatsApp: boolean

  // Contexto Unificado
  unifiedQuoteContext: QuoteContext | null
  totalMessages: number
  totalInteractions: number

  // Timeline
  conversationTimeline: TimelineEvent[]

  // Metadados
  firstContactDate: Date
  lastActivityDate: Date
  preferredChannel: 'WEB' | 'WHATSAPP' | 'BOTH'
}

export interface TimelineEvent {
  id: string
  type: 'MESSAGE' | 'QUOTE_GENERATED' | 'CHANNEL_SWITCH' | 'STATUS_CHANGE'
  channel: 'WEB' | 'WHATSAPP'
  timestamp: Date
  content: string
  metadata?: Record<string, any>
}
```

**Funções Principais:**

```typescript
/**
 * Busca contexto unificado do cliente em todos os canais
 */
export async function getUnifiedCustomerContext(params: {
  phoneNumber?: string
  userId?: string
  sessionId?: string
}): Promise<UnifiedCustomerContext | null>

/**
 * Cria link entre Web Chat e WhatsApp
 */
export async function linkConversations(params: {
  webSessionId: string
  whatsappConversationId: string
}): Promise<{ success: boolean; error?: string }>

/**
 * Mescla quoteContext de ambos os canais (último update prevalece)
 */
export function mergeQuoteContexts(webContext: any, whatsappContext: any): QuoteContext

/**
 * Constrói timeline unificada ordenada por timestamp
 */
export function buildConversationTimeline(
  webMessages: AiMessage[],
  whatsappMessages: Message[]
): TimelineEvent[]
```

**Implementação:**

```typescript
// src/services/unified-context.ts

import { prisma } from '@/lib/prisma'
import type { AiConversation, Conversation } from '@prisma/client'

export async function getUnifiedCustomerContext(params: {
  phoneNumber?: string
  userId?: string
  sessionId?: string
}): Promise<UnifiedCustomerContext | null> {
  const { phoneNumber, userId, sessionId } = params

  // 1. Buscar Web Chat
  const webChat = sessionId
    ? await prisma.aiConversation.findUnique({
        where: { sessionId },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
          whatsappConversation: {
            include: { messages: true },
          },
        },
      })
    : null

  // 2. Buscar WhatsApp Chat
  const whatsappChat = phoneNumber
    ? await prisma.conversation.findFirst({
        where: {
          phoneNumber,
          ...(userId && { userId }),
        },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
          websiteChat: {
            include: { messages: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : null

  // Se nenhum encontrado, retorna null
  if (!webChat && !whatsappChat) {
    return null
  }

  // 3. Verificar se há link
  const hasLinkedConversations = !!(webChat?.whatsappConversationId || whatsappChat?.websiteChatId)

  // 4. Merge de contextos
  const webQuoteContext = webChat?.quoteContext as any
  const whatsappMetadata = whatsappChat?.metadata as any

  const unifiedQuoteContext = mergeQuoteContexts(webQuoteContext, whatsappMetadata)

  // 5. Construir timeline
  const conversationTimeline = buildConversationTimeline(
    webChat?.messages || [],
    whatsappChat?.messages || []
  )

  // 6. Calcular métricas
  const totalMessages = (webChat?.messages.length || 0) + (whatsappChat?.messages.length || 0)
  const totalInteractions = conversationTimeline.filter((e) => e.type === 'MESSAGE').length

  const firstContactDate = conversationTimeline[0]?.timestamp || new Date()
  const lastActivityDate =
    conversationTimeline[conversationTimeline.length - 1]?.timestamp || new Date()

  // Determinar canal preferido
  const webMessages = webChat?.messages.length || 0
  const whatsappMessages = whatsappChat?.messages.length || 0
  let preferredChannel: 'WEB' | 'WHATSAPP' | 'BOTH' = 'BOTH'
  if (webMessages > whatsappMessages * 2) preferredChannel = 'WEB'
  if (whatsappMessages > webMessages * 2) preferredChannel = 'WHATSAPP'

  return {
    customerId: userId,
    phoneNumber: whatsappChat?.phoneNumber,
    sessionId: webChat?.sessionId,

    webChat: webChat || undefined,
    whatsappChat: whatsappChat || undefined,

    hasLinkedConversations,
    isActiveOnWeb: webChat?.status === 'ACTIVE',
    isActiveOnWhatsApp: whatsappChat?.status === 'ACTIVE',

    unifiedQuoteContext,
    totalMessages,
    totalInteractions,

    conversationTimeline,

    firstContactDate,
    lastActivityDate,
    preferredChannel,
  }
}

export function mergeQuoteContexts(webContext: any, whatsappContext: any): any {
  if (!webContext && !whatsappContext) return null
  if (!webContext) return whatsappContext
  if (!whatsappContext) return webContext

  // Merge com timestamp-based priority (último update prevalece)
  return {
    items: [...(webContext.items || []), ...(whatsappContext.items || [])],
    customerData: whatsappContext.customerData || webContext.customerData,
    scheduleData: whatsappContext.scheduleData || webContext.scheduleData,
    mergedAt: new Date().toISOString(),
    sources: ['WEB', 'WHATSAPP'],
  }
}

export function buildConversationTimeline(
  webMessages: any[],
  whatsappMessages: any[]
): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // Web messages
  webMessages.forEach((msg) => {
    events.push({
      id: msg.id,
      type: 'MESSAGE',
      channel: 'WEB',
      timestamp: msg.createdAt,
      content: msg.content,
      metadata: {
        role: msg.role,
        imageUrl: msg.imageUrl,
      },
    })
  })

  // WhatsApp messages
  whatsappMessages.forEach((msg) => {
    events.push({
      id: msg.id,
      type: 'MESSAGE',
      channel: 'WHATSAPP',
      timestamp: msg.createdAt,
      content: msg.content,
      metadata: {
        fromCustomer: msg.fromCustomer,
      },
    })
  })

  // Sort by timestamp
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export async function linkConversations(params: {
  webSessionId: string
  whatsappConversationId: string
}): Promise<{ success: boolean; error?: string }> {
  const { webSessionId, whatsappConversationId } = params

  try {
    // 1. Verificar se ambas existem
    const webChat = await prisma.aiConversation.findUnique({
      where: { sessionId: webSessionId },
    })

    const whatsappChat = await prisma.conversation.findUnique({
      where: { id: whatsappConversationId },
    })

    if (!webChat || !whatsappChat) {
      return {
        success: false,
        error: 'Uma ou ambas conversas não encontradas',
      }
    }

    // 2. Criar link bidirecional
    await prisma.$transaction([
      prisma.aiConversation.update({
        where: { id: webChat.id },
        data: { whatsappConversationId: whatsappChat.id },
      }),
      prisma.conversation.update({
        where: { id: whatsappChat.id },
        data: { websiteChatId: webChat.sessionId },
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Error linking conversations:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
```

**Tarefas:**

- [ ] Criar arquivo `src/services/unified-context.ts`
- [ ] Implementar `getUnifiedCustomerContext()`
- [ ] Implementar `linkConversations()`
- [ ] Implementar `mergeQuoteContexts()`
- [ ] Implementar `buildConversationTimeline()`
- [ ] Adicionar testes unitários
- [ ] Documentar funções (JSDoc)

**Entregas:**

- ✅ Serviço completo de contexto unificado
- ✅ Merge inteligente de dados
- ✅ Timeline ordenada
- ✅ Link bidirecional automático

---

### P5.3: Cross-Channel Handoff (2 dias)

**Objetivo:** Permitir transição suave Web → WhatsApp mantendo contexto

#### P5.3.1: Contact Hub Enhancement

**Arquivo:** `src/components/shared/contact-hub.tsx` (MODIFICAR)

**Mudanças:**

```typescript
// Adicionar hook para pegar sessionId atual
const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

// Quando AI Chat abre, capturar sessionId
{activeView === 'ai-chat' && (
  <ChatAssistido
    onClose={() => setActiveView('closed')}
    showInitially={true}
    onSessionReady={(sessionId) => setCurrentSessionId(sessionId)} // NOVO
  />
)}

// Modificar função openWhatsApp para incluir session
const openWhatsApp = (context?: string) => {
  const baseMessage = context
    ? `Olá! Estou vindo do site da Versati Glass. ${context}`
    : 'Olá! Estou vindo do site da Versati Glass.'

  const params = new URLSearchParams({
    text: baseMessage,
  })

  // NOVO: Passar sessionId se existir
  if (currentSessionId) {
    params.set('session', currentSessionId)
  }

  const url = `https://wa.me/${whatsappNumber}?${params.toString()}`
  window.open(url, '_blank')

  // Log para analytics
  console.log('🔗 Cross-channel handoff:', {
    from: 'WEB_CHAT',
    to: 'WHATSAPP',
    sessionId: currentSessionId,
    context: context,
  })
}
```

**Tarefas:**

- [ ] Modificar Contact Hub para capturar sessionId
- [ ] Passar sessionId via URL do WhatsApp
- [ ] Adicionar logging de handoff

#### P5.3.2: ChatAssistido Enhancement

**Arquivo:** `src/components/chat/chat-assistido.tsx` (MODIFICAR)

**Mudanças:**

```typescript
interface ChatAssistidoProps {
  // ... existing props
  onSessionReady?: (sessionId: string) => void // NOVO
}

// Quando sessionId é gerado ou recuperado
useEffect(() => {
  if (sessionId && onSessionReady) {
    onSessionReady(sessionId)
  }
}, [sessionId, onSessionReady])
```

**Tarefas:**

- [ ] Adicionar callback `onSessionReady`
- [ ] Emitir sessionId quando disponível

#### P5.3.3: WhatsApp Webhook Enhancement

**Arquivo:** `src/app/api/whatsapp/webhook/route.ts` (MODIFICAR - ~200 linhas adicionais)

**Mudanças:**

```typescript
import { getUnifiedCustomerContext, linkConversations } from '@/services/unified-context'

export async function POST(request: Request) {
  const body = await request.json()
  const { phoneNumber, message, from } = body

  // 1. Detectar session parameter na mensagem
  const sessionMatch = message.match(/session=([a-zA-Z0-9-_]+)/)
  let unifiedContext = null

  if (sessionMatch) {
    const sessionId = sessionMatch[1]

    console.log('🔗 Cross-channel handoff detected:', {
      sessionId,
      phoneNumber,
    })

    // 2. Buscar contexto unificado
    unifiedContext = await getUnifiedCustomerContext({
      sessionId,
      phoneNumber,
    })

    // 3. Se não linkado ainda, criar link
    if (unifiedContext && !unifiedContext.hasLinkedConversations) {
      // Buscar ou criar conversa WhatsApp
      let whatsappConv = await prisma.conversation.findFirst({
        where: { phoneNumber },
        orderBy: { createdAt: 'desc' },
      })

      if (!whatsappConv) {
        whatsappConv = await prisma.conversation.create({
          data: {
            phoneNumber,
            customerName: from,
            status: 'ACTIVE',
          },
        })
      }

      // Linkar conversas
      await linkConversations({
        webSessionId: sessionId,
        whatsappConversationId: whatsappConv.id,
      })

      console.log('✅ Conversations linked successfully')
    }
  } else {
    // Sem session parameter, buscar apenas por telefone
    unifiedContext = await getUnifiedCustomerContext({
      phoneNumber,
    })
  }

  // 4. Gerar resposta com contexto unificado
  const aiResponse = await generateWhatsAppAIResponse({
    message,
    phoneNumber,
    unifiedContext, // Passa contexto completo!
  })

  // 5. Enviar resposta
  await sendWhatsAppMessage(phoneNumber, aiResponse)

  return NextResponse.json({ success: true })
}

async function generateWhatsAppAIResponse(params: {
  message: string
  phoneNumber: string
  unifiedContext: UnifiedCustomerContext | null
}): Promise<string> {
  const { message, unifiedContext } = params

  // Se tem contexto unificado, usar na prompt
  let contextPrompt = ''

  if (unifiedContext?.webChat) {
    const quoteContext = unifiedContext.unifiedQuoteContext

    contextPrompt = `
CONTEXTO IMPORTANTE - Cliente já conversou no site:
- Total de ${unifiedContext.totalMessages} mensagens anteriores
- Última atividade: ${unifiedContext.lastActivityDate.toLocaleString('pt-BR')}

${
  quoteContext
    ? `
DADOS JÁ COLETADOS:
- Produtos: ${JSON.stringify(quoteContext.items, null, 2)}
- Cliente: ${JSON.stringify(quoteContext.customerData, null, 2)}
- Agendamento: ${JSON.stringify(quoteContext.scheduleData, null, 2)}

IMPORTANTE: O cliente JÁ forneceu essas informações no chat do site.
NÃO peça novamente. Continue de onde paramos!
`
    : ''
}
`
  }

  const prompt = `${WHATSAPP_SYSTEM_PROMPT}

${contextPrompt}

Mensagem do cliente: ${message}

Responda de forma natural e contextualizada.`

  // Chamar Groq API
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: message },
    ],
  })

  return response.choices[0]?.message?.content || 'Desculpe, não entendi.'
}
```

**Tarefas:**

- [ ] Modificar webhook para detectar `session` parameter
- [ ] Implementar busca de contexto unificado
- [ ] Implementar linking automático
- [ ] Atualizar geração de resposta com contexto
- [ ] Adicionar logging detalhado
- [ ] Testar fluxo completo

**Entregas:**

- ✅ Detecção automática de cross-channel handoff
- ✅ Linking automático de conversas
- ✅ IA usa contexto completo do site
- ✅ Cliente não precisa repetir informações

---

### P5.4: Admin Unified View (1.5 dias)

**Objetivo:** Admin vê timeline unificada de todas interações do cliente

#### P5.4.1: Customer Detail Page Enhancement

**Arquivo:** `src/app/(admin)/admin/clientes/[id]/page.tsx` (MODIFICAR - ~150 linhas adicionais)

**Features:**

- Timeline unificada (Web + WhatsApp)
- Filtro por canal
- Indicadores visuais de canal
- Estatísticas combinadas

**Implementação:**

```tsx
import { getUnifiedCustomerContext } from '@/services/unified-context'
import { Bot, MessageCircle, ArrowRightLeft } from 'lucide-react'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      aiConversations: {
        include: { messages: true },
        orderBy: { createdAt: 'desc' },
      },
      conversations: {
        include: { messages: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!customer) notFound()

  // Buscar contexto unificado
  const unifiedContext = await getUnifiedCustomerContext({
    userId: id,
    phoneNumber: customer.phone || undefined,
  })

  // Estatísticas
  const totalWebMessages = customer.aiConversations.reduce((acc, c) => acc + c.messages.length, 0)
  const totalWhatsappMessages = customer.conversations.reduce(
    (acc, c) => acc + c.messages.length,
    0
  )
  const totalMessages = totalWebMessages + totalWhatsappMessages

  const hasLinkedConversations = unifiedContext?.hasLinkedConversations || false
  const preferredChannel = unifiedContext?.preferredChannel || 'BOTH'

  return (
    <div>
      <AdminHeader title={customer.name || 'Cliente'} subtitle={customer.email || customer.phone} />

      <div className="space-y-6 p-6">
        {/* Unified Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-neutral-700">Total de Mensagens</p>
            <p className="text-3xl font-bold text-white">{totalMessages}</p>
            <p className="mt-1 text-xs text-neutral-600">
              {totalWebMessages} web + {totalWhatsappMessages} WhatsApp
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-neutral-700">Conversas</p>
            <p className="text-3xl font-bold text-white">
              {customer.aiConversations.length + customer.conversations.length}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-neutral-700">Canal Preferido</p>
            <div className="mt-2 flex items-center gap-2">
              {preferredChannel === 'WEB' && <Bot className="h-5 w-5 text-accent-500" />}
              {preferredChannel === 'WHATSAPP' && (
                <MessageCircle className="h-5 w-5 text-green-400" />
              )}
              {preferredChannel === 'BOTH' && <ArrowRightLeft className="h-5 w-5 text-blue-400" />}
              <span className="font-medium text-white">{preferredChannel}</span>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-neutral-700">Cross-Channel</p>
            <p className="text-3xl font-bold text-white">{hasLinkedConversations ? '✓' : '○'}</p>
            <p className="mt-1 text-xs text-neutral-600">
              {hasLinkedConversations ? 'Linkado' : 'Não linkado'}
            </p>
          </Card>
        </div>

        {/* Unified Timeline */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Timeline Unificada</h3>

          <div className="space-y-3">
            {unifiedContext?.conversationTimeline.map((event) => (
              <div
                key={event.id}
                className={`flex gap-3 rounded-lg p-3 ${
                  event.channel === 'WEB' ? 'bg-accent-500/10' : 'bg-green-500/10'
                }`}
              >
                {/* Channel Icon */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    event.channel === 'WEB' ? 'bg-accent-500/20' : 'bg-green-500/20'
                  }`}
                >
                  {event.channel === 'WEB' ? (
                    <Bot className="h-4 w-4 text-accent-500" />
                  ) : (
                    <MessageCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-700">
                      {event.channel === 'WEB' ? 'Chat Site' : 'WhatsApp'}
                    </span>
                    <span className="text-xs text-neutral-600">
                      {event.timestamp.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-white">{event.content}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
```

**Tarefas:**

- [ ] Modificar página de detalhe do cliente
- [ ] Integrar com `getUnifiedCustomerContext()`
- [ ] Criar componente `UnifiedTimeline`
- [ ] Adicionar filtros por canal
- [ ] Estatísticas combinadas
- [ ] Export CSV unificado

**Entregas:**

- ✅ Timeline visual unificada
- ✅ Estatísticas cross-channel
- ✅ Indicadores de linking
- ✅ Canal preferido identificado

---

### P5.5: Testing & Refinement (1 dia)

**Objetivo:** Testar fluxo completo e ajustar

**Cenários de Teste:**

**Teste 1: Handoff Web → WhatsApp**

1. Cliente abre chat no site
2. IA coleta categoria + medidas
3. Cliente clica "WhatsApp" no Contact Hub
4. Envia mensagem no WhatsApp
5. ✅ Verificar: IA lembra dos dados coletados

**Teste 2: Cliente Recorrente**

1. Cliente já tem conversa web antiga
2. Envia nova mensagem no WhatsApp
3. ✅ Verificar: IA reconhece histórico

**Teste 3: Admin View**

1. Admin acessa detalhe do cliente
2. ✅ Verificar: Timeline mostra ambos canais
3. ✅ Verificar: Estatísticas corretas

**Teste 4: Linking Automático**

1. Cliente com sessionId abre WhatsApp
2. ✅ Verificar: Link criado automaticamente
3. ✅ Verificar: Relação bidirecional funciona

**Ajustes:**

- [ ] Corrigir bugs encontrados
- [ ] Melhorar mensagens de transição
- [ ] Otimizar queries (N+1 problem)
- [ ] Adicionar caching (Redis opcional)

**Entregas:**

- ✅ Todos os cenários testados
- ✅ Bugs corrigidos
- ✅ Performance otimizada
- ✅ Documentação atualizada

---

## 📊 SPRINT STEPS-6-7: Payment & Conclusion Flow

**Duração Estimada:** 4-5 dias
**Prioridade:** Média-Alta
**Objetivo:** Implementar Steps 6 e 7 do wizard de orçamento conforme especificação

### Contexto Atual

Wizard tem 7 steps:

1. ✅ Categoria
2. ✅ Produto
3. ✅ Detalhes
4. ✅ Carrinho (Item Review)
5. ✅ Dados do Cliente
6. ❌ **Resumo Final** (PENDENTE)
7. ❌ **Agendamento + Pagamento** (PARCIAL)

### Especificação Steps 6-7

Conforme você mencionou anteriormente, Steps 6 e 7 devem incluir:

**Step 6: Resumo Final**

- Mostrar todos os itens do carrinho
- Exibir dados do cliente
- Estimativa de preço total (se disponível)
- Botão "Confirmar Orçamento"
- Opção de editar qualquer etapa anterior

**Step 7: Agendamento + Conclusão**

- Agendar visita técnica
- Mensagem de sucesso
- Informações do que acontece a seguir
- Opção de enviar orçamento por email
- Link para acompanhar no portal

---

## 📋 STEPS 6-7 - Plano Detalhado

### S6.1: Step 6 - Resumo Final (2 dias)

**Objetivo:** Criar componente de revisão final antes do envio

**Arquivo:** `src/components/quote/steps/step-final-summary.tsx` (MODIFICAR - já existe)

**Design:**

```
┌─────────────────────────────────────────┐
│  📋 Resumo do Seu Orçamento              │
├─────────────────────────────────────────┤
│                                          │
│  ITENS SOLICITADOS (3)                   │
│  ┌──────────────────────────────────┐   │
│  │ 🔲 Box de Vidro Temperado 8mm    │   │
│  │    1.2m x 1.9m                    │   │
│  │    Incolor, Cromado              │   │
│  │    [Editar]                       │   │
│  └──────────────────────────────────┘   │
│  ... mais itens ...                      │
│                                          │
│  SEUS DADOS                              │
│  ┌──────────────────────────────────┐   │
│  │ Nome: João Silva                  │   │
│  │ Tel: (21) 99999-9999             │   │
│  │ Email: joao@email.com            │   │
│  │ Endereço: Rua ABC, 123           │   │
│  │    [Editar]                       │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ESTIMATIVA                              │
│  ┌──────────────────────────────────┐   │
│  │ Valor estimado: R$ 3.500 - 4.200 │   │
│  │ ⚠️ Sujeito a alteração após      │   │
│  │    visita técnica                 │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [Voltar]  [Confirmar Orçamento →]      │
└─────────────────────────────────────────┘
```

**Implementação:**

```tsx
'use client'

import { useQuoteStore } from '@/store/quote-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pencil, CheckCircle } from 'lucide-react'
import { estimatePriceRange } from '@/lib/pricing'

export function StepFinalSummary() {
  const { items, customerData, goToStep, nextStep } = useQuoteStore()

  // Calcular estimativa total
  const totalEstimate = items.reduce(
    (acc, item) => {
      const { min, max } = estimatePriceRange(item)
      return {
        min: acc.min + min,
        max: acc.max + max,
      }
    },
    { min: 0, max: 0 }
  )

  const handleConfirm = () => {
    // Validação final
    if (!customerData?.phone) {
      alert('Dados do cliente incompletos!')
      goToStep(5)
      return
    }

    if (items.length === 0) {
      alert('Carrinho vazio!')
      goToStep(4)
      return
    }

    // Prosseguir para Step 7
    nextStep()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Resumo do Seu Orçamento</h2>
        <p className="mt-2 text-neutral-700">Revise todos os detalhes antes de confirmar</p>
      </div>

      {/* ITENS */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Itens Solicitados ({items.length})</h3>
          <Button variant="ghost" size="sm" onClick={() => goToStep(4)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="border-theme-default bg-theme-secondary rounded-lg border p-4"
            >
              <p className="font-medium text-white">{item.productName}</p>
              <div className="mt-1 space-y-1 text-sm text-neutral-700">
                <p>
                  Dimensões: {item.width}m x {item.height}m
                </p>
                <p>Quantidade: {item.quantity}</p>
                {item.color && <p>Cor: {item.color}</p>}
                {item.glassType && <p>Tipo: {item.glassType}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* DADOS DO CLIENTE */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Seus Dados</h3>
          <Button variant="ghost" size="sm" onClick={() => goToStep(5)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-sm text-neutral-700">Nome</p>
            <p className="font-medium text-white">{customerData?.name}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-700">Telefone</p>
            <p className="font-medium text-white">{customerData?.phone}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-700">Email</p>
            <p className="font-medium text-white">{customerData?.email || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-700">Endereço</p>
            <p className="font-medium text-white">{customerData?.address || 'Não informado'}</p>
          </div>
        </div>
      </Card>

      {/* ESTIMATIVA */}
      <Card className="from-accent-500/10 border-accent-500/30 bg-gradient-to-br to-gold-500/10 p-6">
        <h3 className="mb-3 text-lg font-semibold text-white">Estimativa de Investimento</h3>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-accent-500">
            R$ {totalEstimate.min.toLocaleString('pt-BR')}
          </span>
          <span className="text-neutral-700">a</span>
          <span className="text-3xl font-bold text-accent-500">
            R$ {totalEstimate.max.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
          <p className="text-sm text-yellow-300">
            ⚠️ <strong>Importante:</strong> Esta é uma estimativa aproximada. O valor final será
            definido após a visita técnica gratuita.
          </p>
        </div>
      </Card>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => goToStep(5)} className="flex-1">
          Voltar
        </Button>
        <Button onClick={handleConfirm} className="flex-1 bg-accent-500 hover:bg-accent-600">
          <CheckCircle className="mr-2 h-5 w-5" />
          Confirmar Orçamento
        </Button>
      </div>
    </div>
  )
}
```

**Tarefas:**

- [ ] Implementar StepFinalSummary component
- [ ] Integração com pricing.ts para estimativas
- [ ] Botões de edição (goToStep)
- [ ] Validação final
- [ ] Responsividade mobile

**Entregas:**

- ✅ Resumo completo visual
- ✅ Estimativa de preço exibida
- ✅ Opção de editar etapas anteriores
- ✅ Validação antes de prosseguir

---

### S6.2: Step 7 - Agendamento + Conclusão (2-3 dias)

**Objetivo:** Finalizar orçamento com agendamento e confirmação

**Arquivo:** `src/components/quote/steps/step-schedule.tsx` (MODIFICAR - já existe parcialmente)

**Design:**

```
┌─────────────────────────────────────────┐
│  📅 Agende sua Visita Técnica Gratuita  │
├─────────────────────────────────────────┤
│                                          │
│  SELECIONE DATA E HORÁRIO                │
│  ┌──────────────────────────────────┐   │
│  │ Data: [18/12/2024 ▼]             │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ Período:                          │   │
│  │ ( ) Manhã (8h-12h)               │   │
│  │ (•) Tarde (13h-17h)              │   │
│  │ ( ) Noite (18h-20h)              │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ Observações (opcional):           │   │
│  │ [                              ]  │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [Voltar]  [Finalizar Orçamento →]      │
└─────────────────────────────────────────┘

Após clicar "Finalizar":

┌─────────────────────────────────────────┐
│  ✅ Orçamento Enviado com Sucesso!      │
├─────────────────────────────────────────┤
│                                          │
│  Número do Orçamento: #2024-0123        │
│                                          │
│  📧 Enviamos uma confirmação para:      │
│     joao@email.com                       │
│                                          │
│  📅 Visita Agendada:                    │
│     Quarta, 18/12 - Tarde (13h-17h)     │
│                                          │
│  PRÓXIMOS PASSOS:                        │
│  1. Confirmaremos por WhatsApp          │
│  2. Técnico vai até você (grátis)      │
│  3. Medição precisa + ajustes           │
│  4. Orçamento final detalhado           │
│                                          │
│  [Ver Orçamento no Portal]              │
│  [Voltar para Home]                     │
└─────────────────────────────────────────┘
```

**Implementação:**

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuoteStore } from '@/store/quote-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, Clock, CheckCircle, Home, ExternalLink } from 'lucide-react'

export function StepSchedule() {
  const router = useRouter()
  const { items, customerData, reset } = useQuoteStore()

  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>(
    'AFTERNOON'
  )
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)
  const [quoteNumber, setQuoteNumber] = useState('')
  const [quoteId, setQuoteId] = useState('')

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // 1. Criar quote no banco
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerData,
          scheduleData: {
            preferredDate: selectedDate,
            preferredTime: selectedPeriod,
            notes,
          },
          source: 'WEBSITE',
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar orçamento')
      }

      const data = await response.json()

      setQuoteNumber(data.quoteNumber)
      setQuoteId(data.quoteId)
      setQuoteSubmitted(true)

      // 2. Enviar email de confirmação (via API)
      await fetch('/api/quotes/send-confirmation', {
        method: 'POST',
        body: JSON.stringify({ quoteId: data.quoteId }),
      })
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('Erro ao enviar orçamento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = () => {
    reset() // Limpa store
    router.push('/') // Volta pra home
  }

  // Se já submeteu, mostra tela de sucesso
  if (quoteSubmitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
          <CheckCircle className="h-12 w-12 text-green-400" />
        </div>

        <div>
          <h2 className="mb-2 text-3xl font-bold text-white">Orçamento Enviado com Sucesso!</h2>
          <p className="text-lg text-neutral-700">
            Número do Orçamento:{' '}
            <span className="font-mono font-bold text-accent-500">#{quoteNumber}</span>
          </p>
        </div>

        <Card className="p-6 text-left">
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm text-neutral-700">📧 Confirmação enviada para:</p>
              <p className="font-medium text-white">{customerData?.email || customerData?.phone}</p>
            </div>

            <div>
              <p className="mb-1 text-sm text-neutral-700">📅 Visita Agendada:</p>
              <p className="font-medium text-white">
                {new Date(selectedDate).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                })}
                {' - '}
                {selectedPeriod === 'MORNING' && 'Manhã (8h-12h)'}
                {selectedPeriod === 'AFTERNOON' && 'Tarde (13h-17h)'}
                {selectedPeriod === 'EVENING' && 'Noite (18h-20h)'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-accent-500/10 border-accent-500/30 p-6 text-left">
          <h3 className="mb-3 font-semibold text-white">Próximos Passos:</h3>
          <ol className="space-y-2 text-sm text-neutral-700">
            <li>✓ Você receberá confirmação por WhatsApp em breve</li>
            <li>✓ Nosso técnico irá até você (visita 100% gratuita)</li>
            <li>✓ Faremos medição precisa e ajustes necessários</li>
            <li>✓ Você receberá orçamento final detalhado</li>
          </ol>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleFinish} className="flex-1">
            <Home className="mr-2 h-5 w-5" />
            Voltar para Home
          </Button>
          <Button
            onClick={() => router.push(`/portal/pedidos/${quoteId}`)}
            className="flex-1 bg-accent-500 hover:bg-accent-600"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Ver no Portal
          </Button>
        </div>
      </div>
    )
  }

  // Formulário de agendamento
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Agende sua Visita Técnica Gratuita</h2>
        <p className="mt-2 text-neutral-700">Nosso técnico irá até você para medição precisa</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {/* Data */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              <Calendar className="mr-2 inline h-4 w-4" />
              Data Preferida
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="bg-theme-secondary border-theme-default w-full rounded-lg border px-4 py-2 text-white"
            />
          </div>

          {/* Período */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              <Clock className="mr-2 inline h-4 w-4" />
              Período
            </label>
            <div className="space-y-2">
              {[
                { value: 'MORNING', label: 'Manhã (8h-12h)' },
                { value: 'AFTERNOON', label: 'Tarde (13h-17h)' },
                { value: 'EVENING', label: 'Noite (18h-20h)' },
              ].map((period) => (
                <label
                  key={period.value}
                  className="bg-theme-secondary border-theme-default hover:bg-theme-primary flex cursor-pointer items-center gap-3 rounded-lg border p-3"
                >
                  <input
                    type="radio"
                    name="period"
                    value={period.value}
                    checked={selectedPeriod === period.value}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="text-accent-500"
                  />
                  <span className="text-white">{period.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Portaria com horário específico, dificuldade de acesso..."
              rows={3}
              className="bg-theme-secondary border-theme-default w-full rounded-lg border px-4 py-2 text-white placeholder:text-neutral-600"
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => useQuoteStore.getState().prevStep()}
          className="flex-1"
          disabled={isSubmitting}
        >
          Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-accent-500 hover:bg-accent-600"
          disabled={!selectedDate || isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Finalizar Orçamento'}
        </Button>
      </div>
    </div>
  )
}
```

**Tarefas:**

- [ ] Implementar formulário de agendamento
- [ ] Integração com `/api/quotes` (POST)
- [ ] Tela de sucesso com detalhes
- [ ] Email de confirmação
- [ ] Link para portal do cliente
- [ ] Reset do store após conclusão

**Entregas:**

- ✅ Agendamento de visita técnica
- ✅ Criação de quote no banco
- ✅ Tela de sucesso visual
- ✅ Email de confirmação
- ✅ Link para acompanhamento

---

## 🔧 SPRINT MELHORIAS: Incremental Improvements

**Duração Estimada:** 3-4 dias
**Prioridade:** Média
**Objetivo:** Melhorias incrementais em catálogo, pricing e prompts

### M1: Catálogo de Produtos (1 dia)

**Objetivo:** Adicionar mais produtos reais ao banco

**Tarefas:**

- [ ] Ampliar `prisma/seed.ts` com +20 produtos
- [ ] Categorias: BOX, ESPELHOS, VIDROS, PORTAS, GUARDA-CORPOS
- [ ] Incluir variações (8mm, 10mm, incolor, fumê, bronze)
- [ ] Adicionar imagens de produtos reais
- [ ] Configurar preços base por m²

**Exemplo:**

```typescript
// seed.ts
const products = [
  // BOX
  { category: 'BOX', name: 'Box de Correr 2 Folhas 8mm', basePrice: 450, ... },
  { category: 'BOX', name: 'Box de Correr 4 Folhas 8mm', basePrice: 650, ... },
  { category: 'BOX', name: 'Box de Abrir 8mm', basePrice: 400, ... },

  // ESPELHOS
  { category: 'ESPELHOS', name: 'Espelho 4mm Bisotê', basePrice: 180, ... },
  { category: 'ESPELHOS', name: 'Espelho 6mm Colado', basePrice: 220, ... },

  // VIDROS
  { category: 'VIDROS', name: 'Vidro Temperado Incolor 8mm', basePrice: 280, ... },
  { category: 'VIDROS', name: 'Vidro Laminado 8mm', basePrice: 350, ... },

  // ... mais produtos
]
```

---

### M2: Pricing Refinement (1 dia)

**Objetivo:** Melhorar cálculo de estimativas de preço

**Arquivo:** `src/lib/pricing.ts` (MODIFICAR)

**Melhorias:**

```typescript
// Adicionar custos de mão de obra
const INSTALLATION_COST_PER_M2 = 120

// Adicionar complexidade
function getComplexityMultiplier(item: QuoteItem): number {
  let multiplier = 1.0

  // Altura acima de 2.5m = +20%
  if (item.height > 2.5) multiplier += 0.2

  // Largura acima de 3m = +15%
  if (item.width > 3.0) multiplier += 0.15

  // Vidro laminado = +30%
  if (item.glassType === 'LAMINATED') multiplier += 0.3

  // Acabamento especial = +25%
  if (item.finish === 'GOLD' || item.finish === 'BLACK') multiplier += 0.25

  return multiplier
}

// Estimativa mais precisa
export function estimatePriceRange(item: QuoteItem): {
  min: number
  max: number
  estimated: number
  breakdown: PriceBreakdown
} {
  const area = item.width * item.height
  const basePrice = getPricePerM2(item.category, item.glassType)
  const complexity = getComplexityMultiplier(item)

  // Custo do material
  const materialCost = area * basePrice * complexity

  // Custo de instalação
  const installationCost = area * INSTALLATION_COST_PER_M2

  // Custo de acessórios
  const accessoriesCost = getAccessoriesCost(item)

  // Total
  const estimatedPrice = materialCost + installationCost + accessoriesCost

  return {
    min: estimatedPrice * 0.9, // -10%
    max: estimatedPrice * 1.15, // +15%
    estimated: estimatedPrice,
    breakdown: {
      material: materialCost,
      installation: installationCost,
      accessories: accessoriesCost,
    },
  }
}
```

**Tarefas:**

- [ ] Refinar multiplicadores
- [ ] Adicionar breakdown detalhado
- [ ] Testes com produtos reais
- [ ] Validação com time comercial

---

### M3: AI Prompts Refinement (1 dia)

**Objetivo:** Melhorar prompts da IA para maior acurácia

**Arquivo:** `src/app/api/ai/chat/route.ts` (MODIFICAR)

**Melhorias no SYSTEM_PROMPT:**

```typescript
const ENHANCED_SYSTEM_PROMPT = `
Você é Ana, assistente virtual da Versati Glass.

PERSONALIDADE:
- Amigável, profissional e prestativa
- Use linguagem natural e informal (você, não tu)
- Mostre empatia e entusiasmo
- Seja concisa (respostas < 100 palavras)

PRODUTOS & PREÇOS:
${productCatalogContext} // Lista de produtos reais do banco

COLETA DE DADOS - FLUXO OTIMIZADO:
1. SAUDAÇÃO + IDENTIFICAÇÃO DO PRODUTO
   "Olá! Sou a Ana da Versati Glass 👋
    Qual tipo de produto você procura?"

   Opções:
   - Box para Banheiro
   - Espelhos
   - Vidros Temperados
   - Portas de Vidro
   - Guarda-Corpos

2. DETALHES DO PRODUTO
   "Ótima escolha! Me conta um pouco mais:"

   Perguntas:
   - Você tem as medidas? (largura x altura)
   - Ou pode enviar uma foto do local?
   - Qual cor prefere? (incolor, fumê, bronze)

3. ANÁLISE DE FOTO (se enviada)
   Use GPT-4 Vision para:
   - Identificar tipo de ambiente
   - Estimar dimensões aproximadas
   - Sugerir produtos adequados

   "Pela foto, parece um banheiro de X m².
    Sugiro um Box de Correr 2 Folhas."

4. DADOS DE CONTATO
   "Perfeito! Para finalizar, preciso de:"
   - Nome
   - Telefone (com WhatsApp)
   - Endereço (para visita técnica)

5. AGENDAMENTO
   "Quando seria melhor para a visita técnica gratuita?"
   - Manhã, tarde ou noite?
   - Dia da semana preferido?

EXTRAÇÃO DE DADOS:
Quando coletar TODAS essas informações, atualize o quoteContext:
{
  "items": [{
    "category": "BOX",
    "productName": "Box de Correr 2 Folhas",
    "width": 1.2,
    "height": 2.0,
    "quantity": 1,
    "color": "incolor",
    "glassType": "TEMPERED",
    "thickness": 8
  }],
  "customerData": {
    "name": "João Silva",
    "phone": "21999999999",
    "email": "joao@email.com",
    "address": "Rua ABC, 123, Rio de Janeiro"
  },
  "scheduleData": {
    "preferredPeriod": "AFTERNOON",
    "preferredDays": ["MONDAY", "TUESDAY"]
  }
}

IMPORTANTE:
- NÃO peça todos os dados de uma vez (causa abandono)
- Faça perguntas uma de cada vez
- Use emojis moderadamente 😊
- Confirme dados antes de finalizar
- Ofereça estimativa de preço quando tiver medidas
`
```

**Tarefas:**

- [ ] Atualizar SYSTEM_PROMPT
- [ ] Melhorar EXTRACTION_PROMPT
- [ ] Adicionar product catalog context dinâmico
- [ ] Testes A/B com diferentes tons

---

### M4: Performance & Caching (0.5 dia)

**Objetivo:** Otimizar queries e adicionar caching

**Tarefas:**

- [ ] Adicionar indexes no Prisma (já feito parcialmente)
- [ ] Implementar cache de produtos (Redis ou in-memory)
- [ ] Lazy loading de imagens
- [ ] Otimizar N+1 queries no admin

**Exemplo:**

```typescript
// src/lib/cache.ts
const productCache = new Map<string, Product[]>()

export async function getCachedProducts(category?: string): Promise<Product[]> {
  const cacheKey = category || 'ALL'

  if (productCache.has(cacheKey)) {
    return productCache.get(cacheKey)!
  }

  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
  })

  productCache.set(cacheKey, products)

  // Invalidar após 1h
  setTimeout(() => productCache.delete(cacheKey), 3600000)

  return products
}
```

---

## 📊 Resumo dos Sprints

| Sprint        | Duração        | Prioridade | Entregas Principais                                  |
| ------------- | -------------- | ---------- | ---------------------------------------------------- |
| **FASE-5**    | 5-6 dias       | Alta       | WhatsApp Integration, Unified Context, Cross-Channel |
| **STEPS-6-7** | 4-5 dias       | Média-Alta | Resumo Final, Agendamento, Conclusão                 |
| **MELHORIAS** | 3-4 dias       | Média      | +20 Produtos, Pricing 2.0, Prompts Refinados         |
| **TOTAL**     | **12-15 dias** | -          | **3 sprints completos**                              |

---

## 🎯 Ordem de Execução Recomendada

### Opção A: Sequencial (Recomendado)

```
Semana 1: FASE-5 (WhatsApp Integration)
Semana 2: STEPS-6-7 (Payment & Conclusion)
Semana 3: MELHORIAS (Incremental Improvements)
```

### Opção B: Paralelo (Se houver 2+ devs)

```
Dev 1: FASE-5 (5-6 dias)
Dev 2: STEPS-6-7 (4-5 dias) + MELHORIAS (3-4 dias)
```

### Opção C: Por Prioridade de Negócio

```
1. STEPS-6-7 (fechar wizard completo)
2. MELHORIAS (melhorar conversão)
3. FASE-5 (WhatsApp opcional)
```

---

## 📋 Checklist de Início

Antes de começar qualquer sprint:

**Setup:**

- [ ] Branch criado: `git checkout -b sprint-fase-5` (ou steps-6-7, melhorias)
- [ ] Database atualizado: `pnpm db:push`
- [ ] Dependencies atualizadas: `pnpm install`
- [ ] .env configurado corretamente

**Documentação:**

- [ ] Ler este roadmap completo
- [ ] Revisar arquivos relacionados
- [ ] Preparar ambiente de teste

**Comunicação:**

- [ ] Stakeholders informados
- [ ] Timeline aprovado
- [ ] Prioridades alinhadas

---

## 📝 Notas Finais

- Todos os sprints são **independentes** (podem ser feitos em qualquer ordem)
- FASE-5 depende de Contact Hub (✅ já implementado)
- STEPS-6-7 depende de Steps 1-5 (✅ já implementados)
- MELHORIAS são incrementais (podem ser feitas em paralelo)

**Escolha a ordem baseada em:**

1. Prioridade de negócio
2. Recursos disponíveis (devs)
3. Dependências técnicas

---

**Documento preparado por:** Claude Agent SDK
**Data:** 17 Dezembro 2024
**Status:** Aguardando aprovação para execução

**Qual sprint você quer começar? 🚀**
