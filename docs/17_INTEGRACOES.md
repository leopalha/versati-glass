# 🔌 VERSATI GLASS - INTEGRAÇÕES

**Versão:** 1.0.0
**Data:** 17 Dezembro 2024
**Objetivo:** Documentação completa de todas as integrações externas

---

## ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Groq AI](#2-groq-ai)
3. [OpenAI](#3-openai)
4. [Stripe](#4-stripe)
5. [Twilio](#5-twilio)
6. [Resend](#6-resend)
7. [Cloudflare R2](#7-cloudflare-r2)
8. [Google OAuth](#8-google-oauth)
9. [Google Analytics](#9-google-analytics)
10. [Meta Pixel](#10-meta-pixel)
11. [Configuração](#11-configuração)
12. [Rate Limiting](#12-rate-limiting)

---

## 1. VISÃO GERAL

### 1.1 Stack de Integrações

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERSATI GLASS INTEGRATIONS                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │    GROQ     │    │   OPENAI    │    │   STRIPE    │        │
│   │  (AI Free)  │    │ (AI Backup) │    │ (Payments)  │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   TWILIO    │    │   RESEND    │    │     R2      │        │
│   │  (WhatsApp) │    │   (Email)   │    │  (Storage)  │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   GOOGLE    │    │   GOOGLE    │    │    META     │        │
│   │   (OAuth)   │    │ (Analytics) │    │   (Pixel)   │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Resumo de Integrações

| Serviço              | Função                        | Custo          | Status   | Arquivo Principal                               |
| -------------------- | ----------------------------- | -------------- | -------- | ----------------------------------------------- |
| **Groq**             | IA Conversacional (Llama 3.3) | FREE           | ✅ Ativo | `src/services/ai.ts`                            |
| **OpenAI**           | IA Backup + Vision            | Pago           | ✅ Ativo | `src/services/ai.ts`                            |
| **Stripe**           | Pagamentos (PIX + Cartão)     | % transação    | ✅ Ativo | `src/app/api/payments/*`                        |
| **Twilio**           | WhatsApp Business API         | Pago           | ✅ Ativo | `src/services/whatsapp.ts`                      |
| **Resend**           | Email Transacional            | FREE (100/dia) | ✅ Ativo | `src/services/email.ts`                         |
| **Cloudflare R2**    | Armazenamento de Arquivos     | FREE (10GB)    | ✅ Ativo | `src/app/api/upload/route.ts`                   |
| **Google OAuth**     | Autenticação Social           | FREE           | ✅ Ativo | `src/lib/auth.ts`                               |
| **Google Analytics** | Analytics Web                 | FREE           | ✅ Ativo | `src/components/analytics/google-analytics.tsx` |
| **Meta Pixel**       | Analytics + Ads Tracking      | FREE           | ✅ Ativo | `src/components/analytics/meta-pixel.tsx`       |

---

## 2. GROQ AI

### 2.1 Visão Geral

**O que é:** Plataforma de IA ultra-rápida que oferece acesso GRATUITO ao modelo Llama 3.3 70B da Meta.

**Por que Groq:**

- ✅ Totalmente GRATUITO (diferencial chave)
- ✅ Ultra-rápido (300+ tokens/segundo)
- ✅ Modelo Llama 3.3 70B de alta qualidade
- ✅ 128k tokens de contexto
- ✅ Sem necessidade de cartão de crédito

**Uso no Versati:**

- WhatsApp Bot conversacional 24/7
- Qualificação automática de leads
- Extração de dados estruturados de conversas
- Sugestões de produtos baseadas em descrições

### 2.2 Modelos Disponíveis

| Modelo                      | Velocidade   | Contexto | Custo | Uso no Projeto        |
| --------------------------- | ------------ | -------- | ----- | --------------------- |
| **llama-3.3-70b-versatile** | 300 tokens/s | 128k     | FREE  | ✅ Produção principal |
| llama-3.1-8b-instant        | 800 tokens/s | 8k       | FREE  | Fallback rápido       |
| llama-3.1-70b-versatile     | 250 tokens/s | 128k     | FREE  | Alternativa           |
| mixtral-8x7b-32768          | 500 tokens/s | 32k      | FREE  | Tarefas específicas   |

### 2.3 Configuração

```bash
# .env
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Como obter a API Key:**

1. Acesse [console.groq.com](https://console.groq.com)
2. Crie uma conta (totalmente gratuito, sem cartão)
3. Navegue até "API Keys" no menu lateral
4. Clique em "Create API Key"
5. Dê um nome (ex: "Versati Production")
6. Copie a chave gerada (só aparece uma vez!)
7. Cole no arquivo `.env` do projeto

### 2.4 Implementação

**Arquivo principal:** `src/services/ai.ts`

```typescript
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function sendWhatsAppAIMessage(conversationHistory: Message[], userMessage: string) {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: WHATSAPP_SYSTEM_PROMPT,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.senderType === 'CUSTOMER' ? 'user' : 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
    })

    return completion.choices[0]?.message?.content || 'Desculpe, não entendi.'
  } catch (error) {
    console.error('[Groq] Error:', error)
    // Fallback para modelo mais rápido
    return await sendWithFallbackModel(conversationHistory, userMessage)
  }
}
```

### 2.5 System Prompt - WhatsApp Bot

**Localização:** `src/services/ai.ts`

```typescript
const WHATSAPP_SYSTEM_PROMPT = `
Você é o assistente virtual da VERSATI GLASS, uma vidraçaria premium no Rio de Janeiro.

## OBJETIVO
Qualificar leads, coletar informações e agendar visitas técnicas.

## FLUXO DE CONVERSA
1. Cumprimente de forma calorosa e profissional
2. Pergunte como pode ajudar
3. Identifique o tipo de produto desejado
4. Pergunte sobre medidas aproximadas (largura x altura)
5. Colete nome completo do cliente
6. Colete endereço completo do serviço
7. Ofereça agendamento de visita técnica GRATUITA

## PRODUTOS E PREÇOS (use apenas essas faixas)
- **Box para Banheiro:** R$ 800 - R$ 2.500
- **Espelhos:** R$ 200 - R$ 1.500
- **Portas de Vidro:** R$ 1.500 - R$ 4.000
- **Guarda-Corpo:** R$ 400/m - R$ 800/m linear
- **Fechamentos de Varanda:** R$ 350/m² - R$ 650/m²
- **Janelas de Vidro:** R$ 600 - R$ 1.800
- **Pergolados:** R$ 250/m² - R$ 450/m²

## REGRAS IMPORTANTES
✓ Sempre seja educado, profissional e acolhedor
✓ Use emojis moderadamente (1-2 por mensagem)
✓ Respostas curtas e objetivas (máximo 3-4 linhas)
✓ NUNCA invente preços fora das faixas indicadas
✓ Se não souber algo, seja honesto e ofereça visita técnica
✓ Capture informações gradualmente, sem pressionar
✓ Sempre termine oferecendo próximo passo (agendamento)
✓ Ao receber endereço completo, confirme os dados

## ESTILO
- Tom: profissional mas amigável
- Linguagem: clara e acessível
- Foco: resolver o problema do cliente

## EXEMPLO DE CONVERSA
Cliente: "Oi, quero um box"
Você: "Olá! Que bom falar com você 😊 Tenho opções incríveis de box para banheiro! Me conta, você já tem as medidas aproximadas do vão?"

Cliente: "1,20m x 1,80m"
Você: "Perfeito! Um box de 1,20m x 1,80m fica entre R$ 1.200 e R$ 1.800 dependendo do modelo. Posso agendar uma visita técnica gratuita para tirar as medidas exatas e fazer um orçamento personalizado? Qual seu nome completo?"
`
```

### 2.6 Limites e Quotas (FREE Tier)

| Recurso         | Limite Diário | Limite por Minuto |
| --------------- | ------------- | ----------------- |
| Requisições     | 14,400        | 30                |
| Tokens entrada  | Ilimitado     | 20,000            |
| Tokens saída    | Ilimitado     | 20,000            |
| Contexto máximo | 128k tokens   | 128k tokens       |

**Estimativa de uso Versati:**

- ~500 conversas WhatsApp/dia
- ~10 mensagens por conversa = 5,000 mensagens/dia
- Média de 100 tokens por mensagem = 500k tokens/dia
- **Status:** Dentro do FREE tier ✅

### 2.7 Monitoramento

**Dashboard:** [console.groq.com/usage](https://console.groq.com/usage)

**Métricas disponíveis:**

- Total de requisições (últimos 30 dias)
- Tokens consumidos (entrada + saída)
- Latência média por requisição
- Taxa de erro
- Uso por modelo

**Alertas configurados:**

- Email quando atingir 80% do limite diário
- Webhook para Slack em caso de erros consecutivos

---

## 3. OPENAI

### 3.1 Visão Geral

**O que é:** Plataforma de IA da OpenAI com modelos GPT-4 e GPT-4o Vision.

**Uso no Versati:**

- **GPT-4o Vision:** Análise de imagens de ambientes enviadas por clientes
- **GPT-4 Turbo:** Fallback para Groq (raramente necessário)
- **Whisper:** Transcrição de áudios do WhatsApp (futuro)

### 3.2 Modelos Utilizados

| Modelo        | Velocidade   | Contexto | Custo (por 1M tokens)      | Uso                |
| ------------- | ------------ | -------- | -------------------------- | ------------------ |
| **gpt-4o**    | Rápido       | 128k     | $2.50 input / $10 output   | ✅ Vision Analysis |
| gpt-4-turbo   | Médio        | 128k     | $10 input / $30 output     | Fallback Groq      |
| gpt-3.5-turbo | Muito rápido | 16k      | $0.50 input / $1.50 output | Tarefas simples    |

### 3.3 Configuração

```bash
# .env
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Como obter:**

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta
3. Adicione método de pagamento (cartão de crédito)
4. Navegue até "API Keys"
5. Clique em "Create new secret key"
6. Dê um nome (ex: "Versati Production")
7. Copie a chave (começa com `sk-proj-`)
8. Cole no `.env`

### 3.4 Implementação - Vision Analysis

**Arquivo:** `src/services/ai.ts`

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function analyzeEnvironmentImage(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você é um especialista em vidraçaria analisando ambientes.

Analise a imagem e retorne um JSON com:
{
  "ambiente": "banheiro|sala|cozinha|varanda|outro",
  "dimensoes_estimadas": {
    "largura_metros": number,
    "altura_metros": number
  },
  "produtos_sugeridos": [
    {
      "categoria": "BOX|ESPELHOS|PORTAS|GUARDA_CORPO|FECHAMENTOS",
      "nome": string,
      "justificativa": string,
      "prioridade": "alta|media|baixa"
    }
  ],
  "observacoes": string
}`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analise esta imagem e sugira produtos de vidro adequados',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high', // Análise detalhada
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3, // Mais determinístico para análise técnica
    })

    const content = response.choices[0].message.content || '{}'
    return JSON.parse(content)
  } catch (error) {
    console.error('[OpenAI Vision] Error:', error)
    return {
      erro: 'Não foi possível analisar a imagem',
      produtos_sugeridos: [],
    }
  }
}
```

### 3.5 Uso Esperado e Custos

**Estimativa Mensal (100 clientes ativos):**

| Operação            | Qtd/mês      | Tokens médios      | Custo unitário | Total          |
| ------------------- | ------------ | ------------------ | -------------- | -------------- |
| Vision Analysis     | 50 imagens   | 1,000 out          | $0.02/imagem   | $1.00          |
| Fallback Groq       | 20 conversas | 2,000 in + 500 out | $0.05/conversa | $1.00          |
| Descrições produtos | 10 novos     | 500 in + 200 out   | $0.01/produto  | $0.10          |
| **TOTAL ESTIMADO**  | -            | -                  | -              | **~$2.10/mês** |

**Orçamento recomendado:** $10/mês (margem confortável)

### 3.6 Limites e Quotas

| Tier       | Requisições/minuto | Tokens/minuto | Custo necessário |
| ---------- | ------------------ | ------------- | ---------------- |
| FREE       | 3                  | 40,000        | $0               |
| **Tier 1** | 500                | 30,000        | $5+ gastos       |
| Tier 2     | 5,000              | 450,000       | $50+ gastos      |
| Tier 3     | 10,000             | 800,000       | $100+ gastos     |

**Tier atual:** Tier 1 (suficiente para operação)

---

## 4. STRIPE

### 4.1 Visão Geral

**O que é:** Plataforma de pagamentos online líder mundial, com suporte completo ao mercado brasileiro.

**Por que Stripe:**

- ✅ Suporte nativo a PIX (taxa mais baixa do mercado)
- ✅ Cartão de crédito internacional
- ✅ API moderna e bem documentada
- ✅ Webhooks confiáveis
- ✅ Dashboard completo

**Uso no Versati:**

- Pagamentos de orçamentos aprovados
- PIX instantâneo (método principal)
- Cartão de crédito (até 12x - futuro)
- Webhooks para automação de status
- Relatórios e conciliação

### 4.2 Métodos de Pagamento Configurados

| Método         | Taxa Stripe    | Processamento  | Recomendação          |
| -------------- | -------------- | -------------- | --------------------- |
| **PIX**        | 0.99%          | Instantâneo    | ✅ Método principal   |
| Cartão Débito  | 1.99% + R$0.39 | 1-2 dias       | Secundário            |
| Cartão Crédito | 3.59% + R$0.39 | 1-2 dias       | Futuro (parcelamento) |
| Boleto         | R$2.49         | 2-3 dias úteis | Não implementado      |

**Estratégia de incentivo:**

- Priorizar PIX nos CTAs (menor taxa)
- Destacar PIX como "Pagamento Instantâneo"
- Desconto de 5% para PIX à vista (opcional)

### 4.3 Configuração

```bash
# .env
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Como obter (Passo a passo completo):**

**1. Criar conta Stripe:**

- Acesse [dashboard.stripe.com/register](https://dashboard.stripe.com/register)
- Preencha dados da empresa:
  - Nome: "Versati Glass Vidraçaria Ltda"
  - CNPJ
  - Endereço completo
  - Telefone
  - Website

**2. Ativar conta (modo produção):**

- Complete verificação de identidade
- Envie documentos solicitados
- Aguarde aprovação (1-3 dias úteis)
- Configure conta bancária para recebimentos

**3. Obter API Keys:**

- Dashboard > Developers > API Keys
- **Publishable key** (começa com `pk_live_`):
  - Usar no frontend
  - Copiar para `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Secret key** (começa com `sk_live_`):
  - NUNCA expor no frontend
  - Copiar para `STRIPE_SECRET_KEY`

**4. Configurar Webhook:**

- Dashboard > Developers > Webhooks
- Clicar em "Add endpoint"
- URL do endpoint: `https://versatiglass.com.br/api/payments/webhook`
- Selecionar eventos:
  ```
  ✓ checkout.session.completed
  ✓ payment_intent.succeeded
  ✓ payment_intent.payment_failed
  ✓ charge.refunded
  ```
- Copiar "Signing secret" (começa com `whsec_`)
- Colar em `STRIPE_WEBHOOK_SECRET`

**5. Habilitar PIX:**

- Dashboard > Settings > Payment methods
- Ativar "PIX"
- Aceitar termos

### 4.4 Implementação - Criar Sessão de Checkout

**Arquivo:** `src/app/api/payments/create-session/route.ts`

```typescript
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()

    // Buscar pedido
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    if (!order) {
      return Response.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer_email: order.user.email,
      payment_method_types: ['card', 'pix'], // PIX + Cartão
      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.description,
            description: item.specifications || undefined,
            images: item.product?.images.slice(0, 1) || [],
          },
          unit_amount: Math.round(Number(item.unitPrice) * 100), // centavos
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/pedidos/${orderId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/pedidos/${orderId}?payment=canceled`,
      metadata: {
        orderId: order.id,
        orderNumber: order.number,
      },
      // Configurações PIX
      payment_method_options: {
        pix: {
          expires_after_seconds: 3600, // Expira em 1 hora
        },
      },
      // Expiração da sessão
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
    })

    // Salvar session ID no pedido
    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: session.id,
      },
    })

    return Response.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('[Stripe] Error creating session:', error)
    return Response.json({ error: 'Erro ao criar sessão de pagamento' }, { status: 500 })
  }
}
```

### 4.5 Webhook Handler

**Arquivo:** `src/app/api/payments/webhook/route.ts`

```typescript
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { sendPaymentConfirmationEmail } from '@/services/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[Stripe] Webhook signature verification failed:', err)
    return new Response('Webhook Error', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleRefund(charge)
        break
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('[Stripe] Webhook handler error:', error)
    return Response.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId

  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: {
      stripePaymentIntentId: session.payment_intent as string,
      paymentStatus: 'PAID',
      status: 'APROVADO',
      paidAmount: session.amount_total ? session.amount_total / 100 : 0,
    },
  })

  // Criar entrada no timeline
  await prisma.orderTimelineEntry.create({
    data: {
      orderId,
      status: 'APROVADO',
      description: 'Pagamento confirmado via Stripe',
      createdBy: 'system',
    },
  })

  // Enviar email de confirmação
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  })

  if (order) {
    await sendPaymentConfirmationEmail(
      order.user.email,
      order.user.name,
      order.number,
      Number(order.total)
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Lógica adicional se necessário
  console.log('[Stripe] Payment succeeded:', paymentIntent.id)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId

  if (!orderId) return

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'PENDING',
      status: 'AGUARDANDO_PAGAMENTO',
    },
  })

  // Notificar cliente sobre falha
  console.error('[Stripe] Payment failed:', paymentIntent.id)
}

async function handleRefund(charge: Stripe.Charge) {
  // Implementar lógica de reembolso se necessário
  console.log('[Stripe] Charge refunded:', charge.id)
}
```

### 4.6 Component Frontend - Payment Button

**Arquivo:** `src/components/portal/payment-button.tsx`

```typescript
'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export function PaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Criar sessão de checkout
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const { sessionId } = await response.json()

      // Redirecionar para Stripe Checkout
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      size="lg"
      className="w-full"
    >
      {loading ? 'Carregando...' : 'Pagar com PIX ou Cartão'}
    </Button>
  )
}
```

### 4.7 Monitoramento e Dashboard

**Dashboard Stripe:** [dashboard.stripe.com](https://dashboard.stripe.com)

**Métricas monitoradas:**

- Volume de vendas (dia/semana/mês)
- Taxa de sucesso de pagamentos
- Métodos de pagamento preferidos
- Disputas (chargebacks)
- Reembolsos solicitados
- Tempo médio de confirmação PIX

**Relatórios disponíveis:**

- Balanço diário
- Payout para conta bancária
- Conciliação contábil
- Análise de fraude

**Alertas configurados:**

- Email em caso de pagamento com alto risco de fraude
- Notificação de disputas abertas
- Aviso de saldo insuficiente para pagamentos

---

## 5. TWILIO

### 5.1 Visão Geral

**O que é:** Plataforma de comunicação programável com API oficial do WhatsApp Business.

**Uso no Versati:**

- Envio de mensagens WhatsApp automatizadas
- Recebimento de mensagens de clientes
- Integração com IA (Groq) para respostas automáticas
- Notificações de status de pedidos
- Lembretes de agendamentos

### 5.2 Configuração

```bash
# .env
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_WHATSAPP_NUMBER="+14155238886"  # Sandbox (teste) ou número aprovado (produção)
```

**Como obter:**

**1. Criar conta Twilio:**

- Acesse [console.twilio.com](https://console.twilio.com)
- Registre-se (oferece $15 de crédito grátis)
- Preencha dados da empresa

**2. Obter credenciais:**

- No dashboard inicial, copie:
  - **Account SID** (começa com `AC`)
  - **Auth Token** (oculto, clicar para revelar)

**3. WhatsApp Sandbox (para testes):**

- Menu lateral: Messaging > Try it Out > Send a WhatsApp message
- Enviar mensagem para `+1 415 523 8886` com o código fornecido
- Exemplo: `join <código-único>`
- Número sandbox: `+14155238886`

**4. WhatsApp Número Próprio (produção):**

- Menu: Messaging > Senders > WhatsApp senders
- Clicar em "Request Access"
- Preencher formulário:
  - Número de telefone brasileiro (+55)
  - Tipo de negócio
  - Casos de uso
- Aguardar aprovação do Meta (5-7 dias úteis)
- Configurar perfil WhatsApp Business:
  - Nome: "Versati Glass"
  - Descrição
  - Logo
  - Categorias

### 5.3 Implementação - Enviar Mensagem

**Arquivo:** `src/services/whatsapp.ts`

```typescript
import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)

const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER!

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    // Normalizar número de telefone
    const normalizedTo = to.startsWith('+') ? to : `+${to}`

    const result = await client.messages.create({
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${normalizedTo}`,
      body: message,
    })

    console.log('[Twilio] Message sent:', result.sid)

    return { success: true, sid: result.sid }
  } catch (error: any) {
    console.error('[Twilio] Error sending message:', error)

    return {
      success: false,
      error: error.message,
      code: error.code,
    }
  }
}

// Enviar mensagem com template aprovado
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  variables: Record<string, string>
) {
  try {
    const result = await client.messages.create({
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`,
      contentSid: templateName, // ID do template aprovado
      contentVariables: JSON.stringify(variables),
    })

    return { success: true, sid: result.sid }
  } catch (error: any) {
    console.error('[Twilio] Template error:', error)
    return { success: false, error: error.message }
  }
}

// Enviar com mídia (imagem, PDF, etc)
export async function sendWhatsAppMedia(to: string, message: string, mediaUrl: string) {
  try {
    const result = await client.messages.create({
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`,
      body: message,
      mediaUrl: [mediaUrl],
    })

    return { success: true, sid: result.sid }
  } catch (error: any) {
    console.error('[Twilio] Media error:', error)
    return { success: false, error: error.message }
  }
}
```

### 5.4 Webhook - Receber Mensagens

**Arquivo:** `src/app/api/whatsapp/webhook/route.ts`

```typescript
import { sendWhatsAppAIMessage } from '@/services/ai'
import { sendWhatsAppMessage } from '@/services/whatsapp'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Extrair dados da mensagem
    const from = formData.get('From')?.toString().replace('whatsapp:', '') || ''
    const body = formData.get('Body')?.toString() || ''
    const messageId = formData.get('MessageSid')?.toString() || ''
    const mediaUrl = formData.get('MediaUrl0')?.toString()

    console.log('[WhatsApp Webhook] Message from:', from, 'Body:', body)

    // Buscar ou criar conversa
    let conversation = await prisma.conversation.findFirst({
      where: { phoneNumber: from },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Últimas 20 mensagens (contexto)
        },
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          phoneNumber: from,
          status: 'ACTIVE',
        },
        include: {
          messages: true,
        },
      })
    }

    // Salvar mensagem recebida
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: 'INBOUND',
        type: mediaUrl ? 'IMAGE' : 'TEXT',
        content: body,
        mediaUrl,
        senderType: 'CUSTOMER',
      },
    })

    // Processar com IA (Groq)
    const aiResponse = await sendWhatsAppAIMessage(conversation.messages, body)

    // Salvar resposta da IA
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: 'OUTBOUND',
        type: 'TEXT',
        content: aiResponse,
        senderType: 'AI',
      },
    })

    // Enviar resposta para cliente
    await sendWhatsAppMessage(from, aiResponse)

    // Atualizar timestamp da conversa
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error)
    return new Response('Error', { status: 500 })
  }
}

// Configurar o webhook no Twilio Console:
// URL: https://versatiglass.com.br/api/whatsapp/webhook
// Method: POST
// Events: Incoming Messages
```

### 5.5 Templates Aprovados pelo Meta

**Status:** Pendente de aprovação

**Templates planejados:**

1. **welcome_message**

```
Olá {{1}}! 🔷

Bem-vindo à Versati Glass, especialistas em vidraçaria premium.

Como posso ajudar você hoje?
```

2. **quote_ready**

```
Olá {{1}}! 📋

Seu orçamento #{{2}} está pronto!

💰 Valor: R$ {{3}}
📅 Validade: {{4}}

Acesse: {{5}}
```

3. **payment_confirmed**

```
Pagamento confirmado! ✅

Pedido #{{1}} aprovado.

Próxima etapa: {{2}}

Obrigado pela confiança! 🔷
```

4. **appointment_reminder**

```
Lembrete de Agendamento 📅

Data: {{1}} às {{2}}
Endereço: {{3}}

Para confirmar, responda: SIM
Para reagendar, responda: REAGENDAR
```

### 5.6 Custos

**Preços Brasil (2024):**

| Tipo                     | Custo Unitário | Estimativa Mensal | Total           |
| ------------------------ | -------------- | ----------------- | --------------- |
| Mensagem Inbound         | $0.0075        | 1,000 msgs        | $7.50           |
| Mensagem Outbound        | $0.0082        | 1,000 msgs        | $8.20           |
| Número WhatsApp Business | $25.00/mês     | 1 número          | $25.00          |
| **TOTAL ESTIMADO**       | -              | -                 | **~$40.70/mês** |

**Conversão para BRL (dólar a R$ 5.00):** ~R$ 203/mês

**Otimização de custos:**

- Usar Twilio Sandbox para testes (gratuito)
- Aprovar templates (mensagens de template são mais baratas)
- Limitar mensagens automatizadas a horário comercial
- Implementar rate limiting para evitar spam

### 5.7 Monitoramento

**Dashboard Twilio:** [console.twilio.com](https://console.twilio.com)

**Métricas importantes:**

- Total de mensagens enviadas/recebidas
- Taxa de entrega (delivery rate)
- Erros e mensagens falhadas
- Custos acumulados
- Uso de templates vs mensagens livres

**Logs:** Monitor > Logs > Messaging Logs

---

## 6. RESEND

### 6.1 Visão Geral

**O que é:** Plataforma moderna de email transacional, criada pelos desenvolvedores do React Email.

**Por que Resend:**

- ✅ API simples e moderna
- ✅ 100 emails/dia GRATUITOS
- ✅ React Email integrado
- ✅ Verificação de domínio fácil
- ✅ Sem vendor lock-in

**Uso no Versati:**

- Emails de boas-vindas
- Recuperação de senha
- Confirmação de orçamentos
- Notificações de pagamento
- Lembretes de agendamento
- Documentos anexados

### 6.2 Configuração

```bash
# .env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@versatiglass.com.br"
```

**Como obter:**

**1. Criar conta:**

- Acesse [resend.com](https://resend.com)
- Sign up com GitHub ou email
- Verificar email

**2. Obter API Key:**

- Dashboard > API Keys
- Clicar em "Create API Key"
- Nome: "Versati Production"
- Permissões: "Sending access"
- Copiar chave (só aparece uma vez!)
- Colar em `.env` como `RESEND_API_KEY`

**3. Verificar domínio:**

- Dashboard > Domains
- Clicar em "Add Domain"
- Digitar: `versatiglass.com.br`
- Adicionar os registros DNS fornecidos no painel do domínio:

```
Tipo: TXT
Nome: _resend
Valor: [valor fornecido]

Tipo: MX
Nome: versatiglass.com.br
Prioridade: 10
Valor: feedback-smtp.us-east-1.amazonses.com

Tipo: CNAME
Nome: resend._domainkey
Valor: [valor fornecido]
```

- Aguardar verificação (5-30 minutos)
- Status muda para "Verified" ✅

### 6.3 Implementação - Service Layer

**Arquivo:** `src/services/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!

// Email de orçamento pronto
export async function sendQuoteEmail(
  to: string,
  customerName: string,
  quoteNumber: string,
  total: number,
  quoteUrl: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Versati Glass <${FROM_EMAIL}>`,
      to: [to],
      subject: `Seu orçamento #${quoteNumber} está pronto! 🔷`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C9A962; font-size: 32px; margin: 0;">Versati Glass</h1>
            <p style="color: #999; margin-top: 5px;">Transparência que transforma</p>
          </div>

          <!-- Saudação -->
          <div style="background: #111; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #FFF; margin-top: 0;">Olá ${customerName}!</h2>
            <p style="color: #CCC; line-height: 1.6;">
              Seu orçamento foi preparado com atenção e está pronto para visualização.
            </p>
          </div>

          <!-- Card do Orçamento -->
          <div style="background: linear-gradient(135deg, #C9A962 0%, #8B7355 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 20px;">
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Orçamento</p>
            <h1 style="color: #FFF; margin: 10px 0; font-size: 36px;">#${quoteNumber}</h1>
            <p style="color: #FFF; margin: 0; font-size: 28px; font-weight: 600;">R$ ${total.toFixed(2)}</p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${quoteUrl}"
               style="display: inline-block; background: #C9A962; color: #0A0A0A; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Ver Orçamento Completo
            </a>
          </div>

          <!-- Rodapé -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 12px; margin: 5px 0;">
              Dúvidas? Responda este email ou entre em contato pelo WhatsApp
            </p>
            <p style="color: #666; font-size: 12px; margin: 5px 0;">
              📱 +55 21 98253-6229 | 📧 contato@versatiglass.com.br
            </p>
            <p style="color: #444; font-size: 11px; margin-top: 20px;">
              © 2024 Versati Glass. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Resend] Error:', error)
      return { success: false, error }
    }

    console.log('[Resend] Email sent:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('[Resend] Exception:', error)
    return { success: false, error }
  }
}

// Email de recuperação de senha
export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  await resend.emails.send({
    from: `Versati Glass <${FROM_EMAIL}>`,
    to: [to],
    subject: 'Recuperação de senha - Versati Glass',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Olá ${name}</h1>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #C9A962; color: #0A0A0A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Redefinir Senha
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Se você não solicitou esta alteração, ignore este email.
          <br>Este link expira em 1 hora.
        </p>
      </div>
    `,
  })
}

// Email com anexo (PDF do orçamento)
export async function sendQuotePDFEmail(
  to: string,
  name: string,
  quoteNumber: string,
  pdfUrl: string
) {
  await resend.emails.send({
    from: `Versati Glass <${FROM_EMAIL}>`,
    to: [to],
    subject: `Orçamento #${quoteNumber} - PDF anexo`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>Olá ${name}!</h2>
        <p>Segue em anexo o PDF do seu orçamento #${quoteNumber}.</p>
        <p>Qualquer dúvida, estamos à disposição!</p>
      </div>
    `,
    attachments: [
      {
        filename: `orcamento-${quoteNumber}.pdf`,
        path: pdfUrl,
      },
    ],
  })
}
```

### 6.4 Templates de Email Implementados

**Localização:** `src/emails/` (usando React Email)

1. ✅ **welcome.tsx** - Boas-vindas após cadastro
2. ✅ **reset-password.tsx** - Recuperação de senha
3. ✅ **quote-sent.tsx** - Orçamento enviado
4. ✅ **quote-accepted.tsx** - Cliente aceitou orçamento
5. ✅ **payment-confirmed.tsx** - Pagamento confirmado
6. ✅ **appointment-scheduled.tsx** - Agendamento confirmado
7. ✅ **appointment-reminder.tsx** - Lembrete (24h antes)
8. ✅ **installation-complete.tsx** - Instalação concluída
9. ✅ **document-uploaded.tsx** - Novo documento disponível
10. ✅ **order-status-updated.tsx** - Status do pedido alterado

### 6.5 Limites e Custos

| Tier     | Emails/dia | Emails/mês | Custo   | Status         |
| -------- | ---------- | ---------- | ------- | -------------- |
| **FREE** | 100        | ~3,000     | $0      | ✅ Atual       |
| Pro      | ~1,666     | 50,000     | $20/mês | Upgrade futuro |
| Scale    | Ilimitado  | Ilimitado  | Custom  | Enterprise     |

**Estimativa de uso Versati:**

- 50 orçamentos/dia = 50 emails
- 10 cadastros/dia = 10 emails
- 5 recuperações de senha/dia = 5 emails
- 10 notificações diversas/dia = 10 emails
- **Total:** ~75 emails/dia (dentro do FREE tier ✅)

### 6.6 Monitoramento

**Dashboard:** [resend.com/emails](https://resend.com/emails)

**Métricas disponíveis:**

- Emails enviados (últimas 24h/7 dias/30 dias)
- Taxa de entrega (delivery rate)
- Taxa de abertura (open rate) - se habilitado
- Taxa de cliques (click rate) - se habilitado
- Bounces (emails rejeitados)
- Complaints (marcados como spam)

**Webhooks disponíveis:**

```typescript
// Configurar webhook para rastrear status
resend.webhooks.create({
  url: 'https://versatiglass.com.br/api/webhooks/resend',
  events: ['email.delivered', 'email.bounced', 'email.complained'],
})
```

---

## 7. CLOUDFLARE R2

**Tipo:** Object Storage (S3-compatible)
**Status:** 🟡 Configurado (não implementado)
**Uso:** Armazenamento de uploads (fotos, documentos, orçamentos)

### 7.1 Finalidade

Cloudflare R2 é usado para armazenar arquivos enviados pelos usuários:

- **Fotos de referência** (orçamentos)
- **Documentos técnicos** (projetos, especificações)
- **Contratos assinados**
- **Comprovantes de pagamento**
- **Fotos de instalações concluídas**

**Vantagens vs S3:**

- ✅ Sem custos de egress (bandwidth grátis)
- ✅ Compatível com S3 API
- ✅ CDN integrado do Cloudflare
- ✅ Menor custo de armazenamento

### 7.2 Configuração

**Variáveis de Ambiente:**

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID="sua-account-id"
R2_ACCESS_KEY_ID="sua-access-key"
R2_SECRET_ACCESS_KEY="seu-secret"
R2_BUCKET_NAME="versatiglass-uploads"
R2_PUBLIC_URL="https://uploads.versatiglass.com.br"
```

**Onde configurar:**

1. Dashboard Cloudflare → R2 → Create Bucket
2. Gerar API Token com permissões de read/write
3. Configurar domínio customizado (opcional)

### 7.3 Implementação

**Arquivo:** [src/lib/storage.ts](../src/lib/storage.ts) (não implementado ainda)

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadFile(file: File, path: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: path,
      Body: buffer,
      ContentType: file.type,
    })
  )

  return `${process.env.R2_PUBLIC_URL}/${path}`
}
```

**API Route:** [src/app/api/upload/route.ts](../src/app/api/upload/route.ts)

- Atualmente usa UploadThing (alternativa temporária)
- Migração para R2 planejada para v1.2.0

### 7.4 Limites e Custos

| Tier     | Storage   | Operações    | Egress    | Custo         |
| -------- | --------- | ------------ | --------- | ------------- |
| **FREE** | 10 GB     | 1M/mês       | Ilimitado | $0            |
| Paid     | $0.015/GB | $0.36/milhão | Grátis    | Pay-as-you-go |

**Estimativa de uso Versati:**

- 100 uploads/dia × 2 MB = 200 MB/dia = 6 GB/mês
- 100 reads/dia × 30 = 3,000 operações/mês
- **Total:** ~$0.09/mês (dentro do FREE tier ✅)

### 7.5 Roadmap

- ⏳ **v1.2.0:** Migrar de UploadThing para R2
- ⏳ Implementar compressão de imagens automática
- ⏳ Adicionar watermark nas fotos
- ⏳ Cleanup automático de arquivos órfãos (30 dias)

---

## 8. GOOGLE OAUTH

**Tipo:** Autenticação Social
**Status:** 🟡 Configurado (NextAuth)
**Uso:** Login com Google

### 8.1 Finalidade

Permite que usuários façam login usando suas contas Google, sem criar senha:

- **Cadastro rápido** (1 clique)
- **Menos atritos** (sem formulários longos)
- **Mais seguro** (OAuth 2.0)
- **Recuperação automática** (via Google)

### 8.2 Configuração

**Variáveis de Ambiente:**

```env
# Google OAuth
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz"
```

**Onde configurar:**

1. [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials → Create OAuth Client ID
3. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://versatiglass.com.br/api/auth/callback/google` (prod)

### 8.3 Implementação

**Arquivo:** [src/lib/auth.ts](../src/lib/auth.ts)

```typescript
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // ... resto da config
}
```

**Fluxo:**

1. User clica "Entrar com Google" → [/login](<../src/app/(auth)/login/page.tsx>)
2. Redireciona para Google OAuth
3. User autoriza acesso
4. Callback cria/atualiza user no Prisma
5. Sessão criada com NextAuth

### 8.4 Dados Capturados

```typescript
// Informações retornadas pelo Google
{
  id: string // Google ID único
  email: string // Email verificado
  name: string // Nome completo
  image: string // Foto de perfil (avatar)
  emailVerified: Date // Sempre true (Google já verificou)
}
```

### 8.5 Limites e Custos

- ✅ **Grátis** (até 10,000 users)
- ✅ Sem rate limits para OAuth básico
- ✅ Incluso no Google Cloud Free Tier

---

## 9. GOOGLE ANALYTICS 4

**Tipo:** Analytics & Tracking
**Status:** ⏳ Pendente (variável vazia)
**Uso:** Análise de comportamento e conversões

### 9.1 Finalidade

Google Analytics 4 (GA4) rastreia comportamento dos usuários para:

- **Funil de conversão:** Visitante → Lead → Cliente
- **Origem de tráfego:** Google Ads, Orgânico, Redes Sociais
- **Páginas mais visitadas:** /produtos, /orcamento, /portfolio
- **Taxa de abandono:** Onde users desistem do orçamento
- **Eventos personalizados:** Botão WhatsApp, Download catálogo

### 9.2 Configuração

**Variáveis de Ambiente:**

```env
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Onde configurar:**

1. [Google Analytics](https://analytics.google.com/)
2. Admin → Create Property → GA4
3. Data Streams → Web → Copy Measurement ID

### 9.3 Implementação

**Arquivo:** [src/lib/analytics.ts](../src/lib/analytics.ts)

```typescript
// Google Analytics 4
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Pageview tracking
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID) return

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Event tracking
export const event = (action: string, params?: any) => {
  if (!GA_MEASUREMENT_ID) return

  window.gtag('event', action, params)
}
```

**Eventos rastreados:**

```typescript
// Orçamento iniciado
event('begin_checkout', {
  currency: 'BRL',
  value: 0, // Estimado depois
  items: [{ item_name: 'Espelho', quantity: 1 }],
})

// WhatsApp clicado
event('contact_whatsapp', {
  method: 'floating_button',
  page: window.location.pathname,
})

// Produto visualizado
event('view_item', {
  item_id: product.slug,
  item_name: product.name,
  item_category: product.category,
})
```

### 9.4 Eventos Personalizados

| Evento                  | Quando dispara         | Parâmetros                             |
| ----------------------- | ---------------------- | -------------------------------------- |
| `quote_started`         | Step 1 do wizard       | category, source                       |
| `quote_completed`       | Step 7 finalizado      | category, items_count, estimated_value |
| `quote_abandoned`       | User sai sem completar | step_number, time_spent                |
| `whatsapp_click`        | Botão WhatsApp         | page, position                         |
| `appointment_scheduled` | Agendamento confirmado | date, time                             |
| `catalog_download`      | Download PDF catálogo  | product_category                       |

### 9.5 Limites e Custos

- ✅ **Grátis** (até 10M events/mês)
- ✅ Retenção de dados: 14 meses
- ✅ Sem limites de propriedades

**Estimativa de uso Versati:**

- 1,000 pageviews/dia
- 200 eventos personalizados/dia
- **Total:** ~9,000 events/dia = 270K/mês (dentro do FREE ✅)

---

## 10. META PIXEL

**Tipo:** Ads Tracking & Retargeting
**Status:** ⏳ Pendente (variável vazia)
**Uso:** Facebook/Instagram Ads e retargeting

### 10.1 Finalidade

Meta Pixel rastreia conversões de anúncios Facebook/Instagram:

- **Retargeting:** Mostrar anúncios para quem visitou o site
- **Lookalike Audiences:** Encontrar usuários similares aos clientes
- **Conversion Tracking:** Medir ROI das campanhas
- **Otimização de anúncios:** Meta aprende quem converte melhor

### 10.2 Configuração

**Variáveis de Ambiente:**

```env
# Meta Pixel (Facebook/Instagram)
NEXT_PUBLIC_META_PIXEL_ID="1234567890123456"
```

**Onde configurar:**

1. [Meta Business Suite](https://business.facebook.com/)
2. Events Manager → Create Pixel
3. Copy Pixel ID

### 10.3 Implementação

**Arquivo:** [src/lib/analytics.ts](../src/lib/analytics.ts)

```typescript
// Meta Pixel
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

// Track pageview
export const pixelPageview = () => {
  if (!PIXEL_ID) return

  window.fbq('track', 'PageView')
}

// Track events
export const pixelEvent = (name: string, params?: any) => {
  if (!PIXEL_ID) return

  window.fbq('track', name, params)
}
```

**Eventos padrão do Meta:**

```typescript
// Lead gerado (orçamento iniciado)
pixelEvent('Lead', {
  content_category: 'Espelho',
  content_name: 'Orçamento Espelho Bisotado',
  value: 0,
  currency: 'BRL',
})

// Contato via WhatsApp
pixelEvent('Contact', {
  content_name: 'WhatsApp',
})

// Agendamento confirmado
pixelEvent('Schedule', {
  content_name: 'Visita Técnica',
})
```

### 10.4 Eventos Personalizados

| Evento              | Standard Event      | Quando dispara   |
| ------------------- | ------------------- | ---------------- |
| Orçamento iniciado  | `Lead`              | Step 1 completo  |
| Orçamento enviado   | `SubmitApplication` | Step 7 completo  |
| WhatsApp clicado    | `Contact`           | Botão floating   |
| Produto visualizado | `ViewContent`       | /produtos/[slug] |
| Catálogo baixado    | `Lead`              | Download PDF     |

### 10.5 Limites e Custos

- ✅ **Grátis** (ilimitado)
- ✅ Sem rate limits
- ✅ Retenção de 180 dias de eventos

---

## 11. CONFIGURAÇÃO CONSOLIDADA

### 11.1 Variáveis de Ambiente (.env.production)

```env
# ==========================================
# DATABASE
# ==========================================
DATABASE_URL="postgresql://user:pass@host:5432/versatiglass"

# ==========================================
# AUTHENTICATION
# ==========================================
NEXTAUTH_URL="https://versatiglass.com.br"
NEXTAUTH_SECRET="seu-secret-complexo-aqui-64-chars-min"
AUTH_SECRET="seu-secret-complexo-aqui-64-chars-min"

# Google OAuth
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz"

# ==========================================
# AI PROVIDERS
# ==========================================
# Groq (Conversacional - FREE)
GROQ_API_KEY="gsk_abc123xyz"

# OpenAI (Visão - PAID)
OPENAI_API_KEY="sk-proj-abc123xyz"

# ==========================================
# PAYMENTS
# ==========================================
# Stripe (PIX + Cartão)
STRIPE_SECRET_KEY="sk_live_abc123xyz"
STRIPE_WEBHOOK_SECRET="whsec_abc123xyz"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_abc123xyz"

# ==========================================
# COMMUNICATION
# ==========================================
# Twilio WhatsApp
TWILIO_ACCOUNT_SID="AC123abc"
TWILIO_AUTH_TOKEN="abc123xyz"
TWILIO_WHATSAPP_NUMBER="+14155238886"

# Resend (Email)
RESEND_API_KEY="re_abc123xyz"
RESEND_FROM_EMAIL="noreply@versatiglass.com.br"

# ==========================================
# STORAGE
# ==========================================
# Cloudflare R2
R2_ACCOUNT_ID="abc123xyz"
R2_ACCESS_KEY_ID="abc123"
R2_SECRET_ACCESS_KEY="xyz789"
R2_BUCKET_NAME="versatiglass-uploads"
R2_PUBLIC_URL="https://uploads.versatiglass.com.br"

# ==========================================
# ANALYTICS & TRACKING
# ==========================================
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID="1234567890123456"

# Google Tag Manager (opcional)
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"

# ==========================================
# CRON JOBS
# ==========================================
CRON_SECRET="seu-cron-secret-123"

# ==========================================
# APP CONFIG
# ==========================================
NEXT_PUBLIC_APP_URL="https://versatiglass.com.br"
NEXT_PUBLIC_BASE_URL="https://versatiglass.com.br"
NEXT_PUBLIC_WHATSAPP_NUMBER="+5521982536229"
```

### 11.2 Checklist de Deploy

**Antes de ir para produção:**

- [ ] Database PostgreSQL criado e migrado (`pnpm db:push`)
- [ ] Todas as API keys configuradas em produção
- [ ] NEXTAUTH_SECRET gerado com 64+ caracteres
- [ ] Google OAuth redirect URIs atualizados
- [ ] Stripe webhook configurado com URL de produção
- [ ] Twilio WhatsApp Business API ativado (sair do sandbox)
- [ ] Resend domínio verificado (versatiglass.com.br)
- [ ] Cloudflare R2 bucket criado e público
- [ ] Google Analytics 4 property criada
- [ ] Meta Pixel instalado e testado
- [ ] Testes E2E passando (`pnpm test:e2e`)
- [ ] Build de produção validado (`pnpm build`)

### 11.3 Custos Mensais Estimados

| Serviço                  | Tier          | Custo/mês      | Justificativa                    |
| ------------------------ | ------------- | -------------- | -------------------------------- |
| **Railway** (PostgreSQL) | Hobby         | $5             | Database hosting                 |
| **Vercel** (Next.js)     | Hobby         | $20            | Frontend + APIs                  |
| **Groq**                 | FREE          | $0             | Chat IA (100K req/dia)           |
| **OpenAI**               | Pay-as-you-go | $10-30         | Análise de imagens (~1K req/mês) |
| **Resend**               | FREE          | $0             | <100 emails/dia                  |
| **Twilio**               | Pay-as-you-go | $20-40         | WhatsApp Business (~500 msg/mês) |
| **Stripe**               | Pay-as-you-go | 2.99% + R$0.59 | Apenas quando há venda           |
| **Cloudflare R2**        | FREE          | $0             | <10 GB storage                   |
| **Google Analytics**     | FREE          | $0             | Ilimitado até 10M events         |
| **Meta Pixel**           | FREE          | $0             | Ilimitado                        |
|                          |               |                |                                  |
| **TOTAL**                |               | **$55-95/mês** | Sem contar transações Stripe     |

**Escalabilidade:**

- 100 → 1,000 usuários/dia: +$20-30/mês (OpenAI + Twilio)
- 1,000 → 10,000 usuários/dia: +$100-200/mês (upgrade tiers)

---

**Versão**: 1.0.0
**Última Atualização**: 17 Dezembro 2024
**Status**: Documentação Completa ✅

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Integrações de IA](#integrações-de-ia)
3. [Comunicação e Notificações](#comunicação-e-notificações)
4. [Infraestrutura e Banco de Dados](#infraestrutura-e-banco-de-dados)
5. [Pagamentos](#pagamentos)
6. [Armazenamento](#armazenamento)
7. [Autenticação](#autenticação)
8. [Analytics e Tracking](#analytics-e-tracking)
9. [Cron Jobs e Automações](#cron-jobs-e-automações)
10. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Esta documentação centraliza todas as integrações de APIs externas utilizadas no sistema Versati Glass. Cada integração inclui:

- **Finalidade**: Para que serve
- **Configuração**: Variáveis de ambiente necessárias
- **Implementação**: Onde está implementado no código
- **Limites e Preços**: Rate limits e custos
- **Documentação Oficial**: Links de referência

### Status das Integrações

| Integração              | Status       | Prioridade | Ambiente                         |
| ----------------------- | ------------ | ---------- | -------------------------------- |
| **Groq (Llama)**        | ✅ Produção  | P0         | API Key configurada              |
| **OpenAI (GPT-4o)**     | ✅ Produção  | P0         | API Key configurada              |
| **Prisma + PostgreSQL** | ✅ Produção  | P0         | Railway hosting                  |
| **NextAuth**            | ✅ Produção  | P0         | Configurado                      |
| **Resend (Email)**      | ✅ Produção  | P1         | API Key configurada              |
| **Twilio (WhatsApp)**   | ⏳ Sandbox   | P1         | Implementado, requer verificação |
| **Stripe**              | 🔜 Planejado | P2         | Não configurado                  |
| **Cloudflare R2**       | 🔜 Planejado | P2         | Não configurado                  |
| **Google OAuth**        | ⏳ Pendente  | P2         | Suporte implementado             |
| **Cal.com**             | 🔜 Planejado | P3         | Não implementado                 |
| **Google Analytics**    | 🔜 Planejado | P3         | Não configurado                  |

---

## Integrações de IA

### 1. Groq (Llama 3.3-70b-versatile)

**Finalidade**: Chat conversacional com IA para atendimento ao cliente

**Modelo**: `llama-3.3-70b-versatile`

- Melhor modelo Llama para conversação
- Velocidade: ~100 tokens/s
- Contexto: 32k tokens
- **GRATUITO** durante beta (rate limits aplicam)

#### Configuração

```bash
# .env.local
GROQ_API_KEY="gsk_..."
```

#### Obter API Key

1. Acesse: https://console.groq.com/keys
2. Crie uma conta (gratuita)
3. Gere uma nova API Key
4. Copie e adicione no `.env.local`

#### Implementação

- **Arquivo**: `src/services/ai.ts`
- **Funções principais**:
  - `generateAIResponse()`: Gera resposta contextualizada
  - `generateGreeting()`: Gera saudação baseada no horário
  - `generateQuoteSummary()`: Gera resumo de orçamento
  - `extractDataFromMessage()`: Extrai dados estruturados

```typescript
import { generateAIResponse } from '@/services/ai'

const response = await generateAIResponse('Preciso de um box de banheiro', conversationHistory, {
  name: 'João',
  previousOrders: 2,
})
```

#### API Endpoint

- **Rota**: `POST /api/ai/chat`
- **Arquivo**: `src/app/api/ai/chat/route.ts`
- **Payload**:

```json
{
  "message": "Olá, preciso de um orçamento",
  "sessionId": "uuid-v4",
  "conversationId": "optional-conversation-id"
}
```

#### Rate Limits (Beta Gratuito)

| Limite             | Valor         |
| ------------------ | ------------- |
| Requisições/minuto | 30            |
| Requisições/dia    | 14,400        |
| Tokens/minuto      | 6,000         |
| Contexto máximo    | 32,768 tokens |

#### Custos Futuros (Pós-Beta)

| Modelo        | Input           | Output          |
| ------------- | --------------- | --------------- |
| Llama 3.3-70b | $0.59/1M tokens | $0.79/1M tokens |
| Llama 3.1-8b  | $0.05/1M tokens | $0.08/1M tokens |

#### Fallback Strategy

O sistema possui respostas fallback em caso de erro:

- Saudações baseadas em horário
- Respostas pré-configuradas para tópicos comuns
- Referência ao atendimento humano

**Documentação**: https://console.groq.com/docs

---

### 2. OpenAI (GPT-4o Vision)

**Finalidade**: Análise de imagens enviadas pelos clientes para identificar produtos e estimar medidas

**Modelo**: `gpt-4o` (multimodal - texto + imagem)

#### Configuração

```bash
# .env.local
OPENAI_API_KEY="sk-proj-..."
```

#### Obter API Key

1. Acesse: https://platform.openai.com/api-keys
2. Crie uma conta OpenAI
3. Adicione créditos (mínimo $5)
4. Gere uma nova API Key
5. Copie e adicione no `.env.local`

#### Implementação

- **Arquivo**: `src/app/api/ai/chat/route.ts` (linhas 228-290)
- **Uso**: Análise de imagens com GPT-4o Vision

```typescript
// Quando o usuário envia uma imagem
if (imageUrl) {
  const visionResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: visionPrompt },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
    max_tokens: 500,
  })
}
```

#### Rate Limits

| Tier   | RPM   | TPM        | Custo         |
| ------ | ----- | ---------- | ------------- |
| Free   | 3     | 200,000    | Limitado      |
| Tier 1 | 500   | 2,000,000  | $5+ créditos  |
| Tier 2 | 5,000 | 10,000,000 | $50+ créditos |

#### Custos (GPT-4o)

| Tipo        | Custo              |
| ----------- | ------------------ |
| Input text  | $2.50 / 1M tokens  |
| Output text | $10.00 / 1M tokens |
| Input image | $7.50 / 1M tokens  |

**Estimativa**: Uma análise de imagem custa ~$0.01-0.03 por foto

#### Prompt de Visão

```typescript
const visionPrompt = `Analise esta imagem de banheiro/ambiente e identifique:
1. Tipo de produto necessário (box, espelho, vidro temperado, porta)
2. Configuração do espaço (canto, frontal, lateral)
3. Medidas aproximadas (largura e altura em metros)
4. Acabamentos visíveis (ferragens, cores)
5. Observações importantes

Responda em português BR, formato JSON estruturado.`
```

**Documentação**: https://platform.openai.com/docs/guides/vision

---

## Comunicação e Notificações

### 3. Resend (Email Transacional)

**Finalidade**: Envio de emails transacionais (orçamentos, confirmações, lembretes)

#### Configuração

```bash
# .env.local
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@versatiglass.com.br"
```

#### Obter API Key

1. Acesse: https://resend.com/api-keys
2. Crie uma conta
3. Verifique seu domínio (versatiglass.com.br)
4. Gere uma API Key
5. Configure registros DNS (SPF, DKIM, DMARC)

#### Implementação

- **Arquivo**: `src/services/email.ts`
- **Templates disponíveis**:
  - `generateQuoteEmailHtml()`: Orçamento enviado
  - `generateOrderConfirmationHtml()`: Pedido confirmado
  - `generateAppointmentReminderHtml()`: Lembrete de agendamento
  - `generatePasswordResetHtml()`: Redefinição de senha
  - `generateEmailVerificationHtml()`: Verificação de email
  - `generateAppointmentStatusChangeHtml()`: Status de agendamento
  - `generateAppointmentRescheduledHtml()`: Agendamento reagendado

```typescript
import { sendEmail, generateQuoteEmailHtml } from '@/services/email'

await sendEmail({
  to: "cliente@email.com",
  subject: "Orçamento #1234 - Versati Glass",
  html: generateQuoteEmailHtml({
    customerName: "João Silva",
    quoteNumber: "1234",
    total: "R$ 1.850,00",
    validUntil: "15/01/2025",
    portalUrl: "https://versatiglass.com.br/portal/orcamentos/1234",
    items: [...]
  })
})
```

#### Rate Limits (Plano Gratuito)

| Limite     | Valor     |
| ---------- | --------- |
| Emails/dia | 100       |
| Emails/mês | 3,000     |
| Remetentes | 1 domínio |

#### Custos (Plano Pago)

| Plano | Custo   | Emails           |
| ----- | ------- | ---------------- |
| Free  | $0      | 3,000/mês        |
| Pro   | $20/mês | 50,000/mês       |
| Extra | $0.40   | por 1,000 extras |

#### Configuração DNS

```dns
# SPF Record
@ TXT "v=spf1 include:resend.com ~all"

# DKIM Record (fornecido pela Resend)
resend._domainkey TXT "v=DKIM1; k=rsa; p=..."

# DMARC Record
_dmarc TXT "v=DMARC1; p=none; rua=mailto:dmarc@versatiglass.com.br"
```

**Documentação**: https://resend.com/docs

---

### 4. Twilio (WhatsApp Business)

**Finalidade**: Envio de mensagens via WhatsApp para notificações e atendimento

#### Configuração

```bash
# .env.local
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="+14155238886"  # Sandbox number
```

#### Obter Credenciais

1. Acesse: https://console.twilio.com/
2. Crie uma conta Twilio
3. Configure WhatsApp Sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
4. Para produção: solicite aprovação do WhatsApp Business API
5. Copie Account SID e Auth Token

#### Implementação

- **Arquivo**: `src/services/whatsapp.ts`
- **Funções principais**:
  - `sendWhatsAppMessage()`: Envia mensagem
  - `sendTemplateMessage()`: Envia template pré-aprovado
  - `parseIncomingMessage()`: Parse webhook Twilio
  - `validateTwilioSignature()`: Valida assinatura webhook

```typescript
import { sendWhatsAppMessage, sendTemplateMessage } from '@/services/whatsapp'

// Mensagem simples
await sendWhatsAppMessage({
  to: '21982536229',
  message: 'Seu orçamento #1234 foi aprovado!',
  mediaUrl: 'https://versatiglass.com.br/quote-pdf/1234.pdf',
})

// Template pré-aprovado
await sendTemplateMessage('21982536229', 'quote_sent', {
  customerName: 'João Silva',
  quoteNumber: '1234',
  total: '1850.00',
  validUntil: '15/01/2025',
  portalUrl: 'https://versatiglass.com.br/portal',
})
```

#### Templates Disponíveis

| Template                | Uso                                 |
| ----------------------- | ----------------------------------- |
| `quote_sent`            | Orçamento enviado                   |
| `order_approved`        | Pedido aprovado                     |
| `appointment_reminder`  | Lembrete de agendamento (24h antes) |
| `installation_complete` | Instalação concluída                |

#### Webhook Configuration

**URL**: `https://versatiglass.com.br/api/whatsapp/webhook`

**Configuração no Twilio**:

1. Console → Messaging → Settings → WhatsApp Sandbox Settings
2. Configure "When a message comes in": `POST https://versatiglass.com.br/api/whatsapp/webhook`

#### Rate Limits (Sandbox)

| Limite               | Valor                               |
| -------------------- | ----------------------------------- |
| Destinatários únicos | Usuários que enviaram "join [code]" |
| Mensagens/hora       | Ilimitado (sandbox)                 |
| Validade             | 72 horas por usuário                |

#### Custos (Produção)

| Tipo                           | Custo                   |
| ------------------------------ | ----------------------- |
| Conversa iniciada pelo negócio | $0.0055 (BR)            |
| Conversa iniciada pelo usuário | $0.0038 (BR)            |
| Template aprovado              | Grátis (primeiras 1000) |

**Importante**: Para produção, requer:

- WhatsApp Business Account verificado
- Aprovação de templates de mensagem
- Facebook Business Manager

**Documentação**: https://www.twilio.com/docs/whatsapp

---

## Infraestrutura e Banco de Dados

### 5. Prisma + PostgreSQL (Railway)

**Finalidade**: ORM e banco de dados relacional

#### Configuração

```bash
# .env.local
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

#### Railway Setup

1. Acesse: https://railway.app/
2. Crie novo projeto
3. Adicione PostgreSQL plugin
4. Copie `DATABASE_URL` fornecida
5. Configure no `.env.local`

#### Prisma CLI

```bash
# Instalar Prisma CLI
pnpm install -D prisma

# Gerar Prisma Client
pnpm prisma generate

# Criar migration
pnpm prisma migrate dev --name nome-da-migration

# Aplicar migrations em produção
pnpm prisma migrate deploy

# Abrir Prisma Studio (GUI)
pnpm prisma studio

# Seed do banco
pnpm prisma db seed
```

#### Schema Location

- **Arquivo**: `prisma/schema.prisma`
- **Modelos principais**: User, Quote, Order, Product, Appointment, AiConversation, AiMessage

#### Backup e Restore

```bash
# Backup (Railway CLI)
railway db backup create

# Backup manual (pg_dump)
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

#### Rate Limits (Railway - Hobby Plan)

| Limite               | Valor         |
| -------------------- | ------------- |
| Armazenamento        | 512 MB        |
| Conexões simultâneas | 20            |
| RAM                  | 512 MB        |
| CPU                  | Compartilhado |

#### Custos

| Plano      | Custo   | Recursos           |
| ---------- | ------- | ------------------ |
| Hobby      | $5/mês  | 512MB, 20 conexões |
| Pro        | $20/mês | 8GB, 100 conexões  |
| Enterprise | Custom  | Ilimitado          |

**Documentação**:

- Prisma: https://www.prisma.io/docs
- Railway: https://docs.railway.app/

---

### 6. NextAuth (Authentication)

**Finalidade**: Autenticação de usuários (email/senha + OAuth)

#### Configuração

```bash
# .env.local
NEXTAUTH_URL="http://localhost:3000"  # Produção: https://versatiglass.com.br
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

#### Gerar Secret

```bash
openssl rand -base64 32
```

#### Implementação

- **Arquivo**: `src/lib/auth.ts`
- **Providers configurados**:
  - Credentials (email/senha)
  - Google OAuth (pendente configuração)

#### Google OAuth Setup (Opcional)

1. Acesse: https://console.cloud.google.com/
2. Crie novo projeto
3. APIs & Services → Credentials → Create OAuth 2.0 Client ID
4. Authorized redirect URIs: `https://versatiglass.com.br/api/auth/callback/google`
5. Copie Client ID e Secret

#### Rotas de Autenticação

| Rota                        | Método | Descrição                |
| --------------------------- | ------ | ------------------------ |
| `/api/auth/[...nextauth]`   | \*     | NextAuth routes          |
| `/api/auth/register`        | POST   | Registro de usuário      |
| `/api/auth/forgot-password` | POST   | Solicitar reset de senha |
| `/api/auth/reset-password`  | POST   | Redefinir senha          |
| `/login`                    | GET    | Página de login          |
| `/registro`                 | GET    | Página de registro       |

#### Middleware Protection

- **Arquivo**: `src/middleware.ts`
- **Rotas protegidas**:
  - `/portal/*` → Requer autenticação de CUSTOMER
  - `/admin/*` → Requer autenticação de ADMIN

**Documentação**: https://next-auth.js.org/

---

## Pagamentos

### 7. Stripe (Pagamentos Online)

**Finalidade**: Processamento de pagamentos (cartão, Pix)

**Status**: 🔜 Planejado para v1.2.0

#### Configuração

```bash
# .env.local
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### Obter Credenciais

1. Acesse: https://dashboard.stripe.com/register
2. Crie conta Stripe Brasil
3. Navegue para Developers → API Keys
4. Copie Publishable Key e Secret Key
5. Configure webhook endpoint

#### Implementação Planejada

- **Rotas**:
  - `POST /api/payments/create-session`: Criar sessão de checkout
  - `POST /api/payments/webhook`: Webhook de eventos Stripe
- **Métodos suportados**:
  - Cartão de crédito (Visa, Mastercard, Amex)
  - Pix (Stripe Brasil)
  - Boleto (Stripe Brasil)

#### Webhook Setup

**URL**: `https://versatiglass.com.br/api/payments/webhook`

**Eventos a monitorar**:

- `checkout.session.completed`: Pagamento concluído
- `payment_intent.succeeded`: Pagamento confirmado
- `payment_intent.failed`: Pagamento falhou

#### Custos (Brasil)

| Método         | Taxa            |
| -------------- | --------------- |
| Cartão crédito | 4.99% + R$0.39  |
| Pix            | 0.99% (max R$5) |
| Boleto         | 2.99% + R$2.00  |

**Documentação**: https://stripe.com/docs

---

## Armazenamento

### 8. Cloudflare R2 / AWS S3

**Finalidade**: Armazenamento de imagens, PDFs e documentos

**Status**: 🔜 Planejado (atualmente usando local storage)

#### Configuração

```bash
# .env.local
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="versatiglass"
R2_PUBLIC_URL="https://versatiglass.r2.dev"
```

#### Cloudflare R2 Setup

1. Acesse: https://dash.cloudflare.com/
2. Navegue para R2
3. Crie novo bucket: `versatiglass`
4. Gere R2 API Token
5. Configure CORS e Public Access

#### Vantagens do R2

- **Grátis**: Primeiros 10GB armazenamento + 1M leituras/mês
- **S3-compatible**: Drop-in replacement para S3
- **Sem egress fees**: Sem custos de transferência de dados
- **Latência baixa**: CDN global da Cloudflare

#### Custos

| Recurso         | Custo                            |
| --------------- | -------------------------------- |
| Armazenamento   | $0.015/GB/mês (após 10GB grátis) |
| Class A (write) | $4.50/1M requests                |
| Class B (read)  | Grátis (primeiras 1M)            |
| Egress          | $0.00 (sempre grátis)            |

**Comparação com S3**: R2 economiza ~90% em custos de egress

**Documentação**: https://developers.cloudflare.com/r2/

---

## Analytics e Tracking

### 9. Google Analytics 4

**Finalidade**: Analytics de tráfego e conversões

**Status**: 🔜 Planejado

#### Configuração

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

#### Setup

1. Acesse: https://analytics.google.com/
2. Crie propriedade GA4
3. Copie Measurement ID (G-XXXXXXXXX)
4. Adicione no `.env.local`

#### Implementação

- **Arquivo**: `src/lib/analytics.ts`
- **Eventos rastreados**:
  - Page views
  - Quote created
  - Quote submitted
  - Order placed
  - Chat interaction

**Documentação**: https://developers.google.com/analytics/devguides/collection/ga4

---

### 10. Meta Pixel / Google Tag Manager

**Finalidade**: Tracking para anúncios Facebook/Instagram

**Status**: 🔜 Planejado

#### Configuração

```bash
# .env.local
NEXT_PUBLIC_META_PIXEL_ID="1234567890"
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
```

---

## Cron Jobs e Automações

### 11. Vercel Cron / Upstash Qstash

**Finalidade**: Tarefas agendadas (lembretes, expiração de orçamentos)

#### Configuração

```bash
# .env.local
CRON_SECRET="generate-with-openssl-rand-base64-32"
```

#### Cron Jobs Implementados

| Job                   | Frequência   | Rota                      | Descrição                  |
| --------------------- | ------------ | ------------------------- | -------------------------- |
| Appointment Reminders | Diário (8AM) | `/api/cron/reminders`     | Envia lembretes 24h antes  |
| Quote Expiration      | Diário (0AM) | `/api/cron/expire-quotes` | Marca orçamentos expirados |

#### Vercel Cron Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

#### Protegendo Cron Endpoints

```typescript
// Validação de secret
if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
  return new Response('Unauthorized', { status: 401 })
}
```

**Documentação**: https://vercel.com/docs/cron-jobs

---

## Troubleshooting

### Problemas Comuns

#### 1. Erro de Autenticação Prisma

```
Error: P1001: Can't reach database server
```

**Solução**:

- Verifique `DATABASE_URL` no `.env.local`
- Confirme que o banco está acessível
- Verifique `?sslmode=require` na connection string
- Teste conexão: `pnpm prisma db pull`

#### 2. Groq API Timeout

```
Error: Request timeout after 30s
```

**Solução**:

- Modelo Llama está sobrecarregado
- Reduza `max_tokens` para 300-500
- Implemente retry logic
- Use fallback responses

#### 3. Twilio Sandbox Expired

```
Error: User not authorized for sandbox
```

**Solução**:

- Usuário precisa reenviar "join [code]" no WhatsApp
- Sandbox expira após 72h de inatividade
- Para produção, migre para WhatsApp Business API

#### 4. Email Não Enviado (Resend)

```
Error: Domain not verified
```

**Solução**:

- Verifique registros DNS (SPF, DKIM)
- Aguarde até 48h propagação DNS
- Use email sandbox: `delivered@resend.dev`

#### 5. Rate Limit Exceeded (OpenAI)

```
Error: Rate limit reached for requests
```

**Solução**:

- Reduza frequência de análise de imagens
- Implemente cache de respostas
- Upgrade tier (adicione mais créditos)
- Use exponential backoff retry

---

## Checklist de Deploy

Antes de fazer deploy para produção:

### Variáveis de Ambiente

- [ ] `DATABASE_URL` configurado (Railway)
- [ ] `NEXTAUTH_URL` = URL de produção
- [ ] `NEXTAUTH_SECRET` gerado com openssl
- [ ] `GROQ_API_KEY` configurado
- [ ] `OPENAI_API_KEY` configurado (com créditos)
- [ ] `RESEND_API_KEY` configurado
- [ ] `RESEND_FROM_EMAIL` com domínio verificado
- [ ] `TWILIO_ACCOUNT_SID` e `TWILIO_AUTH_TOKEN` configurados
- [ ] `CRON_SECRET` gerado

### Integrações

- [ ] Resend: Domínio verificado (SPF + DKIM)
- [ ] Twilio: WhatsApp Business API aprovado (produção)
- [ ] OpenAI: Créditos adicionados ($50+)
- [ ] Railway: Backup agendado habilitado
- [ ] Vercel: Cron jobs configurados

### Segurança

- [ ] Secrets não commitados no Git
- [ ] `.env.local` no `.gitignore`
- [ ] API endpoints com rate limiting
- [ ] Webhook signatures validadas
- [ ] Cron endpoints protegidos com secret

---

## Referências Rápidas

### Links de Consoles

- [Groq Console](https://console.groq.com/)
- [OpenAI Platform](https://platform.openai.com/)
- [Railway Dashboard](https://railway.app/)
- [Resend Dashboard](https://resend.com/dashboard)
- [Twilio Console](https://console.twilio.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)

### Comandos Úteis

```bash
# Verificar health das integrações
curl https://versatiglass.com.br/api/health

# Testar Groq API
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"

# Testar Resend
curl https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY"

# Prisma migrations
pnpm prisma migrate deploy
pnpm prisma generate

# Logs Railway
railway logs
```

---

## 12. RATE LIMITING

### 12.1 Visão Geral

**O que é:** Sistema de proteção contra abuso e spam que limita o número de requisições por IP/usuário em janelas de tempo.

**Implementação:** Dual-mode com Upstash Redis (produção) e fallback in-memory (desenvolvimento).

**Arquivo:** `src/lib/rate-limit.ts`

### 12.2 Arquitetura

```
┌─────────────────────────────────────────────────────┐
│              RATE LIMITING ARCHITECTURE              │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Request → Check Redis Config                     │
│                ↓                                    │
│             YES? → Upstash Redis (Persistent)      │
│                ↓                                    │
│              NO? → In-Memory Map (Fallback)        │
│                ↓                                    │
│           Return: {success, limit, remaining}      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 12.3 Modos de Operação

| Modo                  | Trigger                              | Storage          | Persistência | Produção      |
| --------------------- | ------------------------------------ | ---------------- | ------------ | ------------- |
| **Redis (Preferred)** | `UPSTASH_REDIS_REST_URL` configurado | Upstash Redis    | ✅ Sim       | ✅ Ideal      |
| **In-Memory**         | Redis não configurado                | Map() JavaScript | ❌ Não       | ⚠️ Temporário |

### 12.4 Presets Configurados

| Preset             | Max Requests | Window | Uso                         |
| ------------------ | ------------ | ------ | --------------------------- |
| **QUOTE_CREATION** | 5 (prod)     | 15 min | Criação de orçamentos       |
|                    | 50 (dev)     | 5 min  | Desenvolvimento             |
| **MUTATIONS**      | 20           | 5 min  | APIs de criação/atualização |
| **QUERIES**        | 60           | 1 min  | APIs de leitura             |
| **PASSWORD_RESET** | 3            | 30 min | Recuperação de senha        |

### 12.5 Limitações do In-Memory Mode

⚠️ **IMPORTANTE:** O modo in-memory possui limitações críticas em ambientes serverless/multi-instância:

1. **Não persiste entre restarts** - Contadores são resetados ao reiniciar servidor
2. **Não compartilha entre instâncias** - Cada instância Vercel/Railway tem seu próprio Map
3. **Memória limitada** - Pode crescer indefinidamente sem cleanup adequado
4. **Não ideal para produção** - Atacante pode bypassar limitando-se a diferentes instâncias

### 12.6 Solução Recomendada para Produção

**Opção 1: Upstash Redis (RECOMENDADO)**

```bash
# .env.production
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**Benefícios:**

- ✅ FREE tier generoso (10k requests/dia)
- ✅ Serverless-friendly (REST API)
- ✅ Compartilhado entre todas as instâncias
- ✅ Analytics built-in

**Opção 2: Redis próprio (Railway/Render)**

```bash
# Deploy Redis no Railway
railway add redis

# Configure DATABASE_REDIS_URL
REDIS_URL=redis://default:password@host:6379
```

### 12.7 Uso no Código

```typescript
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit'

// Em qualquer API route
export async function POST(request: Request) {
  const result = await rateLimit(request, RateLimitPresets.QUOTE_CREATION)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
        },
      }
    )
  }

  // Continue com a lógica normal
}
```

### 12.8 Monitoramento

O sistema de rate limiting inclui logging automático:

```typescript
// Logs quando requisição é bloqueada
logger.warn('[RATE_LIMIT] Request blocked', {
  ip: '192.168.1.1',
  limit: 5,
  remaining: 0,
  reset: '2024-12-22T23:30:00.000Z',
})
```

### 12.9 Próximos Passos

1. ⏳ **Configurar Upstash Redis para produção** (PRIORIDADE ALTA)
   - Criar conta em https://upstash.com
   - Configurar variáveis de ambiente
   - Validar que Redis está sendo usado (checar logs)

2. 🔜 **Adicionar rate limiting granular por usuário autenticado**
   - Usar `userId` em vez de IP para usuários logados
   - Limites diferentes para usuários autenticados

3. 🔜 **Dashboard de monitoramento**
   - Visualizar requisições bloqueadas
   - Identificar possíveis ataques
   - Ajustar limites baseado em métricas reais

---

## 13. Próximos Passos

1. ✅ Groq + OpenAI configurados e funcionando
2. ✅ Resend configurado para emails transacionais
3. ✅ Rate Limiting implementado (in-memory fallback)
4. ⏳ Migrar Twilio do Sandbox para WhatsApp Business API
5. ⏳ **Configurar Upstash Redis para rate limiting persistente** (NOVO)
6. 🔜 Implementar integração Stripe (v1.2.0)
7. 🔜 Configurar Cloudflare R2 para armazenamento
8. 🔜 Adicionar Google Analytics 4

---

**Mantido por**: Equipe Versati Glass
**Última Revisão**: 22 Dezembro 2024
