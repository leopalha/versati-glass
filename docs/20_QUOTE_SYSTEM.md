# Sistema de Cotação - Documentação Completa

**Versão:** 2.0
**Última Atualização:** 17 Dezembro 2024
**Status:** ✅ Produção (após FIX-QUOTE.1-7)

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Fluxo Completo (7 Steps)](#fluxo-completo)
4. [Diagrama de Estados](#diagrama-de-estados)
5. [Validações por Step](#validações-por-step)
6. [API Endpoints](#api-endpoints)
7. [Guia de Troubleshooting](#guia-de-troubleshooting)
8. [Changelog](#changelog)

---

## 🎯 Visão Geral

O Sistema de Cotação permite que clientes criem orçamentos personalizados para produtos de vidro através de um wizard de 7 etapas. O sistema suporta:

- ✅ Múltiplos itens por cotação (até 50)
- ✅ 12 categorias de produtos
- ✅ Edição de itens já adicionados
- ✅ Persistência local (30 minutos)
- ✅ Validações robustas (cliente + servidor)
- ✅ Rate limiting (5 cotações / 15 min)
- ✅ Agendamento opcional de visita técnica

### Estatísticas

- **Steps:** 7 (Category → Product → Details → Review → Customer → Summary → Schedule)
- **Arquivos:** 10 componentes + 1 store Zustand
- **Validações:** 40+ regras Zod
- **Testes E2E:** 52 cenários (21.5% success rate - bloqueado por DB)

---

## 🏗️ Arquitetura

### Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  src/components/quote/quote-wizard.tsx (Wrapper)        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    STEP COMPONENTS                       │
│  • StepCategory      (Step 1)                           │
│  • StepProduct       (Step 2)                           │
│  • StepDetails       (Step 3)                           │
│  • StepItemReview    (Step 4)                           │
│  • StepCustomer      (Step 5)                           │
│  • StepFinalSummary  (Step 6)                           │
│  • StepSchedule      (Step 7)                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                      │
│  src/store/quote-store.ts (Zustand)                     │
│  • currentItem: QuoteItem                               │
│  • items: QuoteItem[]                                   │
│  • customerData: CustomerData                           │
│  • scheduleData: ScheduleData                           │
│  • Persist: localStorage (30min timeout)                │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    API LAYER                             │
│  POST /api/quotes (Create quote + items)                │
│  • Rate Limiting: 5 req / 15 min                        │
│  • Validation: Zod schemas                              │
│  • Response: Quote number + ID                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    DATABASE                              │
│  Prisma Models: Quote + QuoteItem + User                │
└─────────────────────────────────────────────────────────┘
```

### Tecnologias

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **State:** Zustand + persist middleware
- **Validação:** Zod (client + server)
- **UI:** Tailwind + Radix UI
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM

---

## 📝 Fluxo Completo

### Step 1: Categoria (StepCategory)

**Objetivo:** Selecionar categoria do produto/serviço

**Interface:**

```typescript
interface Category {
  id: string // 'BOX', 'ESPELHOS', etc
  name: string // Nome amigável
  description: string // Descrição curta
  icon: string // Nome do ícone Lucide
  color: string // Classe Tailwind
}
```

**12 Categorias Disponíveis:**

1. BOX (Box para Banheiro)
2. ESPELHOS (Espelhos)
3. VIDROS (Vidros)
4. PORTAS (Portas de Vidro)
5. JANELAS (Janelas de Vidro)
6. GUARDA_CORPO (Guarda-Corpo)
7. CORTINAS_VIDRO (Cortinas de Vidro)
8. PERGOLADOS (Pergolados e Coberturas)
9. TAMPOS_PRATELEIRAS (Tampos e Prateleiras)
10. DIVISORIAS (Divisórias e Painéis)
11. FECHAMENTOS (Fechamentos em Vidro)
12. SERVICOS (Serviços)

**Comportamento:**

- Grid responsivo (1-4 colunas)
- Seleção única (radiogroup)
- ARIA compliant (role="radio", aria-checked)
- Estado persistido em `currentItem.category`

**Navegação:**

- ← Cancelar (se editando)
- → Continuar para Step 2

---

### Step 2: Produto (StepProduct)

**Objetivo:** Selecionar produto específico da categoria

**Data Source:**

- Busca produtos do banco via `/api/products?category=${category}`
- Cache de produtos no store

**Interface:**

```typescript
interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  images: string[]
  price: number
  featured: boolean
}
```

**Comportamento:**

- Grid de cards com imagem + nome + preço
- Loading state durante fetch
- Seleção múltipla suportada (checkbox)
- Produtos selecionados salvos em `selectedProducts`

**Validações:**

- ✅ Categoria deve estar setada
- ✅ Pelo menos 1 produto selecionado

**Navegação:**

- ← Voltar para Step 1
- → Continuar para Step 3 (sem chamar updateCurrentItem - FIX-QUOTE.2.1)

---

### Step 3: Detalhes (StepDetails)

**Objetivo:** Definir especificações técnicas do item

**Campos:**

```typescript
interface ItemDetails {
  // Dimensões
  width?: number // 0.01 - 100m
  height?: number // 0.01 - 100m
  quantity: number // 1 - 1000 (inteiro)

  // Especificações
  color?: string // max 50 chars
  finish?: string // max 50 chars
  thickness?: string // max 50 chars
  glassType?: string // max 50 chars
  glassColor?: string // max 50 chars
  model?: string // max 100 chars

  // Observações
  description?: string // max 500 chars
  images?: string[] // max 10 URLs
}
```

**Validações (Zod):**

```typescript
const detailsSchema = z.object({
  width: z.number().min(0.01, 'Largura mínima: 0.01m').max(100, 'Largura máxima: 100m').optional(),
  height: z.number().min(0.01, 'Altura mínima: 0.01m').max(100, 'Altura máxima: 100m').optional(),
  quantity: z.number().int('Deve ser inteiro').min(1).max(1000),
  color: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  images: z.array(z.string().url()).max(10).optional(),
})
```

**Comportamento:**

- Form validado on blur
- Contador de caracteres em tempo real
- Preview de imagens (se houver)
- **IMPORTANTE:** clearSelectedProducts() chamado apenas ao clicar "Adicionar Item" (FIX-QUOTE.2.2)

**Navegação:**

- ← Voltar para Step 2
- → "Adicionar Item" → Step 4 (Review)

---

### Step 4: Revisão de Itens (StepItemReview)

**Objetivo:** Visualizar carrinho e gerenciar itens

**Features:**

- Lista todos os itens adicionados
- Cálculo de estimativa por item
- Total estimado do orçamento
- Editar item (volta para Step 1 com dados restaurados - FIX-QUOTE.2.3)
- Remover item (com modal de confirmação - FQ.3.4)
- Adicionar mais itens

**Cálculo de Estimativa:**

```typescript
// ARCH-P1-4: Memoized calculation
const basePrices: Record<string, number> = {
  BOX: 1500,
  ESPELHOS: 300,
  VIDROS: 200,
  PORTAS: 2000,
  JANELAS: 1200,
  GUARDA_CORPO: 800,
  CORTINAS_VIDRO: 600,
  PERGOLADOS: 500,
  TAMPOS_PRATELEIRAS: 250,
  DIVISORIAS: 400,
  FECHAMENTOS: 450,
  SERVICOS: 500,
}

const calculateItemEstimate = (item: QuoteItem) => {
  if (!item.width || !item.height) return 0
  const area = item.width * item.height
  const basePrice = basePrices[item.category] || 500
  return (basePrice + area * 300) * item.quantity
}
```

**Modal de Confirmação (FQ.3.4):**

```typescript
// ARCH-P1-5: Accessible modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="remove-dialog-title"
  aria-describedby="remove-dialog-description"
>
  {/* Confirmação de remoção */}
</div>
```

**Navegação:**

- ← Voltar para Step 3
- → "Adicionar Mais Itens" → Step 1
- → "Editar Item" → Step 1 (com selectedProducts restaurado)
- → "Continuar" → Step 5

---

### Step 5: Dados do Cliente (StepCustomer)

**Objetivo:** Coletar informações de contato e endereço

**Campos:**

```typescript
interface CustomerData {
  // Contato
  name: string // 2-100 chars
  email: string // email válido
  phone: string // 10-20 chars

  // Endereço de instalação
  street: string // 1-200 chars
  number: string // 1-20 chars
  complement?: string // 0-100 chars
  neighborhood: string // 1-100 chars
  city: string // 1-100 chars
  state: string // exatamente 2 chars (SP, RJ, etc)
  zipCode: string // 8-10 chars
}
```

**Validações (Zod):**

```typescript
const customerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email('Email inválido').max(100),
  phone: z.string().min(10).max(20),
  street: z.string().min(1).max(200),
  number: z.string().min(1).max(20),
  complement: z.string().max(100).optional(),
  neighborhood: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  state: z.string().length(2, 'Estado deve ter 2 letras (ex: SP)'),
  zipCode: z.string().min(8).max(10),
})
```

**Features:**

- CEP lookup (integração futura)
- Validação de email em tempo real
- Máscara de telefone
- Autocomplete de endereço (browser)

**Navegação:**

- ← Voltar para Step 4
- → Continuar para Step 6

---

### Step 6: Resumo Final (StepFinalSummary)

**Objetivo:** Revisar tudo antes de enviar

**Seções:**

1. **Itens do Orçamento**
   - Lista completa com estimativas
   - Botão "Editar" (volta para Step 4)

2. **Dados de Contato**
   - Nome, email, telefone
   - Botão "Editar" (volta para Step 5)

3. **Endereço para Instalação**
   - Endereço completo formatado

4. **Total Estimado**
   - Soma de todos os itens
   - Disclaimer: "\* Valor estimado. Preço final após visita técnica."

**Submissão:**

```typescript
// POST /api/quotes
const handleSubmit = async () => {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName,
      customerEmail,
      customerPhone,
      serviceStreet,
      serviceNumber,
      serviceComplement,
      serviceNeighborhood,
      serviceCity,
      serviceState,
      serviceZipCode,
      items: items.map((item) => ({
        productId: item.productId,
        description: item.description,
        specifications: `${item.width}m x ${item.height}m`,
        width: item.width,
        height: item.height,
        quantity: item.quantity,
        color: item.color,
        finish: item.finish,
        thickness: item.thickness,
        glassType: item.glassType,
        glassColor: item.glassColor,
        model: item.model,
        unitPrice: estimate / quantity,
        totalPrice: estimate,
        customerImages: item.images,
      })),
      source: 'WEBSITE',
    }),
  })

  const result = await response.json()
  // result: { id, number, status, total, validUntil }
}
```

**Navegação:**

- ← Voltar para Step 5
- → "Enviar Orçamento" → Step 7

---

### Step 7: Agendamento (StepSchedule)

**Objetivo:** Agendar visita técnica (opcional)

**Features:**

- Calendário dos próximos 14 dias (exceto domingos)
- Slots de horário (08:00 - 17:00)
- Observações opcionais (max 500 chars)
- Opção de pular agendamento

**Validações (FQ.4.5):**

```typescript
// Data no futuro
const scheduledDate = new Date(selectedDate)
const today = new Date()
today.setHours(0, 0, 0, 0)
if (scheduledDate < today) throw new Error('Data inválida')

// Não é domingo
if (scheduledDate.getDay() === 0) throw new Error('Não atendemos aos domingos')

// Horário dentro do expediente
const [hours] = selectedTime.split(':').map(Number)
if (hours < 8 || hours >= 18) throw new Error('Fora do expediente')

// Observações < 500 chars
if (notes.length > 500) throw new Error('Observações muito longas')
```

**Tela de Sucesso:**

- Ícone de check verde
- Confirmação de orçamento + agendamento
- Mensagem: "Você receberá confirmação por WhatsApp"
- Botão "Voltar para Home"

**Limpeza (FQ.5.2):**

```typescript
const handleFinish = () => {
  reset() // Limpa localStorage
  router.push('/')
}
```

**Navegação:**

- ← Voltar para Step 6
- → "Pular Agendamento" → Home (limpa store)
- → "Confirmar" → Tela de Sucesso → Home (limpa store)

---

## 🔄 Diagrama de Estados

```mermaid
stateDiagram-v2
    [*] --> Step1_Category: Iniciar Orçamento

    Step1_Category --> Step2_Product: Categoria selecionada
    Step2_Product --> Step1_Category: ← Voltar

    Step2_Product --> Step3_Details: Produto(s) selecionado(s)
    Step3_Details --> Step2_Product: ← Voltar

    Step3_Details --> Step4_Review: Item adicionado
    Step4_Review --> Step3_Details: ← Voltar

    Step4_Review --> Step1_Category: + Adicionar Mais\n(startNewItem)
    Step4_Review --> Step1_Category: Editar Item\n(startEditItem)

    Step4_Review --> Step5_Customer: Continuar
    Step5_Customer --> Step4_Review: ← Voltar

    Step5_Customer --> Step6_Summary: Dados preenchidos
    Step6_Summary --> Step5_Customer: ← Voltar / Editar Dados
    Step6_Summary --> Step4_Review: Editar Itens

    Step6_Summary --> Step7_Schedule: Orçamento enviado
    Step7_Schedule --> Step6_Summary: ← Voltar

    Step7_Schedule --> Success: Agendamento confirmado
    Step7_Schedule --> Success: Pular agendamento

    Success --> [*]: reset() + router.push('/')

    note right of Step1_Category
        currentItem.category setado
    end note

    note right of Step2_Product
        selectedProducts[] populado
    end note

    note right of Step3_Details
        currentItem completo
        selectedProducts limpo após "Adicionar"
    end note

    note right of Step4_Review
        items[] com todos os itens
        Editar: restaura selectedProducts
    end note

    note right of Step6_Summary
        API POST /api/quotes
        Rate Limit: 5/15min
    end note

    note right of Success
        localStorage limpo
        Store resetado
    end note
```

### Fluxo de Edição de Item

```mermaid
sequenceDiagram
    participant User
    participant Step4 as Step4_Review
    participant Store as quote-store
    participant Step1 as Step1_Category

    User->>Step4: Clica "Editar Item #2"
    Step4->>Store: startEditItem(2)

    Note over Store: editingIndex = 2
    Note over Store: currentItem = items[2]
    Note over Store: selectedProducts = [items[2].productId]
    Note over Store: setStep(1)

    Store->>Step1: Navegação para Step 1

    Note over Step1: Categoria pré-selecionada
    Note over Step1: Mostra "Editando item"

    User->>Step1: Continua wizard

    alt Usuário confirma edição
        User->>Step4: Adiciona item editado
        Step4->>Store: items[2] = currentItem atualizado
        Store->>Step4: setStep(4)
    else Usuário cancela
        User->>Step1: Clica "Cancelar Edição"
        Step1->>Store: cancelEditItem()
        Note over Store: editingIndex = null
        Note over Store: currentItem = {}
        Note over Store: selectedProducts = []
        Store->>Step4: setStep(4)
    end
```

---

## ✅ Validações por Step

### Step 1: Category

| Campo    | Validação           | Mensagem de Erro          |
| -------- | ------------------- | ------------------------- |
| category | Obrigatório         | "Selecione uma categoria" |
| category | Deve estar na lista | "Categoria inválida"      |

### Step 2: Product

| Campo            | Validação    | Mensagem de Erro                  |
| ---------------- | ------------ | --------------------------------- |
| selectedProducts | Pelo menos 1 | "Selecione pelo menos um produto" |
| productId        | UUID válido  | "Produto inválido"                |

### Step 3: Details

| Campo       | Validação             | Mensagem de Erro                  |
| ----------- | --------------------- | --------------------------------- |
| width       | 0.01 - 100 (opcional) | "Largura: 0.01m - 100m"           |
| height      | 0.01 - 100 (opcional) | "Altura: 0.01m - 100m"            |
| quantity    | 1 - 1000 (inteiro)    | "Quantidade: 1-1000"              |
| color       | Max 50 chars          | "Cor muito longa"                 |
| description | Max 500 chars         | "Descrição muito longa (max 500)" |
| images      | Max 10 URLs válidas   | "Máximo 10 imagens"               |
| thickness   | Max 50 chars          | "Espessura muito longa"           |
| glassType   | Max 50 chars          | "Tipo de vidro muito longo"       |
| model       | Max 100 chars         | "Modelo muito longo"              |

### Step 4: Review

| Campo | Validação         | Mensagem de Erro                |
| ----- | ----------------- | ------------------------------- |
| items | Pelo menos 1 item | "Adicione pelo menos um item"   |
| items | Max 50 itens      | "Máximo 50 itens por orçamento" |

### Step 5: Customer

| Campo        | Validação          | Mensagem de Erro                    |
| ------------ | ------------------ | ----------------------------------- |
| name         | 2 - 100 chars      | "Nome: 2-100 caracteres"            |
| email        | Email válido       | "Email inválido"                    |
| email        | Max 100 chars      | "Email muito longo"                 |
| phone        | 10 - 20 chars      | "Telefone: 10-20 dígitos"           |
| street       | 1 - 200 chars      | "Rua obrigatória"                   |
| number       | 1 - 20 chars       | "Número obrigatório"                |
| complement   | Max 100 chars      | "Complemento muito longo"           |
| neighborhood | 1 - 100 chars      | "Bairro obrigatório"                |
| city         | 1 - 100 chars      | "Cidade obrigatória"                |
| state        | Exatamente 2 chars | "Estado deve ter 2 letras (ex: SP)" |
| zipCode      | 8 - 10 chars       | "CEP: 8-10 caracteres"              |

### Step 6: Summary

| Campo        | Validação | Mensagem de Erro               |
| ------------ | --------- | ------------------------------ |
| items        | Não vazio | "Nenhum item no carrinho"      |
| customerData | Completo  | "Dados do cliente incompletos" |

### Step 7: Schedule

| Campo | Validação     | Mensagem de Erro                             |
| ----- | ------------- | -------------------------------------------- |
| date  | No futuro     | "Não é possível agendar para datas passadas" |
| date  | Não é domingo | "Não atendemos aos domingos"                 |
| time  | HH:MM format  | "Formato de horário inválido (use HH:MM)"    |
| time  | 08:00 - 17:59 | "Horário de atendimento: 08:00-18:00"        |
| notes | Max 500 chars | "Observações muito longas (max 500)"         |

### API Server-Side Validations

Todas as validações acima são **duplicadas no servidor** via Zod schemas em `/api/quotes/route.ts`:

```typescript
// FQ.7.1: Comprehensive server-side validation
const quoteItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1).max(500, 'Descrição muito longa (máximo 500 caracteres)'),
  specifications: z.string().max(500).optional(),
  width: z
    .number()
    .min(0.01, 'Largura deve ser maior que 0')
    .max(100, 'Largura máxima: 100m')
    .optional(),
  height: z
    .number()
    .min(0.01, 'Altura deve ser maior que 0')
    .max(100, 'Altura máxima: 100m')
    .optional(),
  quantity: z
    .number()
    .int('Quantidade deve ser número inteiro')
    .min(1)
    .max(1000, 'Quantidade máxima: 1000'),
  // ... mais validações
})

const createQuoteSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  customerEmail: z.string().email('Email inválido').max(100),
  // ... mais validações
  items: z
    .array(quoteItemSchema)
    .min(1, 'Pelo menos um item é obrigatório')
    .max(50, 'Máximo 50 itens por orçamento'),
})
```

---

## 🔌 API Endpoints

### POST /api/quotes

**Descrição:** Cria novo orçamento com itens

**Rate Limiting:** 5 requisições / 15 minutos por IP

**Headers de Rate Limit:**

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1702837200
Retry-After: 900 (apenas em 429)
```

**Request Body:**

```json
{
  "customerName": "João Silva",
  "customerEmail": "joao@example.com",
  "customerPhone": "11987654321",
  "serviceStreet": "Rua das Flores",
  "serviceNumber": "123",
  "serviceComplement": "Apto 45",
  "serviceNeighborhood": "Centro",
  "serviceCity": "São Paulo",
  "serviceState": "SP",
  "serviceZipCode": "01234567",
  "items": [
    {
      "productId": "uuid-opcional",
      "description": "Box de vidro temperado",
      "specifications": "2.0m x 2.0m",
      "width": 2.0,
      "height": 2.0,
      "quantity": 1,
      "color": "Incolor",
      "finish": "Polido",
      "thickness": "8mm",
      "glassType": "Temperado",
      "glassColor": "Incolor",
      "model": "Modelo A",
      "unitPrice": 2000.0,
      "totalPrice": 2000.0,
      "customerImages": ["https://example.com/image1.jpg"]
    }
  ],
  "source": "WEBSITE",
  "customerNotes": "Observações opcionais"
}
```

**Response 201 (Success):**

```json
{
  "id": "cm123abc",
  "number": "ORC-2024-0123",
  "status": "DRAFT",
  "total": 2000.0,
  "validUntil": "2024-12-31T23:59:59.000Z"
}
```

**Response 400 (Validation Error):**

```json
{
  "error": "Dados invalidos",
  "message": "Verifique os dados enviados e tente novamente",
  "details": {
    "fieldErrors": {
      "customerEmail": ["Email inválido"],
      "items": ["Pelo menos um item é obrigatório"]
    }
  }
}
```

**Response 429 (Rate Limit Exceeded):**

```json
{
  "error": "Muitas solicitacoes",
  "message": "Voce excedeu o limite de 5 orcamentos em 15 minutos. Tente novamente em alguns minutos.",
  "retryAfter": 1702837200
}
```

**Response 500 (Server Error):**

```json
{
  "error": "Erro ao criar orcamento",
  "message": "Ocorreu um erro ao processar sua solicitacao. Tente novamente ou entre em contato."
}
```

### GET /api/quotes

**Descrição:** Lista orçamentos do usuário autenticado

**Auth:** Requerido (NextAuth session)

**Query Params:**

- `status` (opcional): `DRAFT`, `SENT`, `VIEWED`, `ACCEPTED`, `REJECTED`, `EXPIRED`, `CONVERTED`

**Response 200:**

```json
[
  {
    "id": "cm123abc",
    "number": "ORC-2024-0123",
    "status": "DRAFT",
    "total": 2000.0,
    "validUntil": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-12-17T10:00:00.000Z",
    "items": [
      {
        "description": "Box de vidro temperado",
        "quantity": 1
      }
    ]
  }
]
```

**Response 401 (Unauthorized):**

```json
{
  "error": "Nao autorizado"
}
```

---

## 🔧 Guia de Troubleshooting

### Problema 1: "currentItem não está setado no Step 3"

**Sintoma:** Navegação Step 2 → 3 falha ou campos vazios

**Causa:** `currentItem` não foi populado no Step 2

**Solução (FIX-QUOTE.2.1):**

- ✅ **Removida** chamada desnecessária `updateCurrentItem()` no Step 2
- ✅ Step 2 agora apenas seta `selectedProducts`
- ✅ Step 3 usa `selectedProducts` para popular `currentItem`

**Código Correto:**

```typescript
// Step 2: StepProduct (linha 88-103)
const handleContinue = () => {
  if (selectedProducts.length === 0) {
    toast({ variant: 'error', title: 'Selecione pelo menos um produto' })
    return
  }
  // NÃO chamar updateCurrentItem aqui!
  nextStep() // Apenas avança
}
```

### Problema 2: "selectedProducts não limpa, causando duplicação"

**Sintoma:** Ao adicionar segundo item, produto do primeiro aparece selecionado

**Causa:** `clearSelectedProducts()` chamado muito cedo (timing issue)

**Solução (FIX-QUOTE.2.2):**

- ✅ **Movido** `clearSelectedProducts()` de Step 2 para Step 3
- ✅ Chamado apenas ao clicar "Adicionar Item"

**Código Correto:**

```typescript
// Step 3: StepDetails
const handleAddItem = () => {
  // Adiciona item ao carrinho
  addItem({
    ...currentItem,
    id: crypto.randomUUID(),
  })

  // AGORA limpa selectedProducts
  clearSelectedProducts()

  // Vai para Review
  nextStep()
}
```

### Problema 3: "Editar item não restaura produto selecionado"

**Sintoma:** Ao editar item, categoria e detalhes carregam, mas produto não aparece selecionado

**Causa:** `selectedProducts` não é restaurado em `startEditItem()`

**Solução (FIX-QUOTE.2.3):**

- ✅ **Adicionado** lógica para restaurar `selectedProducts` em `startEditItem()`

**Código Correto:**

```typescript
// quote-store.ts (linha 209-225)
startEditItem: (index: number) => {
  const itemToEdit = get().items[index]

  set({
    editingIndex: index,
    currentItem: { ...itemToEdit },
    // FIX: Restaurar selectedProducts para manter checkbox marcado
    selectedProducts: itemToEdit.productId ? [itemToEdit.productId] : [],
  })

  // Volta para Step 1 (categoria)
  set({ step: 1 })
}
```

### Problema 4: "Cancelar edição não limpa estado"

**Sintoma:** Após cancelar edição, próximo item criado tem dados do item cancelado

**Causa:** `cancelEditItem()` não limpa `selectedProducts`

**Solução (FIX-QUOTE.2.4):**

- ✅ **Adicionado** limpeza de `selectedProducts` em `cancelEditItem()`

**Código Correto:**

```typescript
// quote-store.ts
cancelEditItem: () => {
  set({
    editingIndex: null,
    currentItem: {},
    selectedProducts: [], // LIMPAR!
  })
  set({ step: 4 }) // Volta para Review
}
```

### Problema 5: "Rate limit não funciona"

**Sintoma:** Possível criar mais de 5 orçamentos em 15 minutos

**Diagnóstico:**

1. Verificar se `rateLimit()` está sendo chamado no POST handler
2. Verificar se headers estão sendo retornados
3. Verificar console do servidor para logs de rate limit

**Testes:**

```bash
# Executar script de teste
node test-api-errors.mjs

# Deve passar no teste "Rate Limiting (6 requests)"
# Espera-se: primeiras 5 requests = 200/400, 6ª request = 429
```

### Problema 6: "Validação passa no cliente mas falha no servidor"

**Sintoma:** Formulário permite envio, mas API retorna 400

**Causa:** Schemas Zod diferentes entre cliente/servidor

**Solução:**

- ✅ Sempre duplicar validações em ambos os lados
- ✅ Usar mesmos limites (min/max)
- ✅ Testar com payloads no limite

**Checklist:**

- [ ] Validações de string length iguais
- [ ] Validações de number range iguais
- [ ] Validações de array length iguais
- [ ] Mensagens de erro consistentes

### Problema 7: "Timeout de 30 minutos não funciona"

**Sintoma:** Store persiste indefinidamente mesmo após 30 minutos

**Diagnóstico:**

```typescript
// Verificar se QuoteTimeoutChecker está montado
// src/app/(public)/layout.tsx deve ter:
<QuoteTimeoutChecker />
```

**Solução:**

- ✅ Verificar `lastActivity` sendo atualizado a cada ação
- ✅ Verificar `QuoteTimeoutChecker` rodando a cada 1 minuto
- ✅ Verificar console para logs de timeout

### Problema 8: "Estimativa de preço incorreta"

**Sintoma:** Preço calculado não bate com expectativa

**Debug:**

```typescript
// Verificar basePrices
console.log(basePrices[item.category]) // Deve retornar número

// Verificar cálculo
const area = item.width * item.height
const basePrice = basePrices[item.category] || 500
const estimate = (basePrice + area * 300) * item.quantity

console.log({ area, basePrice, estimate })
```

**Solução:**

- ✅ Verificar se categoria está correta
- ✅ Verificar se width/height são números (não strings)
- ✅ Verificar se quantity é inteiro

### Problema 9: "E2E tests falhando"

**Sintoma:** Testes playwright timeout ou falham

**Diagnóstico:**

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Deve ser: postgresql://user:pass@localhost:54320/db
```

**Soluções:**

1. **Database não rodando:**

```bash
# Iniciar PostgreSQL (porta 54320)
docker-compose up -d postgres
```

2. **Schema desatualizado:**

```bash
pnpm db:push
pnpm db:seed:test
```

3. **Produtos não seedados:**

```bash
# Verificar se 13 produtos foram criados
pnpm db:seed:test

# Deve mostrar: "✅ 13 products seeded"
```

4. **Seletor mudou:**

- Verificar IDs/classes no componente
- Atualizar seletores em `e2e/*.spec.ts`

### Problema 10: "Performance lenta em Step 4"

**Sintoma:** Lag ao adicionar/remover itens

**Causa:** Re-renders desnecessários

**Solução (ARCH-P1-4):**

- ✅ Usar `useMemo` para cálculos
- ✅ Usar `useCallback` para handlers
- ✅ Usar `React.memo` para subcomponentes

**Verificação:**

```typescript
// Instalar React DevTools
// Abrir Profiler
// Gravar interação "Adicionar Item"
// Verificar componentes renderizando

// Devem ter memo:
// - ActivityItem (activity-feed.tsx)
// - Cálculos de estimativa
```

---

## 📊 Changelog

### v2.0 (17 Dez 2024) - FIX-QUOTE.1-7

**Bugs Corrigidos:**

- ✅ FQ.2.1: Step 2→3 navigation sem updateCurrentItem
- ✅ FQ.2.2: clearSelectedProducts timing (movido para Step 3)
- ✅ FQ.2.3: Edit flow restaura selectedProducts
- ✅ FQ.2.4: cancelEditItem limpa selectedProducts

**Melhorias de UX (FQ.3):**

- ✅ FQ.3.1: Loading states em todos os steps
- ✅ FQ.3.2: Mensagens de erro mais claras
- ✅ FQ.3.3: Animações de transição CSS
- ✅ FQ.3.4: Modal de confirmação de remoção
- ✅ FQ.3.5: Preview de item em StepItemReview

**Validações (FQ.4):**

- ✅ FQ.4.1: Dimensões (0.01-100m)
- ✅ FQ.4.2: Email format
- ✅ FQ.4.3: Quantidade inteira (1-1000)
- ✅ FQ.4.4: String lengths (max chars)
- ✅ FQ.4.5: Data agendamento (futuro, não domingo, horário)

**Persistência (FQ.5):**

- ✅ FQ.5.1: localStorage com Zustand persist
- ✅ FQ.5.2: Limpeza após envio bem-sucedido
- ✅ FQ.5.3: Timeout de 30 minutos (QuoteTimeoutChecker)
- ✅ FQ.5.4: lastActivity tracking

**API Backend (FQ.7):**

- ✅ FQ.7.1: Validação Zod aprimorada (limites realistas)
- ✅ FQ.7.2: Rate limiting (5 req / 15 min)
- ✅ FQ.7.3: Mensagens de erro estruturadas
- ✅ FQ.7.4: Logs estruturados (logger)
- ✅ FQ.7.5: Script de teste de erros (test-api-errors.mjs)

**Arquitetura (ARCH-P1):**

- ✅ ARCH-P1-2: Error handling standardizado (7 arquivos)
- ✅ ARCH-P1-3: Type safety (7 'any' eliminados)
- ✅ ARCH-P1-4: Performance optimization (React.memo, useMemo)
- ✅ ARCH-P1-5: Accessibility (ARIA roles, labels)

**Arquivos Modificados:** 23 files
**Novos Arquivos:** 4 files (rate-limit.ts, test-api-errors.mjs, quote-timeout-checker.tsx, 20_QUOTE_SYSTEM.md)
**TypeScript:** 0 errors

### v1.0 (Nov 2024) - MVP Inicial

**Features:**

- ✅ 7-step wizard completo
- ✅ Zustand state management
- ✅ Persistência básica
- ✅ API POST /api/quotes
- ✅ 12 categorias de produtos
- ✅ Múltiplos itens por cotação

**Issues Conhecidos:**

- ⚠️ E2E tests 21.5% success (8 bugs)
- ⚠️ Sem rate limiting
- ⚠️ Validações básicas
- ⚠️ Performance não otimizada

---

## 📚 Referências

**Componentes:**

- [src/components/quote/quote-wizard.tsx](../src/components/quote/quote-wizard.tsx)
- [src/components/quote/steps/](../src/components/quote/steps/)

**Store:**

- [src/store/quote-store.ts](../src/store/quote-store.ts)

**API:**

- [src/app/api/quotes/route.ts](../src/app/api/quotes/route.ts)

**Validações:**

- [src/lib/validations/product.ts](../src/lib/validations/product.ts)

**Testes:**

- [e2e/02-quote-flow.spec.ts](../e2e/02-quote-flow.spec.ts)
- [test-api-errors.mjs](../test-api-errors.mjs)

**Outras Docs:**

- [docs/tasks.md](tasks.md) - Roadmap completo
- [docs/05_TECHNICAL_ARCHITECTURE.md](05_TECHNICAL_ARCHITECTURE.md) - Arquitetura geral
- [docs/07_DEV_BRIEF.md](07_DEV_BRIEF.md) - Briefing técnico

---

**Última Atualização:** 17 Dezembro 2024
**Próximas Melhorias:** Ver [FIX-QUOTE.8](tasks.md#fix-quote8) em tasks.md
