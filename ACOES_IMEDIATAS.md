# ⚡ AÇÕES IMEDIATAS - VERSATI GLASS

**Prioridade:** P0 (Crítico)
**Deadline:** 1-2 dias
**Objetivo:** Preparar para deploy em staging

---

## 🎯 AÇÕES CRÍTICAS (HOJE)

### 1. ⏳ Implementar Rate Limiting
**Tempo estimado:** 2-4 horas
**Prioridade:** P0

**Por quê?**
- APIs públicas vulneráveis a DoS
- Proteção contra abuse
- Requirement básico de segurança

**Como implementar:**

```bash
npm install @vercel/edge-rate-limit
```

```typescript
// lib/rate-limit.ts
import { rateLimit } from '@vercel/edge-rate-limit'

export const limiter = rateLimit({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 500,
})

export async function checkRateLimit(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'

  try {
    await limiter.check(5, ip) // 5 requests per minute
  } catch {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60'
      }
    })
  }

  return null
}
```

**Aplicar em:**
- `/api/auth/register`
- `/api/quotes` (POST)
- `/api/appointments` (POST)
- `/api/ai/chat` (POST)

### 2. ⏳ Configurar Monitoring (Sentry)
**Tempo estimado:** 1-2 horas
**Prioridade:** P0

**Por quê?**
- Detectar erros em produção
- Rastrear performance
- Alertas automáticos

**Como implementar:**

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
})

// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

**Configurar variáveis:**
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx
```

### 3. ⏳ Configurar Email Notifications (Resend)
**Tempo estimado:** 3-4 horas
**Prioridade:** P1

**Por quê?**
- Cliente precisa receber confirmações
- Orçamentos precisam ser enviados
- UX crítica

**Como implementar:**

```bash
npm install resend
```

```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendQuoteEmail(to: string, quote: Quote) {
  return resend.emails.send({
    from: 'Versati Glass <orcamento@versatiglass.com.br>',
    to,
    subject: `Orçamento #${quote.number}`,
    html: `
      <h1>Seu orçamento está pronto!</h1>
      <p>Olá ${quote.customerName},</p>
      <p>Preparamos um orçamento especial para você:</p>
      <ul>
        ${quote.items.map(item => `
          <li>${item.description} - R$ ${item.totalPrice}</li>
        `).join('')}
      </ul>
      <p><strong>Valor total: R$ ${quote.total}</strong></p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_URL}/portal/orcamentos/${quote.id}">
          Ver orçamento completo
        </a>
      </p>
    `
  })
}

export async function sendOrderCreatedEmail(to: string, order: Order) {
  // Similar implementation
}
```

**Templates a criar:**
- ✉️ Quote sent
- ✉️ Order created
- ✉️ Status updated
- ✉️ Appointment reminder

**Configurar variável:**
```env
RESEND_API_KEY=re_xxx
```

### 4. ⏳ Adicionar Testes Críticos
**Tempo estimado:** 4-6 horas
**Prioridade:** P1

**Por quê?**
- Prevenir regressões
- Confiança no deploy
- Coverage mínimo

**Como implementar:**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
```

**Testes a criar (prioritários):**

```typescript
// src/__tests__/services/quote.service.test.ts
import { describe, it, expect } from 'vitest'
import { QuoteService } from '@/services/quote.service'

describe('QuoteService', () => {
  it('should calculate total correctly', () => {
    // test implementation
  })

  it('should apply discount', () => {
    // test implementation
  })
})

// src/__tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/lib/utils'

describe('formatCurrency', () => {
  it('should format BRL currency', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
  })
})
```

**Scripts no package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 🚀 PREPARAÇÃO PARA DEPLOY

### 5. ⏳ Checklist Pré-Deploy
**Tempo estimado:** 2-3 horas

**Verificações:**

```bash
# 1. Build passa localmente
npm run build

# 2. Testes passam
npm run test

# 3. Lint passa
npm run lint

# 4. Type check passa
npm run type-check

# 5. Variáveis de ambiente configuradas
cp .env.example .env.production
# Preencher com valores de produção

# 6. Database migration
npx prisma migrate deploy

# 7. Seed database (se necessário)
npx prisma db seed
```

**Variáveis de ambiente essenciais:**
```env
# App
NEXT_PUBLIC_URL=https://versatiglass-staging.vercel.app
NODE_ENV=production

# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_URL=https://versatiglass-staging.vercel.app
NEXTAUTH_SECRET=<gerar com openssl rand -base64 32>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Resend
RESEND_API_KEY=re_...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
```

### 6. ⏳ Deploy em Staging
**Tempo estimado:** 1-2 horas

**Passos:**

1. **Criar projeto no Vercel (se não existe)**
```bash
vercel login
vercel --prod
```

2. **Configurar domínio staging**
- versatiglass-staging.vercel.app
- ou staging.versatiglass.com.br

3. **Configurar variáveis de ambiente no Vercel**
- Settings → Environment Variables
- Copiar do .env.production

4. **Deploy**
```bash
git push origin main
# Auto-deploy configurado
```

5. **Verificar deployment**
- ✅ Build passou
- ✅ Site carregando
- ✅ Database conectado
- ✅ Auth funcionando

### 7. ⏳ Teste Manual Completo
**Tempo estimado:** 2-3 horas

**Fluxos a testar:**

**Fluxo 1: Criar orçamento (público)**
- [ ] Acessar /orcamento
- [ ] Selecionar categoria (Box)
- [ ] Escolher modelo (Elegance)
- [ ] Preencher especificações
- [ ] Upload de foto
- [ ] Preencher endereço
- [ ] Revisar e confirmar
- [ ] Verificar email recebido
- [ ] ✅ Orçamento criado

**Fluxo 2: Login e visualizar orçamento**
- [ ] Acessar /login
- [ ] Login com email/senha
- [ ] Dashboard carrega
- [ ] Ver orçamento criado
- [ ] Aceitar orçamento
- [ ] ✅ Pedido criado

**Fluxo 3: Admin gerenciar pedido**
- [ ] Login admin
- [ ] Ver novo pedido
- [ ] Atualizar status
- [ ] Verificar timeline
- [ ] ✅ Status atualizado

**Fluxo 4: Chat IA**
- [ ] Abrir chat na página de orçamento
- [ ] Conversar com IA
- [ ] Verificar extração de dados
- [ ] ✅ Contexto salvo

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs para Staging
- **Uptime:** > 99%
- **Response Time:** < 1s (p95)
- **Error Rate:** < 1%
- **Conversão Quote → Order:** > 20%
- **User Satisfaction:** > 4/5

### Ferramentas de Monitoramento
- ✅ Vercel Analytics (performance)
- ✅ Sentry (errors)
- ⏳ Better Stack (uptime)
- ⏳ Posthog (analytics)

---

## 🎯 CRITÉRIOS DE ACEITE

### Staging está pronto quando:
- [x] Build passa sem erros
- [ ] Rate limiting implementado
- [ ] Monitoring configurado (Sentry)
- [ ] Email notifications funcionando
- [ ] Testes críticos passando (30%+ coverage)
- [ ] Deploy automatizado
- [ ] Variáveis de ambiente configuradas
- [ ] Database migrado
- [ ] Teste manual completo

### Produção está pronta quando:
- [ ] Beta testing completo (5-10 usuários)
- [ ] Feedback incorporado
- [ ] Sprint 1 concluído
- [ ] Coverage > 60%
- [ ] Lighthouse > 90
- [ ] Performance tuning
- [ ] LGPD compliance
- [ ] Política de privacidade
- [ ] Termos de uso

---

## 🚨 BLOCKERS CONHECIDOS

### 1. ⏳ Twilio WhatsApp não configurado
**Impacto:** Baixo (canal alternativo)
**Solução:** Adiar para Sprint 3
**Workaround:** Email + chat web

### 2. ⏳ Cal.com não integrado
**Impacto:** Médio (agendamento manual)
**Solução:** Adiar para Sprint 2
**Workaround:** Admin agenda manualmente

### 3. ⏳ Stripe não testado em produção
**Impacto:** Médio (pagamentos)
**Solução:** Testar em staging
**Workaround:** Pagamento offline temporariamente

---

## 📞 PRÓXIMOS PASSOS (ORDEM)

### Hoje (Dia 1)
1. ⏳ Implementar rate limiting (2-4h)
2. ⏳ Configurar Sentry (1-2h)
3. ⏳ Configurar Resend (3-4h)

### Amanhã (Dia 2)
4. ⏳ Adicionar testes críticos (4-6h)
5. ⏳ Checklist pré-deploy (2-3h)
6. ⏳ Deploy em staging (1-2h)

### Próxima Semana
7. ⏳ Teste manual completo (2-3h)
8. ⏳ Convidar beta testers (1h)
9. ⏳ Coletar feedback (1 semana)
10. ⏳ Iterar e melhorar (Sprint 1)

---

## ✅ CONCLUSÃO

### Você está aqui: 📍
- ✅ Auditoria completa realizada
- ✅ Issues críticos identificados
- ✅ Plano de ação definido

### Próximo passo: 🎯
**Implementar rate limiting** (2-4 horas)

### Meta final: 🚀
**Deploy em staging em 1-2 dias**
**Launch oficial em 3-4 semanas**

---

**Criado por:** Claude Sonnet 4.5
**Data:** 19/12/2024
**Status:** ⏳ AGUARDANDO EXECUÇÃO
