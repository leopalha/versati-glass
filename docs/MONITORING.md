# 📊 Monitoring & Observability - Versati Glass

**Data:** 16 Dezembro 2024
**Status:** ✅ Configurado

---

## 🎯 Objetivos

1. **Performance Monitoring:** Rastrear métricas de performance em tempo real
2. **Error Tracking:** Capturar e alertar sobre erros
3. **User Analytics:** Entender comportamento dos usuários
4. **Business Metrics:** KPIs e métricas de negócio

---

## 1. Vercel Analytics

### ✅ Já Configurado

Vercel Analytics fornece métricas de performance e Web Vitals automaticamente.

### Recursos Disponíveis

- **Real User Monitoring (RUM):** Métricas de usuários reais
- **Core Web Vitals:** LCP, FID, CLS
- **Geographic Data:** Performance por região
- **Device Breakdown:** Desktop vs Mobile
- **Page Insights:** Performance por página

### Como Acessar

1. Acessar https://vercel.com/dashboard
2. Selecionar projeto "versati-glass"
3. Ir em "Analytics" no menu lateral
4. Ver métricas em tempo real

### Métricas Principais

```typescript
// Core Web Vitals Targets
{
  LCP: < 2.5s,    // Largest Contentful Paint
  FID: < 100ms,   // First Input Delay
  CLS: < 0.1,     // Cumulative Layout Shift
  TTFB: < 600ms,  // Time to First Byte
  FCP: < 1.8s     // First Contentful Paint
}
```

### Dashboard URL

```
https://vercel.com/[team]/versati-glass/analytics
```

---

## 2. Vercel Speed Insights

### Ativação

```bash
# Instalar pacote (já instalado)
pnpm add @vercel/speed-insights

# Já integrado em src/app/layout.tsx
```

### Código de Integração

```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Status

✅ Ativo em produção

---

## 3. Google Analytics 4

### ✅ Já Configurado

Configurado em [src/components/analytics/google-analytics.tsx](../src/components/analytics/google-analytics.tsx)

### ID de Medição

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Eventos Customizados Implementados

```typescript
// Quote Created
gtag('event', 'quote_created', {
  category: 'engagement',
  value: quoteTotal,
  currency: 'BRL',
})

// Quote Approved
gtag('event', 'quote_approved', {
  category: 'conversion',
  value: quoteTotal,
  currency: 'BRL',
})

// Order Placed
gtag('event', 'purchase', {
  transaction_id: orderNumber,
  value: orderTotal,
  currency: 'BRL',
  items: orderItems,
})

// Appointment Scheduled
gtag('event', 'appointment_scheduled', {
  category: 'engagement',
  type: appointmentType,
})
```

### Dashboard GA4

```
https://analytics.google.com/analytics/web/
Property: Versati Glass
```

---

## 4. Google Tag Manager

### ✅ Já Configurado

Configurado em [src/components/analytics/google-tag-manager.tsx](../src/components/analytics/google-tag-manager.tsx)

### Container ID

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Tags Configuradas

1. **Google Analytics 4**
2. **Meta Pixel**
3. **Conversões do Google Ads** (quando ativo)
4. **Hotjar** (opcional)

### Triggers

- Page View
- Form Submit
- Button Click
- Scroll Depth (25%, 50%, 75%, 100%)
- Video Engagement

### Dashboard GTM

```
https://tagmanager.google.com/#/container/accounts/[ACCOUNT_ID]/containers/[CONTAINER_ID]
```

---

## 5. Meta Pixel (Facebook/Instagram)

### ✅ Já Configurado

Configurado em [src/components/analytics/meta-pixel.tsx](../src/components/analytics/meta-pixel.tsx)

### Pixel ID

```env
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXX
```

### Eventos Implementados

```typescript
// Page View (automático)
fbq('track', 'PageView')

// View Content
fbq('track', 'ViewContent', {
  content_name: productName,
  content_category: category,
  content_ids: [productId],
  value: price,
  currency: 'BRL',
})

// Lead
fbq('track', 'Lead', {
  content_name: 'Quote Request',
  value: estimatedValue,
  currency: 'BRL',
})

// Purchase
fbq('track', 'Purchase', {
  value: orderTotal,
  currency: 'BRL',
  content_ids: orderItems.map((i) => i.id),
  content_type: 'product',
})
```

### Dashboard Meta

```
https://business.facebook.com/events_manager2/list/pixel/[PIXEL_ID]
```

---

## 6. Error Tracking com Sentry (Recomendado)

### Instalação

```bash
pnpm add @sentry/nextjs
```

### Configuração

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
})
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
```

### Uso

```typescript
// Capturar erros
try {
  await dangerousOperation()
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      component: 'OrderPayment',
      userId: user.id,
    },
  })
  throw error
}

// Breadcrumbs
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
})
```

### Custo

- **Free Tier:** 5k events/mês
- **Team Plan:** $26/mês (50k events)

### Status

⏸️ Opcional - Implementar se necessário

---

## 7. Uptime Monitoring

### Recomendação: UptimeRobot

**Free Plan:**

- 50 monitores
- Check interval: 5 minutos
- Alertas: Email, SMS, Slack, webhook

### Configuração

1. Criar conta em https://uptimerobot.com
2. Adicionar monitores:

```
Nome: Versati Glass - Homepage
Tipo: HTTP(S)
URL: https://versatiglass.vercel.app
Intervalo: 5 minutos
Alertas: Email + Slack

Nome: Versati Glass - API Health
Tipo: HTTP(S)
URL: https://versatiglass.vercel.app/api/health
Intervalo: 5 minutos
Status esperado: 200
```

3. Configurar alertas
4. Status page público (opcional)

### Endpoints a Monitorar

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        api: 'up',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
      },
      { status: 503 }
    )
  }
}
```

### Status

⏸️ Recomendado - Implementar antes do launch

---

## 8. Log Aggregation

### Vercel Logs (Built-in)

**Features:**

- Real-time logs
- Function execution logs
- Build logs
- Deployment logs

**Retenção:**

- Free: 1 hora
- Pro: 1 dia
- Enterprise: Customizável

### Acesso

```
Vercel Dashboard > Project > Logs
```

### Logs Estruturados

```typescript
// Usar console.log estruturado
console.log(
  JSON.stringify({
    level: 'info',
    message: 'Order created',
    orderId: order.id,
    userId: user.id,
    timestamp: new Date().toISOString(),
  })
)

// Em produção, aparece no Vercel Logs
```

### Alternativas (Futuro)

1. **Logtail (Better Stack):** $5/mês (1GB)
2. **LogRocket:** Session replay + logs
3. **Datadog:** Enterprise solution

---

## 9. Database Monitoring

### Railway Built-in Metrics

**Já disponível no Railway Dashboard:**

- CPU Usage
- Memory Usage
- Disk Usage
- Connection Count
- Query Performance

### Acesso

```
Railway Dashboard > PostgreSQL > Metrics
```

### Alertas Recomendados

```yaml
CPU > 80%: Warning
Memory > 85%: Warning
Disk > 90%: Critical
Connections > 90%: Warning
```

### Slow Query Log

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}

// Em produção
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
})

prisma.$on('query', (e) => {
  if (e.duration > 1000) { // > 1s
    console.warn('Slow query detected:', {
      query: e.query,
      duration: e.duration,
    })
  }
})
```

---

## 10. Business Metrics Dashboard

### KPIs Principais

```typescript
// Dashboard Admin - src/app/(admin)/admin/page.tsx

interface BusinessMetrics {
  // Vendas
  totalRevenue: number
  monthlyRevenue: number
  averageOrderValue: number
  conversionRate: number

  // Operacional
  pendingQuotes: number
  activeOrders: number
  scheduledAppointments: number
  completedInstallations: number

  // Clientes
  totalCustomers: number
  newCustomers: number
  repeatCustomers: number
  customerLifetimeValue: number

  // Performance
  quoteResponseTime: number // hours
  productionTime: number // days
  installationSuccessRate: number // %
}
```

### Queries Implementadas

```typescript
// Revenue
const monthlyRevenue = await prisma.order.aggregate({
  where: {
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    createdAt: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  },
  _sum: { total: true },
})

// Conversion Rate
const totalQuotes = await prisma.quote.count({
  where: { createdAt: { gte: startOfMonth } },
})
const approvedQuotes = await prisma.quote.count({
  where: {
    status: 'APPROVED',
    createdAt: { gte: startOfMonth },
  },
})
const conversionRate = (approvedQuotes / totalQuotes) * 100
```

### Visualização

✅ Já implementado em:

- [src/app/(admin)/admin/page.tsx](<../src/app/(admin)/admin/page.tsx>) - Dashboard principal
- Gráficos com Recharts
- Cards com métricas em tempo real
- Comparação mês a mês

---

## 11. Alertas e Notificações

### Slack Webhook (Recomendado)

```typescript
// src/lib/slack.ts
export async function sendSlackAlert(message: string, priority: 'info' | 'warning' | 'critical') {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const color = {
    info: '#36a64f',
    warning: '#ff9800',
    critical: '#f44336',
  }[priority]

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [
        {
          color,
          title: '🔷 Versati Glass Alert',
          text: message,
          footer: 'Versati Glass Monitoring',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    }),
  })
}

// Uso
await sendSlackAlert(
  `💳 Novo pedido recebido: ${orderNumber}\nValor: ${formatCurrency(total)}`,
  'info'
)

await sendSlackAlert(`⚠️ Pagamento falhado: ${orderNumber}`, 'warning')

await sendSlackAlert(`🚨 Database connection error`, 'critical')
```

### Email Alerts via Resend

```typescript
// src/lib/alerts.ts
import { resend } from '@/lib/email'

export async function sendAdminAlert(subject: string, message: string) {
  await resend.emails.send({
    from: 'alerts@versatiglass.com',
    to: process.env.ADMIN_EMAIL!,
    subject: `[ALERT] ${subject}`,
    html: `
      <h2>🔷 Versati Glass Alert</h2>
      <p>${message}</p>
      <p><small>${new Date().toISOString()}</small></p>
    `,
  })
}
```

---

## 12. Checklist de Produção

### Antes do Deploy

- [x] Vercel Analytics ativado
- [x] Google Analytics configurado
- [x] Google Tag Manager configurado
- [x] Meta Pixel configurado
- [x] Error boundaries implementados
- [x] Logging estruturado
- [x] Health check endpoint
- [ ] Uptime monitoring configurado
- [ ] Slack webhooks configurados
- [ ] Sentry configurado (opcional)
- [ ] Alertas de database configurados

### Pós-Deploy

- [ ] Validar métricas no Vercel Dashboard
- [ ] Confirmar eventos no Google Analytics
- [ ] Testar conversões no Meta Pixel
- [ ] Verificar logs em tempo real
- [ ] Testar alertas (Slack/Email)
- [ ] Configurar dashboard de business metrics
- [ ] Documentar runbooks para incidentes

---

## 13. Runbooks

### 🚨 Site Down

1. Verificar status do Vercel: https://www.vercel-status.com
2. Verificar logs no Vercel Dashboard
3. Verificar Railway (database): https://railway.app/status
4. Fazer rollback se necessário: `vercel rollback`
5. Notificar stakeholders

### ⚠️ High Error Rate

1. Acessar Vercel Logs
2. Filtrar por status 500
3. Identificar endpoint problemático
4. Verificar conexão com database
5. Verificar rate limits de APIs externas (Twilio, Stripe, Groq)
6. Fazer hotfix se necessário

### 🐌 Slow Performance

1. Verificar Core Web Vitals no Vercel Analytics
2. Identificar páginas lentas
3. Verificar queries no banco (Railway metrics)
4. Verificar CDN cache
5. Revisar bundle size: `pnpm build`

### 💾 Database Issues

1. Verificar Railway Dashboard
2. Verificar connection pool
3. Verificar slow queries
4. Verificar disk space
5. Considerar scale up se necessário

---

## 📊 Métricas Alvo (SLOs)

```yaml
Availability: 99.9% (8h45m downtime/year)
Response Time (p95): < 2s
Response Time (p99): < 5s
Error Rate: < 0.1%
Database Query Time (p95): < 500ms
Time to First Byte: < 600ms
```

---

## 🔗 Links Úteis

- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Google Analytics 4](https://analytics.google.com)
- [Google Tag Manager](https://tagmanager.google.com)
- [Meta Events Manager](https://business.facebook.com/events_manager2)
- [Railway Metrics](https://railway.app)
- [Sentry](https://sentry.io)
- [UptimeRobot](https://uptimerobot.com)

---

_Última atualização: 16 Dezembro 2024_
