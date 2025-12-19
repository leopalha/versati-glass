# 🤖 SISTEMA DE AUTOMAÇÃO DE FORNECEDORES

**Versati Glass - Automação Inteligente de Recebimento de Cotações**

**Última Atualização:** 19 Dezembro 2024 - 03:20
**Status:** 📋 Planejamento Completo
**Prioridade:** 🟡 ALTA (após implementar SUP.1-4)

---

## 🎯 OBJETIVO

Automatizar **80-90% do processo de recebimento de cotações** de fornecedores via:
- ✉️ **Email** (parsing automático de valores)
- 📱 **WhatsApp** (extração inteligente via regex + IA)
- 🧠 **IA** (comparação e sugestão automática do melhor preço)
- 🔔 **Tempo Real** (notificações push quando cotação chega)

---

## 📊 ANÁLISE TÉCNICA - CAPACIDADES EXISTENTES

### ✅ JÁ IMPLEMENTADO

#### 1. **WhatsApp (Twilio)**
- **Webhook funcionando**: `/api/whatsapp/webhook/route.ts`
- **Parsing de dados**: Telefone, medidas, produtos
- **AI Processing**: Groq API com Llama 3.3 70B
- **Templates**: 5 templates prontos (quote_sent, order_approved, etc)

#### 2. **Email (Resend)**
- **Envio**: Totalmente funcional
- **Templates**: React Email com HTML profissional
- **Anexos**: Suporte a PDFs, ICS (calendário)
- **Recebimento**: ❌ NÃO IMPLEMENTADO (apenas outbound)

#### 3. **IA e Parsing**
- **Extração de Dados**: Telefone, email, CEP, medidas
- **NLP**: Detecção de produtos por palavras-chave
- **Pricing Engine**: Cálculo automático de estimativas
- **Regex Patterns**: Valores monetários, prazos, códigos

#### 4. **Banco de Dados**
- **Models**: Quote, QuoteItem, Conversation, Message
- **JSON Fields**: `quoteContext` para dados estruturados
- **Timestamps**: createdAt, updatedAt, respondedAt

### ❌ FALTA IMPLEMENTAR

1. **Webhook de Email Inbound** (Resend ou alternativa)
2. **Parser de Valores Monetários** em texto livre
3. **OCR de PDFs** (cotações em anexo)
4. **Algoritmo de Comparação** multi-critério
5. **Notificações Push** em tempo real (SSE)
6. **Auto-confirmação** para fornecedores

---

## 🏗️ ARQUITETURA DA AUTOMAÇÃO

### Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                   FORNECEDOR ENVIA COTAÇÃO                      │
└────────────┬────────────────────────────────────┬───────────────┘
             │                                    │
             ▼                                    ▼
      ┌──────────────┐                    ┌──────────────┐
      │    EMAIL     │                    │   WHATSAPP   │
      │   (Resend)   │                    │   (Twilio)   │
      └──────┬───────┘                    └───────┬──────┘
             │                                    │
             ▼                                    ▼
      ┌──────────────┐                    ┌──────────────┐
      │   WEBHOOK    │                    │   WEBHOOK    │
      │   /email-    │                    │  /whatsapp/  │
      │   webhook    │                    │   webhook    │
      └──────┬───────┘                    └───────┬──────┘
             │                                    │
             └────────────────┬───────────────────┘
                              ▼
                    ┌──────────────────┐
                    │   PARSER         │
                    │   INTELIGENTE    │
                    │                  │
                    │ • Regex valores  │
                    │ • NLP prazos     │
                    │ • Match ORC-#    │
                    └─────────┬────────┘
                              ▼
                    ┌──────────────────┐
                    │  IDENTIFICAÇÃO   │
                    │                  │
                    │ 1. Buscar        │
                    │    Supplier      │
                    │    (email/phone) │
                    │                  │
                    │ 2. Buscar        │
                    │    SupplierQuote │
                    │    (ORC number)  │
                    └─────────┬────────┘
                              ▼
                    ┌──────────────────┐
                    │  ATUALIZAÇÃO BD  │
                    │                  │
                    │ • subtotal       │
                    │ • shippingFee    │
                    │ • laborFee       │
                    │ • total          │
                    │ • deliveryDays   │
                    │ • status:        │
                    │   RESPONDED      │
                    │ • respondedAt    │
                    └─────────┬────────┘
                              ▼
             ┌────────────────┴────────────────┐
             ▼                                 ▼
      ┌──────────────┐              ┌──────────────────┐
      │ NOTIFICAÇÃO  │              │  ANÁLISE IA      │
      │ ADMIN        │              │                  │
      │              │              │ • Compara preços │
      │ • Push       │              │ • Calcula score  │
      │ • Toast      │              │ • Sugere melhor  │
      │ • Email      │              │   custo-benefício│
      └──────────────┘              └──────────────────┘
             │                                 │
             └────────────────┬────────────────┘
                              ▼
                    ┌──────────────────┐
                    │ RESPOSTA AUTO    │
                    │ FORNECEDOR       │
                    │                  │
                    │ "✅ Recebido!"   │
                    │ "Total: R$ XXX"  │
                    └──────────────────┘
```

---

## 📋 FASE 5: IMPLEMENTAÇÃO DETALHADA

### **SUP.5.1 - Webhook de Email (6h)** 🔴 CRÍTICO

#### Escolha de Serviço

**Opção 1: Resend Inbound** (RECOMENDADO)
- Mesma plataforma do outbound
- Webhook nativo
- Parsing de headers, body, attachments
- $0 adicional (incluído no plano)

**Opção 2: SendGrid Inbound Parse**
- Robusto, enterprise-grade
- Parser de anexos (PDFs)
- Requer configuração DNS adicional

**Opção 3: AWS SES + Lambda**
- Mais complexo
- Maior controle
- Custo adicional

#### Configuração Resend Inbound

1. **DNS Setup** (Registro.br):
```
Tipo: MX
Host: fornecedores.versatiglass.com.br
Valor: mx.resend.com
Prioridade: 10
```

2. **Webhook Endpoint**:
```typescript
// POST /api/suppliers/email-webhook

interface ResendInboundWebhook {
  from: string              // "fornecedor@vidracaria.com"
  to: string                // "orcamentos@versatiglass.com"
  subject: string           // "Re: Cotação ORC-2024-0123"
  html: string              // Corpo HTML
  text: string              // Corpo plain text
  attachments?: Array<{
    filename: string
    content: string         // Base64
    contentType: string
  }>
}
```

3. **Parser Inteligente**:

```typescript
// src/lib/parsers/email-quote-parser.ts

export interface ParsedEmailQuote {
  supplierEmail: string
  quoteNumber: string | null
  values: {
    subtotal?: number
    shipping?: number
    labor?: number
    material?: number
    total?: number
  }
  deliveryDays?: number
  notes?: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  rawBody: string
}

export function parseSupplierEmail(email: ResendInboundWebhook): ParsedEmailQuote {
  const body = email.text || stripHtml(email.html)

  // 1. EXTRAIR NÚMERO DO ORÇAMENTO
  const quoteNumber = extractQuoteNumber(email.subject, body)

  // 2. EXTRAIR VALORES MONETÁRIOS
  const monetaryValues = extractMonetaryValues(body)

  // 3. IDENTIFICAR QUAL VALOR É O QUÊ
  const categorized = categorizeValues(body, monetaryValues)

  // 4. EXTRAIR PRAZO
  const deliveryDays = extractDeliveryDays(body)

  // 5. CALCULAR CONFIANÇA
  const confidence = calculateConfidence({
    hasQuoteNumber: !!quoteNumber,
    hasTotal: !!categorized.total,
    valuesCategorized: Object.keys(categorized).length > 1
  })

  return {
    supplierEmail: email.from,
    quoteNumber,
    values: categorized,
    deliveryDays,
    notes: body.slice(0, 500), // Primeiros 500 chars
    confidence,
    rawBody: body
  }
}

// REGEX HELPERS

function extractQuoteNumber(subject: string, body: string): string | null {
  // Padrão: ORC-2024-0123 ou #ORC-2024-0123
  const pattern = /#?ORC-\d{4}-\d{4,}/i
  return (subject.match(pattern) || body.match(pattern))?.[0] || null
}

function extractMonetaryValues(text: string): number[] {
  // Detecta: "R$ 2.500,00", "R$2500", "2.500 reais", "2500.00"
  const patterns = [
    /R\$\s?([\d.]+,\d{2})/g,           // R$ 2.500,00
    /R\$\s?([\d.]+)/g,                 // R$ 2500
    /([\d.]+,\d{2})\s*reais?/gi,       // 2.500,00 reais
    /([\d.]+)\s*reais?/gi,             // 2500 reais
  ]

  const values: number[] = []

  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const numStr = match[1].replace(/\./g, '').replace(',', '.')
      const num = parseFloat(numStr)
      if (!isNaN(num) && num > 0 && num < 1000000) {
        values.push(num)
      }
    }
  })

  return [...new Set(values)].sort((a, b) => b - a) // Unique, desc
}

function categorizeValues(body: string, values: number[]): Record<string, number> {
  if (values.length === 0) return {}

  const result: Record<string, number> = {}

  // Procurar por palavras-chave próximas aos valores
  const keywords = {
    total: ['total', 'valor total', 'soma', 'final'],
    subtotal: ['subtotal', 'material', 'vidro', 'produto'],
    shipping: ['frete', 'entrega', 'transporte'],
    labor: ['mão de obra', 'mao de obra', 'instalação', 'instalacao', 'montagem'],
    material: ['material adicional', 'extras', 'acessórios', 'acessorios']
  }

  values.forEach(value => {
    // Encontrar contexto (50 chars antes e depois do valor)
    const valueStr = value.toFixed(2).replace('.', ',')
    const index = body.indexOf(valueStr)
    if (index === -1) return

    const context = body.slice(Math.max(0, index - 50), index + 50).toLowerCase()

    // Tentar categorizar
    for (const [category, terms] of Object.entries(keywords)) {
      if (terms.some(term => context.includes(term))) {
        result[category] = value
        return
      }
    }
  })

  // Fallback: se não categorizou nenhum, pegar o maior como total
  if (Object.keys(result).length === 0 && values.length > 0) {
    result.total = values[0]
  }

  return result
}

function extractDeliveryDays(body: string): number | undefined {
  // Padrões: "7 dias", "uma semana", "15 dias úteis", "1 semana"
  const patterns = [
    /(\d+)\s*dias?\s*(úteis|corridos)?/i,
    /(uma|1)\s*semanas?/i,
    /(duas|2)\s*semanas?/i,
  ]

  for (const pattern of patterns) {
    const match = body.match(pattern)
    if (match) {
      if (match[0].includes('semana')) {
        return match[1] === 'duas' || match[1] === '2' ? 14 : 7
      }
      return parseInt(match[1])
    }
  }

  return undefined
}

function calculateConfidence(criteria: {
  hasQuoteNumber: boolean
  hasTotal: boolean
  valuesCategorized: boolean
}): 'HIGH' | 'MEDIUM' | 'LOW' {
  const score =
    (criteria.hasQuoteNumber ? 40 : 0) +
    (criteria.hasTotal ? 40 : 0) +
    (criteria.valuesCategorized ? 20 : 0)

  if (score >= 80) return 'HIGH'
  if (score >= 50) return 'MEDIUM'
  return 'LOW'
}
```

4. **Endpoint de Webhook**:

```typescript
// src/app/api/suppliers/email-webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { parseSupplierEmail } from '@/lib/parsers/email-quote-parser'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { sendWhatsAppMessage } from '@/services/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ResendInboundWebhook

    logger.info('[EMAIL WEBHOOK] Received email from supplier', {
      from: body.from,
      subject: body.subject
    })

    // 1. PARSE EMAIL
    const parsed = parseSupplierEmail(body)

    if (!parsed.quoteNumber) {
      logger.warn('[EMAIL WEBHOOK] No quote number found, ignoring', {
        from: body.from,
        subject: body.subject
      })
      return NextResponse.json({ ok: true, message: 'No quote number' })
    }

    // 2. IDENTIFICAR SUPPLIER
    const supplier = await prisma.supplier.findFirst({
      where: { email: { equals: parsed.supplierEmail, mode: 'insensitive' } }
    })

    if (!supplier) {
      logger.warn('[EMAIL WEBHOOK] Unknown supplier', { email: parsed.supplierEmail })
      return NextResponse.json({ ok: true, message: 'Unknown supplier' })
    }

    // 3. BUSCAR QUOTE
    const quote = await prisma.quote.findFirst({
      where: { number: parsed.quoteNumber }
    })

    if (!quote) {
      logger.warn('[EMAIL WEBHOOK] Quote not found', { number: parsed.quoteNumber })
      return NextResponse.json({ ok: true, message: 'Quote not found' })
    }

    // 4. BUSCAR OU CRIAR SUPPLIER QUOTE
    let supplierQuote = await prisma.supplierQuote.findFirst({
      where: {
        quoteId: quote.id,
        supplierId: supplier.id
      }
    })

    if (!supplierQuote) {
      logger.warn('[EMAIL WEBHOOK] SupplierQuote not found (não foi enviado para esse fornecedor?)')
      return NextResponse.json({ ok: true, message: 'SupplierQuote not found' })
    }

    // 5. ATUALIZAR COM VALORES PARSEADOS
    const updateData: any = {
      status: 'RESPONDED',
      respondedAt: new Date(),
      supplierNotes: parsed.notes,
    }

    if (parsed.values.total) {
      updateData.total = parsed.values.total
      updateData.subtotal = parsed.values.subtotal || parsed.values.total
      updateData.shippingFee = parsed.values.shipping || 0
      updateData.laborFee = parsed.values.labor || 0
      updateData.materialFee = parsed.values.material || 0
    }

    if (parsed.deliveryDays) {
      updateData.deliveryDays = parsed.deliveryDays
    }

    const updated = await prisma.supplierQuote.update({
      where: { id: supplierQuote.id },
      data: updateData
    })

    logger.info('[EMAIL WEBHOOK] SupplierQuote updated', {
      id: updated.id,
      supplier: supplier.name,
      total: updated.total,
      confidence: parsed.confidence
    })

    // 6. NOTIFICAR ADMIN (via toast/push, implementar depois)
    // TODO: SSE notification

    // 7. SE CONFIANÇA BAIXA, ENVIAR EMAIL PEDINDO REVISÃO
    if (parsed.confidence === 'LOW') {
      // Enviar email para admin: "Cotação precisa de revisão manual"
      logger.warn('[EMAIL WEBHOOK] Low confidence, manual review needed', {
        supplierQuoteId: updated.id
      })
    }

    return NextResponse.json({
      ok: true,
      supplierQuoteId: updated.id,
      confidence: parsed.confidence,
      values: parsed.values
    })

  } catch (error) {
    logger.error('[EMAIL WEBHOOK] Error processing email', { error })
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    )
  }
}
```

---

### **SUP.5.2 - Recebimento via WhatsApp (3h)** 🟡 IMPORTANTE

**Modificar webhook existente**: `/api/whatsapp/webhook/route.ts`

```typescript
// Adicionar no final do handler POST, antes do return

// NOVO: Detectar se é resposta de fornecedor
const isSupplier = await checkIfSupplierMessage(from, body)

if (isSupplier) {
  await handleSupplierQuoteResponse(from, body)
}

// === FUNÇÕES AUXILIARES ===

async function checkIfSupplierMessage(phone: string, body: string): Promise<boolean> {
  // 1. Verificar se telefone está cadastrado como fornecedor
  const normalized = phone.replace(/\D/g, '').slice(-10) // últimos 10 dígitos

  const supplier = await prisma.supplier.findFirst({
    where: {
      phone: { contains: normalized }
    }
  })

  if (!supplier) return false

  // 2. Verificar se mensagem contém indicadores de cotação
  const hasPriceKeywords = /(?:total|preço|valor|cotação|orcamento)/i.test(body)
  const hasMoneyValue = /R\$?\s?[\d.,]+/i.test(body)
  const hasQuoteRef = /ORC-\d{4}-\d{4,}/i.test(body)

  return hasPriceKeywords && (hasMoneyValue || hasQuoteRef)
}

async function handleSupplierQuoteResponse(phone: string, body: string) {
  logger.info('[WHATSAPP] Supplier quote response detected', { phone })

  // 1. PARSE MENSAGEM
  const parsed = parseSupplierWhatsAppMessage(body)

  if (!parsed.quoteNumber) {
    logger.warn('[WHATSAPP] No quote number in message')
    return
  }

  // 2. IDENTIFICAR SUPPLIER
  const normalized = phone.replace(/\D/g, '').slice(-10)
  const supplier = await prisma.supplier.findFirst({
    where: { phone: { contains: normalized } }
  })

  if (!supplier) return

  // 3. BUSCAR QUOTE
  const quote = await prisma.quote.findFirst({
    where: { number: parsed.quoteNumber }
  })

  if (!quote) return

  // 4. BUSCAR SUPPLIER QUOTE
  const supplierQuote = await prisma.supplierQuote.findFirst({
    where: {
      quoteId: quote.id,
      supplierId: supplier.id
    }
  })

  if (!supplierQuote) return

  // 5. ATUALIZAR
  await prisma.supplierQuote.update({
    where: { id: supplierQuote.id },
    data: {
      status: 'RESPONDED',
      respondedAt: new Date(),
      total: parsed.total || undefined,
      subtotal: parsed.subtotal || parsed.total || undefined,
      shippingFee: parsed.shipping || 0,
      laborFee: parsed.labor || 0,
      deliveryDays: parsed.deliveryDays,
      supplierNotes: parsed.notes
    }
  })

  logger.info('[WHATSAPP] SupplierQuote updated from WhatsApp', {
    supplier: supplier.name,
    quote: quote.number,
    total: parsed.total
  })

  // 6. RESPONDER AUTOMATICAMENTE
  await sendWhatsAppMessage(
    phone,
    `✅ *Cotação Recebida!*\n\n` +
    `Orçamento: ${parsed.quoteNumber}\n` +
    `Total: R$ ${parsed.total?.toFixed(2) || 'N/A'}\n\n` +
    `Obrigado! Entraremos em contato em breve.\n\n` +
    `_Versati Glass_`
  )
}

function parseSupplierWhatsAppMessage(body: string): {
  quoteNumber: string | null
  total: number | null
  subtotal?: number
  shipping?: number
  labor?: number
  deliveryDays?: number
  notes: string
} {
  // Extrair quote number
  const quoteMatch = body.match(/ORC-\d{4}-\d{4,}/)
  const quoteNumber = quoteMatch ? quoteMatch[0] : null

  // Extrair valores
  const values = extractMonetaryValues(body)

  // Procurar por "TOTAL" explícito
  let total = null
  const totalMatch = body.match(/total:?\s*R?\$?\s?([\d.,]+)/i)
  if (totalMatch) {
    total = parseFloat(totalMatch[1].replace(/\./g, '').replace(',', '.'))
  } else if (values.length > 0) {
    total = values[0] // Pegar maior valor
  }

  // Extrair prazo
  const deadlineMatch = body.match(/(\d+)\s*dias?\s*(úteis)?/i)
  const deliveryDays = deadlineMatch ? parseInt(deadlineMatch[1]) : undefined

  return {
    quoteNumber,
    total,
    deliveryDays,
    notes: body.slice(0, 500)
  }
}
```

---

### **SUP.5.3 - IA para Comparação Automática (2h)** 🟢 NICE-TO-HAVE

Ver planejamento completo na seção anterior (componente AIQuoteAnalysis + endpoint de análise)

---

### **SUP.5.4 - Notificações em Tempo Real (3h)** 🟢 NICE-TO-HAVE

Ver planejamento completo na seção anterior (SSE endpoint + hook React)

---

## 📊 MÉTRICAS DE SUCESSO DA AUTOMAÇÃO

**KPIs:**
- ✅ Taxa de parsing bem-sucedido: >80%
- ✅ Tempo de processamento: <5s por cotação
- ✅ Redução de tempo manual: 95% (de 10min para 30s)
- ✅ Taxa de falsos positivos: <5%
- ✅ Notificação em tempo real: <10s após recebimento

**Monitoramento:**
- Dashboard de cotações processadas (auto vs manual)
- Log de parsing failures (para melhorar regex)
- Tempo médio de resposta de fornecedores

---

## 🧪 TESTES

### Cenário 1: Email Estruturado (90% de sucesso esperado)
```
From: contato@vidracariasilva.com
Subject: Re: Cotação ORC-2024-0123

Olá!

Segue nossa cotação:

Material: R$ 2.200,00
Frete: R$ 150,00
Instalação: R$ 500,00
TOTAL: R$ 2.850,00

Prazo: 7 dias úteis

Atenciosamente,
Silva
```

**Resultado Esperado:**
```json
{
  "quoteNumber": "ORC-2024-0123",
  "values": {
    "subtotal": 2200,
    "shipping": 150,
    "labor": 500,
    "total": 2850
  },
  "deliveryDays": 7,
  "confidence": "HIGH"
}
```

### Cenário 2: WhatsApp Informal (75% de sucesso esperado)
```
Oi! Fiz a cotação do ORC-2024-0123.
Fica em 2850 reais no total.
Entrego em 1 semana.
```

**Resultado Esperado:**
```json
{
  "quoteNumber": "ORC-2024-0123",
  "total": 2850,
  "deliveryDays": 7,
  "confidence": "MEDIUM"
}
```

### Cenário 3: Email Desestruturado (50% de sucesso)
```
Prezados,
Consegui fazer por dois mil e oitocentos.
Abraço!
```

**Resultado Esperado:**
```json
{
  "quoteNumber": null,
  "values": {},
  "confidence": "LOW"
}
```
→ Requer intervenção manual

---

## 🔄 INTEGRAÇÕES FUTURAS

Após implementar SUP.5.1-5.4, considerar:

1. **OCR de PDFs** (Tesseract.js ou Google Cloud Vision)
   - Fornecedor anexa PDF
   - Sistema extrai valores automaticamente
   - Precisão: ~70% (depende de formatação)

2. **Portal do Fornecedor**
   - Login para fornecedores
   - Formulário web de cotação
   - Upload de documentos
   - Histórico de cotações

3. **ML para Previsão**
   - Treinar modelo com histórico
   - Prever preço antes de solicitar
   - Alertar se cotação está muito acima/abaixo

4. **Integração ERP**
   - TOTVS, SAP, Bling
   - Sincronizar pedidos automaticamente

---

## 📝 DOCUMENTAÇÃO

Após implementação, atualizar:
- [ ] `docs/20_QUOTE_SYSTEM.md` - Seção de automação
- [ ] `docs/14_ADMIN_GUIDE.md` - Tutorial de uso
- [ ] `docs/17_INTEGRACOES.md` - Webhooks e APIs
- [ ] `README.md` - Mencionar automação inteligente

---

## 🎯 RESUMO EXECUTIVO

**Investimento:** 14 horas (SUP.5.1-5.4)
**ROI:** Redução de 95% no tempo de processamento manual
**Tecnologias:** Resend Inbound, Twilio WhatsApp, Groq AI, SSE
**Taxa de Automação:** 80-90% das cotações

**Próximos Passos:**
1. ✅ Implementar SUP.1-4 (sistema base)
2. ⏳ Implementar SUP.5.1 (email webhook) → **maior impacto**
3. ⏳ Implementar SUP.5.2 (WhatsApp parsing)
4. ⏳ Implementar SUP.5.3 (IA comparison) → **diferencial**
5. ⏳ Implementar SUP.5.4 (notificações real-time)

---

**Versati Glass - Transformando vidro em experiências digitais**
