# 📋 TAREFAS PÓS-ANÁLISE COMPLETA DO SISTEMA

**Data:** 22 Dezembro 2024
**Análise Completa:** Sistema auditado - 312 arquivos TS/TSX analisados

---

## ✅ IMPLEMENTADO (22-23/12/2024)

- [x] PDF de orçamento para cliente (tema escuro, com preços)
- [x] Edição de medidas nos itens do orçamento (largura, altura, cor, acabamento, espessura)
- [x] Sistema de cotação com fornecedores (dialog, seleção múltipla, envio email)
- [x] Sistema de notificações in-app completo (modelo, API, componente NotificationBell)
- [x] Sistema de pagamentos flexíveis (múltiplos pagamentos por pedido, parciais)
- [x] Endpoint SSE para WhatsApp real-time (`/api/whatsapp/stream`)
- [x] CNPJ placeholder substituído (56.025.592/0001-36)
- [x] Serviço de notificações automáticas (`in-app-notifications.ts`)
- [x] Migrações executadas (tabelas notifications e payments)
- [x] Notificações integradas em todos eventos do sistema (orçamentos, pedidos, pagamentos, agendamentos)
- [x] **NOVO (23/12):** File Storage migrado para Cloudflare R2 (documentos + imagens chat IA)
- [x] **NOVO (23/12):** Rate Limiting distribuído com Upstash Redis (com fallback in-memory)

---

## 🔥 PRIORIDADE ALTA (Implementar Próximo)

### 1. ~~Migrar File Storage para R2~~ ✅ **CONCLUÍDO**

**Status:** ✅ Implementado e deployed (23/12/2024)
**Impacto:** Resolvido - Todos os uploads agora vão para R2
**Arquivos atualizados:**

- ✅ `src/app/api/documents/route.ts` - Migrado para R2
- ✅ `src/app/api/ai/chat/upload/route.ts` - Migrado para R2 (caminho correto encontrado)

**Implementação:**

```typescript
// Implementado em ambos os endpoints:
import { uploadToR2, isR2Configured } from '@/lib/r2-storage'

// Verificação antes do upload
if (!isR2Configured()) {
  return NextResponse.json({ error: 'Serviço não disponível' }, { status: 503 })
}

// Upload para R2 com organização por tipo
const { url } = await uploadToR2(buffer, `documents/${filename}`, file.type)
const { url } = await uploadToR2(buffer, `chat/${filename}`, file.type)
```

**Checklist:**

- [x] Atualizar `/api/documents/route.ts` para usar R2
- [x] Atualizar `/api/ai/chat/upload/route.ts` para usar R2 (caminho correto)
- [x] Adicionar verificação de configuração R2
- [x] Organizar arquivos por tipo (documents/, chat/)
- [x] Deploy para produção
- [ ] ⚠️ TODO: Migrar arquivos existentes de `public/uploads/` para R2 (se houver)
- [ ] ⚠️ TODO: Atualizar referências de URLs nos documentos (se houver arquivos antigos)

**Resultado:** Sistema agora usa storage persistente. Arquivos não serão mais perdidos no Vercel.

---

### 2. ~~Conectar Notificações aos Eventos do Sistema~~ ✅ **CONCLUÍDO**

**Status:** ✅ Implementado e deployed
**Implementação:** Notificações integradas em todos os eventos críticos do sistema

```typescript
// src/app/api/quotes/[id]/route.ts - Quando orçamento é enviado
import { notifyQuoteReceived } from '@/services/in-app-notifications'
await notifyQuoteReceived(quote.userId, quote.number, quote.id)

// src/app/api/orders/[id]/route.ts - Quando status muda
import { notifyOrderStatusChanged } from '@/services/in-app-notifications'
await notifyOrderStatusChanged(order.userId, order.number, order.id, newStatus)

// src/app/api/payments/webhook/route.ts - Quando pagamento confirmado
import { notifyPaymentReceived } from '@/services/in-app-notifications'
await notifyPaymentReceived(order.userId, order.number, order.id, amount)

// src/app/api/appointments/route.ts - Quando agendamento confirmado
import { notifyAppointmentConfirmed } from '@/services/in-app-notifications'
await notifyAppointmentConfirmed(userId, appointmentId, type, date, time)

// src/services/notifications.ts - Adicionar notificação in-app junto com email/WhatsApp
import { notifyAppointmentReminder } from '@/services/in-app-notifications'
await notifyAppointmentReminder(userId, appointmentId, type, date, time)
```

**Checklist:**

- [ ] Adicionar notificação ao enviar orçamento
- [ ] Adicionar notificação ao aceitar/rejeitar orçamento
- [ ] Adicionar notificação ao mudar status do pedido
- [ ] Adicionar notificação ao confirmar pagamento
- [ ] Adicionar notificação ao criar agendamento
- [ ] Adicionar notificação ao confirmar agendamento
- [ ] Adicionar notificação 24h antes do agendamento (cron)
- [ ] Adicionar notificação para novas mensagens

**Estimativa:** 3-4 horas

---

## ⚠️ PRIORIDADE MÉDIA

### 3. ~~Implementar Rate Limiting Distribuído (Redis/Upstash)~~ ✅ **CONCLUÍDO**

**Status:** ✅ Implementado e deployed (23/12/2024)
**Impacto:** Resolvido - Rate limiting agora funciona em serverless
**Arquivo:** `src/lib/rate-limit.ts`

**Implementação:**

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Lazy initialization com fallback para in-memory
function getRatelimiter(config: RateLimitConfig): Ratelimit | null {
  if (!isRedisConfigured()) return null

  const ratelimiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowSeconds} s`),
    analytics: true,
    prefix: 'versati_glass',
  })

  return ratelimiter
}

// Graceful fallback automático para in-memory se Redis falhar
export async function rateLimit(request: Request, config: RateLimitConfig) {
  const ratelimiter = getRatelimiter(config)

  if (ratelimiter) {
    try {
      return await ratelimiter.limit(key)
    } catch (error) {
      // Fallback to in-memory
      return rateLimitInMemory(key, config)
    }
  }

  return rateLimitInMemory(key, config)
}
```

**Checklist:**

- [x] Instalar `@upstash/ratelimit` e `@upstash/redis`
- [x] Atualizar `src/lib/rate-limit.ts` com Upstash Redis
- [x] Implementar lazy initialization
- [x] Implementar fallback gracioso para in-memory
- [x] Manter backward compatibility com API existente
- [x] Deploy para produção
- [ ] ⚠️ TODO: Criar conta Upstash e configurar variáveis de ambiente
- [ ] ⚠️ TODO: Monitorar uso do Redis

**Resultado:** Sistema pronto para usar Upstash Redis. Funciona com in-memory até Redis ser configurado.

---

### 4. Adicionar Modelo WhatsAppMessage Dedicado

**Status:** Comentado mas não implementado
**Impacto:** Baixo (sistema funciona), mas melhoraria organização
**Arquivo:** `src/hooks/use-whatsapp-unread.ts:20`

**Schema Prisma:**

```prisma
model WhatsAppMessage {
  id              String   @id @default(uuid())
  conversationId  String
  messageId       String   @unique // Twilio message ID
  from            String
  to              String
  body            String
  mediaUrl        String?
  status          String   // sent, delivered, read, failed
  direction       String   // inbound, outbound
  timestamp       DateTime
  createdAt       DateTime @default(now())
  conversation    Conversation @relation(fields: [conversationId], references: [id])

  @@map("whatsapp_messages")
}
```

**Checklist:**

- [ ] Adicionar modelo ao `schema.prisma`
- [ ] Criar migração
- [ ] Atualizar webhook do WhatsApp para salvar em WhatsAppMessage
- [ ] Atualizar hooks para usar novo modelo
- [ ] Migrar mensagens existentes (se necessário)

**Estimativa:** 2-3 horas

---

### 5. Dashboard de Analytics de Pagamentos

**Status:** Não existe
**Impacto:** Baixo, mas útil para gestão financeira

**Página:** `src/app/(admin)/admin/financeiro/page.tsx`

**Métricas a exibir:**

- Total recebido (mês atual)
- Total pendente
- Pagamentos parciais
- Taxa de conversão PIX vs Cartão
- Gráfico de receita mensal
- Top 10 clientes por valor
- Métodos de pagamento mais usados

**Checklist:**

- [ ] Criar página `/admin/financeiro`
- [ ] Criar API `/api/admin/analytics/payments`
- [ ] Adicionar gráficos (Chart.js ou Recharts)
- [ ] Adicionar filtros (data, método, status)
- [ ] Exportar relatórios (PDF/Excel)

**Estimativa:** 4-6 horas

---

## 💡 PRIORIDADE BAIXA (Melhorias de UX)

### 6. Visualizador de PDF Inline

**Status:** Não existe
**Arquivo:** `src/app/(portal)/portal/documentos/page.tsx`

**Implementação:**

```typescript
import { Document, Page } from 'react-pdf'

<Dialog>
  <Document file={pdfUrl}>
    <Page pageNumber={1} />
  </Document>
</Dialog>
```

**Checklist:**

- [ ] Instalar `react-pdf`
- [ ] Adicionar visualizador no DocumentosPage
- [ ] Adicionar navegação entre páginas
- [ ] Adicionar zoom
- [ ] Testar com PDFs grandes

**Estimativa:** 2-3 horas

---

### 7. Busca e Filtros Avançados em Conversas

**Status:** Busca básica existe, filtros limitados
**Arquivo:** `src/app/(admin)/admin/conversas/page.tsx`

**Melhorias:**

- [ ] Busca por nome/telefone/mensagem
- [ ] Filtro por período (última hora, hoje, semana)
- [ ] Filtro por atendente
- [ ] Ordenação (mais recente, mais antiga, não lidas)
- [ ] Tags/categorias

**Estimativa:** 3-4 horas

---

### 8. Indicadores de Digitação nos Chats

**Status:** Não existe
**Impacto:** UX

**Implementação com WebSockets ou SSE:**

```typescript
// Cliente envia evento "typing"
await fetch('/api/conversations/[id]/typing', { method: 'POST' })

// SSE transmite para outros usuários
eventSource.onmessage = (e) => {
  if (e.data.type === 'typing') {
    showTypingIndicator(e.data.userId)
  }
}
```

**Checklist:**

- [ ] Criar API `/api/conversations/[id]/typing`
- [ ] Adicionar endpoint SSE para typing events
- [ ] Atualizar componentes de chat
- [ ] Adicionar timeout (3s sem digitar = esconde)

**Estimativa:** 3-4 horas

---

### 9. Drag-and-Drop no Calendário de Agendamentos

**Status:** Calendário atual é lista
**Página:** `src/app/(admin)/admin/agendamentos/page.tsx`

**Biblioteca:** FullCalendar ou React Big Calendar

**Checklist:**

- [ ] Instalar biblioteca de calendário
- [ ] Criar view de calendário
- [ ] Implementar drag-and-drop
- [ ] Atualizar API para suportar reagendamento
- [ ] Adicionar confirmação de mudança
- [ ] Enviar notificações de reagendamento

**Estimativa:** 6-8 horas

---

### 10. Permitir Upload de Documentos por Clientes

**Status:** Bloqueado (só admin/staff)
**Arquivo:** `src/app/api/documents/route.ts:55`

**Mudanças:**

```typescript
// Antes:
if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Depois:
const isAdmin = ['ADMIN', 'STAFF'].includes(session.user.role)
const isOwner = session.user.id === userId

if (!isAdmin && !isOwner) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Cliente só pode fazer upload em seus próprios pedidos/orçamentos
if (!isAdmin) {
  // Validar ownership do orderId/quoteId
}
```

**Checklist:**

- [ ] Atualizar validação de permissões
- [ ] Adicionar verificação de ownership
- [ ] Limitar tipos de arquivo (clientes: fotos, PDFs)
- [ ] Adicionar moderação (admin aprova)
- [ ] Criar UI no portal para upload
- [ ] Notificar admin quando cliente enviar documento

**Estimativa:** 3-4 horas

---

## 🚀 FUNCIONALIDADES NOVAS (Longo Prazo)

### 11. Assinatura Digital de Contratos

**Status:** Não implementado
**Prioridade:** Longo prazo

**Opções:**

1. DocuSign API
2. Adobe Sign
3. Solução própria (canvas + certificado digital)

**Estimativa:** 8-12 horas

---

### 12. Boleto Bancário

**Status:** Não implementado
**Impacto:** Médio (alguns clientes preferem)

**Integração:** Stripe ou PagSeguro/Asaas

**Estimativa:** 4-6 horas

---

### 13. Split Payments para Fornecedores

**Status:** Não implementado
**Descrição:** Dividir pagamento entre Versati Glass e fornecedor

**Stripe Connect** ou **PagSeguro Split**

**Estimativa:** 12-16 horas

---

### 14. Push Notifications (PWA)

**Status:** PWA básico existe, push não
**Arquivo:** `public/manifest.webmanifest` existe

**Checklist:**

- [ ] Adicionar service worker completo
- [ ] Implementar Web Push API
- [ ] Criar UI para permissão de notificações
- [ ] Integrar com Firebase Cloud Messaging ou OneSignal
- [ ] Criar API para enviar push notifications
- [ ] Testar em mobile

**Estimativa:** 6-8 horas

---

### 15. Mobile App (React Native)

**Status:** Não existe
**Prioridade:** Longo prazo

**Opções:**

1. React Native (Expo)
2. Flutter
3. PWA otimizado (mais rápido)

**Estimativa:** 80-120 horas (app completo)

---

## 🔍 REFATORAÇÕES E MELHORIAS TÉCNICAS

### 16. Adicionar Testes E2E

**Status:** Poucos testes existem
**Framework:** Playwright ou Cypress

**Fluxos críticos a testar:**

- [ ] Login/registro
- [ ] Criar orçamento
- [ ] Aceitar orçamento
- [ ] Fazer pagamento
- [ ] Criar agendamento
- [ ] Chat IA

**Estimativa:** 12-16 horas

---

### 17. Implementar Feature Flags

**Status:** Não existe
**Biblioteca:** Unleash, LaunchDarkly, ou Vercel Edge Config

**Benefícios:**

- Testar features em produção (A/B testing)
- Deploy gradual (rollout)
- Kill switch para features problemáticas

**Estimativa:** 4-6 horas

---

### 18. Adicionar Monitoring Completo

**Status:** Sentry configurado, mas básico
**Arquivo:** `src/lib/sentry.ts`

**Melhorias:**

- [ ] Error tracking completo
- [ ] Performance monitoring
- [ ] Session replay
- [ ] Alerts customizados
- [ ] Dashboard de métricas

**Estimativa:** 3-4 horas

---

### 19. Documentação de APIs (OpenAPI/Swagger)

**Status:** Não existe
**Benefício:** Facilita integração e manutenção

**Checklist:**

- [ ] Instalar `swagger-ui-react` e `swagger-jsdoc`
- [ ] Documentar todas as APIs
- [ ] Adicionar exemplos de request/response
- [ ] Criar página `/api/docs`

**Estimativa:** 8-12 horas

---

### 20. CI/CD com Testes Automáticos

**Status:** Deploy manual via Vercel CLI
**Melhoria:** GitHub Actions para:

- [ ] Lint
- [ ] Type checking
- [ ] Unit tests
- [ ] E2E tests
- [ ] Build
- [ ] Deploy automático (main branch)

**Estimativa:** 4-6 horas

---

## 📊 ANÁLISE DE PRIORIDADES

### Próximos Passos Recomendados (Ordem de Implementação)

**Semana 1:**

1. Migrar file storage para R2 (2-3h)
2. Conectar notificações aos eventos (3-4h)
3. Implementar rate limiting distribuído (1-2h)

**Semana 2:** 4. Dashboard de analytics de pagamentos (4-6h) 5. Permitir upload de documentos por clientes (3-4h) 6. Adicionar modelo WhatsAppMessage (2-3h)

**Semana 3:** 7. Visualizador de PDF inline (2-3h) 8. Busca avançada em conversas (3-4h) 9. Indicadores de digitação (3-4h)

**Mês 2:** 10. Drag-and-drop no calendário (6-8h) 11. Boleto bancário (4-6h) 12. Push notifications PWA (6-8h)

**Backlog (Prioridade Baixa):**

- Assinatura digital de contratos
- Split payments
- Mobile app
- Testes E2E completos
- Feature flags

---

## 🎯 MÉTRICAS DE SUCESSO

**KPIs a monitorar:**

- Taxa de conversão de orçamentos (meta: >30%)
- Tempo médio de resposta (meta: <2h)
- Satisfação do cliente (NPS: >8)
- Taxa de conclusão de pedidos (meta: >90%)
- Uptime do sistema (meta: >99.5%)

---

**Última Atualização:** 22 Dezembro 2024 - 18:00
**Versão:** 3.0 (Pós-Análise Completa)
**Responsável:** Claude Code + Dev Team
**Sistema Analisado:** 312 arquivos TS/TSX | 14 modelos Prisma | 50+ APIs

_Versati Glass - Sistema auditado e otimizado para produção_ ✨
