# 📋 VERSATI GLASS - PRODUCT REQUIREMENTS DOCUMENT (PRD)

## VISÃO GERAL

**Produto:** Versati Glass - Plataforma Digital Integrada
**Versão:** 2.0.0
**Data:** 18 Dezembro 2024
**Tipo:** Web Application (Next.js) + AI Chat Assistant (Groq + OpenAI)
**Objetivo:** Ecossistema digital completo para vidraçaria premium que conecta clientes, atendimento automatizado por IA e gestão em tempo real
**Atualização:** Diagramas convertidos para Mermaid

### URLs Planejadas

- **Frontend:** https://www.versatiglass.com.br (Vercel)
- **Backend API:** https://api.versatiglass.com.br (Railway)
- **WhatsApp:** +55 (21) 98253-6229 (Twilio)

---

## 1. ARQUITETURA DO ECOSSISTEMA

```mermaid
flowchart TB
    subgraph ECOSYSTEM["🏗️ VERSATI GLASS ECOSYSTEM"]

        subgraph USERS["👥 Usuários"]
            VISITANTE["👤 VISITANTE<br/>(Landing)"]
            CLIENTE["👤 CLIENTE<br/>(Portal)"]
            ADMIN["👤 ADMIN<br/>(Gestão)"]
        end

        subgraph CORE["⚙️ VERSATI CORE API"]
            API_PRODUTOS["📦 Produtos & Serviços"]
            API_ORCAMENTOS["📝 Orçamentos"]
            API_ORDENS["📋 Ordens/Pedidos"]
            API_AGENDA["📅 Agendamentos"]
            API_PAYMENTS["💳 Pagamentos (Stripe)"]
            API_DOCS["📄 Documentos"]
            API_NOTIF["🔔 Notificações"]
        end

        subgraph INTEGRATIONS["🔌 Integrações"]
            TWILIO["📱 TWILIO<br/>(WhatsApp)"]
            CHAT_IA["🤖 CHAT IA<br/>AGENT"]
            AI_SERVICES["⚡ GROQ + GPT-4o<br/>Vision"]
        end

        subgraph DATABASE["💾 Database"]
            POSTGRES[(PostgreSQL<br/>Railway)]
        end

        VISITANTE --> CORE
        CLIENTE --> CORE
        ADMIN --> CORE

        CORE --> INTEGRATIONS
        TWILIO <--> CHAT_IA
        CHAT_IA <--> AI_SERVICES

        CORE --> POSTGRES
        CHAT_IA --> POSTGRES

    end

    style ECOSYSTEM fill:#1a1a2e,stroke:#d4af37,color:#fff
    style USERS fill:#16213e,stroke:#0f3460,color:#fff
    style CORE fill:#16213e,stroke:#22c55e,color:#fff
    style INTEGRATIONS fill:#16213e,stroke:#f97316,color:#fff
    style DATABASE fill:#16213e,stroke:#9333ea,color:#fff
```

---

## 2. MÓDULOS DO SISTEMA

### 2.1 MÓDULO LANDING PAGE (Público)

#### Funcionalidades

| Feature        | Descrição                          | Prioridade | Status |
| -------------- | ---------------------------------- | ---------- | ------ |
| Home Hero      | Seção impactante com CTA principal | P0         | ⬜     |
| Sobre          | História e diferenciais da empresa | P1         | ⬜     |
| Produtos       | Catálogo visual de produtos        | P0         | ⬜     |
| Serviços       | Lista de serviços oferecidos       | P0         | ⬜     |
| Portfólio      | Galeria de projetos realizados     | P1         | ⬜     |
| Depoimentos    | Avaliações de clientes             | P2         | ⬜     |
| Orçamento      | Formulário de solicitação          | P0         | ⬜     |
| Contato        | Informações e formulário           | P0         | ⬜     |
| WhatsApp Float | Botão flutuante WhatsApp           | P0         | ⬜     |
| SEO            | Meta tags, sitemap, schema         | P1         | ⬜     |

#### Páginas

| Página            | Rota                           | Descrição           |
| ----------------- | ------------------------------ | ------------------- |
| Home              | `/`                            | Landing principal   |
| Produtos          | `/produtos`                    | Catálogo geral      |
| Produto Categoria | `/produtos/[categoria]`        | Box, Espelhos, etc. |
| Produto Detalhe   | `/produtos/[categoria]/[slug]` | Detalhe do produto  |
| Serviços          | `/servicos`                    | Lista de serviços   |
| Portfólio         | `/portfolio`                   | Galeria de projetos |
| Projeto Detalhe   | `/portfolio/[slug]`            | Detalhe do projeto  |
| Orçamento         | `/orcamento`                   | Formulário/Checkout |
| Contato           | `/contato`                     | Página de contato   |
| Sobre             | `/sobre`                       | Sobre a empresa     |

---

### 2.2 MÓDULO CHECKOUT/ORÇAMENTO (Público)

#### Funcionalidades

| Feature             | Descrição                             | Prioridade | Status |
| ------------------- | ------------------------------------- | ---------- | ------ |
| Seleção de Produtos | Escolher produtos do catálogo         | P0         | ⬜     |
| Especificações      | Formulário de medidas e detalhes      | P0         | ⬜     |
| Upload de Imagens   | Enviar fotos do local                 | P1         | ⬜     |
| Cálculo Automático  | Estimativa de valor (produtos padrão) | P0         | ⬜     |
| Agendamento         | Marcar visita técnica (sob medida)    | P0         | ⬜     |
| Pagamento Online    | Stripe (PIX, Cartão)                  | P0         | ⬜     |
| Criação de Conta    | Auto-cadastro após compra             | P0         | ⬜     |
| Confirmação         | Email + WhatsApp de confirmação       | P0         | ⬜     |

#### Fluxo de Checkout

```mermaid
flowchart TD
    subgraph CHECKOUT["💳 FLUXO DE CHECKOUT"]
        STEP1["1️⃣ SELEÇÃO<br/>• Categoria (Box, Espelho)<br/>• Modelo<br/>• Cor/Acabamento"]

        STEP1 --> STEP2

        STEP2["2️⃣ ESPECIFICAÇÕES<br/>• Medidas (L x A)<br/>• CEP<br/>• Upload fotos<br/>• Observações"]

        STEP2 --> STEP3

        STEP3{3️⃣ TIPO}

        STEP3 --> |"Produto Padrão"| PADRAO["✅ PRODUTO PADRÃO<br/>Valor fechado<br/>Checkout direto"]
        STEP3 --> |"Sob Medida"| MEDIDA["📐 SOB MEDIDA<br/>Faixa de valor<br/>Visita técnica"]

        PADRAO --> STEP4A["4A. PAGAMENTO<br/>• PIX (5% desc.)<br/>• Cartão até 10x<br/>• Boleto à vista"]

        MEDIDA --> STEP4B["4B. AGENDAMENTO<br/>• Escolher data<br/>• Escolher horário<br/>• Confirmar visita"]

        STEP4A --> STEP5
        STEP4B --> STEP5

        STEP5["5️⃣ CONFIRMAÇÃO<br/>• Criar conta<br/>• Email confirmação<br/>• WhatsApp confirmação<br/>• Redirecionar Portal"]
    end

    style CHECKOUT fill:#1a1a2e,stroke:#d4af37,color:#fff
    style STEP3 fill:#16213e,stroke:#f97316,color:#fff
    style STEP5 fill:#0f3460,stroke:#22c55e,color:#22c55e
```

---

### 2.3 MÓDULO PORTAL DO CLIENTE (Autenticado)

#### Funcionalidades

| Feature          | Descrição                      | Prioridade | Status |
| ---------------- | ------------------------------ | ---------- | ------ |
| Dashboard        | Visão geral do cliente         | P0         | ⬜     |
| Minhas Ordens    | Lista de pedidos/serviços      | P0         | ⬜     |
| Detalhe da Ordem | Timeline de status             | P0         | ⬜     |
| Orçamentos       | Orçamentos pendentes/aprovados | P0         | ⬜     |
| Documentos       | Contratos, garantias, NFs      | P1         | ⬜     |
| Agendamentos     | Próximas visitas/instalações   | P0         | ⬜     |
| Pagamentos       | Histórico e pendências         | P1         | ⬜     |
| Perfil           | Dados pessoais e endereços     | P1         | ⬜     |
| Chat/Suporte     | Comunicação com a empresa      | P2         | ⬜     |
| Avaliações       | Avaliar serviços concluídos    | P2         | ⬜     |

#### Páginas do Portal

| Página            | Rota                      | Descrição            |
| ----------------- | ------------------------- | -------------------- |
| Dashboard         | `/portal`                 | Visão geral          |
| Ordens            | `/portal/ordens`          | Lista de ordens      |
| Ordem Detalhe     | `/portal/ordens/[id]`     | Detalhe com timeline |
| Orçamentos        | `/portal/orcamentos`      | Lista de orçamentos  |
| Orçamento Detalhe | `/portal/orcamentos/[id]` | Detalhe do orçamento |
| Agenda            | `/portal/agenda`          | Próximas visitas     |
| Documentos        | `/portal/documentos`      | Arquivos             |
| Pagamentos        | `/portal/pagamentos`      | Histórico financeiro |
| Perfil            | `/portal/perfil`          | Dados do cliente     |

#### Status de Ordem (Timeline)

```mermaid
stateDiagram-v2
    [*] --> ORCAMENTO_ENVIADO: Quote aceito

    ORCAMENTO_ENVIADO: 📝 ORÇAMENTO_ENVIADO
    ORCAMENTO_ENVIADO: Orçamento criado

    AGUARDANDO_PAGAMENTO: 💳 AGUARDANDO_PAGAMENTO
    AGUARDANDO_PAGAMENTO: Sinal/Pagamento

    APROVADO: ✅ APROVADO
    APROVADO: Ordem aprovada

    EM_PRODUCAO: 🔧 EM_PRODUCAO
    EM_PRODUCAO: Fabricação

    PRONTO_ENTREGA: 📦 PRONTO_ENTREGA
    PRONTO_ENTREGA: Aguardando instalação

    INSTALACAO_AGENDADA: 📅 INSTALACAO_AGENDADA
    INSTALACAO_AGENDADA: Data marcada

    INSTALANDO: 🛠️ INSTALANDO
    INSTALANDO: Em andamento

    CONCLUIDO: ✅ CONCLUIDO
    CONCLUIDO: Serviço finalizado

    CANCELADO: ❌ CANCELADO
    AGUARDANDO_CLIENTE: ⏳ AGUARDANDO_CLIENTE
    EM_REVISAO: 🔍 EM_REVISAO

    ORCAMENTO_ENVIADO --> AGUARDANDO_PAGAMENTO: Cliente aceita
    AGUARDANDO_PAGAMENTO --> APROVADO: Pagamento OK
    APROVADO --> EM_PRODUCAO: Inicia produção
    EM_PRODUCAO --> PRONTO_ENTREGA: Produção concluída
    PRONTO_ENTREGA --> INSTALACAO_AGENDADA: Agenda instalação
    INSTALACAO_AGENDADA --> INSTALANDO: Técnico inicia
    INSTALANDO --> CONCLUIDO: Finaliza

    CONCLUIDO --> [*]: SUCCESS

    note right of CANCELADO: Estados alternativos<br/>(qualquer momento)
    note right of AGUARDANDO_CLIENTE: Pendência do cliente
    note right of EM_REVISAO: Ajustes necessários
```

---

### 2.4 MÓDULO CHAT IA ASSISTIDO (Web + WhatsApp) 🆕

**Status**: ✅ Implementado (v1.1.0)
**Stack**: Groq (Llama 3.3-70b) + OpenAI (GPT-4o Vision)
**Canais**: Chat Web (modal) + WhatsApp Business (planejado)

#### Funcionalidades Implementadas

| Feature                          | Descrição                                                 | Prioridade | Status |
| -------------------------------- | --------------------------------------------------------- | ---------- | ------ |
| **Chat Web Modal**               | Interface conversacional integrada na página de orçamento | P0         | ✅     |
| **Atendimento Contextual**       | Saudação e identificação de necessidade com contexto      | P0         | ✅     |
| **Análise de Linguagem Natural** | Entende "preciso de um box" via Groq Llama 3.3            | P0         | ✅     |
| **Upload de Imagens**            | Cliente envia foto do local para análise                  | P0         | ✅     |
| **GPT-4o Vision**                | Analisa foto, identifica produto e estima medidas         | P0         | ✅     |
| **Extração de Dados**            | Captura nome, telefone, medidas da conversa               | P0         | ✅     |
| **Histórico de Conversa**        | Mantém contexto da sessão (AiConversation)                | P0         | ✅     |
| **Geração de Orçamento**         | Converte conversa em Quote estruturado                    | P0         | ⏳     |
| **Personalidade "Ana"**          | Assistente virtual amigável e profissional                | P0         | ✅     |
| **Fallback Inteligente**         | Respostas pré-programadas se IA falhar                    | P1         | ✅     |
| **Escalada Humana**              | Detecta quando transferir para atendente                  | P1         | ✅     |
| **WhatsApp Integration**         | Bot 24/7 via Twilio (webhook implementado)                | P1         | ⏳     |
| **Agendamento**                  | Marcar visita técnica via chat                            | P1         | 🔜     |
| **Status de Ordem**              | Consultar andamento pelo chat                             | P2         | 🔜     |

#### Fluxo de Conversação

```mermaid
sequenceDiagram
    autonumber
    participant C as 👤 Cliente
    participant IA as 🤖 Ana (IA)
    participant V as 👁️ Vision API
    participant DB as 💾 Database

    C->>IA: "Oi, quero fazer um orçamento"

    IA->>C: Olá! 👋 Sou o assistente Versati Glass<br/>O que você precisa?<br/>1️⃣ Box 2️⃣ Espelho 3️⃣ Vidro...

    C->>IA: "1" (Box)

    IA->>C: Qual modelo?<br/>• Elegance (correr)<br/>• Flex (compacto)<br/>• Comum (abrir)

    C->>IA: "Elegance"

    IA->>C: Excelente! Sabe as medidas?<br/>Pode mandar foto também!

    C->>IA: 📷 [Envia foto do banheiro]

    IA->>V: Analisar imagem

    V-->>IA: ~1.20m x 1.90m detectado

    IA->>C: Identifiquei ~1.20m x 1.90m<br/>Qual cor da ferragem?<br/>• Preto • Branco • Inox • Bronze

    C->>IA: "Preto"

    IA->>C: Qual seu CEP?

    C->>IA: "22745-005"

    IA->>C: ✅ Freguesia - atendemos!<br/>━━━━━━━━━━━━━━━<br/>BOX ELEGANCE - Preto<br/>~1.20m x 1.90m<br/>💰 R$ 1.800 - R$ 2.200<br/>━━━━━━━━━━━━━━━<br/>Agendar visita técnica?

    C->>IA: "Sim"

    IA->>C: 📅 Horários disponíveis:<br/>• Ter 17/12 - 09:00, 14:00<br/>• Qua 18/12 - 09:00, 16:00

    C->>IA: "Terça 14h"

    IA->>C: Me confirma nome e endereço?

    C->>IA: "João Silva, Rua X, 100"

    IA->>DB: Criar Quote + Appointment + User

    DB-->>IA: ✅ Criado

    IA->>C: ✅ Agendado, João!<br/>📅 17/12/2024 às 14:00<br/>📍 Rua X, 100<br/>🔗 Portal: versatiglass.com.br/portal<br/>📧 Senha enviada por email
```

---

### 2.5 MÓDULO ADMIN (Gestão Interna)

#### Funcionalidades

| Feature       | Descrição                         | Prioridade | Status |
| ------------- | --------------------------------- | ---------- | ------ |
| Dashboard     | Métricas e KPIs                   | P0         | ⬜     |
| Produtos      | CRUD de produtos                  | P0         | ⬜     |
| Serviços      | CRUD de serviços                  | P0         | ⬜     |
| Orçamentos    | Gestão de orçamentos              | P0         | ⬜     |
| Ordens        | Gestão de pedidos/serviços        | P0         | ⬜     |
| Clientes      | CRM básico                        | P1         | ⬜     |
| Agenda        | Calendário de visitas/instalações | P0         | ⬜     |
| Financeiro    | Pagamentos e relatórios           | P1         | ⬜     |
| Portfólio     | Gestão de projetos/fotos          | P1         | ⬜     |
| Configurações | Parâmetros do sistema             | P2         | ⬜     |
| Usuários      | Gestão de funcionários            | P2         | ⬜     |

#### Páginas Admin

| Página          | Rota                   | Descrição           |
| --------------- | ---------------------- | ------------------- |
| Dashboard       | `/admin`               | Visão geral         |
| Produtos        | `/admin/produtos`      | Lista de produtos   |
| Produto Editar  | `/admin/produtos/[id]` | Edição de produto   |
| Serviços        | `/admin/servicos`      | Lista de serviços   |
| Orçamentos      | `/admin/orcamentos`    | Lista de orçamentos |
| Ordens          | `/admin/ordens`        | Lista de ordens     |
| Ordem Detalhe   | `/admin/ordens/[id]`   | Detalhe da ordem    |
| Clientes        | `/admin/clientes`      | Lista de clientes   |
| Cliente Detalhe | `/admin/clientes/[id]` | Perfil do cliente   |
| Agenda          | `/admin/agenda`        | Calendário          |
| Financeiro      | `/admin/financeiro`    | Relatórios          |
| Portfólio       | `/admin/portfolio`     | Gestão de projetos  |
| Config          | `/admin/config`        | Configurações       |

---

## 3. MODELOS DE DADOS

### 3.0 Diagrama de Entidades (ER Simplificado)

```mermaid
erDiagram
    USER ||--o{ ORDER : "has"
    USER ||--o{ QUOTE : "requests"
    USER ||--o{ APPOINTMENT : "schedules"
    USER ||--o{ DOCUMENT : "owns"
    USER ||--o{ AI_CONVERSATION : "participates"

    QUOTE ||--o{ QUOTE_ITEM : "contains"
    QUOTE ||--o| ORDER : "converts_to"
    QUOTE ||--o| APPOINTMENT : "schedules"

    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER ||--o{ ORDER_TIMELINE : "tracks"
    ORDER ||--o{ APPOINTMENT : "requires"
    ORDER ||--o{ DOCUMENT : "generates"
    ORDER ||--o{ PAYMENT : "receives"

    PRODUCT ||--o{ QUOTE_ITEM : "referenced_in"
    PRODUCT ||--o{ ORDER_ITEM : "referenced_in"

    AI_CONVERSATION ||--o{ AI_MESSAGE : "contains"
    AI_CONVERSATION ||--o| QUOTE : "generates"
    AI_CONVERSATION ||--o| APPOINTMENT : "schedules"

    USER {
        string id PK
        string email UK
        string name
        string phone
        string role
        datetime createdAt
    }

    PRODUCT {
        string id PK
        string slug UK
        string name
        string category
        decimal basePrice
        boolean isActive
    }

    QUOTE {
        string id PK
        string number UK
        string userId FK
        string status
        decimal total
        datetime validUntil
    }

    ORDER {
        string id PK
        string number UK
        string userId FK
        string quoteId FK
        string status
        string paymentStatus
        decimal total
    }

    APPOINTMENT {
        string id PK
        string userId FK
        string orderId FK
        string type
        string status
        date scheduledDate
        time scheduledTime
    }

    AI_CONVERSATION {
        string id PK
        string userId FK
        string status
        json extractedData
        string quoteId FK
    }
```

### 3.1 User (Usuário)

```typescript
User = {
  id: string (UUID),
  email: string (unique),
  password: string (hashed),
  name: string,
  phone: string,
  cpfCnpj: string?,

  // Endereço principal
  address: {
    street: string,
    number: string,
    complement: string?,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
  },

  // Auth
  role: enum ('customer', 'admin', 'staff'),
  emailVerified: boolean,
  phoneVerified: boolean,
  authProvider: enum ('email', 'google'),
  googleId: string?,

  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
  lastLoginAt: datetime?,

  // Relações
  orders: Order[],
  quotes: Quote[],
  appointments: Appointment[],
  documents: Document[],
}
```

### 3.2 Product (Produto)

```typescript
Product = {
  id: string (UUID),

  // Básico
  name: string,
  slug: string (unique),
  description: string,
  shortDescription: string,

  // Categorização
  category: enum ('box', 'espelhos', 'vidros', 'portas_janelas', 'fechamentos', 'outros'),
  subcategory: string?,

  // Mídia
  images: string[] (URLs),
  thumbnail: string (URL),

  // Preço
  priceType: enum ('fixed', 'per_m2', 'quote_only'),
  basePrice: decimal?,
  pricePerM2: decimal?,
  priceRange: {
    min: decimal,
    max: decimal,
  }?,

  // Opções
  colors: string[] ('preto', 'branco', 'inox', 'bronze'),
  finishes: string[]?,
  thicknesses: string[]?,

  // Status
  isActive: boolean,
  isFeatured: boolean,

  // SEO
  metaTitle: string?,
  metaDescription: string?,

  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
}
```

### 3.3 Quote (Orçamento)

```typescript
Quote = {
  id: string (UUID),
  number: string (unique, ex: "ORC-2024-001"),

  // Cliente
  userId: string (FK User),
  customerName: string,
  customerEmail: string,
  customerPhone: string,

  // Endereço do serviço
  serviceAddress: {
    street: string,
    number: string,
    complement: string?,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
  },

  // Itens
  items: QuoteItem[],

  // Valores
  subtotal: decimal,
  discount: decimal,
  total: decimal,

  // Status
  status: enum (
    'draft',           // Rascunho
    'sent',            // Enviado ao cliente
    'viewed',          // Cliente visualizou
    'accepted',        // Cliente aceitou
    'rejected',        // Cliente recusou
    'expired',         // Expirou
    'converted',       // Virou ordem
  ),

  // Validade
  validUntil: datetime,

  // Notas
  internalNotes: string?,
  customerNotes: string?,

  // Origem
  source: enum ('website', 'whatsapp', 'phone', 'walkin'),

  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
  sentAt: datetime?,
  viewedAt: datetime?,
  acceptedAt: datetime?,
}
```

#### Quote Status Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Criado

    DRAFT: 📝 DRAFT
    DRAFT: Rascunho interno

    SENT: 📤 SENT
    SENT: Enviado ao cliente

    VIEWED: 👁️ VIEWED
    VIEWED: Cliente visualizou

    ACCEPTED: ✅ ACCEPTED
    ACCEPTED: Cliente aceitou

    REJECTED: ❌ REJECTED
    REJECTED: Cliente recusou

    EXPIRED: ⏰ EXPIRED
    EXPIRED: Prazo expirou

    CONVERTED: 🔄 CONVERTED
    CONVERTED: Virou Order

    DRAFT --> SENT: Admin envia
    SENT --> VIEWED: Cliente abre
    VIEWED --> ACCEPTED: Cliente aceita
    VIEWED --> REJECTED: Cliente recusa
    SENT --> EXPIRED: 7 dias sem resposta
    VIEWED --> EXPIRED: 7 dias sem resposta
    ACCEPTED --> CONVERTED: Cria Order

    CONVERTED --> [*]
    REJECTED --> [*]
    EXPIRED --> [*]

    note right of ACCEPTED: Trigger: Cria Order<br/>Notifica Admin
    note right of EXPIRED: Cron job diário<br/>Notifica cliente
```

```typescript

QuoteItem = {
  id: string (UUID),
  quoteId: string (FK Quote),
  productId: string? (FK Product),

  // Descrição
  description: string,
  specifications: string?,

  // Medidas
  width: decimal?,
  height: decimal?,
  quantity: number,

  // Opções
  color: string?,
  finish: string?,
  thickness: string?,

  // Valores
  unitPrice: decimal,
  totalPrice: decimal,

  // Imagens do cliente
  customerImages: string[] (URLs),
}
```

### 3.4 Order (Ordem de Serviço)

```typescript
Order = {
  id: string (UUID),
  number: string (unique, ex: "OS-2024-001"),

  // Origem
  quoteId: string? (FK Quote),

  // Cliente
  userId: string (FK User),

  // Endereço
  serviceAddress: Address,

  // Itens
  items: OrderItem[],

  // Valores
  subtotal: decimal,
  discount: decimal,
  installationFee: decimal,
  total: decimal,

  // Pagamento
  paymentStatus: enum ('pending', 'partial', 'paid', 'refunded'),
  paymentMethod: enum ('pix', 'credit_card', 'debit_card', 'boleto', 'cash'),
  paidAmount: decimal,

  // Status
  status: enum (
    'orcamento_enviado',
    'aguardando_pagamento',
    'aprovado',
    'em_producao',
    'pronto_entrega',
    'instalacao_agendada',
    'instalando',
    'concluido',
    'cancelado',
    'aguardando_cliente',
    'em_revisao',
  ),

  // Timeline
  timeline: OrderTimelineEntry[],

  // Datas
  estimatedDelivery: datetime?,
  installedAt: datetime?,
  completedAt: datetime?,

  // Garantia
  warrantyUntil: datetime?,

  // Notas
  internalNotes: string?,

  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
}

OrderItem = {
  id: string (UUID),
  orderId: string (FK Order),
  productId: string? (FK Product),

  description: string,
  specifications: string?,

  width: decimal?,
  height: decimal?,
  quantity: number,

  color: string?,
  finish: string?,
  thickness: string?,

  unitPrice: decimal,
  totalPrice: decimal,

  status: enum ('pending', 'in_production', 'ready', 'installed'),
}

OrderTimelineEntry = {
  id: string (UUID),
  orderId: string (FK Order),

  status: string,
  description: string,
  createdBy: string (userId ou 'system'),
  createdAt: datetime,
}
```

### 3.5 Appointment (Agendamento)

```typescript
Appointment = {
  id: string (UUID),

  // Referência
  userId: string (FK User),
  orderId: string? (FK Order),
  quoteId: string? (FK Quote),

  // Tipo
  type: enum ('visita_tecnica', 'instalacao', 'manutencao', 'revisao'),

  // Data/Hora
  scheduledDate: date,
  scheduledTime: time,
  estimatedDuration: number (minutos),

  // Endereço
  address: Address,

  // Status
  status: enum (
    'scheduled',      // Agendado
    'confirmed',      // Confirmado pelo cliente
    'in_progress',    // Em andamento
    'completed',      // Concluído
    'cancelled',      // Cancelado
    'rescheduled',    // Reagendado
    'no_show',        // Cliente ausente
  ),

  // Técnico
  assignedTo: string? (userId),

  // Notas
  notes: string?,
  completionNotes: string?,

  // Lembretes
  reminderSentAt: datetime?,

  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
  completedAt: datetime?,
}
```

### 3.6 Document (Documento)

```typescript
Document = {
  id: string (UUID),

  // Referência
  userId: string (FK User),
  orderId: string? (FK Order),
  quoteId: string? (FK Quote),

  // Tipo
  type: enum ('contrato', 'garantia', 'nota_fiscal', 'orcamento_pdf', 'foto', 'outro'),

  // Arquivo
  name: string,
  url: string,
  mimeType: string,
  size: number (bytes),

  // Status
  status: enum ('pending', 'signed', 'active', 'expired'),

  // Assinatura (se aplicável)
  signedAt: datetime?,
  signedBy: string?,
  signatureUrl: string?,

  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
}
```

### 3.7 AiConversation (Chat IA) 🆕

```typescript
AiConversation = {
  id: string (UUID),

  // Cliente
  userId: string? (FK User),
  customerName: string?,
  customerPhone: string?,
  customerEmail: string?,

  // Status da Conversa
  status: enum ('ACTIVE', 'IDLE', 'CONVERTED', 'ESCALATED', 'ARCHIVED'),
  assignedToUserId: string? (FK User - atendente humano),

  // Contexto Extraído pela IA
  extractedData: JSON, // { productType, dimensions, location, budget, urgency }

  // Análise de Imagem (se houver)
  imageAnalysis: JSON?, // { detectedProduct, estimatedDimensions, recommendations }

  // Resultado
  quoteId: string? (FK Quote),
  appointmentId: string? (FK Appointment),

  // Métricas
  messageCount: number,
  escalatedAt: datetime?,
  convertedAt: datetime?,

  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
  lastMessageAt: datetime,
}

AiMessage = {
  id: string (UUID),
  conversationId: string (FK AiConversation),

  // Conteúdo
  role: enum ('user', 'assistant', 'system'),
  content: string,
  imageUrl: string?, // Se mensagem incluir imagem

  // Metadados
  model: string?, // 'llama-3.3-70b-versatile' ou 'gpt-4o'
  tokens: number?,

  // Timestamps
  createdAt: datetime,
}
```

---

## 4. INTEGRAÇÕES

### 4.0 Mapa de Integrações Externas

```mermaid
flowchart TB
    subgraph VERSATI["🏗️ VERSATI GLASS CORE"]
        API[API Routes<br/>Next.js]
        SERVICES[Services Layer<br/>Business Logic]
        DB[(PostgreSQL<br/>Prisma ORM)]
    end

    subgraph PAYMENTS["💳 PAGAMENTOS"]
        STRIPE[Stripe]
        STRIPE_CHECKOUT[Checkout Session]
        STRIPE_WEBHOOK[Webhook Events]
        STRIPE_PIX[PIX Integration]
    end

    subgraph COMMUNICATION["📱 COMUNICAÇÃO"]
        TWILIO[Twilio]
        WA_SEND[Send Messages]
        WA_RECEIVE[Receive Webhook]
        WA_MEDIA[Media Messages]
    end

    subgraph AI_STACK["🤖 IA"]
        GROQ[Groq Cloud]
        LLAMA[Llama 3.3 70B<br/>Chat Conversacional]
        OPENAI[OpenAI]
        GPT4V[GPT-4o Vision<br/>Análise de Imagens]
    end

    subgraph EMAIL["📧 EMAIL"]
        RESEND[Resend]
        EMAIL_TRANS[Transactional]
        EMAIL_NOTIF[Notifications]
    end

    subgraph STORAGE["☁️ STORAGE"]
        R2[Cloudflare R2]
        S3_COMPAT[S3 Compatible]
    end

    subgraph CALENDAR["📅 AGENDA"]
        GOOGLE_CAL[Google Calendar]
        CAL_SLOTS[Available Slots]
        CAL_EVENTS[Create Events]
    end

    API --> SERVICES
    SERVICES --> DB

    SERVICES -->|"POST /api/payments"| STRIPE
    STRIPE --> STRIPE_CHECKOUT
    STRIPE --> STRIPE_PIX
    STRIPE_WEBHOOK -->|"Payment Success"| API

    SERVICES -->|"POST /api/whatsapp"| TWILIO
    TWILIO --> WA_SEND
    WA_RECEIVE -->|"Incoming Message"| API

    SERVICES -->|"POST /api/ai/chat"| GROQ
    GROQ --> LLAMA
    SERVICES -->|"POST /api/ai/analyze"| OPENAI
    OPENAI --> GPT4V

    SERVICES -->|"Send Email"| RESEND
    RESEND --> EMAIL_TRANS
    RESEND --> EMAIL_NOTIF

    SERVICES -->|"Upload Files"| R2

    SERVICES -->|"Check Availability"| GOOGLE_CAL
    GOOGLE_CAL --> CAL_SLOTS
    GOOGLE_CAL --> CAL_EVENTS

    style VERSATI fill:#1a1a2e,stroke:#d4af37,color:#fff
    style PAYMENTS fill:#16213e,stroke:#22c55e,color:#fff
    style COMMUNICATION fill:#16213e,stroke:#3b82f6,color:#fff
    style AI_STACK fill:#16213e,stroke:#9333ea,color:#fff
    style EMAIL fill:#16213e,stroke:#f97316,color:#fff
    style STORAGE fill:#16213e,stroke:#06b6d4,color:#fff
    style CALENDAR fill:#16213e,stroke:#ec4899,color:#fff
```

### 4.1 Twilio (WhatsApp Business)

| Funcionalidade    | Endpoint       | Uso                   |
| ----------------- | -------------- | --------------------- |
| Enviar mensagem   | POST /messages | Templates e free-form |
| Receber mensagem  | Webhook        | Mensagens do cliente  |
| Receber mídia     | Webhook        | Imagens, áudio        |
| Status de entrega | Webhook        | Delivered, read       |

**Custo estimado:** R$ 0,05 - R$ 0,15 por mensagem

### 4.2 IA Conversacional (Groq + OpenAI)

| Provedor   | Funcionalidade | Model                   | Uso                    |
| ---------- | -------------- | ----------------------- | ---------------------- |
| **Groq**   | Chat           | llama-3.3-70b-versatile | Conversação contextual |
| **OpenAI** | Vision         | gpt-4o                  | Análise de imagens     |

**Custo estimado:**

- Groq: **GRÁTIS** (30 req/min, 6K tokens/min)
- OpenAI Vision: ~R$ 0,05-0,15 por imagem (R$ 0,01-0,03 USD)

### 4.3 Stripe (Pagamentos)

| Funcionalidade   | Uso                      |
| ---------------- | ------------------------ |
| Checkout Session | Pagamento único          |
| Payment Intent   | Pagamento customizado    |
| PIX              | Via Payment Intent       |
| Webhooks         | Confirmação de pagamento |

**Taxa:** 3,99% + R$ 0,39 por transação

### 4.4 NextAuth.js (Autenticação)

| Provider    | Uso           |
| ----------- | ------------- |
| Credentials | Email + Senha |
| Google      | OAuth         |

### 4.5 Cloudflare R2 / AWS S3 (Storage)

| Funcionalidade | Uso                            |
| -------------- | ------------------------------ |
| Upload         | Imagens de produtos, portfólio |
| Download       | Servir arquivos                |
| Signed URLs    | Documentos privados            |

**Custo estimado:** ~R$ 0,015/GB/mês

### 4.6 Cal.com / Google Calendar (Agenda)

| Funcionalidade  | Uso                |
| --------------- | ------------------ |
| Disponibilidade | Slots disponíveis  |
| Agendamento     | Criar eventos      |
| Cancelamento    | Cancelar/reagendar |
| Lembretes       | Emails automáticos |

---

## 5. API ENDPOINTS

### 5.0 API Routes Map (Visão Geral)

```mermaid
flowchart LR
    subgraph PUBLIC["🌐 PUBLIC APIs"]
        AUTH["/api/auth/*<br/>• register<br/>• login<br/>• forgot-password"]
        PRODUCTS["/api/products/*<br/>• GET list<br/>• GET :slug"]
        QUOTES_PUB["/api/quotes<br/>• POST create"]
        APPOINTMENTS_PUB["/api/appointments/*<br/>• GET slots<br/>• POST schedule"]
    end

    subgraph AUTHENTICATED["🔐 AUTHENTICATED APIs"]
        USERS["/api/users/me/*<br/>• GET profile<br/>• PUT update<br/>• PUT password"]
        QUOTES_AUTH["/api/quotes/*<br/>• GET list<br/>• GET :id<br/>• PUT accept/reject"]
        ORDERS["/api/orders/*<br/>• GET list<br/>• GET :id<br/>• GET :id/timeline"]
        DOCS["/api/documents/*<br/>• GET list<br/>• POST upload"]
    end

    subgraph ADMIN["👑 ADMIN APIs"]
        ADMIN_DASH["/api/admin/dashboard<br/>• GET stats"]
        ADMIN_QUOTES["/api/admin/quotes/*<br/>• GET list<br/>• PUT :id<br/>• POST :id/send<br/>• POST :id/convert"]
        ADMIN_ORDERS["/api/admin/orders/*<br/>• GET list<br/>• PUT :id/status"]
        ADMIN_CUSTOMERS["/api/admin/customers/*<br/>• GET list<br/>• GET :id"]
        ADMIN_PRODUCTS["/api/admin/products/*<br/>• CRUD completo"]
    end

    subgraph INTEGRATIONS["⚡ INTEGRATIONS"]
        WHATSAPP["/api/whatsapp/*<br/>• POST webhook<br/>• POST send"]
        PAYMENTS["/api/payments/*<br/>• POST create-session<br/>• POST webhook"]
        AI["/api/ai/*<br/>• POST chat<br/>• POST analyze-image"]
        UPLOAD["/api/upload/*<br/>• POST image"]
    end

    CLIENT((👤 Cliente)) --> PUBLIC
    CLIENT --> AUTHENTICATED
    ADMIN_USER((👑 Admin)) --> ADMIN
    ADMIN_USER --> AUTHENTICATED

    TWILIO((📱 Twilio)) --> WHATSAPP
    STRIPE((💳 Stripe)) --> PAYMENTS

    style PUBLIC fill:#16213e,stroke:#22c55e,color:#fff
    style AUTHENTICATED fill:#16213e,stroke:#3b82f6,color:#fff
    style ADMIN fill:#16213e,stroke:#f97316,color:#fff
    style INTEGRATIONS fill:#16213e,stroke:#9333ea,color:#fff
```

### 5.1 Autenticação

```
POST   /api/auth/register        # Cadastro
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
POST   /api/auth/forgot-password # Esqueci senha
POST   /api/auth/reset-password  # Resetar senha
GET    /api/auth/me              # Usuário atual
PUT    /api/auth/me              # Atualizar perfil
POST   /api/auth/google          # OAuth Google
```

### 5.2 Produtos (Público)

```
GET    /api/products             # Listar produtos
GET    /api/products/:slug       # Detalhe do produto
GET    /api/products/category/:cat # Por categoria
GET    /api/products/featured    # Destaques
```

### 5.3 Orçamentos

```
POST   /api/quotes               # Criar orçamento
GET    /api/quotes               # Listar (cliente)
GET    /api/quotes/:id           # Detalhe
PUT    /api/quotes/:id/accept    # Aceitar
PUT    /api/quotes/:id/reject    # Rejeitar
```

### 5.4 Ordens

```
GET    /api/orders               # Listar (cliente)
GET    /api/orders/:id           # Detalhe
GET    /api/orders/:id/timeline  # Timeline
GET    /api/orders/:id/documents # Documentos
```

### 5.5 Agendamentos

```
GET    /api/appointments/slots   # Slots disponíveis
POST   /api/appointments         # Agendar
GET    /api/appointments         # Listar (cliente)
PUT    /api/appointments/:id     # Reagendar
DELETE /api/appointments/:id     # Cancelar
```

### 5.6 Pagamentos

```
POST   /api/payments/create-session    # Criar sessão Stripe
POST   /api/payments/webhook           # Webhook Stripe
GET    /api/payments/history           # Histórico
```

### 5.7 WhatsApp

```
POST   /api/whatsapp/webhook     # Webhook Twilio
POST   /api/whatsapp/send        # Enviar mensagem
```

### 5.8 IA Conversacional 🆕

```
POST   /api/ai/chat              # Enviar mensagem ao chat IA
GET    /api/ai/conversations     # Listar conversas
GET    /api/ai/conversations/:id # Detalhe da conversa
POST   /api/ai/analyze-image     # Análise de imagem (GPT-4o Vision)
POST   /api/ai/escalate          # Escalar para atendente humano
```

### 5.9 Upload

```
POST   /api/upload/image         # Upload de imagem
GET    /api/upload/signed-url    # URL assinada
```

### 5.10 Admin

```
# Produtos
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id

# Orçamentos
GET    /api/admin/quotes
PUT    /api/admin/quotes/:id
POST   /api/admin/quotes/:id/send

# Ordens
GET    /api/admin/orders
PUT    /api/admin/orders/:id
PUT    /api/admin/orders/:id/status

# Clientes
GET    /api/admin/customers
GET    /api/admin/customers/:id

# Agenda
GET    /api/admin/appointments
PUT    /api/admin/appointments/:id

# Dashboard
GET    /api/admin/dashboard/stats
GET    /api/admin/dashboard/recent

# Relatórios
GET    /api/admin/reports/sales
GET    /api/admin/reports/orders
```

---

## 6. SEGURANÇA

### 6.1 Autenticação

- JWT com refresh tokens
- Senhas hashadas com bcrypt (12 rounds)
- Sessions com httpOnly cookies
- CSRF protection

### 6.2 Autorização

- Role-based access control (RBAC)
- Middleware de autenticação
- Verificação de ownership

### 6.3 Dados

- Validação com Zod em todas as entradas
- Sanitização de inputs
- Prepared statements (Prisma)
- Encryption de dados sensíveis

### 6.4 API

- Rate limiting
- CORS configurado
- HTTPS obrigatório
- Headers de segurança (Helmet)

### 6.5 LGPD

- Consentimento para comunicações
- Política de privacidade
- Direito ao esquecimento
- Exportação de dados

---

## 7. PERFORMANCE

### 7.1 Frontend

- Next.js App Router (Server Components)
- Image Optimization
- Code Splitting
- Lazy Loading
- Service Worker (PWA)

### 7.2 Backend

- Connection pooling (Prisma)
- Query optimization
- Caching (Redis futuro)
- Pagination em todas as listas

### 7.3 Metas

| Métrica          | Meta    |
| ---------------- | ------- |
| LCP              | < 2.5s  |
| FID              | < 100ms |
| CLS              | < 0.1   |
| TTFB             | < 600ms |
| Lighthouse Score | 90+     |

---

## 8. MONITORAMENTO

### 8.1 Logs

- Logs estruturados (JSON)
- Níveis: error, warn, info, debug
- Request ID para rastreamento

### 8.2 Métricas

- Uptime
- Response time
- Error rate
- Active users

### 8.3 Alertas

- Downtime
- Error spikes
- Payment failures
- WhatsApp failures

---

## 9. FLUXO DE NOTIFICAÇÕES

```mermaid
flowchart TB
    subgraph TRIGGERS["🎯 TRIGGERS (Eventos)"]
        T1[Quote Created]
        T2[Quote Sent]
        T3[Quote Accepted]
        T4[Order Created]
        T5[Payment Received]
        T6[Status Changed]
        T7[Appointment Scheduled]
        T8[Appointment Reminder]
    end

    subgraph NOTIFICATIONS["📬 NOTIFICATION SERVICE"]
        NS[Notification<br/>Service]
        TEMPLATE[Template<br/>Engine]
    end

    subgraph CHANNELS["📤 CANAIS"]
        EMAIL[📧 Email<br/>Resend API]
        WHATSAPP[📱 WhatsApp<br/>Twilio API]
        PUSH[🔔 Push<br/>Web Notifications]
        INAPP[📋 In-App<br/>Database]
    end

    subgraph RECIPIENTS["👥 DESTINATÁRIOS"]
        CUSTOMER[👤 Cliente]
        ADMIN[👑 Admin]
    end

    T1 -->|"Novo orçamento"| NS
    T2 -->|"Orçamento enviado"| NS
    T3 -->|"Orçamento aceito"| NS
    T4 -->|"Pedido criado"| NS
    T5 -->|"Pagamento OK"| NS
    T6 -->|"Status atualizado"| NS
    T7 -->|"Agendamento"| NS
    T8 -->|"Lembrete 24h"| NS

    NS --> TEMPLATE
    TEMPLATE --> EMAIL
    TEMPLATE --> WHATSAPP
    TEMPLATE --> PUSH
    TEMPLATE --> INAPP

    EMAIL --> CUSTOMER
    EMAIL --> ADMIN
    WHATSAPP --> CUSTOMER
    WHATSAPP --> ADMIN
    PUSH --> CUSTOMER
    INAPP --> CUSTOMER
    INAPP --> ADMIN

    style TRIGGERS fill:#16213e,stroke:#f97316,color:#fff
    style NOTIFICATIONS fill:#16213e,stroke:#22c55e,color:#fff
    style CHANNELS fill:#16213e,stroke:#3b82f6,color:#fff
    style RECIPIENTS fill:#16213e,stroke:#9333ea,color:#fff
```

### 9.1 Matriz de Notificações

| Evento                | Email Cliente | WhatsApp Cliente | Email Admin | In-App |
| --------------------- | ------------- | ---------------- | ----------- | ------ |
| Quote Created         | -             | -                | ✅          | ✅     |
| Quote Sent            | ✅            | ✅               | -           | ✅     |
| Quote Accepted        | ✅            | ✅               | ✅          | ✅     |
| Order Created         | ✅            | ✅               | ✅          | ✅     |
| Payment Received      | ✅            | ✅               | ✅          | ✅     |
| Status Changed        | ✅            | ✅               | -           | ✅     |
| Appointment Scheduled | ✅            | ✅               | ✅          | ✅     |
| Appointment Reminder  | ✅            | ✅               | -           | -      |

---

_Versati Glass PRD v2.0 - Dezembro 2024_
_Atualizado com diagramas Mermaid_
