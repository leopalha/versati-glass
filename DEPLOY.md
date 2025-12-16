# Versati Glass - Guia de Deploy

## Pre-requisitos

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+
- Conta Vercel (deploy)
- Conta Stripe (pagamentos)
- Conta Twilio (WhatsApp)
- Conta Resend (emails)
- Conta Groq (AI)

## Variaveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Database (Neon/Supabase/Railway)
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Twilio WhatsApp
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="+14155238886"

# Groq AI
GROQ_API_KEY="gsk_..."

# Resend Email
RESEND_API_KEY="re_..."

# Cron
CRON_SECRET="gerar-com-openssl-rand-base64-32"

# App
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
NEXT_PUBLIC_BASE_URL="https://seu-dominio.com"
NEXT_PUBLIC_WHATSAPP_NUMBER="+5521982536229"
```

## Deploy na Vercel

### 1. Conectar Repositorio

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Configurar Variaveis de Ambiente

No dashboard da Vercel:
1. Settings > Environment Variables
2. Adicione todas as variaveis do `.env.example`

### 3. Configurar Database

Recomendamos Neon ou Supabase para PostgreSQL serverless:

```bash
# Gerar schema
pnpm db:generate

# Push para producao
pnpm db:push

# (Opcional) Seed inicial
pnpm db:seed
```

### 4. Configurar Webhooks

#### Stripe Webhook
1. Dashboard Stripe > Developers > Webhooks
2. Endpoint: `https://seu-dominio.com/api/payments/webhook`
3. Eventos: `checkout.session.completed`, `payment_intent.succeeded`

#### Twilio Webhook
1. Console Twilio > Messaging > Try it out > Send a WhatsApp message
2. Sandbox Settings > When a message comes in: `https://seu-dominio.com/api/whatsapp/webhook`

### 5. Configurar Cron Jobs

O arquivo `vercel.json` ja configura o cron para lembretes:
- `/api/cron/reminders` - Roda diariamente as 8h

## Comandos Uteis

```bash
# Desenvolvimento
pnpm dev

# Build local
pnpm build

# Rodar testes
pnpm test:run

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Rotas admin
│   ├── (auth)/            # Rotas autenticacao
│   ├── (portal)/          # Portal do cliente
│   ├── (public)/          # Paginas publicas
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── admin/            # Componentes admin
│   ├── landing/          # Componentes landing
│   ├── portal/           # Componentes portal
│   ├── quote/            # Wizard de orcamento
│   └── ui/               # Design system
├── lib/                  # Bibliotecas
├── services/             # Servicos (AI, Email, WhatsApp)
├── stores/               # Estado global (Zustand)
└── types/                # TypeScript types
```

## Checklist Pre-Deploy

- [ ] Variaveis de ambiente configuradas
- [ ] Database migrada
- [ ] Stripe webhook configurado
- [ ] Twilio webhook configurado
- [ ] Dominio configurado
- [ ] SSL ativo
- [ ] Build passando (`pnpm build`)
- [ ] Testes passando (`pnpm test:run`)

## Suporte

- Documentacao: Este arquivo
- Issues: GitHub repository
- WhatsApp: +55 21 98253-6229
