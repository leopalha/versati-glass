# 📦 GUIA DE FORNECEDORES TÉCNICOS E DEPENDÊNCIAS

**Versati Glass Platform - Technical Suppliers & Dependencies Management**

> Documentação completa de todos os fornecedores técnicos, APIs externas e dependências críticas da plataforma digital.

**Versão:** 2.0
**Última atualização:** 17 Dezembro 2024
**Responsável:** Dev Team

---

## 📑 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Fornecedores Críticos](#2-fornecedores-críticos)
3. [Integrações de IA](#3-integrações-de-ia)
4. [Pagamentos e Transações](#4-pagamentos-e-transações)
5. [Comunicação](#5-comunicação)
6. [Armazenamento e CDN](#6-armazenamento-e-cdn)
7. [Analytics e Tracking](#7-analytics-e-tracking)
8. [Infraestrutura](#8-infraestrutura)
9. [Dependências NPM Críticas](#9-dependências-npm-críticas)
10. [SLAs e Disponibilidade](#10-slas-e-disponibilidade)
11. [Matriz de Custos](#11-matriz-de-custos)
12. [Plano de Contingência](#12-plano-de-contingência)
13. [Checklist de Onboarding](#13-checklist-de-onboarding)

> **📝 NOTA:** Para fornecedores de materiais físicos (vidro, ferragens, espelhos), consultar o documento [19B_FORNECEDORES_FISICOS.md](./19B_FORNECEDORES_FISICOS.md)

---

## 1. VISÃO GERAL

### 1.1 Categorização de Fornecedores Técnicos

| Categoria          | Fornecedores                 | Criticidade | Alternativas            |
| ------------------ | ---------------------------- | ----------- | ----------------------- |
| **IA/ML**          | Groq, OpenAI                 | 🔴 CRÍTICA  | Anthropic, Together AI  |
| **Pagamentos**     | Stripe                       | 🔴 CRÍTICA  | Mercado Pago, PagSeguro |
| **Comunicação**    | Twilio, Resend               | 🔴 CRÍTICA  | Vonage, SendGrid        |
| **Infraestrutura** | Vercel, Railway              | 🔴 CRÍTICA  | AWS, DigitalOcean       |
| **Storage**        | Cloudflare R2                | 🟡 MÉDIA    | AWS S3, Backblaze       |
| **Analytics**      | Google Analytics, Meta Pixel | 🟢 BAIXA    | Plausible, Mixpanel     |
| **Auth**           | NextAuth.js, Google OAuth    | 🔴 CRÍTICA  | Auth0, Clerk            |

### 1.2 Dependências por Criticidade

#### 🔴 CRÍTICAS (Downtime = Perda de Negócio)

- **Railway (PostgreSQL)** - Database principal
- **Vercel (Next.js)** - Hosting da aplicação
- **Stripe** - Processamento de pagamentos
- **Groq** - WhatsApp Bot conversacional
- **Twilio** - WhatsApp Business API
- **NextAuth.js** - Autenticação de usuários

#### 🟡 MÉDIAS (Degradação de Funcionalidade)

- **OpenAI** - Análise de imagens em orçamentos
- **Resend** - Envio de emails transacionais
- **Cloudflare R2** - Upload de arquivos/imagens
- **Google OAuth** - Login social

#### 🟢 BAIXAS (Não Afeta Operação)

- **Google Analytics 4** - Tracking de analytics
- **Meta Pixel** - Retargeting de anúncios
- **Plausible** - Analytics alternativo (opcional)

---

## 2. FORNECEDORES CRÍTICOS

### 2.1 Vercel (Frontend Hosting)

**Propósito:** Hosting da aplicação Next.js 14

**Plano Recomendado:**

- **Hobby Plan** ($20/mês) - Para MVP e testes
  - 100 GB bandwidth
  - Unlimited sites
  - Serverless Functions: 100 GB-Hrs
  - Edge Functions: 500K invocations

- **Pro Plan** ($20/mês por usuário) - Para produção
  - 1 TB bandwidth
  - Advanced Analytics
  - Serverless Functions: 1000 GB-Hrs
  - Password Protection
  - Preview Deployments ilimitados

**Setup:**

```bash
# 1. Instalar Vercel CLI
pnpm add -g vercel

# 2. Login
vercel login

# 3. Link projeto
vercel link

# 4. Configurar env vars
vercel env pull .env.production
```

**Environment Variables (Vercel Dashboard):**

- `DATABASE_URL` (Production scope)
- `NEXTAUTH_URL` (Production + Preview)
- `NEXTAUTH_SECRET` (Production)
- Todas as API keys (ver [docs/17_INTEGRACOES.md](./17_INTEGRACOES.md))

**Monitoring:**

- Dashboard: https://vercel.com/versatiglass/analytics
- Build logs: https://vercel.com/versatiglass/deployments
- Functions logs: Realtime no dashboard

**SLA:** 99.99% uptime guarantee

**Alternativas:**

1. **AWS Amplify** ($0.01/build min + $0.15/GB)
2. **Netlify** ($19/mês - similar ao Vercel)
3. **DigitalOcean App Platform** ($5-12/mês)

---

### 2.2 Railway (PostgreSQL)

**Propósito:** Database PostgreSQL 14+ gerenciado

**Plano Recomendado:**

- **Hobby Plan** ($5/mês) - Para MVP
  - 8 GB storage
  - 8 GB RAM
  - Shared CPU
  - 100 GB bandwidth

- **Pro Plan** ($20/mês base + usage) - Para produção
  - 100 GB storage
  - 32 GB RAM
  - 8 vCPUs
  - 500 GB bandwidth
  - Daily backups automáticos

**Setup:**

```bash
# 1. Criar projeto no Railway Dashboard
# 2. Add PostgreSQL service
# 3. Copiar DATABASE_URL

# 4. Conectar localmente
psql $DATABASE_URL

# 5. Aplicar schema Prisma
pnpm db:push

# 6. Seed inicial
pnpm db:seed:test
```

**Connection String Format:**

```
postgresql://user:password@host.railway.app:5432/railway
```

**Monitoring:**

- CPU/Memory: Railway Dashboard
- Query performance: `pg_stat_statements`
- Slow queries: Railway Logs

**Backup Strategy:**

```bash
# Manual backup (via Railway CLI)
railway pg:dump > backup-$(date +%Y%m%d).sql

# Restore
railway pg:restore < backup-20241217.sql
```

**SLA:** 99.9% uptime

**Alternativas:**

1. **Supabase** ($25/mês - PostgreSQL + Auth + Storage)
2. **Neon** ($19/mês - Serverless PostgreSQL)
3. **AWS RDS** ($15-50/mês)
4. **DigitalOcean Managed DB** ($15/mês)

---

### 2.3 Stripe (Pagamentos)

**Propósito:** Processamento de pagamentos PIX + Cartão de Crédito

**Pricing:**

- **PIX:** 0.8% por transação (max R$ 5,00)
- **Cartão de Crédito:** 3.99% + R$ 0.59
- **Boleto:** 3.99% (max R$ 5,00)
- Sem taxa mensal fixa

**Setup:**

```bash
# 1. Criar conta em https://stripe.com
# 2. Ativar modo Produção (requer dados da empresa)
# 3. Configurar método de pagamento PIX no Dashboard

# 4. Obter chaves API
# Dashboard > Developers > API Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# 5. Configurar Webhook
# URL: https://versatiglass.com.br/api/payments/webhook
# Events: payment_intent.succeeded, payment_intent.payment_failed
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Webhook Testing (Local):**

```bash
# 1. Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# 2. Login
stripe login

# 3. Forward webhooks
stripe listen --forward-to localhost:3000/api/payments/webhook
```

**Documentos Necessários:**

- CNPJ da empresa
- Contrato social
- Comprovante de endereço
- Documento de identificação (RG/CPH do representante)
- Dados bancários para recebimento

**Compliance:**

- PCI-DSS Level 1 compliant (Stripe gerencia)
- LGPD compliant (não armazenar dados de cartão)
- Anti-fraud: Stripe Radar (grátis)

**SLA:** 99.99% uptime

**Alternativas:**

1. **Mercado Pago** (2.99% + R$ 0.39 - mais popular no Brasil)
2. **PagSeguro** (similar ao Mercado Pago)
3. **Asaas** (R$ 0.59 - ótimo para pequenas empresas)

---

## 3. INTEGRAÇÕES DE IA

### 3.1 Groq (Conversational AI)

**Propósito:** WhatsApp Bot conversacional 24/7

**Pricing:**

- **FREE Tier:**
  - 14,400 requests/day (600/hora)
  - 3.5M tokens/day input
  - 300K tokens/day output
  - Llama 3.3 70B (590 tokens/sec)

- **Pay-as-you-go** (se exceder free tier):
  - $0.59/million tokens input
  - $0.79/million tokens output

**Setup:**

```bash
# 1. Criar conta: https://console.groq.com
# 2. Gerar API Key
GROQ_API_KEY=gsk_...

# 3. Testar conexão
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

**Modelos Disponíveis:**

- **llama-3.3-70b-versatile** (RECOMENDADO - 128K context)
- llama-3.1-8b-instant (Fast, 8K context)
- mixtral-8x7b-32768 (Bom em português)

**Rate Limits (Free Tier):**

- 600 requests/minuto
- 30 requests/segundo
- Burst: 100 requests/segundo (5s)

**Monitoring:**

- Dashboard: https://console.groq.com/usage
- Logs: Via aplicação (src/services/ai.ts)

**Alternativas:**

1. **Together AI** ($0.20/M tokens - Llama 70B)
2. **Anthropic Claude** ($3/M tokens - melhor qualidade)
3. **Google Gemini** ($0.50/M tokens - FREE tier limitado)

---

### 3.2 OpenAI (Vision AI)

**Propósito:** Análise de imagens em orçamentos (detectar tipo de vidro, medidas)

**Pricing:**

- **GPT-4 Vision:** $0.01/imagem (1024x1024)
- **GPT-4o:** $2.50/M tokens input + $10/M output
- FREE tier: $5 créditos iniciais

**Setup:**

```bash
# 1. Criar conta: https://platform.openai.com
# 2. Gerar API Key
OPENAI_API_KEY=sk-proj-...

# 3. Configurar organização (opcional)
OPENAI_ORG_ID=org-...
```

**Uso Estimado:**

- ~50 análises de imagens/mês = $0.50/mês
- ~1000 análises = $10/mês

**Alternativas:**

1. **Anthropic Claude Vision** ($3/M tokens - melhor acurácia)
2. **Google Gemini Vision** ($0.50/M tokens)
3. **LLaVA (open-source)** - FREE, self-hosted

---

## 4. PAGAMENTOS E TRANSAÇÕES

### 4.1 Stripe (Ver Seção 2.3)

### 4.2 Métodos de Pagamento

**PIX (Recomendado para Brasil):**

- ✅ Taxa menor (0.8%)
- ✅ Confirmação instantânea
- ✅ Sem estorno fácil (mais seguro)
- ✅ Popular no Brasil (90%+ dos brasileiros)

**Cartão de Crédito:**

- ✅ Parcelamento (até 12x)
- ✅ Aceito internacionalmente
- ⚠️ Taxa maior (3.99%)
- ⚠️ Risco de estorno

**Boleto (Opcional):**

- ✅ Não precisa de conta bancária
- ⚠️ Compensação em 1-3 dias úteis
- ⚠️ Taxa de 3.99%

---

## 5. COMUNICAÇÃO

### 5.1 Twilio (WhatsApp Business)

**Propósito:** Envio/recebimento de mensagens WhatsApp

**Pricing:**

- **WhatsApp Business API:**
  - Mensagens iniciadas pela empresa: $0.005-0.02/msg (varia por país)
  - Mensagens iniciadas pelo cliente: FREE (primeiras 24h)
  - Brasil: ~R$ 0.10/mensagem

**Setup:**

```bash
# 1. Criar conta: https://www.twilio.com
# 2. Ativar WhatsApp Business API
# 3. Configurar número de teste (+1415)

TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+14155238886

# 4. Configurar Webhook
# URL: https://versatiglass.com.br/api/whatsapp/webhook
# Method: POST
```

**Uso Estimado:**

- ~500 conversas/mês = $5-10/mês
- ~2000 conversas/mês = $20-40/mês

**WhatsApp Business Requirements:**

- Meta Business Account
- Número de telefone dedicado
- Documento da empresa (CNPJ)
- Aprovação do template de mensagens

**Alternativas:**

1. **Vonage (Nexmo)** - Similar pricing
2. **MessageBird** - Mais barato na Europa
3. **WhatsApp Business App** - FREE mas manual

---

### 5.2 Resend (Transactional Email)

**Propósito:** Envio de emails transacionais (confirmações, orçamentos, etc)

**Pricing:**

- **FREE Tier:** 100 emails/dia (3K/mês)
- **Pro Plan:** $20/mês (50K emails)

**Setup:**

```bash
# 1. Criar conta: https://resend.com
# 2. Adicionar domínio

# 3. Configurar DNS (Records)
TXT: resend._domainkey.versatiglass.com.br
CNAME: resend.versatiglass.com.br

# 4. Gerar API Key
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@versatiglass.com.br
```

**Templates Usados:**

- Confirmação de cadastro
- Orçamento enviado
- Pedido confirmado
- Agendamento de instalação
- Recuperação de senha

**Monitoring:**

- Dashboard: https://resend.com/emails
- Deliverability: 99%+ (DKIM/SPF)

**Alternativas:**

1. **SendGrid** ($19.95/mês - 50K emails)
2. **Postmark** ($15/mês - 10K emails, melhor deliverability)
3. **AWS SES** ($0.10/1K emails - mais barato mas requer setup)

---

## 6. ARMAZENAMENTO E CDN

### 6.1 Cloudflare R2 (Object Storage)

**Propósito:** Upload de imagens de produtos, documentos de clientes

**Pricing:**

- **FREE Tier:**
  - 10 GB storage
  - 1 million Class A operations/month
  - 10 million Class B operations/month
  - FREE egress (bandwidth)

- **Paid:**
  - $0.015/GB storage
  - No egress fees (grande vantagem vs S3)

**Setup:**

```bash
# 1. Criar conta Cloudflare
# 2. Criar R2 bucket

# 3. Gerar API token
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=versatiglass-uploads

# 4. Configurar custom domain (opcional)
R2_PUBLIC_URL=https://uploads.versatiglass.com.br
```

**Uso Estimado:**

- ~500 MB/mês = FREE
- ~5 GB/mês = $0.08/mês

**Alternativas:**

1. **AWS S3** ($0.023/GB + egress fees)
2. **Backblaze B2** ($0.005/GB + $0.01/GB egress)
3. **Vercel Blob** ($0.15/GB - integrado mas caro)

---

## 7. ANALYTICS E TRACKING

### 7.1 Google Analytics 4

**Propósito:** Web analytics, tracking de conversões

**Pricing:** FREE (até 10M events/mês)

**Setup:**

```bash
# 1. Criar propriedade GA4
# 2. Obter Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# 3. Configurar Google Tag Manager (opcional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Events Tracked:**

- Page views
- Quote requests
- Form submissions
- Button clicks
- Conversions (purchases)

**Alternativas:**

1. **Plausible** ($9/mês - privacy-focused)
2. **Mixpanel** (FREE até 100K users - melhor para produto)
3. **PostHog** ($0.00031/event - open-source)

---

### 7.2 Meta Pixel (Facebook/Instagram Ads)

**Propósito:** Retargeting de anúncios, tracking de conversões

**Pricing:** FREE (paga apenas anúncios no Meta Ads)

**Setup:**

```bash
# 1. Criar Pixel no Meta Business Suite
# 2. Obter Pixel ID
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
```

**Events Tracked:**

- PageView
- ViewContent (produtos)
- InitiateCheckout (orçamento)
- Purchase (pedido pago)

---

## 8. INFRAESTRUTURA

### 8.1 Resumo de Serviços

| Serviço        | Propósito        | Tier  | Custo/mês |
| -------------- | ---------------- | ----- | --------- |
| **Vercel**     | Next.js hosting  | Hobby | $20       |
| **Railway**    | PostgreSQL 14    | Hobby | $5        |
| **Cloudflare** | DNS + R2 Storage | FREE  | $0        |
| **GitHub**     | Git + Actions CI | FREE  | $0        |

**Total Infraestrutura:** $25/mês

---

## 9. DEPENDÊNCIAS NPM CRÍTICAS

### 9.1 Core Framework

```json
{
  "next": "^14.2.18", // Next.js App Router
  "react": "^18.3.1", // React 18
  "typescript": "^5.7.2" // TypeScript 5.7
}
```

**Versão fixa** - Não atualizar sem testes extensivos.

---

### 9.2 Database & ORM

```json
{
  "@prisma/client": "^6.1.0", // Prisma Client
  "prisma": "^6.1.0" // Prisma CLI
}
```

**Breaking changes** - Sempre ler CHANGELOG antes de atualizar.

---

### 9.3 Authentication

```json
{
  "next-auth": "^5.0.0-beta.25", // NextAuth v5 (beta)
  "@auth/prisma-adapter": "^2.7.4",
  "bcryptjs": "^2.4.3"
}
```

**NextAuth v5 beta** - API estável mas ainda em beta.

---

### 9.4 AI/ML

```json
{
  "groq-sdk": "^0.37.0", // Groq API
  "openai": "^6.9.1", // OpenAI API
  "@anthropic-ai/sdk": "^0.71.2" // Claude API (backup)
}
```

---

### 9.5 Payments

```json
{
  "stripe": "^17.5.0", // Stripe Server SDK
  "@stripe/stripe-js": "^5.2.0" // Stripe Client SDK
}
```

---

### 9.6 Communication

```json
{
  "twilio": "^5.5.0", // Twilio WhatsApp
  "resend": "^6.6.0" // Resend Email
}
```

---

### 9.7 UI Components

```json
{
  "@radix-ui/react-dialog": "^1.1.4",
  "@radix-ui/react-dropdown-menu": "^2.1.5",
  "lucide-react": "^0.468.0",
  "tailwindcss": "^3.4.17",
  "framer-motion": "^11.15.0"
}
```

---

### 9.8 Testing

```json
{
  "@playwright/test": "^1.57.0", // E2E testing
  "vitest": "^4.0.15" // Unit testing
}
```

---

## 10. SLAS E DISPONIBILIDADE

### 10.1 Garantias de Uptime

| Fornecedor     | SLA    | Downtime Permitido/Mês | Compensação            |
| -------------- | ------ | ---------------------- | ---------------------- |
| **Vercel**     | 99.99% | 4.38 minutos           | Créditos proporcionais |
| **Railway**    | 99.9%  | 43.8 minutos           | Créditos proporcionais |
| **Stripe**     | 99.99% | 4.38 minutos           | N/A (serviço crítico)  |
| **Groq**       | 99.9%  | 43.8 minutos           | N/A (free tier)        |
| **Twilio**     | 99.95% | 21.9 minutos           | Créditos proporcionais |
| **Cloudflare** | 99.99% | 4.38 minutos           | Créditos proporcionais |

---

### 10.2 Monitoramento de Status

**Status Pages:**

- Vercel: https://www.vercel-status.com
- Railway: https://railway.statuspage.io
- Stripe: https://status.stripe.com
- Groq: https://status.groq.com
- Twilio: https://status.twilio.com
- Cloudflare: https://www.cloudflarestatus.com

**Alertas:**

```bash
# Configurar alertas via Vercel
# Dashboard > Settings > Notifications
# - Deploy failures
# - Function errors
# - High response time (>2s)
```

---

## 11. MATRIZ DE CUSTOS

### 11.1 Cenário MVP (até 100 clientes/mês)

| Fornecedor       | Plano         | Custo/mês   | Justificativa           |
| ---------------- | ------------- | ----------- | ----------------------- |
| Vercel           | Hobby         | $20         | Hosting Next.js         |
| Railway          | Hobby         | $5          | PostgreSQL              |
| Groq             | FREE          | $0          | Chat IA (600 req/hora)  |
| OpenAI           | Pay-as-you-go | $10         | ~500 análises imagem    |
| Resend           | FREE          | $0          | <100 emails/dia         |
| Twilio           | Pay-as-you-go | $20         | ~500 mensagens WhatsApp |
| Stripe           | Pay-as-you-go | 2.99%       | Apenas quando há venda  |
| Cloudflare R2    | FREE          | $0          | <10 GB storage          |
| Google Analytics | FREE          | $0          | Analytics               |
| Meta Pixel       | FREE          | $0          | Retargeting             |
| **TOTAL**        |               | **$55/mês** | + taxas transacionais   |

---

### 11.2 Cenário Crescimento (500-1000 clientes/mês)

| Fornecedor    | Plano         | Custo/mês    | Justificativa          |
| ------------- | ------------- | ------------ | ---------------------- |
| Vercel        | Pro           | $20/usuário  | Advanced analytics     |
| Railway       | Pro           | $30          | 32 GB RAM, backups     |
| Groq          | FREE          | $0           | Ainda dentro do limite |
| OpenAI        | Pay-as-you-go | $40          | ~2K análises imagem    |
| Resend        | Pro           | $20          | 50K emails             |
| Twilio        | Pay-as-you-go | $80          | ~2K mensagens          |
| Stripe        | Pay-as-you-go | 2.99%        | Por transação          |
| Cloudflare R2 | Paid          | $5           | ~30 GB storage         |
| **TOTAL**     |               | **$195/mês** | + taxas transacionais  |

---

### 11.3 Cenário Escala (5000+ clientes/mês)

| Fornecedor    | Plano         | Custo/mês    | Justificativa         |
| ------------- | ------------- | ------------ | --------------------- |
| Vercel        | Enterprise    | $150+        | Custom pricing        |
| Railway       | Pro           | $100+        | Dedicated DB          |
| Groq          | Paid          | $50          | Excesso do free tier  |
| OpenAI        | Pay-as-you-go | $150         | ~10K análises         |
| Resend        | Business      | $100         | 250K emails           |
| Twilio        | Pay-as-you-go | $300         | ~10K mensagens        |
| Stripe        | Pay-as-you-go | 2.99%        | Por transação         |
| Cloudflare R2 | Paid          | $20          | ~100 GB storage       |
| **TOTAL**     |               | **$870/mês** | + taxas transacionais |

---

## 12. PLANO DE CONTINGÊNCIA

### 12.1 Vercel Down

**Impacto:** 🔴 CRÍTICO - Site inteiro fora do ar

**Detecção:**

```bash
# Healthcheck externo (UptimeRobot)
curl https://versatiglass.com.br/api/health
```

**Resposta:**

1. **Verificar status:** https://www.vercel-status.com
2. **Página estática de manutenção** (Cloudflare Pages backup)
3. **Migração emergencial para Netlify** (30 min setup)

**Prevenção:**

- Deploy automático para Netlify (secondary)
- Static fallback page no Cloudflare

---

### 12.2 Railway Down

**Impacto:** 🔴 CRÍTICO - Todas as operações de database

**Detecção:**

```bash
# Connection test
psql $DATABASE_URL -c "SELECT 1;"
```

**Resposta:**

1. **Verificar status:** https://railway.statuspage.io
2. **Read-only mode** - Mostrar mensagem "Manutenção"
3. **Restore do backup** para Supabase (1-2h)

**Prevenção:**

- Daily backups automáticos
- Backup manual semanal para S3
- Réplica read-only (opcional, $20/mês)

---

### 12.3 Stripe Down

**Impacto:** 🔴 CRÍTICO - Pagamentos não processam

**Detecção:**

```bash
# Stripe API test
curl https://api.stripe.com/v1/balance \
  -u $STRIPE_SECRET_KEY:
```

**Resposta:**

1. **Verificar status:** https://status.stripe.com
2. **Fallback para PIX manual** - Gerar QR code interno
3. **Email aos clientes** - Avisar sobre instabilidade

**Prevenção:**

- Multi-gateway (adicionar Mercado Pago como backup)
- Queue de pagamentos (processar quando voltar)

---

### 12.4 Groq Down

**Impacto:** 🟡 MÉDIO - WhatsApp Bot não responde

**Detecção:**

```bash
# Groq API test
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

**Resposta:**

1. **Verificar status:** https://status.groq.com
2. **Fallback para Anthropic Claude** (src/services/ai.ts)
3. **Mensagem automática:** "Estamos com alta demanda..."

**Prevenção:**

- Multi-LLM support (Groq → Claude → OpenAI)
- Resposta padrão em caso de falha

---

## 13. CHECKLIST DE ONBOARDING

### 13.1 Setup Inicial de Fornecedores

**Pré-requisitos:**

- [ ] CNPJ da empresa registrado
- [ ] Domínio versatiglass.com.br configurado
- [ ] Cartão de crédito para pagamentos (backup)
- [ ] Email corporativo configurado

---

### 13.2 Infraestrutura (30 min)

**Vercel:**

- [ ] Criar conta Vercel
- [ ] Conectar repositório GitHub
- [ ] Configurar domínio custom
- [ ] Adicionar environment variables
- [ ] Deploy de teste

**Railway:**

- [ ] Criar conta Railway
- [ ] Criar projeto PostgreSQL
- [ ] Copiar `DATABASE_URL`
- [ ] Configurar variáveis no Vercel
- [ ] Executar `pnpm db:push`

**Cloudflare:**

- [ ] Criar conta Cloudflare
- [ ] Adicionar domínio versatiglass.com.br
- [ ] Configurar DNS records
- [ ] Criar R2 bucket
- [ ] Gerar API tokens

---

### 13.3 IA e ML (20 min)

**Groq:**

- [ ] Criar conta: https://console.groq.com
- [ ] Gerar API key
- [ ] Testar conexão
- [ ] Adicionar ao Vercel env

**OpenAI:**

- [ ] Criar conta: https://platform.openai.com
- [ ] Adicionar $10 créditos
- [ ] Gerar API key
- [ ] Testar GPT-4 Vision
- [ ] Adicionar ao Vercel env

---

### 13.4 Pagamentos (1-2 dias)

**Stripe:**

- [ ] Criar conta Stripe
- [ ] Ativar modo Produção
- [ ] Enviar documentos (CNPJ, contrato social, etc)
- [ ] Configurar PIX como método
- [ ] Gerar API keys
- [ ] Configurar webhook
- [ ] Testar pagamento de teste

---

### 13.5 Comunicação (1 hora)

**Twilio:**

- [ ] Criar conta Twilio
- [ ] Ativar WhatsApp Business API
- [ ] Configurar número de teste
- [ ] Gerar Account SID e Auth Token
- [ ] Configurar webhook
- [ ] Testar mensagem

**Resend:**

- [ ] Criar conta Resend
- [ ] Adicionar domínio
- [ ] Configurar DNS (SPF, DKIM)
- [ ] Gerar API key
- [ ] Testar email

---

### 13.6 Analytics (15 min)

**Google Analytics:**

- [ ] Criar propriedade GA4
- [ ] Copiar Measurement ID
- [ ] Adicionar ao Vercel env
- [ ] Testar eventos

**Meta Pixel:**

- [ ] Criar Pixel no Meta Business Suite
- [ ] Copiar Pixel ID
- [ ] Adicionar ao Vercel env
- [ ] Testar eventos

---

### 13.7 Validação Final (30 min)

**Testes de Integração:**

- [ ] Homepage carrega
- [ ] Login funciona
- [ ] Criação de orçamento funciona
- [ ] WhatsApp Bot responde
- [ ] Email é enviado
- [ ] Pagamento PIX funciona
- [ ] Analytics trackeando

**Monitoramento:**

- [ ] Configurar alertas Vercel
- [ ] Configurar UptimeRobot
- [ ] Documentar credenciais (1Password)

---

## 📞 SUPORTE DE FORNECEDORES

### Contatos de Emergência

| Fornecedor  | Suporte            | Response Time | Link                       |
| ----------- | ------------------ | ------------- | -------------------------- |
| **Vercel**  | support@vercel.com | 24h           | https://vercel.com/support |
| **Railway** | Discord/Email      | 12h           | https://railway.app/help   |
| **Stripe**  | Chat/Email         | Instant       | https://support.stripe.com |
| **Groq**    | Discord            | 24h           | https://groq.com/discord   |
| **Twilio**  | support@twilio.com | 24h           | https://support.twilio.com |

---

## 🔗 REFERÊNCIAS

- [Integrations Guide](./17_INTEGRACOES.md) - Documentação técnica de integrações
- [Deploy Guide](./18_DEPLOY_GUIDE.md) - Guia completo de deploy
- [Technical Architecture](./05_TECHNICAL_ARCHITECTURE.md) - Arquitetura do sistema

---

**🔷 Versati Glass - Fornecedores técnicos documentados e organizados**
