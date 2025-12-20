# Resend - Configuração de Email Transacional

Este documento explica como configurar e usar o Resend para envio de emails transacionais no Versati Glass.

## 📋 Visão Geral

Resend é usado para enviar:
- ✉️ Confirmações de orçamento
- 📧 Verificação de email
- 🔔 Notificações de agendamento
- 📄 Envio de orçamentos para clientes
- 🔐 Reset de senha
- ✅ Confirmações de pedidos

**Status Atual:** ✅ Implementado e funcionando

## 🚀 Configuração Inicial

### 1. Criar Conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
   - **Plano Free:** 100 emails/dia (3.000/mês)
   - **Plano Pro:** $20/mês para 50.000 emails/mês

### 2. Configurar Domínio

Para emails profissionais (ex: `noreply@versatiglass.com.br`):

1. Acesse **Domains** no dashboard
2. Clique em **Add Domain**
3. Digite: `versatiglass.com.br`
4. Adicione os registros DNS no seu provedor:

```dns
Type: TXT
Name: @ (ou vazio)
Value: resend-verify=xxxxxxxxxxxxxxxxxxxx

Type: MX
Name: @ (ou vazio)
Priority: 10
Value: mx1.resend.com

Type: MX
Name: @ (ou vazio)
Priority: 20
Value: mx2.resend.com

Type: TXT
Name: @ (ou vazio)
Value: v=DMARC1; p=none; rua=mailto:dmarc@versatiglass.com.br

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@versatiglass.com.br
```

5. Aguarde propagação (2-48 horas)
6. Verifique status no dashboard

**Alternativa para testes:** Use `onboarding@resend.dev` (limite de 100 emails)

### 3. Gerar API Key

1. Acesse **API Keys** no dashboard
2. Clique em **Create API Key**
3. Nome: `Versati Glass - Production`
4. Permissões: **Send emails**
5. Copie a chave (será exibida apenas uma vez!)

### 4. Configurar Variáveis de Ambiente

Adicione ao `.env`:

```bash
# Resend (Email)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@versatiglass.com.br"
```

**Importante:**
- `RESEND_API_KEY`: Chave secreta (nunca commitar!)
- `RESEND_FROM_EMAIL`: Email remetente (deve ser do domínio verificado)

## 📁 Implementação Atual

### Estrutura de Arquivos

```
src/
├── services/
│   └── email.ts              # Serviço principal de email
├── __tests__/
    └── services/
        ├── email.test.ts     # Testes unitários
        └── email-templates.test.ts  # Testes de templates
```

### Serviço de Email (`src/services/email.ts`)

**Funções principais:**

```typescript
// Enviar email genérico
await sendEmail({
  to: 'cliente@example.com',
  subject: 'Seu orçamento está pronto',
  html: generateQuoteEmailHtml({...}),
  text: 'Versão texto simples...'
})

// Templates disponíveis:
generateQuoteEmailHtml()          // Orçamento aprovado
generateEmailVerificationHtml()   // Verificar email
generatePasswordResetHtml()       // Reset de senha
generateAppointmentConfirmationHtml() // Confirmar agendamento
```

### Templates de Email

Todos os templates seguem o padrão visual:
- Header dourado com logo
- Corpo com informações
- Footer com dados de contato
- Design responsivo para mobile

## 🎨 Templates Disponíveis

### 1. Verificação de Email

```typescript
import { generateEmailVerificationHtml, sendEmail } from '@/services/email'

await sendEmail({
  to: user.email,
  subject: 'Verifique seu email - Versati Glass',
  html: generateEmailVerificationHtml({
    userName: 'João Silva',
    verificationUrl: 'https://versatiglass.com.br/verificar?token=xxx'
  })
})
```

### 2. Orçamento Enviado

```typescript
import { generateQuoteEmailHtml, sendEmail } from '@/services/email'

await sendEmail({
  to: customer.email,
  subject: `Orçamento ${quote.number} - Versati Glass`,
  html: generateQuoteEmailHtml({
    customerName: 'João Silva',
    quoteNumber: 'ORC-2025-0001',
    total: 'R$ 5.250,00',
    validUntil: '15/01/2025',
    portalUrl: 'https://versatiglass.com.br/portal/orcamentos/123',
    items: [
      { description: 'Box de Vidro Temperado', quantity: 1, price: 'R$ 2.500,00' },
      { description: 'Espelho Bisotado', quantity: 2, price: 'R$ 1.375,00' }
    ]
  })
})
```

### 3. Reset de Senha

```typescript
import { generatePasswordResetHtml, sendEmail } from '@/services/email'

await sendEmail({
  to: user.email,
  subject: 'Redefinir senha - Versati Glass',
  html: generatePasswordResetHtml({
    userName: 'João Silva',
    resetUrl: 'https://versatiglass.com.br/reset-password?token=xxx'
  })
})
```

### 4. Confirmação de Agendamento

```typescript
import { generateAppointmentConfirmationHtml, sendEmail } from '@/services/email'

await sendEmail({
  to: customer.email,
  subject: 'Agendamento confirmado - Versati Glass',
  html: generateAppointmentConfirmationHtml({
    customerName: 'João Silva',
    appointmentType: 'Visita Técnica',
    date: '20/01/2025',
    time: '14:00',
    address: 'Rua das Flores, 123 - Centro, Rio de Janeiro/RJ',
    quoteNumber: 'ORC-2025-0001'
  })
})
```

## 🧪 Testes

### Testar em Desenvolvimento

```bash
# Rodar todos os testes de email
npm test -- email

# Teste específico
npm test -- src/__tests__/services/email.test.ts
```

### Teste Manual (via API)

```bash
# Criar arquivo test-email.ts
import { sendEmail, generateEmailVerificationHtml } from '@/services/email'

async function testEmail() {
  const result = await sendEmail({
    to: 'seu-email@example.com',
    subject: 'Teste Resend - Versati Glass',
    html: generateEmailVerificationHtml({
      userName: 'Teste',
      verificationUrl: 'https://example.com/verify'
    })
  })

  console.log(result)
}

testEmail()
```

```bash
# Executar
npx ts-node test-email.ts
```

## 📊 Monitoramento

### Dashboard Resend

1. Acesse [resend.com/emails](https://resend.com/emails)
2. Visualize:
   - Emails enviados
   - Taxa de entrega
   - Bounces e rejeições
   - Logs de cada email

### Logs no Código

```typescript
// Em src/services/email.ts
logger.debug('Email sent:', result)  // Sucesso
logger.error('Failed to send email:', error) // Erro
```

### Webhooks (Opcional)

Configure webhooks para receber notificações:
- `email.delivered`: Email entregue
- `email.bounced`: Email rejeitado
- `email.opened`: Email aberto
- `email.clicked`: Link clicado

## 🔧 Troubleshooting

### Problema: "Missing RESEND_API_KEY"

**Solução:**
```bash
# Verifique se a variável está no .env
cat .env | grep RESEND_API_KEY

# Se não estiver, adicione:
echo 'RESEND_API_KEY="re_xxxxx"' >> .env

# Reinicie o servidor
npm run dev
```

### Problema: Email não chega

**Checklist:**
- [ ] API Key configurada corretamente
- [ ] Domínio verificado no Resend
- [ ] Email remetente usa domínio verificado
- [ ] Não excedeu limite (100/dia no free)
- [ ] Verifica pasta de spam

**Debug:**
```typescript
const result = await sendEmail({...})
console.log('Result:', result)
// success: true → Email enviado
// success: false → Veja result.error
```

### Problema: Erro "Domain not verified"

**Solução:**
1. Use `onboarding@resend.dev` para testes
2. Ou configure DNS do domínio
3. Aguarde até 48h para propagação

### Problema: Rate limit exceeded

**No plano Free:**
- Máximo: 100 emails/dia
- Solução: Upgrade para Pro ($20/mês = 50k/mês)

**Workaround temporário:**
```typescript
// Desabilitar emails em dev
if (process.env.NODE_ENV === 'development') {
  console.log('[Email] Would send:', params)
  return { success: true, id: 'dev-mode' }
}
```

## 💰 Custos e Limites

### Plano Free
- ✅ 100 emails/dia (3.000/mês)
- ✅ API completa
- ✅ Webhooks
- ✅ Analytics básico
- ❌ Sem suporte técnico

### Plano Pro ($20/mês)
- ✅ 50.000 emails/mês ($0,0004/email)
- ✅ Domínios ilimitados
- ✅ Webhooks avançados
- ✅ Analytics completo
- ✅ Suporte técnico

### Plano Enterprise (Custom)
- ✅ Volumes altos (negociável)
- ✅ SLA garantido
- ✅ IP dedicado
- ✅ Suporte prioritário

## 🚀 Deploy

### Vercel (Recomendado)

Configure variáveis em:
**Vercel Dashboard** → **Settings** → **Environment Variables**

```bash
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@versatiglass.com.br
```

### Railway / Render / Outros

Adicione as mesmas variáveis no painel de configuração.

## 📈 Melhores Práticas

### 1. Sempre Use Template HTML + Text

```typescript
await sendEmail({
  to: customer.email,
  subject: 'Seu orçamento',
  html: generateQuoteEmailHtml({...}),
  text: 'Olá! Seu orçamento está pronto...' // Fallback
})
```

### 2. Trate Erros Adequadamente

```typescript
const result = await sendEmail({...})

if (!result.success) {
  // Registrar erro
  logger.error('[Email] Failed:', result.error)

  // Notificar admin (Sentry, Slack, etc.)
  Sentry.captureException(new Error(`Email failed: ${result.error}`))

  // Não bloquear fluxo do usuário
  // Email é secundário, não deve travar o sistema
}
```

### 3. Use Rate Limiting

```typescript
// Já implementado em src/lib/rate-limit.ts
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Limite de emails por IP
const rateLimitResult = await rateLimit(request, RATE_LIMITS.strict)
if (!rateLimitResult.success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
```

### 4. Teste Templates Regularmente

```bash
# Rodar testes automatizados
npm test -- email-templates

# Enviar email de teste
npm run test:email
```

## ✅ Checklist de Configuração

- [ ] Conta criada no Resend
- [ ] Domínio verificado (ou usando onboarding@resend.dev)
- [ ] API Key gerada
- [ ] `RESEND_API_KEY` configurada no `.env`
- [ ] `RESEND_FROM_EMAIL` configurada
- [ ] Variáveis adicionadas no Vercel (produção)
- [ ] Teste enviado com sucesso
- [ ] Templates revisados
- [ ] Webhooks configurados (opcional)
- [ ] Monitoramento ativo

## 📚 Recursos

- [Documentação oficial Resend](https://resend.com/docs)
- [Resend + Next.js Guide](https://resend.com/docs/send-with-nextjs)
- [Email Templates Best Practices](https://resend.com/docs/knowledge-base/html-best-practices)
- [Webhooks](https://resend.com/docs/dashboard/webhooks/introduction)

---

**Status:** ✅ Implementado e pronto para uso
**Última atualização:** 2025-12-19
**Responsável:** DevOps Team
