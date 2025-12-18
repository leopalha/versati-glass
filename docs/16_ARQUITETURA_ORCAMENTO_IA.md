# ARQUITETURA: SISTEMA DE ORÇAMENTO ASSISTIDO POR IA

## Versati Glass - Especificação Técnica v1.0

---

## 1. VISÃO GERAL

### 1.1 Problema

- Cliente não sabe o que precisa
- Não entende termos técnicos (temperado, laminado, pivotante, etc.)
- Não sabe medir corretamente
- Processo atual tem 7 etapas = abandono alto

### 1.2 Solução

Sistema de orçamento assistido por IA que:

1. Conversa com cliente em linguagem simples
2. Analisa fotos do local
3. Identifica produto correto automaticamente
4. Estima medidas baseado na foto + confirmação cliente
5. Gera orçamento automático
6. Vai direto pro carrinho

### 1.3 Canais

1. **Site** - Chat integrado na página de orçamento
2. **WhatsApp** - Agente que faz o mesmo processo
3. **Admin** - Recebe pedidos + gera PDF para fornecedores

---

## 2. FLUXO DETALHADO

### 2.1 Fluxo Site (Chat Assistido)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PÁGINA /orcamento                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  🤖 ORÇAMENTO ASSISTIDO POR IA                            │  │
│  │  ─────────────────────────────────────────────────────────│  │
│  │  Não sabe exatamente o que precisa?                       │  │
│  │  Nossa IA vai te ajudar a identificar o produto ideal!    │  │
│  │                                                            │  │
│  │  ✓ Envie fotos do local                                   │  │
│  │  ✓ Descreva o que precisa                                 │  │
│  │  ✓ Receba orçamento na hora                               │  │
│  │                                                            │  │
│  │  [ 🚀 COMEÇAR ORÇAMENTO ASSISTIDO ]                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ───────────────── ou escolha a categoria ─────────────────     │
│                                                                  │
│  [Box] [Espelhos] [Vidros] [Portas] [Janelas] [Guarda-Corpo]   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Fluxo do Chat

```
ETAPA 1: IDENTIFICAÇÃO DA NECESSIDADE
├── IA pergunta o que cliente precisa
├── Cliente descreve em linguagem livre
├── IA identifica categoria (box, espelho, porta, etc.)
└── IA faz perguntas de refinamento

ETAPA 2: COLETA DE FOTO
├── IA instrui como tirar foto correta
│   ├── "Tire foto frontal do vão"
│   ├── "Inclua algo de referência (porta, pessoa)"
│   └── "Certifique-se de boa iluminação"
├── Cliente envia foto
├── IA analisa com Vision API
└── IA estima dimensões e tipo

ETAPA 3: CONFIRMAÇÃO DE MEDIDAS
├── IA mostra estimativas
├── Cliente confirma ou corrige
├── IA ajusta valores
└── Medidas finalizadas

ETAPA 4: ESPECIFICAÇÃO DO PRODUTO
├── IA sugere produto baseado em:
│   ├── Categoria identificada
│   ├── Foto analisada
│   ├── Medidas confirmadas
│   └── Preferências do cliente
├── Mostra opções de acabamento
├── Mostra opções de vidro
└── Cliente escolhe

ETAPA 5: RESUMO E CONFIRMAÇÃO
├── IA gera resumo completo
├── Mostra valor estimado
├── Cliente confirma
└── Vai direto pro CARRINHO (step 5)

ETAPA 6: CARRINHO/DADOS/AGENDAMENTO
├── Fluxo normal continua
├── Dados já preenchidos pelo chat
└── Agendamento de visita técnica
```

### 2.3 Fluxo WhatsApp (Mesmo processo)

```
Cliente manda mensagem → Agente IA responde
├── Mesma lógica do chat do site
├── Salva conversa no banco
├── Gera orçamento
└── Envia link para finalizar no site (ou finaliza no WhatsApp)
```

---

## 3. ARQUITETURA TÉCNICA

### 3.1 Componentes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  /orcamento                                                              │
│  ├── BotaoOrcamentoAssistido.tsx (botão grande no topo)                 │
│  ├── ChatAssistido.tsx (modal/drawer com chat)                          │
│  │   ├── MessageList.tsx                                                │
│  │   ├── MessageInput.tsx                                               │
│  │   ├── PhotoUpload.tsx                                                │
│  │   ├── ProductConfirmation.tsx                                        │
│  │   └── MeasuresConfirmation.tsx                                       │
│  └── CategoriaCards.tsx (fluxo atual mantido)                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (API Routes)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  /api/ai/                                                                │
│  ├── chat/route.ts          → Processa mensagens do chat                │
│  ├── analyze-image/route.ts → Analisa foto com Vision                   │
│  ├── generate-quote/route.ts → Gera orçamento                           │
│  └── whatsapp/route.ts      → Webhook do WhatsApp                       │
│                                                                          │
│  /api/quotes/                                                            │
│  ├── route.ts               → CRUD de orçamentos                        │
│  ├── [id]/route.ts          → Orçamento específico                      │
│  └── [id]/pdf/route.ts      → Gera PDF do orçamento                     │
│                                                                          │
│  /api/admin/                                                             │
│  ├── supplier-quote/route.ts → Gera PDF para fornecedor                 │
│  └── send-to-suppliers/route.ts → Envia para fornecedores               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVIÇOS EXTERNOS                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │   Groq API      │  │  WhatsApp API   │  │    Prisma +     │         │
│  │   (Llama 3.3)   │  │  (Meta/Twilio)  │  │   PostgreSQL    │         │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤         │
│  │ - Chat          │  │ - Receber msg   │  │ - Orçamentos    │         │
│  │ - Orçamento     │  │ - Enviar msg    │  │ - Conversas IA  │         │
│  │                 │  │ - Mídia         │  │ - Mensagens     │         │
│  │   OpenAI API    │  │ - Templates     │  │ - Clientes      │         │
│  │ - GPT-4 Vision  │                      │ - Produtos      │         │
│  │ - Análise foto  │                      │ - Railway       │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Fluxo de Dados

```
CHAT NO SITE:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Cliente │───▶│  Chat UI │───▶│ API Chat │───▶│  Groq    │
│          │◀───│          │◀───│          │◀───│   API    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │
                     ▼
              ┌──────────┐
              │  Prisma  │ (salva conversa + orçamento)
              │PostgreSQL│
              └──────────┘

WHATSAPP:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Cliente │───▶│ WhatsApp │───▶│ Webhook  │───▶│  Groq    │
│          │◀───│   API    │◀───│   API    │◀───│   API    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │
                                      ▼
                               ┌──────────┐
                               │  Prisma  │
                               │PostgreSQL│
                               └──────────┘

ADMIN - COTAÇÃO FORNECEDOR:
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Admin   │───▶│ Dashboard│───▶│ API PDF  │───▶│  Gera    │
│          │    │          │    │          │    │   PDF    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │
                                      ▼
                         ┌─────────────────────┐
                         │ PDF Cotação         │
                         │ (nome do admin,     │
                         │  não do cliente)    │
                         └─────────────────────┘
                                      │
                                      ▼
                         ┌─────────────────────┐
                         │ Email/WhatsApp      │
                         │ para Fornecedores   │
                         └─────────────────────┘
```

---

## 4. BANCO DE DADOS

### 4.1 Novas Tabelas (Prisma Schema)

```prisma
// prisma/schema.prisma

// Conversas do chat/whatsapp
model AiConversation {
  id          String   @id @default(cuid())
  sessionId   String?  // Para usuários não autenticados
  userId      String?  // Para usuários autenticados
  user        User?    @relation(fields: [userId], references: [id])
  channel     String   @default("web") // 'web' | 'whatsapp'
  status      ConversationStatus @default(ACTIVE)
  messages    AiMessage[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("ai_conversations")
}

enum ConversationStatus {
  ACTIVE
  COMPLETED
  ABANDONED
}

// Mensagens da conversa
model AiMessage {
  id              String         @id @default(cuid())
  conversationId  String
  conversation    AiConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role            MessageRole
  content         String         @db.Text
  imageUrl        String?
  metadata        Json?          // { model, responseTime, tokensUsed, hasImage }
  createdAt       DateTime       @default(now())

  @@map("ai_messages")
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

// Análise de imagens (opcional, pode usar metadata em AiMessage)
model AiImageAnalysis {
  id              String         @id @default(cuid())
  conversationId  String?
  conversation    AiConversation? @relation(fields: [conversationId], references: [id])
  imageUrl        String
  analysis        Json           // { productType, estimatedWidth, estimatedHeight, confidence, suggestions }
  createdAt       DateTime       @default(now())

  @@map("ai_image_analysis")
}

// Fornecedores (para cotações)
model Supplier {
  id          String   @id @default(cuid())
  name        String
  email       String?
  phone       String?
  whatsapp    String?
  categories  String[] // ['box', 'vidros', 'espelhos']
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  @@map("suppliers")
}
```

**NOTA**: Os modelos `AiConversation` e `AiMessage` **já estão implementados** no schema atual do projeto (ver prisma/schema.prisma). Este documento reflete a arquitetura já em produção.

---

## 5. PROMPTS DO AGENTE IA

### 5.1 System Prompt Principal

```markdown
# AGENTE DE ORÇAMENTO - VERSATI GLASS

Você é o assistente virtual da Versati Glass, especialista em vidraçaria.
Seu objetivo é ajudar clientes a fazer orçamentos de forma simples e amigável.

## SUA PERSONALIDADE:

- Amigável e paciente
- Usa linguagem simples (evita termos técnicos)
- Explica quando necessário
- Faz uma pergunta por vez
- Confirma antes de prosseguir

## FLUXO DA CONVERSA:

### 1. BOAS-VINDAS

"Olá! 👋 Sou o assistente da Versati Glass. Vou te ajudar a fazer um orçamento!
Me conta: o que você está precisando?"

### 2. IDENTIFICAR NECESSIDADE

- Pergunte o que o cliente precisa
- Identifique a categoria (box, espelho, porta, janela, guarda-corpo, etc.)
- Se não entender, peça mais detalhes

### 3. PEDIR FOTO

"Para eu te ajudar melhor, pode me enviar uma foto do local?
📸 Dicas para uma boa foto:

- Tire de frente, mostrando todo o espaço
- Boa iluminação ajuda muito
- Se puder, inclua algo de referência (uma porta, uma pessoa)"

### 4. ANALISAR FOTO

Quando receber a foto:

- Identifique o tipo de produto necessário
- Estime as dimensões
- Observe detalhes (acabamentos existentes, cor da parede, etc.)

### 5. CONFIRMAR MEDIDAS

"Analisei a foto! 📐
Parece ser um [TIPO DO PRODUTO].
Minhas estimativas:

- Largura: aproximadamente X cm
- Altura: aproximadamente Y cm

Você tem as medidas exatas? Se não, essas estimativas estão corretas?"

### 6. ESPECIFICAR PRODUTO

"Perfeito! Agora vou te mostrar as opções:

**Tipo de Vidro:**

- Incolor (transparente) ✨
- Fumê (escuro, mais privacidade)
- Jateado (fosco, privacidade total)

**Acabamento:**

- Alumínio Branco
- Alumínio Preto
- Alumínio Fosco
- Inox (premium)

Qual você prefere?"

### 7. GERAR ORÇAMENTO

"Ótimo! Aqui está seu orçamento:

📋 **RESUMO DO PEDIDO**
━━━━━━━━━━━━━━━━━━━━━
Produto: [NOME]
Medidas: [L] x [A] cm
Vidro: [TIPO]
Acabamento: [ACABAMENTO]
━━━━━━━━━━━━━━━━━━━━━
💰 Valor estimado: R$ X.XXX,XX

_Valor sujeito a confirmação após visita técnica_

Deseja confirmar o orçamento?"

### 8. FINALIZAR

"Perfeito! ✅ Seu orçamento foi registrado!

Próximos passos:

1. Nossa equipe vai analisar
2. Entraremos em contato em até 24h
3. Agendaremos uma visita técnica gratuita

Obrigado por escolher a Versati Glass! 🙏"

## REGRAS IMPORTANTES:

1. NUNCA invente preços - use a tabela de referência
2. SEMPRE confirme antes de prosseguir
3. Se não tiver certeza, pergunte
4. Medidas sempre precisam de visita técnica para confirmar
5. Seja honesto sobre limitações
```

### 5.2 Prompt de Análise de Imagem

```markdown
# ANÁLISE DE IMAGEM - VERSATI GLASS

Analise a imagem enviada pelo cliente e identifique:

## 1. TIPO DE PRODUTO

Identifique qual produto o cliente precisa:

- Box para banheiro (frontal, canto, de abrir)
- Espelho (parede, decorativo)
- Porta de vidro (pivotante, correr, abrir)
- Janela (maxim-ar, basculante, correr)
- Guarda-corpo (escada, varanda)
- Cortina de vidro (sacada, varanda)
- Pergolado/Cobertura

## 2. ESTIMATIVA DE MEDIDAS

Baseado em referências na imagem, estime:

- Largura em centímetros
- Altura em centímetros
- Profundidade (se aplicável)

Use como referência:

- Porta padrão: 80cm largura x 210cm altura
- Altura pessoa média: 170cm
- Tomada elétrica: 30cm ou 110cm do chão
- Azulejo padrão: 30x60cm ou 60x60cm

## 3. OBSERVAÇÕES

- Cor das paredes/piso
- Acabamentos existentes
- Obstáculos (registros, ralos, tomadas)
- Condições do local

## 4. CONFIANÇA

Indique seu nível de confiança (0-100%) na análise.

Responda em JSON:
{
"product_type": "box_frontal",
"estimated_width_cm": 90,
"estimated_height_cm": 190,
"confidence": 85,
"observations": ["banheiro pequeno", "piso claro", "sem box atual"],
"suggestions": ["vidro incolor recomendado", "alumínio branco combinaria"],
"questions": ["O registro está do lado esquerdo ou direito?"]
}
```

---

## 6. API ENDPOINTS

### 6.1 Chat API

```typescript
// /api/ai/chat/route.ts

import Groq from 'groq-sdk'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const { conversationId, message, imageUrl } = await request.json()

  // Buscar histórico da conversa
  const history = await prisma.aiMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  })

  // Montar mensagens para o Groq
  const messages = history.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  // Adicionar nova mensagem
  messages.push({ role: 'user', content: message })

  let assistantMessage: string

  // Se tem imagem, usar OpenAI GPT-4 Vision
  if (imageUrl) {
    const visionResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(0, -1),
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: message },
          ],
        },
      ],
    })
    assistantMessage = visionResponse.choices[0]?.message?.content || ''
  } else {
    // Chamar Groq para chat de texto
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    })
    assistantMessage = response.choices[0]?.message?.content || ''
  }

  // Salvar mensagens no banco
  await prisma.aiMessage.createMany({
    data: [
      {
        conversationId,
        role: 'user',
        content: message,
        imageUrl,
      },
      {
        conversationId,
        role: 'assistant',
        content: assistantMessage,
      },
    ],
  })

  return Response.json({
    message: assistantMessage,
    conversationId,
  })
}
```

### 6.2 Webhook WhatsApp

```typescript
// /api/ai/whatsapp/route.ts

export async function POST(request: Request) {
  const body = await request.json()

  // Verificar se é mensagem ou verificação
  if (body.object === 'whatsapp_business_account') {
    const entry = body.entry[0]
    const changes = entry.changes[0]
    const value = changes.value

    if (value.messages) {
      const message = value.messages[0]
      const from = message.from // número do cliente

      // Buscar ou criar conversa
      let conversation = await getOrCreateConversation(from, 'whatsapp')

      // Processar mensagem
      let userMessage = ''
      let imageUrl = null

      if (message.type === 'text') {
        userMessage = message.text.body
      } else if (message.type === 'image') {
        // Baixar imagem do WhatsApp
        imageUrl = await downloadWhatsAppMedia(message.image.id)
        userMessage = message.image.caption || 'Imagem enviada'
      }

      // Processar com IA (mesma lógica do chat)
      const aiResponse = await processWithAI(conversation.id, userMessage, imageUrl)

      // Enviar resposta pelo WhatsApp
      await sendWhatsAppMessage(from, aiResponse)
    }
  }

  return Response.json({ status: 'ok' })
}
```

### 6.3 Geração de PDF para Fornecedor

```typescript
// /api/admin/supplier-quote/route.ts

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function POST(request: Request) {
  const { quoteId, supplierId } = await request.json()

  // Buscar dados do orçamento com Prisma
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      customer: {
        select: { name: true, phone: true },
      },
      items: true,
    },
  })

  // Buscar dados da empresa (admin) das configurações
  const company = {
    name: 'Versati Glass',
    cnpj: '00.000.000/0001-00',
    phone: '(21) 99999-9999',
    email: 'contato@versatiglass.com.br',
  }

  // Gerar PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // CABEÇALHO - EM NOME DA EMPRESA, NÃO DO CLIENTE
  page.drawText('SOLICITAÇÃO DE COTAÇÃO', {
    x: 50,
    y: 780,
    size: 18,
    font: boldFont,
  })

  page.drawText(`${company.name}`, {
    x: 50,
    y: 750,
    size: 12,
    font: boldFont,
  })

  page.drawText(`CNPJ: ${company.cnpj}`, {
    x: 50,
    y: 735,
    size: 10,
    font,
  })

  // PRODUTOS
  let y = 680
  page.drawText('PRODUTOS SOLICITADOS:', {
    x: 50,
    y,
    size: 12,
    font: boldFont,
  })

  y -= 25
  for (const product of quote.products) {
    page.drawText(`• ${product.category} - ${product.type}`, {
      x: 60,
      y,
      size: 10,
      font,
    })
    y -= 15
    page.drawText(`  Medidas: ${product.width}cm x ${product.height}cm`, {
      x: 60,
      y,
      size: 10,
      font,
    })
    y -= 15
    page.drawText(`  Vidro: ${product.glass_type}`, {
      x: 60,
      y,
      size: 10,
      font,
    })
    y -= 15
    page.drawText(`  Acabamento: ${product.finish}`, {
      x: 60,
      y,
      size: 10,
      font,
    })
    y -= 25
  }

  // NÃO INCLUI DADOS DO CLIENTE - apenas da empresa solicitante

  // Salvar PDF
  const pdfBytes = await pdfDoc.save()
  const pdfBuffer = Buffer.from(pdfBytes)

  // Upload para storage (Cloudflare R2 ou local)
  const fileName = `cotacao_${quoteId}_${Date.now()}.pdf`
  const pdfUrl = await uploadToStorage(fileName, pdfBuffer)

  // Salvar referência no banco com Prisma
  await prisma.supplierQuote.create({
    data: {
      quoteId,
      supplierId,
      pdfUrl,
      status: 'PENDING',
    },
  })

  return Response.json({
    success: true,
    pdfUrl,
  })
}
```

---

## 7. COMPONENTES FRONTEND

### 7.1 Botão de Orçamento Assistido

```tsx
// components/orcamento/BotaoOrcamentoAssistido.tsx

'use client'

import { useState } from 'react'
import { Bot, Sparkles, Camera, MessageCircle } from 'lucide-react'
import { ChatAssistido } from './ChatAssistido'

export function BotaoOrcamentoAssistido() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mb-8 w-full transform rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-amber-600 hover:to-amber-700 hover:shadow-xl"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="rounded-full bg-white/20 p-3">
            <Bot className="h-8 w-8" />
          </div>
          <div className="text-left">
            <h3 className="flex items-center gap-2 text-xl font-bold">
              Orçamento Assistido por IA
              <Sparkles className="h-5 w-5" />
            </h3>
            <p className="text-sm text-amber-100">
              Não sabe o que precisa? Nossa IA vai te ajudar!
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-6 text-sm text-amber-100">
          <span className="flex items-center gap-1">
            <Camera className="h-4 w-4" /> Envie fotos
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> Tire dúvidas
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> Orçamento na hora
          </span>
        </div>
      </button>

      {isOpen && <ChatAssistido onClose={() => setIsOpen(false)} />}
    </>
  )
}
```

### 7.2 Chat Assistido (Modal)

```tsx
// components/orcamento/ChatAssistido.tsx

'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Camera, Loader2, Check } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  timestamp: Date
}

interface ChatAssistidoProps {
  onClose: () => void
}

export function ChatAssistido({ onClose }: ChatAssistidoProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Iniciar conversa
  useEffect(() => {
    startConversation()
  }, [])

  const startConversation = async () => {
    const res = await fetch('/api/ai/chat/start', { method: 'POST' })
    const data = await res.json()
    setConversationId(data.conversationId)

    // Mensagem inicial
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          'Olá! 👋 Sou o assistente da Versati Glass.\n\nVou te ajudar a fazer um orçamento de forma simples!\n\nMe conta: o que você está precisando?',
        timestamp: new Date(),
      },
    ])
  }

  const sendMessage = async (text: string, imageUrl?: string) => {
    if (!text.trim() && !imageUrl) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      imageUrl,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: text,
          imageUrl,
        }),
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        },
      ])

      // Verificar se é confirmação final
      if (data.quoteGenerated) {
        // Redirecionar para carrinho
        // router.push(`/orcamento/carrinho?quote=${data.quoteId}`);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Upload da imagem
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const { url } = await res.json()

    // Enviar mensagem com imagem
    sendMessage('Enviei uma foto do local', url)
  }

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[600px] w-full max-w-lg flex-col rounded-2xl bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Assistente Versati</h3>
              <p className="text-xs text-zinc-400">Online • Responde na hora</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user' ? 'bg-amber-500 text-white' : 'bg-zinc-800 text-zinc-100'
                }`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Imagem enviada"
                    className="mb-2 max-w-full rounded-lg"
                  />
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-zinc-800 px-4 py-2">
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-zinc-800 p-3 text-zinc-400 hover:bg-zinc-700"
            >
              <Camera className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="rounded-xl bg-amber-500 p-3 text-white hover:bg-amber-600 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 8. DASHBOARD ADMIN - COTAÇÃO FORNECEDORES

### 8.1 Fluxo do Admin

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📋 PEDIDOS PENDENTES                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ #001 | João Silva | Box Frontal 90x190cm | R$ 1.500       │  │
│  │ [👁️ Ver] [📄 Gerar Cotação Fornecedor] [✓ Aprovar]        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Ao clicar em "Gerar Cotação Fornecedor":                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ GERAR PDF DE COTAÇÃO                                       │  │
│  │ ─────────────────────────────────────────────────────────  │  │
│  │ ⚠️ O PDF será gerado em nome da VERSATI GLASS             │  │
│  │    (dados do cliente não serão incluídos)                  │  │
│  │                                                            │  │
│  │ Selecione fornecedores:                                    │  │
│  │ ☑️ Vidraçaria ABC (Box, Vidros)                            │  │
│  │ ☑️ Tempervidros LTDA (Temperados)                          │  │
│  │ ☐ Espelhos Brasil (Espelhos)                               │  │
│  │                                                            │  │
│  │ [ 📄 Gerar PDF ] [ 📧 Gerar e Enviar por Email ]          │  │
│  │ [ 📱 Gerar e Enviar por WhatsApp ]                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  PDF GERADO:                                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ╔═══════════════════════════════════════════════════════╗ │  │
│  │ ║         SOLICITAÇÃO DE COTAÇÃO                        ║ │  │
│  │ ║         VERSATI GLASS                                 ║ │  │
│  │ ║         CNPJ: 00.000.000/0001-00                     ║ │  │
│  │ ╠═══════════════════════════════════════════════════════╣ │  │
│  │ ║ PRODUTOS:                                             ║ │  │
│  │ ║ • Box Frontal de Correr                              ║ │  │
│  │ ║   Medidas: 90cm x 190cm                              ║ │  │
│  │ ║   Vidro: Temperado 8mm Incolor                       ║ │  │
│  │ ║   Acabamento: Alumínio Fosco                         ║ │  │
│  │ ║                                                       ║ │  │
│  │ ║ Prazo desejado: 10 dias úteis                        ║ │  │
│  │ ║ Contato: contato@versatiglass.com.br                 ║ │  │
│  │ ╚═══════════════════════════════════════════════════════╝ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. INTEGRAÇÕES NECESSÁRIAS

### 9.1 API Keys Necessárias

```env
# .env.local

# Groq AI (Llama para chat)
GROQ_API_KEY=gsk_xxxxx

# OpenAI (GPT-4 Vision para análise de imagens)
OPENAI_API_KEY=sk-proj-xxxxx

# WhatsApp Business (Meta/Twilio)
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# Database (PostgreSQL via Railway)
DATABASE_URL=postgresql://user:pass@host:5432/db
# Prisma já configurado - usar DATABASE_URL acima

# Upload de imagens (Cloudflare R2 ou similar)
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=versatiglass
```

### 9.2 Configuração WhatsApp Business

1. Criar conta Meta Business
2. Criar app no Meta Developers
3. Configurar WhatsApp Business API
4. Configurar webhook: `https://seusite.com/api/ai/whatsapp`
5. Assinar eventos: `messages`, `message_status`

---

## 10. RESUMO DE IMPLEMENTAÇÃO

### Ordem de Implementação:

```
FASE 1: Chat no Site ✅ IMPLEMENTADO
├── ✅ Tabelas criadas no banco (AiConversation, AiMessage)
├── ✅ API /api/ai/chat implementada
├── ✅ Componente ChatAssistido.tsx criado
├── ✅ Integração com Groq API (Llama 3.3-70b-versatile)
├── ✅ Integração com OpenAI GPT-4o Vision
└── ⏳ Testes de fluxo completo pendentes

FASE 2: WhatsApp (1-2 dias)
├── Configurar WhatsApp Business API
├── Criar webhook /api/ai/whatsapp
├── Reutilizar lógica do chat
└── Testar envio/recebimento

FASE 3: Admin Dashboard (1 dia)
├── Página de pedidos pendentes
├── Geração de PDF para fornecedor
├── Envio por email/WhatsApp
└── Histórico de cotações

FASE 4: Refinamentos (1 dia)
├── Melhorar prompts da IA
├── Adicionar mais categorias
├── Testes de usabilidade
└── Ajustes finais
```

---

## 11. PROMPT PARA O AGENTE IMPLEMENTAR

```
IMPLEMENTAR SISTEMA DE ORÇAMENTO ASSISTIDO POR IA

**STATUS ATUAL**: Fase 1 (Chat no Site) está 90% implementada.

### JÁ IMPLEMENTADO ✅:
1. BANCO DE DADOS
   - ✅ Tabelas criadas via Prisma: AiConversation, AiMessage
   - ✅ Schema configurado em prisma/schema.prisma
   - ✅ Migrations executadas

2. API ROUTES
   - ✅ /api/ai/chat (POST + GET) - Processar mensagens e buscar histórico
   - ⏳ /api/ai/whatsapp - Webhook WhatsApp (PENDENTE)
   - ⏳ /api/admin/supplier-quote - Gerar PDF (PENDENTE)

3. COMPONENTES
   - ✅ ChatAssistido.tsx - Modal de chat com IA
   - ✅ Suporte a upload de imagens
   - ✅ Análise de imagens com GPT-4 Vision
   - ⏳ Integração com página /orcamento (PENDENTE)

4. INTEGRAÇÕES
   - ✅ Groq API (Llama 3.3-70b-versatile)
   - ✅ OpenAI API (GPT-4o Vision)
   - ⏳ WhatsApp Business API (PENDENTE)
   - ⏳ Upload de imagens (usando base64, R2 PENDENTE)

### PENDENTE ⏳:
1. Integrar ChatAssistido na página /orcamento
2. Implementar webhook WhatsApp
3. Criar dashboard admin para cotações
4. Implementar geração de PDF para fornecedores
5. Adicionar modelo Supplier ao Prisma schema
6. Testes E2E do fluxo de chat assistido

Siga a arquitetura Prisma do documento. **NÃO usar Supabase** - usar Prisma conforme implementado.
```

---

**FIM DO DOCUMENTO**
