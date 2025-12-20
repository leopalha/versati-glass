# Sentry - Configuração de Monitoramento de Erros

Este documento explica como configurar e usar o Sentry para monitoramento de erros no Versati Glass.

## 📋 Visão Geral

O Sentry foi configurado para capturar erros em três ambientes:
- **Client-side** (navegador)
- **Server-side** (API routes, Server Components)
- **Edge Runtime** (Middleware, Edge Functions)

## 🚀 Configuração Inicial

### 1. Criar Conta no Sentry

1. Acesse [sentry.io](https://sentry.io)
2. Crie uma conta gratuita (até 5.000 erros/mês)
3. Crie um novo projeto para "Next.js"

### 2. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao `.env`:

```bash
# Sentry (Error Monitoring)
SENTRY_DSN="https://xxxxxxxxxxxxx@o000000.ingest.sentry.io/0000000"
SENTRY_ORG="sua-organizacao"
SENTRY_PROJECT="versatiglass"
SENTRY_AUTH_TOKEN="sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxxxxxxxxxxxx@o000000.ingest.sentry.io/0000000"
```

**Onde encontrar:**
- `SENTRY_DSN`: Settings → Projects → [Seu Projeto] → Client Keys (DSN)
- `SENTRY_ORG`: URL da sua organização (ex: `seu-time` em `seu-time.sentry.io`)
- `SENTRY_PROJECT`: Nome do projeto no Sentry
- `SENTRY_AUTH_TOKEN`: Settings → Account → API → Auth Tokens → Create New Token
  - Scopes necessários: `project:read`, `project:releases`, `org:read`

### 3. Instalar Pacote

```bash
npm install @sentry/nextjs --save-exact
```

## 📁 Arquivos de Configuração

### `sentry.client.config.ts`
Configura Sentry para o browser (client-side).

**Recursos ativados:**
- Captura de erros JavaScript
- Performance monitoring (10% sample)
- Session Replay (10% sessões normais, 100% com erro)
- Filtros de erros de extensões e third-party

### `sentry.server.config.ts`
Configura Sentry para o servidor (server-side).

**Recursos ativados:**
- Captura de erros em API routes
- Captura de erros em Server Components
- Integração com Prisma
- Remoção de informações sensíveis (headers de auth)

### `sentry.edge.config.ts`
Configura Sentry para Edge Runtime.

**Recursos ativados:**
- Captura de erros em Middleware
- Performance monitoring otimizado para Edge

### `instrumentation.ts`
Arquivo executado pelo Next.js na inicialização do servidor.
Carrega as configurações apropriadas do Sentry automaticamente.

## 🎯 Como Funciona

### Desenvolvimento
- Erros **não são enviados** ao Sentry
- Erros são logados no console com prefixo `[Sentry Client/Server/Edge]`
- Permite debug local sem poluir o dashboard

### Produção
- Erros são capturados e enviados automaticamente
- Performance monitoring com 10% sample (reduz custos)
- Session Replay apenas para sessões com erro

## 📊 Tipos de Erros Capturados

### Client-side
✅ Erros de JavaScript não capturados
✅ Promise rejections
✅ Erros de componentes React
❌ Erros de extensões do navegador (filtrados)
❌ Erros de third-party scripts (filtrados)

### Server-side
✅ Erros em API routes
✅ Erros em Server Components
✅ Erros do Prisma
✅ Erros não tratados (unhandled exceptions)
❌ Erros esperados (P2025, NEXT_NOT_FOUND, etc.)

### Edge Runtime
✅ Erros em Middleware
✅ Erros em Edge API routes
✅ Rate limiting failures (pode ser útil monitorar)

## 🔍 Monitoramento Manual

### Capturar Erro Customizado

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // seu código
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'payment',
      severity: 'high',
    },
    extra: {
      orderId: '123',
      amount: 1000,
    },
  })
}
```

### Adicionar Contexto

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
})

Sentry.setContext('order', {
  id: order.id,
  total: order.total,
  status: order.status,
})
```

### Breadcrumbs (Rastro de Eventos)

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
})
```

## 🎨 Alertas e Notificações

### Configurar Alertas

1. Acesse: **Alerts** → **Create Alert**
2. Escolha tipo: "Issues"
3. Configure condições:
   - Quando: "A new issue is created"
   - Filtros: environment = "production"
4. Ações: Email, Slack, Discord, etc.

### Alertas Recomendados

1. **Novos Erros Críticos**
   - Condition: New issue
   - Filter: level = "error" OR level = "fatal"
   - Action: Email + Slack

2. **Volume Anormal de Erros**
   - Condition: Issue frequency > 100 events em 1 hora
   - Action: Email para time técnico

3. **Performance Degradation**
   - Condition: Transaction duration > 5s
   - Action: Slack notification

## 📈 Dashboards e Relatórios

### Métricas Importantes

1. **Error Rate**
   - % de sessões com erro
   - Meta: < 1%

2. **Response Time**
   - P50, P95, P99
   - Meta: P95 < 500ms

3. **Apdex Score**
   - Satisfação do usuário
   - Meta: > 0.9

### Relatório Semanal

Configurar em: **Settings** → **Subscriptions**
- Resumo semanal de erros
- Top 10 issues
- Comparação com semana anterior

## 🔒 Segurança e Privacidade

### Dados Removidos Automaticamente

✅ Headers de autorização (`authorization`, `cookie`)
✅ Senhas em formulários
✅ Tokens de sessão
✅ Dados de cartão de crédito

### Configurar Scrubbing Adicional

Em `sentry.server.config.ts`:

```typescript
beforeSend(event, hint) {
  // Remover dados sensíveis
  if (event.request?.data) {
    delete event.request.data.password
    delete event.request.data.cpf
    delete event.request.data.creditCard
  }
  return event
}
```

## 📊 Custos e Limites

### Plano Free (Atual)
- 5.000 erros/mês
- 10.000 performance events/mês
- 50 Session Replays/mês
- Retenção: 30 dias

### Otimizações para Não Exceder

1. **Sample Rate ajustado**
   - Produção: 10% das transações
   - Desenvolvimento: Desabilitado

2. **Filtros de Ruído**
   - Extensões de navegador ignoradas
   - Erros conhecidos ignorados
   - Third-party scripts filtrados

3. **Session Replay seletivo**
   - 10% sessões normais
   - 100% sessões com erro

## 🚀 Deploy e CI/CD

### Vercel (Recomendado)

As variáveis de ambiente devem ser configuradas em:
**Vercel Dashboard** → **Settings** → **Environment Variables**

```bash
SENTRY_DSN=...
SENTRY_ORG=...
SENTRY_PROJECT=...
SENTRY_AUTH_TOKEN=...
NEXT_PUBLIC_SENTRY_DSN=...
```

### Source Maps (Opcional)

Para stack traces detalhados em produção:

1. Criar `.sentryclirc`:
```ini
[auth]
token=YOUR_AUTH_TOKEN

[defaults]
url=https://sentry.io/
org=sua-org
project=versatiglass
```

2. Adicionar ao `.gitignore`:
```
.sentryclirc
```

## 🐛 Debug e Troubleshooting

### Testar em Desenvolvimento

```typescript
// Em qualquer página ou componente
throw new Error('Teste Sentry')
```

Verifique no console: `[Sentry Client] Error: Teste Sentry`

### Testar em Produção

1. Deploy para staging
2. Force um erro
3. Verifique no Sentry Dashboard em ~1 minuto

### Problemas Comuns

**Erro: "DSN not found"**
- Verifique se `NEXT_PUBLIC_SENTRY_DSN` está configurado
- Reconstrua o projeto: `npm run build`

**Erros não aparecem no Sentry**
- Confirme que `NODE_ENV=production`
- Verifique os filtros em `ignoreErrors`
- Teste com `Sentry.captureException(new Error('test'))`

**Source maps não funcionam**
- Configure `SENTRY_AUTH_TOKEN`
- Verifique permissões do token
- Ative upload no build: `sentry:sourcemaps` script

## ✅ Checklist de Configuração

- [ ] Conta criada no Sentry.io
- [ ] Projeto Next.js criado no Sentry
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] Pacote `@sentry/nextjs` instalado
- [ ] Arquivos de config criados (client, server, edge)
- [ ] `instrumentation.ts` criado
- [ ] `next.config.js` atualizado
- [ ] Variáveis configuradas no Vercel (produção)
- [ ] Alertas configurados
- [ ] Teste realizado em staging

## 📚 Recursos

- [Documentação oficial Sentry + Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/performance/)
- [Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/)

---

**Status:** ✅ Configurado
**Última atualização:** 2025-12-19
**Responsável:** DevOps Team
