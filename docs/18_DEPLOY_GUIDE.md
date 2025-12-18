# 18. Guia de Deploy

**Versão**: 1.0.0
**Última Atualização**: 17 Dezembro 2024
**Status**: Documentação Completa ✅

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Deploy](#arquitetura-de-deploy)
3. [Pré-requisitos](#pré-requisitos)
4. [Deploy Passo a Passo](#deploy-passo-a-passo)
5. [Configuração de Ambientes](#configuração-de-ambientes)
6. [Banco de Dados](#banco-de-dados)
7. [Integrações de Terceiros](#integrações-de-terceiros)
8. [CI/CD](#cicd)
9. [Monitoramento](#monitoramento)
10. [Troubleshooting](#troubleshooting)
11. [Rollback](#rollback)
12. [Checklist de Produção](#checklist-de-produção)

---

## Visão Geral

Este guia documenta o processo completo de deploy da plataforma Versati Glass, desde o ambiente de desenvolvimento até a produção.

### Stack de Infraestrutura

| Componente            | Tecnologia            | Ambiente           |
| --------------------- | --------------------- | ------------------ |
| **Aplicação Next.js** | Vercel                | Produção + Preview |
| **Banco de Dados**    | PostgreSQL (Railway)  | Produção + Dev     |
| **DNS & CDN**         | Cloudflare (opcional) | Produção           |
| **Email**             | Resend                | Produção           |
| **WhatsApp**          | Twilio                | Produção           |
| **IA (Chat)**         | Groq (Llama)          | Produção           |
| **IA (Vision)**       | OpenAI (GPT-4o)       | Produção           |
| **Storage (futuro)**  | Cloudflare R2         | Planejado          |

### Ambientes

| Ambiente        | URL                                 | Branch     | Deploy     |
| --------------- | ----------------------------------- | ---------- | ---------- |
| **Development** | http://localhost:3000               | N/A        | Manual     |
| **Preview**     | https://versatiglass-\*.vercel.app  | feature/\* | Automático |
| **Staging**     | https://staging.versatiglass.com.br | develop    | Automático |
| **Production**  | https://versatiglass.com.br         | main       | Manual     |

---

## Arquitetura de Deploy

```
┌─────────────────────────────────────────────────────┐
│                   USUÁRIOS                          │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│              CLOUDFLARE CDN (opcional)              │
│  - DNS Management                                   │
│  - DDoS Protection                                  │
│  - SSL/TLS                                          │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│                VERCEL (Next.js App)                 │
│  - Edge Network (CDN global)                        │
│  - Serverless Functions                             │
│  - Automatic HTTPS                                  │
│  - Preview Deployments                              │
└─────┬────────┬──────────┬──────────────────────────┘
      │        │          │
      ▼        ▼          ▼
   ┌────┐  ┌─────┐   ┌─────────┐
   │APIs│  │Cron │   │Webhooks │
   └─┬──┘  └──┬──┘   └────┬────┘
     │        │           │
     │        └───────────┤
     ▼                    ▼
┌──────────────────────────────────────┐
│     RAILWAY (PostgreSQL + Prisma)    │
│  - Managed PostgreSQL                │
│  - Auto Backups                      │
│  - Vertical Scaling                  │
└──────────────────────────────────────┘

EXTERNAL SERVICES:
┌────────────┐  ┌───────────┐  ┌──────────┐
│   Groq     │  │  OpenAI   │  │  Resend  │
│  (Llama)   │  │ (GPT-4o)  │  │  (Email) │
└────────────┘  └───────────┘  └──────────┘
┌────────────┐  ┌───────────┐
│   Twilio   │  │  Stripe   │
│ (WhatsApp) │  │   ($$)    │
└────────────┘  └───────────┘
```

---

## Pré-requisitos

### Ferramentas Necessárias

- **Node.js**: ≥ 20.0.0 (LTS recomendado)
- **pnpm**: ≥ 8.0.0 (gerenciador de pacotes)
- **Git**: Para controle de versão
- **Vercel CLI**: Para deploys manuais
- **Railway CLI**: Para gerenciar banco de dados
- **Prisma CLI**: Incluído no projeto

### Instalação das Ferramentas

```bash
# Node.js (via nvm - recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm@latest

# Vercel CLI
pnpm install -g vercel

# Railway CLI
npm install -g @railway/cli

# Verificar versões
node -v    # v20.x.x
pnpm -v    # 10.x.x
vercel -v  # Vercel CLI x.x.x
```

### Contas Necessárias

- [x] GitHub account (para repositório)
- [x] Vercel account (deploy da aplicação)
- [x] Railway account (PostgreSQL)
- [x] Groq account (IA - gratuito)
- [x] OpenAI account (IA - requer créditos)
- [x] Resend account (email - gratuito até 3k/mês)
- [ ] Twilio account (WhatsApp - sandbox gratuito)
- [ ] Stripe account (pagamentos - quando implementar)
- [ ] Cloudflare account (DNS/CDN - opcional)

---

## Deploy Passo a Passo

### 1. Preparar Repositório

```bash
# Clone o repositório
git clone https://github.com/versatiglass/versatiglass.git
cd versatiglass

# Instalar dependências
pnpm install

# Verificar se tudo está OK
pnpm type-check
pnpm lint
pnpm test:run
```

### 2. Configurar Banco de Dados (Railway)

#### 2.1. Criar Projeto no Railway

1. Acesse: https://railway.app/
2. Clique em "New Project"
3. Selecione "Provision PostgreSQL"
4. Anote a `DATABASE_URL` fornecida

#### 2.2. Configurar Localmente

```bash
# Criar .env.local (nunca commitar!)
cp .env.example .env.local

# Editar .env.local com a DATABASE_URL do Railway
DATABASE_URL="postgresql://user:pass@host.railway.app:5432/dbname?sslmode=require"
```

#### 2.3. Rodar Migrations

```bash
# Gerar Prisma Client
pnpm db:generate

# Aplicar migrations
pnpm db:push

# (Opcional) Seed do banco de dados
pnpm db:seed

# Verificar no Prisma Studio
pnpm db:studio
```

### 3. Configurar Variáveis de Ambiente

#### 3.1. Variáveis Locais (.env.local)

```bash
# ============================================================================
# DATABASE
# ============================================================================
DATABASE_URL="postgresql://user:password@host.railway.app:5432/db?sslmode=require"

# ============================================================================
# AUTH
# ============================================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID=""  # Opcional
GOOGLE_CLIENT_SECRET=""  # Opcional

# ============================================================================
# AI - GROQ (GRATUITO)
# ============================================================================
GROQ_API_KEY="gsk_..."

# ============================================================================
# AI - OPENAI (PAGO - requer créditos)
# ============================================================================
OPENAI_API_KEY="sk-proj-..."

# ============================================================================
# EMAIL - RESEND
# ============================================================================
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@versatiglass.com.br"

# ============================================================================
# WHATSAPP - TWILIO
# ============================================================================
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="+14155238886"

# ============================================================================
# CRON JOBS
# ============================================================================
CRON_SECRET="generate-with-openssl-rand-base64-32"

# ============================================================================
# APP
# ============================================================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="+5521982536229"
```

#### 3.2. Gerar Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -base64 32
```

### 4. Testar Localmente

```bash
# Rodar em desenvolvimento
pnpm dev

# Acessar: http://localhost:3000

# Testar build de produção
pnpm build
pnpm start
```

#### 4.1. Verificações Locais

- [ ] Homepage carrega corretamente
- [ ] Login/Registro funcionam
- [ ] Chat IA responde (Groq)
- [ ] Upload de imagem analisa (OpenAI)
- [ ] Wizard de orçamento funciona
- [ ] Portal do cliente acessa
- [ ] Admin dashboard acessa
- [ ] Emails são enviados (Resend)
- [ ] Migrations aplicadas (Prisma)

### 5. Deploy para Vercel

#### 5.1. Via Vercel Dashboard (Recomendado)

1. Acesse: https://vercel.com/new
2. Importe o repositório GitHub
3. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `pnpm build` (padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `pnpm install` (padrão)
   - **Node Version**: 20.x

4. Adicione as variáveis de ambiente (ver seção abaixo)
5. Clique em "Deploy"

#### 5.2. Via Vercel CLI (Alternativa)

```bash
# Login na Vercel
vercel login

# Deploy (primeira vez)
vercel

# Deploy para produção
vercel --prod
```

### 6. Configurar Variáveis de Ambiente na Vercel

**Importante**: Configure TODAS as variáveis em **Settings → Environment Variables**

#### 6.1. Variáveis de Produção

```bash
# DATABASE
DATABASE_URL="postgresql://user:pass@host.railway.app:5432/db?sslmode=require"

# AUTH
NEXTAUTH_URL="https://versatiglass.com.br"
NEXTAUTH_SECRET="seu-secret-gerado-com-openssl"
GOOGLE_CLIENT_ID=""  # Se usar Google OAuth
GOOGLE_CLIENT_SECRET=""

# AI
GROQ_API_KEY="gsk_..."
OPENAI_API_KEY="sk-proj-..."

# EMAIL
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@versatiglass.com.br"

# WHATSAPP
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="whatsapp:+5521982536229"

# CRON
CRON_SECRET="seu-cron-secret-gerado"

# APP
NEXT_PUBLIC_APP_URL="https://versatiglass.com.br"
NEXT_PUBLIC_BASE_URL="https://versatiglass.com.br"
NEXT_PUBLIC_WHATSAPP_NUMBER="+5521982536229"
```

#### 6.2. Configurar por Ambiente

- **Production**: Apenas branch `main`
- **Preview**: Todas as branches (menos `main`)
- **Development**: Local apenas

### 7. Configurar Domínio

#### 7.1. Adicionar Domínio na Vercel

1. Vercel Dashboard → Settings → Domains
2. Adicione `versatiglass.com.br`
3. Configure DNS:

```dns
# Se usar Vercel DNS
CNAME  @     cname.vercel-dns.com.
CNAME  www   cname.vercel-dns.com.
```

```dns
# Se usar Cloudflare
CNAME  @     versatiglass.vercel.app
CNAME  www   versatiglass.vercel.app

# Ative "Proxy" (orange cloud)
```

#### 7.2. SSL/TLS Automático

- Vercel provisiona SSL automaticamente via Let's Encrypt
- Aguarde 1-5 minutos para propagação
- Teste: https://versatiglass.com.br

### 8. Configurar Cron Jobs

#### 8.1. Criar vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/expire-quotes",
      "schedule": "0 0 * * *"
    }
  ]
}
```

#### 8.2. Proteger Endpoints

```typescript
// src/app/api/cron/reminders/route.ts
export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Execute cron logic
  // ...
}
```

### 9. Configurar Webhooks

#### 9.1. Twilio WhatsApp Webhook

**URL**: `https://versatiglass.com.br/api/whatsapp/webhook`

1. Twilio Console → Messaging → Settings → WhatsApp Sandbox
2. "When a message comes in": `POST https://versatiglass.com.br/api/whatsapp/webhook`

#### 9.2. Stripe Webhook (quando implementar)

**URL**: `https://versatiglass.com.br/api/payments/webhook`

1. Stripe Dashboard → Developers → Webhooks
2. Adicione endpoint
3. Selecione eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.failed`
4. Copie `STRIPE_WEBHOOK_SECRET`

---

## Configuração de Ambientes

### Desenvolvimento (Local)

```bash
# .env.local
DATABASE_URL="postgresql://localhost:5432/versatiglass"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Preview (Vercel)

- Deploy automático em cada PR
- URL: `https://versatiglass-git-{branch}-{team}.vercel.app`
- Usa mesma `DATABASE_URL` de produção (cuidado!)
- Ideal: usar banco de dados separado para preview

### Staging (Opcional)

```bash
# Branch: develop
# URL: https://staging.versatiglass.com.br
# DATABASE_URL: banco separado para staging
```

### Produção

```bash
# Branch: main
# URL: https://versatiglass.com.br
# DATABASE_URL: Railway production
```

---

## Banco de Dados

### Migrations em Produção

```bash
# Via Railway CLI (recomendado)
railway login
railway link  # Link to project
railway run pnpm prisma migrate deploy

# Via script (alternativa)
pnpm db:push  # Push schema (sem criar migration)
```

### Backup e Restore

#### Backup Automático (Railway)

- Railway faz backup automático diário
- Retenção: 7 dias (hobby), 30 dias (pro)
- Acesse: Railway Dashboard → Database → Backups

#### Backup Manual

```bash
# Via Railway CLI
railway db backup create

# Via pg_dump
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20241217.sql
```

### Monitoramento do Banco

```bash
# Verificar conexões ativas
SELECT count(*) FROM pg_stat_activity;

# Tamanho do banco
SELECT pg_size_pretty(pg_database_size('versatiglass'));

# Tabelas maiores
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
```

---

## Integrações de Terceiros

### Verificar Health de Integrações

```bash
# Criar endpoint de health check
# src/app/api/health/route.ts

export async function GET() {
  const checks = {
    database: await checkDatabase(),
    groq: await checkGroq(),
    openai: await checkOpenAI(),
    resend: await checkResend(),
    twilio: await checkTwilio()
  }

  return Response.json(checks)
}
```

### Groq (IA Chat)

```bash
# Testar API
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"

# Monitorar uso
# https://console.groq.com/usage
```

### OpenAI (IA Vision)

```bash
# Testar API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Verificar créditos
# https://platform.openai.com/usage
```

### Resend (Email)

```bash
# Testar API
curl https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@versatiglass.com.br","to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'

# Monitorar deliverability
# https://resend.com/emails
```

---

## CI/CD

### GitHub Actions (Recomendado)

Criar `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Run tests
        run: pnpm test:run

      - name: Build
        run: pnpm build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

### Vercel Deploy Hooks

**Deploy automático**:

- Push para `main` → Deploy para produção
- Push para outras branches → Preview deployment
- PR aberto → Deploy de preview automático

**Deploy manual**:

```bash
vercel --prod
```

---

## Monitoramento

### Vercel Analytics

1. Ative em: Vercel Dashboard → Analytics
2. Gratuito até 100k pageviews/mês
3. Inclui:
   - Page views
   - Top pages
   - Top referrers
   - Device breakdown
   - Geographic data

### Vercel Logs

```bash
# Via CLI
vercel logs

# Via Dashboard
https://vercel.com/{team}/{project}/logs
```

### Railway Logs

```bash
# Via CLI
railway logs

# Via Dashboard
https://railway.app/project/{id}/service/{id}/logs
```

### Monitoring de Produção

#### 1. Uptime Monitoring

Usar serviços como:

- **UptimeRobot** (gratuito): https://uptimerobot.com/
- **Pingdom** (pago): https://www.pingdom.com/
- **Better Uptime** (freemium): https://betteruptime.com/

Monitorar:

- `https://versatiglass.com.br` (homepage)
- `https://versatiglass.com.br/api/health` (health check)

#### 2. Error Tracking

Considerar adicionar:

- **Sentry** (freemium): https://sentry.io/
- **LogRocket** (pago): https://logrocket.com/

#### 3. Performance Monitoring

- **Vercel Analytics** (incluído)
- **Google Lighthouse** (gratuito)
- **WebPageTest** (gratuito): https://www.webpagetest.org/

---

## Troubleshooting

### Erro: "Module not found"

```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
pnpm install
pnpm build
```

### Erro: "Prisma Client Out of Sync"

```bash
# Regenerar Prisma Client
pnpm db:generate

# Redeploy
vercel --prod
```

### Erro: "Database Connection Failed"

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
pnpm prisma db pull

# Verificar Railway status
railway status
```

### Erro: "Function Timeout"

```typescript
// vercel.json - aumentar timeout
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### Erro: "Out of Memory"

```typescript
// vercel.json - aumentar memória (Pro plan)
{
  "functions": {
    "api/ai/chat/route.ts": {
      "memory": 1024
    }
  }
}
```

### Erro: "Rate Limit Exceeded"

- **Groq**: Aguardar 1 minuto, implementar queue
- **OpenAI**: Upgrade tier, adicionar créditos
- **Resend**: Upgrade plano ou aguardar reset diário

---

## Rollback

### Rollback Imediato (Vercel)

1. Vercel Dashboard → Deployments
2. Encontre deployment anterior estável
3. Click "..." → "Promote to Production"

### Rollback via CLI

```bash
# Listar deployments
vercel ls

# Rollback para deployment específico
vercel rollback {deployment-url}
```

### Rollback de Banco de Dados

```bash
# Via Railway (restore backup)
railway db backup restore {backup-id}

# Via SQL
psql $DATABASE_URL < backup-previous.sql
```

### Rollback de Código

```bash
# Git revert
git revert {commit-hash}
git push origin main

# Força Vercel a redeploy
vercel --prod
```

---

## Checklist de Produção

### Antes do Deploy

- [ ] Todas as migrations aplicadas e testadas
- [ ] `pnpm build` executa sem erros
- [ ] `pnpm lint` passa sem warnings
- [ ] `pnpm type-check` passa sem erros
- [ ] `pnpm test:run` todos os testes passam
- [ ] `.env.example` atualizado com novas variáveis
- [ ] Secrets não estão commitados no Git
- [ ] README.md atualizado

### Configuração Vercel

- [ ] Projeto criado e linked ao repositório
- [ ] Build settings configurados (pnpm, Node 20)
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Domínio adicionado e DNS configurado
- [ ] SSL/TLS ativo e válido
- [ ] Cron jobs configurados (se aplicável)

### Integrações

- [ ] Railway PostgreSQL configurado e acessível
- [ ] Groq API key válida e testada
- [ ] OpenAI API key válida com créditos
- [ ] Resend domínio verificado (SPF + DKIM)
- [ ] Twilio WhatsApp configurado (sandbox ou produção)
- [ ] NextAuth secret gerado e configurado
- [ ] Cron secret gerado e configurado

### Segurança

- [ ] HTTPS funcionando (certificado válido)
- [ ] Middleware de autenticação ativo
- [ ] Rate limiting implementado nas APIs
- [ ] Webhooks com validação de signature
- [ ] Cron endpoints protegidos
- [ ] CORS configurado corretamente
- [ ] CSP headers configurados (se aplicável)

### Monitoramento

- [ ] Vercel Analytics ativado
- [ ] Health check endpoint funcionando
- [ ] Uptime monitor configurado (UptimeRobot/Pingdom)
- [ ] Notificações de erro configuradas
- [ ] Logs de Railway acessíveis

### Performance

- [ ] Images otimizadas (Next.js Image)
- [ ] Lazy loading implementado
- [ ] Bundle size analisado (< 500KB)
- [ ] Lighthouse score > 90
- [ ] Cache headers configurados

### Pós-Deploy

- [ ] Smoke test em produção
- [ ] Testar fluxo completo de orçamento
- [ ] Testar login/registro
- [ ] Testar chat IA
- [ ] Testar envio de email
- [ ] Testar WhatsApp (se ativo)
- [ ] Verificar Analytics funcionando
- [ ] Documentar deployment no CHANGELOG

---

## Comandos Úteis

```bash
# ============================================================================
# LOCAL DEVELOPMENT
# ============================================================================

# Instalar dependências
pnpm install

# Rodar dev server
pnpm dev

# Build local
pnpm build

# Start production build
pnpm start

# Type check
pnpm type-check

# Lint
pnpm lint
pnpm lint:fix

# Tests
pnpm test
pnpm test:run
pnpm test:coverage
pnpm test:e2e

# ============================================================================
# DATABASE (PRISMA)
# ============================================================================

# Gerar Prisma Client
pnpm db:generate

# Push schema (dev)
pnpm db:push

# Create migration
pnpm db:migrate

# Deploy migrations (prod)
pnpm prisma migrate deploy

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Reset database
pnpm db:reset

# ============================================================================
# VERCEL
# ============================================================================

# Login
vercel login

# Link projeto
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Rollback
vercel rollback {url}

# Add environment variable
vercel env add

# ============================================================================
# RAILWAY
# ============================================================================

# Login
railway login

# Link projeto
railway link

# View logs
railway logs

# Create backup
railway db backup create

# Restore backup
railway db backup restore {id}

# ============================================================================
# HEALTH CHECKS
# ============================================================================

# Test Groq API
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"

# Test OpenAI API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Test Resend API
curl https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY"

# Test database connection
pnpm prisma db pull

# Test app health
curl https://versatiglass.com.br/api/health
```

---

## Próximos Passos

1. ✅ Deploy inicial para Vercel (production)
2. ✅ Configurar Railway PostgreSQL
3. ✅ Configurar todas as integrações de API
4. ⏳ Configurar Cloudflare (opcional - CDN + DDoS protection)
5. ⏳ Implementar monitoring completo (Sentry/LogRocket)
6. ⏳ Configurar CI/CD com GitHub Actions
7. 🔜 Implementar staging environment
8. 🔜 Configurar automated backups e disaster recovery

---

## Contato e Suporte

**Equipe DevOps**: devops@versatiglass.com.br
**Documentação**: https://github.com/versatiglass/versatiglass/docs

---

**Mantido por**: Equipe Versati Glass
**Última Revisão**: 17 Dezembro 2024
