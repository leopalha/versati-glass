# 🚀 Guia de Deploy - Versati Glass

## Pré-requisitos

- Conta Vercel (gratuito)
- Conta Railway para PostgreSQL (gratuito até $5/mês)
- Contas nos serviços (opcional mas recomendado):
  - Google Cloud Console (OAuth + Analytics)
  - Meta Business Suite (Pixel)
  - Stripe (Pagamentos)
  - Twilio (WhatsApp)
  - Resend (Emails)
  - Groq (IA - FREE)

---

## 1. Setup do Banco de Dados (Railway)

### 1.1 Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Provision PostgreSQL"
4. Copie a `DATABASE_URL` gerada

### 1.2 Configurar Prisma

```bash
# Adicionar DATABASE_URL no .env
DATABASE_URL="postgresql://postgres:senha@servidor.railway.app:5432/railway"

# Rodar migrations
pnpm prisma migrate deploy

# Popular banco com dados iniciais (opcional)
pnpm prisma db seed
```

---

## 2. Deploy na Vercel

### 2.1 Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente

### 2.2 Variáveis de Ambiente Essenciais

```env
# Database
DATABASE_URL="postgresql://..."

# Auth (CRITICAL!)
NEXTAUTH_URL="https://seu-dominio.vercel.app"
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"

# App
NEXT_PUBLIC_APP_URL="https://seu-dominio.vercel.app"
NEXT_PUBLIC_BASE_URL="https://seu-dominio.vercel.app"
```

### 2.3 Build Settings

- **Framework Preset:** Next.js
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`
- **Node Version:** 18.x

---

## 3. Configurar Serviços Externos

### 3.1 Google OAuth (Login)

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative a **Google+ API**
4. Vá em "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - **Application type:** Web application
   - **Authorized redirect URIs:**
     - `https://seu-dominio.vercel.app/api/auth/callback/google`
6. Copie Client ID e Client Secret para `.env`:

```env
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

### 3.2 Google Analytics

1. Acesse [analytics.google.com](https://analytics.google.com)
2. Crie uma propriedade para o site
3. Copie o Measurement ID (formato: G-XXXXXXXXXX)

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 3.3 Meta Pixel (Facebook/Instagram Ads)

1. Acesse [business.facebook.com](https://business.facebook.com)
2. Vá em "Business Settings" → "Data Sources" → "Pixels"
3. Crie um novo pixel
4. Copie o Pixel ID

```env
NEXT_PUBLIC_META_PIXEL_ID="1234567890"
```

### 3.4 Stripe (Pagamentos)

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Copie as chaves de API (modo test primeiro!)
3. Configure webhook para `/api/webhooks/stripe`

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3.5 Twilio WhatsApp

1. Acesse [console.twilio.com](https://console.twilio.com)
2. Ative WhatsApp Business API
3. Configure webhook para `/api/whatsapp/webhook`

```env
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="+14155238886"
```

### 3.6 Resend (Emails)

1. Acesse [resend.com](https://resend.com)
2. Adicione e verifique seu domínio
3. Gere uma API key

```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@seu-dominio.com"
```

### 3.7 Groq (IA para WhatsApp - FREE!)

1. Acesse [console.groq.com](https://console.groq.com)
2. Crie uma API key (100% gratuito!)

```env
GROQ_API_KEY="gsk_..."
```

---

## 4. Configurar Domínio Personalizado

### 4.1 Na Vercel

1. Vá em "Settings" → "Domains"
2. Adicione seu domínio (ex: versatiglass.com.br)
3. Configure DNS records conforme instruções

### 4.2 No Registro.br (ou seu registrar)

Adicione os seguintes records:

```
Type  Name  Value
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

### 4.3 Atualizar Variáveis

```env
NEXTAUTH_URL="https://versatiglass.com.br"
NEXT_PUBLIC_APP_URL="https://versatiglass.com.br"
NEXT_PUBLIC_BASE_URL="https://versatiglass.com.br"
```

---

## 5. Verificações Pós-Deploy

### 5.1 Checklist Funcional

- [ ] Landing page carrega corretamente
- [ ] Login com Google funciona
- [ ] Login com email/senha funciona
- [ ] Quote wizard completa fluxo
- [ ] Portal do cliente acessível
- [ ] Admin panel acessível
- [ ] Emails são enviados
- [ ] Pagamento Stripe funciona (modo test)

### 5.2 Performance (Lighthouse)

Execute audit no Chrome DevTools:

```bash
# Metas mínimas:
Performance: > 90
Accessibility: > 95
Best Practices: > 95
SEO: > 95
```

### 5.3 Monitoramento

1. **Vercel Analytics:** Já ativo automaticamente
2. **Sentry (opcional):** Para error tracking
3. **Vercel Speed Insights:** Monitorar Web Vitals

---

## 6. Manutenção

### 6.1 Atualizações

```bash
# Desenvolvimento
git checkout -b feature/nova-funcionalidade
# ... fazer changes
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade

# Deploy automático ao fazer merge na main
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

### 6.2 Rollback

Se algo der errado:

1. Vá na Vercel Dashboard
2. Clique na deployment anterior que funcionava
3. Clique em "..." → "Promote to Production"

### 6.3 Logs

```bash
# Ver logs em tempo real
vercel logs

# Ver logs de deployment específico
vercel logs [deployment-url]
```

---

## 7. Segurança

### 7.1 Secrets Management

**NUNCA** commite secrets no código!

```bash
# Adicione ao .env.local (git ignored)
STRIPE_SECRET_KEY="sk_live_..."

# Use Vercel Environment Variables para produção
```

### 7.2 Rate Limiting

APIs já têm rate limiting básico. Para produção, considere:

- Vercel Edge Config para rate limiting avançado
- Cloudflare para DDoS protection

### 7.3 Backup

Configure backups automáticos no Railway:

1. Settings → Backups
2. Enable Daily Backups

---

## 8. Troubleshooting

### 8.1 Build Fails

```bash
# Erro: Out of memory
# Solução: Aumentar Node memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm build

# Erro: Prisma não gera types
# Solução: Adicionar postinstall
"postinstall": "prisma generate"
```

### 8.2 Database Connection Issues

```bash
# Testar conexão
pnpm prisma db push

# Se falhar, verificar:
# 1. DATABASE_URL está correto
# 2. IP está na whitelist (Railway)
# 3. SSL é required (adicionar ?sslmode=require)
```

### 8.3 OAuth Redirect Error

```
Error: redirect_uri_mismatch
```

**Solução:**

1. Verificar NEXTAUTH_URL no .env
2. Adicionar URL no Google Console
3. Incluir trailing slash se necessário

---

## 9. Custos Estimados (Mensal)

### Tier Gratuito (Início)

- **Vercel:** $0 (hobby plan, 100GB bandwidth)
- **Railway:** $5 (PostgreSQL 500MB)
- **Resend:** $0 (100 emails/dia)
- **Groq:** $0 (ilimitado!)
- **Twilio:** $0 (trial + $15 crédito)
- **Total:** ~$5/mês

### Tier Crescimento (~1000 clientes)

- **Vercel:** $20/mês (Pro)
- **Railway:** $10-20/mês
- **Resend:** $0-10/mês
- **Stripe:** 3.99% + $0.39/transação
- **Twilio:** ~$50/mês (1000 mensagens)
- **Total:** ~$100-150/mês

---

## 10. Suporte

- **Documentação:** `/docs`
- **Issues:** GitHub Issues
- **Email:** dev@versatiglass.com.br

---

🎉 **Parabéns! Seu app está no ar!**

Próximos passos:

1. Configurar Google Meu Negócio
2. Criar campanhas Google Ads
3. Configurar Meta Business Suite
4. Lançar oficialmente! 🚀
