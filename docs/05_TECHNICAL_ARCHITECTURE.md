# 🏗️ VERSATI GLASS - TECHNICAL ARCHITECTURE

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Sincronizado com:** PRD v1.0.0

---

## 1. VISÃO GERAL DA ARQUITETURA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      VERSATI GLASS - ARQUITETURA                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CLIENTS                                                                    │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │  Browser  │  │  Mobile   │  │  WhatsApp │  │   Admin   │               │
│  │   (Web)   │  │   (PWA)   │  │  (Twilio) │  │  (Staff)  │               │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘               │
│        │              │              │              │                       │
│        └──────────────┼──────────────┼──────────────┘                       │
│                       │              │                                      │
│                       ▼              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CDN (Vercel Edge)                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  FRONTEND                          │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                         Next.js 14 (App Router)                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │   Landing   │  │   Portal    │  │    Admin    │  │    Auth    │  │   │
│  │  │   Pages     │  │  (Cliente)  │  │   (Staff)   │  │   (Next    │  │   │
│  │  │             │  │             │  │             │  │   Auth)    │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  API LAYER                         │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                    Next.js API Routes + Express                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │  /api/auth    /api/products    /api/quotes    /api/orders    │   │   │
│  │  │  /api/appointments    /api/payments    /api/whatsapp         │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  SERVICES                          │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                          Business Logic                              │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │  Quote    │  │  Order    │  │  Payment  │  │ Appointment│        │   │
│  │  │  Service  │  │  Service  │  │  Service  │  │  Service   │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │  WhatsApp │  │    AI     │  │  Document │  │Notification│        │   │
│  │  │  Service  │  │  Service  │  │  Service  │  │  Service   │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  DATA LAYER                        │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                           Prisma ORM                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                      PostgreSQL (Railway)                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  EXTERNAL SERVICES                                                          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │  Twilio   │  │  Claude   │  │  Stripe   │  │Cloudflare │               │
│  │ (WhatsApp)│  │   (AI)    │  │(Payments) │  │  R2 (S3)  │               │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. STACK TECNOLÓGICA

### 2.1 Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 14.x | Framework React (App Router) |
| **React** | 18.x | UI Library |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 3.x | Styling utility-first |
| **Framer Motion** | 10.x | Animações |
| **Zustand** | 4.x | State management |
| **React Query** | 5.x | Server state / caching |
| **React Hook Form** | 7.x | Formulários |
| **Zod** | 3.x | Validação de schemas |
| **Lucide React** | - | Ícones |
| **Radix UI** | - | Primitivos acessíveis |

### 2.2 Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Node.js** | 20.x LTS | Runtime |
| **Express** | 4.x | API framework (webhooks) |
| **Prisma** | 5.x | ORM |
| **PostgreSQL** | 15.x | Banco de dados |
| **NextAuth.js** | 5.x | Autenticação |
| **Socket.IO** | 4.x | Real-time (futuro) |

### 2.3 Integrações

| Serviço | Uso |
|---------|-----|
| **Twilio** | WhatsApp Business API |
| **Anthropic Claude** | IA conversacional + Vision |
| **Stripe** | Pagamentos (PIX, Cartão) |
| **Cloudflare R2** | Storage de arquivos |
| **Resend** | Envio de emails |
| **Cal.com** | Agendamentos (ou Google Calendar) |

### 2.4 Infraestrutura

| Serviço | Uso |
|---------|-----|
| **Vercel** | Frontend hosting + Edge |
| **Railway** | Backend + PostgreSQL |
| **Cloudflare** | DNS + R2 Storage |

---

## 3. ESTRUTURA DE PASTAS

```
versati-glass/
├── apps/
│   ├── web/                          # Next.js App (Frontend + API)
│   │   ├── app/                      # App Router
│   │   │   ├── (public)/            # Rotas públicas
│   │   │   │   ├── page.tsx         # Home
│   │   │   │   ├── produtos/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [categoria]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── [slug]/
│   │   │   │   │           └── page.tsx
│   │   │   │   ├── servicos/
│   │   │   │   ├── portfolio/
│   │   │   │   ├── orcamento/
│   │   │   │   ├── contato/
│   │   │   │   └── sobre/
│   │   │   │
│   │   │   ├── (auth)/              # Rotas de autenticação
│   │   │   │   ├── login/
│   │   │   │   ├── cadastro/
│   │   │   │   ├── esqueci-senha/
│   │   │   │   └── resetar-senha/
│   │   │   │
│   │   │   ├── portal/              # Área do cliente (protegida)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx         # Dashboard
│   │   │   │   ├── ordens/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   ├── orcamentos/
│   │   │   │   ├── agenda/
│   │   │   │   ├── documentos/
│   │   │   │   ├── pagamentos/
│   │   │   │   └── perfil/
│   │   │   │
│   │   │   ├── admin/               # Área administrativa (protegida)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx         # Dashboard
│   │   │   │   ├── produtos/
│   │   │   │   ├── servicos/
│   │   │   │   ├── orcamentos/
│   │   │   │   ├── ordens/
│   │   │   │   ├── clientes/
│   │   │   │   ├── agenda/
│   │   │   │   ├── financeiro/
│   │   │   │   ├── portfolio/
│   │   │   │   └── config/
│   │   │   │
│   │   │   ├── api/                 # API Routes
│   │   │   │   ├── auth/
│   │   │   │   │   ├── [...nextauth]/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── me/
│   │   │   │   ├── products/
│   │   │   │   ├── quotes/
│   │   │   │   ├── orders/
│   │   │   │   ├── appointments/
│   │   │   │   ├── payments/
│   │   │   │   │   └── webhook/
│   │   │   │   ├── whatsapp/
│   │   │   │   │   └── webhook/
│   │   │   │   ├── upload/
│   │   │   │   └── admin/
│   │   │   │
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── globals.css
│   │   │
│   │   ├── components/              # Componentes React
│   │   │   ├── ui/                  # Primitivos (Button, Input, Card...)
│   │   │   ├── layout/              # Header, Footer, Sidebar...
│   │   │   ├── forms/               # Form components
│   │   │   ├── features/            # Feature components
│   │   │   └── shared/              # Componentes compartilhados
│   │   │
│   │   ├── lib/                     # Bibliotecas e utilitários
│   │   │   ├── prisma.ts           # Cliente Prisma
│   │   │   ├── auth.ts             # Config NextAuth
│   │   │   ├── stripe.ts           # Config Stripe
│   │   │   ├── twilio.ts           # Config Twilio
│   │   │   ├── claude.ts           # Config Claude
│   │   │   ├── storage.ts          # Config R2/S3
│   │   │   └── utils.ts            # Helpers
│   │   │
│   │   ├── services/               # Business logic
│   │   │   ├── quote.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── appointment.service.ts
│   │   │   ├── whatsapp.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── document.service.ts
│   │   │   └── notification.service.ts
│   │   │
│   │   ├── stores/                 # Zustand stores
│   │   │   ├── quote.store.ts
│   │   │   ├── cart.store.ts
│   │   │   └── ui.store.ts
│   │   │
│   │   ├── hooks/                  # Custom hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-products.ts
│   │   │   ├── use-quotes.ts
│   │   │   └── use-orders.ts
│   │   │
│   │   ├── types/                  # TypeScript types
│   │   │   ├── index.ts
│   │   │   ├── product.ts
│   │   │   ├── quote.ts
│   │   │   ├── order.ts
│   │   │   └── user.ts
│   │   │
│   │   ├── config/                 # Configurações
│   │   │   ├── site.ts
│   │   │   ├── navigation.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── public/                 # Assets estáticos
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   │   └── favicon.ico
│   │   │
│   │   ├── prisma/                 # Prisma schema
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   │
│   │   ├── middleware.ts           # Next.js middleware
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── whatsapp-worker/            # Worker para WhatsApp (opcional)
│       ├── src/
│       │   ├── handlers/
│       │   ├── ai/
│       │   └── index.ts
│       └── package.json
│
├── packages/                        # Shared packages (monorepo)
│   ├── ui/                         # Design system components
│   ├── config/                     # Shared configs
│   └── types/                      # Shared types
│
├── docs/                           # Documentação
│   ├── 00_ACTIVATION_PROMPT.md
│   ├── 01_CONCEITO_VERSATI.md
│   ├── 02_DESIGN_SYSTEM.md
│   ├── 03_PRD.md
│   ├── 04_USER_FLOWS.md
│   ├── 05_TECHNICAL_ARCHITECTURE.md
│   └── ...
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## 4. MODELOS DE DADOS (PRISMA)

### 4.1 Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum UserRole {
  customer
  admin
  staff
}

enum AuthProvider {
  email
  google
}

enum ProductCategory {
  box
  espelhos
  vidros
  portas_janelas
  fechamentos
  outros
}

enum ProductPriceType {
  fixed
  per_m2
  quote_only
}

enum QuoteStatus {
  draft
  sent
  viewed
  accepted
  rejected
  expired
  converted
}

enum OrderStatus {
  orcamento_enviado
  aguardando_pagamento
  aprovado
  em_producao
  pronto_entrega
  instalacao_agendada
  instalando
  concluido
  cancelado
  aguardando_cliente
  em_revisao
}

enum PaymentStatus {
  pending
  partial
  paid
  refunded
}

enum PaymentMethod {
  pix
  credit_card
  debit_card
  boleto
  cash
}

enum AppointmentType {
  visita_tecnica
  instalacao
  manutencao
  revisao
}

enum AppointmentStatus {
  scheduled
  confirmed
  in_progress
  completed
  cancelled
  rescheduled
  no_show
}

enum DocumentType {
  contrato
  garantia
  nota_fiscal
  orcamento_pdf
  foto
  outro
}

enum ConversationStatus {
  active
  waiting_human
  closed
}

enum MessageDirection {
  inbound
  outbound
}

enum MessageType {
  text
  image
  document
  audio
  location
}

enum MessageSenderType {
  customer
  ai
  human
}

enum QuoteSource {
  website
  whatsapp
  phone
  walkin
}

// ============================================
// MODELS
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?
  name          String
  phone         String?
  cpfCnpj       String?
  
  // Endereço
  street        String?
  number        String?
  complement    String?
  neighborhood  String?
  city          String?
  state         String?
  zipCode       String?
  
  // Auth
  role          UserRole  @default(customer)
  emailVerified Boolean   @default(false)
  phoneVerified Boolean   @default(false)
  authProvider  AuthProvider @default(email)
  googleId      String?   @unique
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  
  // Relations
  quotes        Quote[]
  orders        Order[]
  appointments  Appointment[]
  documents     Document[]
  conversations Conversation[]
  
  @@map("users")
}

model Product {
  id               String          @id @default(cuid())
  name             String
  slug             String          @unique
  description      String
  shortDescription String?
  
  // Categorização
  category         ProductCategory
  subcategory      String?
  
  // Mídia
  images           String[]        @default([])
  thumbnail        String?
  
  // Preço
  priceType        ProductPriceType @default(quote_only)
  basePrice        Decimal?        @db.Decimal(10, 2)
  pricePerM2       Decimal?        @db.Decimal(10, 2)
  priceRangeMin    Decimal?        @db.Decimal(10, 2)
  priceRangeMax    Decimal?        @db.Decimal(10, 2)
  
  // Opções
  colors           String[]        @default([])
  finishes         String[]        @default([])
  thicknesses      String[]        @default([])
  
  // Status
  isActive         Boolean         @default(true)
  isFeatured       Boolean         @default(false)
  
  // SEO
  metaTitle        String?
  metaDescription  String?
  
  // Timestamps
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  
  // Relations
  quoteItems       QuoteItem[]
  orderItems       OrderItem[]
  
  @@map("products")
}

model Quote {
  id            String      @id @default(cuid())
  number        String      @unique
  
  // Cliente
  userId        String?
  user          User?       @relation(fields: [userId], references: [id])
  customerName  String
  customerEmail String
  customerPhone String
  
  // Endereço do serviço
  street        String?
  number        String?
  complement    String?
  neighborhood  String?
  city          String?
  state         String?
  zipCode       String?
  
  // Valores
  subtotal      Decimal     @db.Decimal(10, 2)
  discount      Decimal     @default(0) @db.Decimal(10, 2)
  total         Decimal     @db.Decimal(10, 2)
  
  // Status
  status        QuoteStatus @default(draft)
  validUntil    DateTime?
  
  // Notas
  internalNotes String?
  customerNotes String?
  
  // Origem
  source        QuoteSource @default(website)
  
  // Timestamps
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  sentAt        DateTime?
  viewedAt      DateTime?
  acceptedAt    DateTime?
  
  // Relations
  items         QuoteItem[]
  order         Order?
  appointments  Appointment[]
  documents     Document[]
  conversation  Conversation?
  
  @@map("quotes")
}

model QuoteItem {
  id             String   @id @default(cuid())
  quoteId        String
  quote          Quote    @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  productId      String?
  product        Product? @relation(fields: [productId], references: [id])
  
  // Descrição
  description    String
  specifications String?
  
  // Medidas
  width          Decimal? @db.Decimal(10, 2)
  height         Decimal? @db.Decimal(10, 2)
  quantity       Int      @default(1)
  
  // Opções
  color          String?
  finish         String?
  thickness      String?
  
  // Valores
  unitPrice      Decimal  @db.Decimal(10, 2)
  totalPrice     Decimal  @db.Decimal(10, 2)
  
  // Imagens do cliente
  customerImages String[] @default([])
  
  @@map("quote_items")
}

model Order {
  id              String        @id @default(cuid())
  number          String        @unique
  
  // Origem
  quoteId         String?       @unique
  quote           Quote?        @relation(fields: [quoteId], references: [id])
  
  // Cliente
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  
  // Endereço
  street          String
  number          String
  complement      String?
  neighborhood    String
  city            String
  state           String
  zipCode         String
  
  // Valores
  subtotal        Decimal       @db.Decimal(10, 2)
  discount        Decimal       @default(0) @db.Decimal(10, 2)
  installationFee Decimal       @default(0) @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)
  
  // Pagamento
  paymentStatus   PaymentStatus @default(pending)
  paymentMethod   PaymentMethod?
  paidAmount      Decimal       @default(0) @db.Decimal(10, 2)
  
  // Status
  status          OrderStatus   @default(orcamento_enviado)
  
  // Datas
  estimatedDelivery DateTime?
  installedAt       DateTime?
  completedAt       DateTime?
  warrantyUntil     DateTime?
  
  // Notas
  internalNotes   String?
  
  // Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relations
  items           OrderItem[]
  timeline        OrderTimeline[]
  appointments    Appointment[]
  documents       Document[]
  payments        Payment[]
  
  @@map("orders")
}

model OrderItem {
  id             String   @id @default(cuid())
  orderId        String
  order          Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId      String?
  product        Product? @relation(fields: [productId], references: [id])
  
  description    String
  specifications String?
  
  width          Decimal? @db.Decimal(10, 2)
  height         Decimal? @db.Decimal(10, 2)
  quantity       Int      @default(1)
  
  color          String?
  finish         String?
  thickness      String?
  
  unitPrice      Decimal  @db.Decimal(10, 2)
  totalPrice     Decimal  @db.Decimal(10, 2)
  
  status         String   @default("pending")
  
  @@map("order_items")
}

model OrderTimeline {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  status      String
  description String
  createdBy   String   // userId or 'system'
  createdAt   DateTime @default(now())
  
  @@map("order_timeline")
}

model Appointment {
  id                String            @id @default(cuid())
  
  // Referências
  userId            String
  user              User              @relation(fields: [userId], references: [id])
  orderId           String?
  order             Order?            @relation(fields: [orderId], references: [id])
  quoteId           String?
  quote             Quote?            @relation(fields: [quoteId], references: [id])
  
  // Tipo
  type              AppointmentType
  
  // Data/Hora
  scheduledDate     DateTime          @db.Date
  scheduledTime     String            // "14:00"
  estimatedDuration Int               @default(60) // minutos
  
  // Endereço
  street            String
  number            String
  complement        String?
  neighborhood      String
  city              String
  state             String
  zipCode           String
  
  // Status
  status            AppointmentStatus @default(scheduled)
  
  // Técnico
  assignedTo        String?
  
  // Notas
  notes             String?
  completionNotes   String?
  
  // Lembretes
  reminderSentAt    DateTime?
  
  // Timestamps
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  completedAt       DateTime?
  
  @@map("appointments")
}

model Payment {
  id              String        @id @default(cuid())
  orderId         String
  order           Order         @relation(fields: [orderId], references: [id])
  
  // Stripe
  stripePaymentId String?       @unique
  stripeSessionId String?
  
  amount          Decimal       @db.Decimal(10, 2)
  method          PaymentMethod
  status          PaymentStatus @default(pending)
  
  paidAt          DateTime?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@map("payments")
}

model Document {
  id           String       @id @default(cuid())
  
  // Referências
  userId       String
  user         User         @relation(fields: [userId], references: [id])
  orderId      String?
  order        Order?       @relation(fields: [orderId], references: [id])
  quoteId      String?
  quote        Quote?       @relation(fields: [quoteId], references: [id])
  
  // Tipo
  type         DocumentType
  
  // Arquivo
  name         String
  url          String
  mimeType     String
  size         Int          // bytes
  
  // Status
  status       String       @default("active")
  
  // Assinatura
  signedAt     DateTime?
  signedBy     String?
  signatureUrl String?
  
  // Timestamps
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  @@map("documents")
}

model Conversation {
  id           String             @id @default(cuid())
  
  // Cliente
  userId       String?
  user         User?              @relation(fields: [userId], references: [id])
  phoneNumber  String
  customerName String?
  
  // Status
  status       ConversationStatus @default(active)
  assignedTo   String?            // userId do admin
  
  // Contexto (dados coletados pela IA)
  context      Json?
  
  // Resultado
  quoteId      String?            @unique
  quote        Quote?             @relation(fields: [quoteId], references: [id])
  
  // Timestamps
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt
  lastMessageAt DateTime          @default(now())
  
  // Relations
  messages     Message[]
  
  @@map("conversations")
}

model Message {
  id             String            @id @default(cuid())
  conversationId String
  conversation   Conversation      @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  // Direção
  direction      MessageDirection
  
  // Conteúdo
  type           MessageType       @default(text)
  content        String
  mediaUrl       String?
  
  // Remetente
  senderType     MessageSenderType
  senderId       String?
  
  // Status (outbound)
  status         String            @default("sent")
  
  // Timestamps
  createdAt      DateTime          @default(now())
  
  @@map("messages")
}

model PortfolioProject {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  
  // Categorias
  category    String
  tags        String[] @default([])
  
  // Mídia
  images      String[] @default([])
  thumbnail   String?
  
  // Detalhes
  location    String?
  completedAt DateTime?
  
  // Status
  isPublished Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("portfolio_projects")
}

model SiteConfig {
  id    String @id @default(cuid())
  key   String @unique
  value Json
  
  updatedAt DateTime @updatedAt
  
  @@map("site_config")
}
```

---

## 5. API ENDPOINTS DETALHADOS

### 5.1 Autenticação

```typescript
// POST /api/auth/register
interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// GET /api/auth/me
interface MeResponse {
  user: User;
}

// PUT /api/auth/me
interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: Address;
}
```

### 5.2 Produtos

```typescript
// GET /api/products
interface ProductsQuery {
  category?: ProductCategory;
  featured?: boolean;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

// GET /api/products/:slug
interface ProductResponse {
  product: Product;
  related: Product[];
}
```

### 5.3 Orçamentos

```typescript
// POST /api/quotes
interface CreateQuoteRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceAddress: Address;
  items: QuoteItemInput[];
  source?: QuoteSource;
}

interface QuoteItemInput {
  productId?: string;
  description: string;
  specifications?: string;
  width?: number;
  height?: number;
  quantity: number;
  color?: string;
  customerImages?: string[];
}

// PUT /api/quotes/:id/accept
interface AcceptQuoteResponse {
  order: Order;
  paymentUrl?: string;
}
```

### 5.4 Ordens

```typescript
// GET /api/orders
interface OrdersResponse {
  orders: Order[];
}

// GET /api/orders/:id
interface OrderDetailResponse {
  order: Order;
  items: OrderItem[];
  timeline: OrderTimeline[];
  documents: Document[];
}

// PUT /api/admin/orders/:id/status
interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notify?: boolean;
  note?: string;
}
```

### 5.5 Agendamentos

```typescript
// GET /api/appointments/slots
interface SlotsQuery {
  date?: string; // YYYY-MM-DD
  type: AppointmentType;
}

interface SlotsResponse {
  slots: {
    date: string;
    times: string[];
  }[];
}

// POST /api/appointments
interface CreateAppointmentRequest {
  quoteId?: string;
  orderId?: string;
  type: AppointmentType;
  scheduledDate: string;
  scheduledTime: string;
  address: Address;
  notes?: string;
}
```

### 5.6 Pagamentos

```typescript
// POST /api/payments/create-session
interface CreatePaymentSessionRequest {
  orderId: string;
  method: PaymentMethod;
}

interface CreatePaymentSessionResponse {
  sessionId: string;
  url: string;
}

// POST /api/payments/webhook (Stripe)
// Recebe eventos do Stripe e atualiza status
```

### 5.7 WhatsApp

```typescript
// POST /api/whatsapp/webhook (Twilio)
interface TwilioWebhookPayload {
  MessageSid: string;
  From: string;
  To: string;
  Body: string;
  NumMedia: string;
  MediaUrl0?: string;
  // ...
}

// POST /api/whatsapp/send
interface SendMessageRequest {
  to: string;
  body: string;
  mediaUrl?: string;
}
```

---

## 6. AUTENTICAÇÃO E AUTORIZAÇÃO

### 6.1 NextAuth Configuration

```typescript
// lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
```

### 6.2 Middleware de Proteção

```typescript
// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Proteger rotas do portal
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Proteger rotas admin
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (userRole !== "admin" && userRole !== "staff") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
```

---

## 7. INTEGRAÇÕES EXTERNAS

### 7.1 Twilio (WhatsApp)

```typescript
// lib/twilio.ts
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppMessage(to: string, body: string) {
  return client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
    body,
  });
}

export async function sendWhatsAppTemplate(
  to: string,
  templateSid: string,
  variables: Record<string, string>
) {
  return client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
    contentSid: templateSid,
    contentVariables: JSON.stringify(variables),
  });
}
```

### 7.2 Claude AI

```typescript
// lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chat(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string
) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "";
}

export async function analyzeImage(imageUrl: string, prompt: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "url",
              url: imageUrl,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "";
}
```

### 7.3 Stripe

```typescript
// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function createCheckoutSession(
  orderId: string,
  amount: number,
  customerEmail: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `Pedido ${orderId}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId },
    success_url: `${process.env.NEXT_PUBLIC_URL}/portal/ordens/${orderId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/portal/ordens/${orderId}?cancelled=true`,
  });

  return session;
}

export async function createPixPayment(orderId: string, amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "brl",
    payment_method_types: ["pix"],
    metadata: { orderId },
  });

  return paymentIntent;
}
```

---

## 8. VARIÁVEIS DE AMBIENTE

```env
# .env.example

# App
NEXT_PUBLIC_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/versatiglass?schema=public"

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=+14155238886

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Cloudflare R2
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=versatiglass
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com

# Resend (Email)
RESEND_API_KEY=re_...

# Cal.com (opcional)
CAL_API_KEY=
```

---

## 9. DEPLOY E CI/CD

### 9.1 Vercel (Frontend)

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["gru1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

### 9.2 Railway (Backend/Database)

```yaml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "pnpm start"
healthcheckPath = "/api/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### 9.3 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm test
```

---

*Versati Glass Technical Architecture v1.0 - Dezembro 2024*
