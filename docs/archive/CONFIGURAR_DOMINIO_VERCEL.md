# Guia: Configurar Domínio Customizado no Vercel

## Data: 2025-12-20

---

## Objetivo

Configurar `versatiglass.com.br` como domínio principal da aplicação no Vercel, eliminando a necessidade do subdomínio `versati-glass.vercel.app`.

**Resultado final:**

- ✅ Login com Google redireciona para `https://versatiglass.com.br`
- ✅ Aplicação rodando em `https://versatiglass.com.br`
- ✅ SSL automático (HTTPS)
- ✅ Sem erros de OAuth

---

## Pré-requisitos

- Acesso ao [Vercel Dashboard](https://vercel.com/dashboard)
- Acesso ao painel de DNS do domínio `versatiglass.com.br`
- Conta com permissões de administrador no Google Cloud Console

---

## Passo 1: Adicionar Domínio no Vercel

### 1.1 Acessar Configurações do Projeto

1. Acesse: https://vercel.com/versati-glass/versati-glass
2. Clique na aba **Settings** (Configurações)
3. No menu lateral, clique em **Domains**

### 1.2 Adicionar Domínio Customizado

1. No campo "Add Domain", digite:

   ```
   versatiglass.com.br
   ```

2. Clique em **Add**

3. Vercel irá detectar que o domínio existe e pedirá confirmação

4. **IMPORTANTE:** Marque como **Primary Domain** (Domínio Principal)
   - Isso garante que todas as requisições sejam redirecionadas para `versatiglass.com.br`
   - `versati-glass.vercel.app` continuará funcionando mas redirecionará automaticamente

---

## Passo 2: Configurar DNS

Vercel oferecerá **duas opções** de configuração DNS. Escolha UMA das opções abaixo:

### Opção A: Nameservers da Vercel (RECOMENDADO - Mais Simples)

**Vantagens:**

- Configuração automática
- SSL instantâneo
- Menos passos manuais

**Passos:**

1. Vercel mostrará 2 nameservers:

   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. Acesse o painel de DNS do seu provedor de domínio (ex: Registro.br, GoDaddy, etc.)

3. Localize a seção **Nameservers** (Servidores de Nome)

4. **Substitua** os nameservers atuais pelos da Vercel:

   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

5. Salve as alterações

6. **Aguarde propagação:** 15 minutos a 48 horas (geralmente 1-2 horas)

---

### Opção B: Registro CNAME Manual

**Use esta opção se:**

- Não quer mudar os nameservers
- Tem outros serviços (email, subdomínios) no domínio atual

**Passos:**

1. Vercel mostrará o registro CNAME necessário:

   ```
   Type: CNAME
   Name: @ (ou deixe vazio para domínio raiz)
   Value: cname.vercel-dns.com
   ```

2. Acesse o painel de DNS do seu provedor

3. Adicione um novo registro **CNAME**:
   - **Host/Name:** `@` ou deixe vazio
   - **Points to/Value:** `cname.vercel-dns.com`
   - **TTL:** Automático ou 3600

4. **IMPORTANTE:** Alguns provedores não permitem CNAME no domínio raiz (`@`). Neste caso, você precisará:
   - Usar registro **A** apontando para o IP da Vercel (Vercel fornecerá o IP)
   - Ou usar registro **ALIAS/ANAME** (se disponível)

5. Salve as alterações

6. **Aguarde propagação:** 15 minutos a 48 horas

---

## Passo 3: Verificar Configuração DNS

### 3.1 Aguardar Propagação

Vercel mostrará o status da verificação:

- 🟡 **Pending** - Aguardando DNS propagar
- 🟢 **Valid** - Configuração correta

### 3.2 Verificar Manualmente (Opcional)

**Windows (PowerShell):**

```powershell
nslookup versatiglass.com.br
```

**Resultado esperado:**

```
Name:    versatiglass.com.br
Address: 76.76.21.21  # IP da Vercel (exemplo)
```

### 3.3 Testar SSL

Após DNS propagar, acesse:

```
https://versatiglass.com.br
```

**Resultado esperado:**

- ✅ Certificado SSL válido (cadeado verde no navegador)
- ✅ Site carrega normalmente
- ✅ Sem avisos de segurança

---

## Passo 4: Atualizar Variáveis de Ambiente

### 4.1 Atualizar no Vercel Dashboard

1. Acesse: https://vercel.com/versati-glass/versati-glass/settings/environment-variables

2. **Edite ou adicione** as seguintes variáveis:

   | Nome                   | Valor                                                                      | Environment |
   | ---------------------- | -------------------------------------------------------------------------- | ----------- |
   | `NEXTAUTH_URL`         | `https://versatiglass.com.br`                                              | Production  |
   | `NEXT_PUBLIC_APP_URL`  | `https://versatiglass.com.br`                                              | Production  |
   | `GOOGLE_CLIENT_ID`     | `326750104611-ej8pmihco1kmlr96ij165ocbcdrcj7qh.apps.googleusercontent.com` | Production  |
   | `GOOGLE_CLIENT_SECRET` | `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`                                      | Production  |

3. Clique em **Save** em cada variável

### 4.2 Atualizar `.env.production` (Local)

Edite o arquivo `.env.production`:

```bash
# NextAuth - PRODUÇÃO
NEXTAUTH_URL=https://versatiglass.com.br
NEXTAUTH_SECRET=h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=
AUTH_SECRET=h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=

# App URLs
NEXT_PUBLIC_APP_URL=https://versatiglass.com.br

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALENDAR_ID=primary

# Database - Railway Remote (Production)
DATABASE_URL="your_database_url_here"

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+your_number_here
NEXT_PUBLIC_COMPANY_WHATSAPP=+5521995354010

# AI Services
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Email (Resend)
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=onboarding@resend.dev

# Stripe
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

**Mudanças:**

- ✅ `NEXTAUTH_URL`: `versati-glass.vercel.app` → `versatiglass.com.br`
- ✅ `NEXT_PUBLIC_APP_URL`: `versati-glass.vercel.app` → `versatiglass.com.br`

---

## Passo 5: Atualizar Google OAuth

### 5.1 Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Selecione o projeto **Versati Glass**
3. Menu lateral → **APIs e serviços** → **Credenciais**

### 5.2 Editar Credenciais OAuth 2.0

1. Encontre a credencial:
   - **ID do cliente:** `326750104611-ej8pmihco1kmlr96ij165ocbcdrcj7qh.apps.googleusercontent.com`

2. Clique no ícone de **edição** (lápis)

### 5.3 Atualizar URIs de Redirecionamento

**REMOVER (se existirem):**

```
https://versati-glass.vercel.app/api/auth/callback/google
https://versatiglass.vercel.app/api/auth/callback/google (sem hífen)
https://versatiglass.com.br/api/auth/callback/google (antiga configuração)
```

**ADICIONAR (configuração correta):**

```
https://versatiglass.com.br/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

**Opcional (manter Vercel como fallback):**

```
https://versati-glass.vercel.app/api/auth/callback/google
```

### 5.4 Atualizar Origens JavaScript Autorizadas

**ADICIONAR:**

```
https://versatiglass.com.br
http://localhost:3000
```

**Opcional (fallback):**

```
https://versati-glass.vercel.app
```

### 5.5 Salvar

1. Clique em **SALVAR**
2. Aguarde alguns minutos para propagação (geralmente instantâneo)

---

## Passo 6: Forçar Redeploy no Vercel

Após atualizar as variáveis de ambiente, é necessário fazer um novo deploy:

### Opção A: Via Git (RECOMENDADO)

```bash
# Commit vazio para forçar redeploy
git commit --allow-empty -m "chore: Atualiza domínio para versatiglass.com.br"
git push
```

### Opção B: Via Vercel Dashboard

1. Acesse: https://vercel.com/versati-glass/versati-glass
2. Aba **Deployments**
3. Clique nos 3 pontos do último deploy
4. Clique em **Redeploy**
5. Confirme **Use existing Build Cache** (mais rápido)

---

## Passo 7: Testes de Verificação

### Teste 1: Acesso ao Site

1. Acesse: https://versatiglass.com.br
2. **Verifique:**
   - ✅ Site carrega normalmente
   - ✅ Certificado SSL válido (cadeado verde)
   - ✅ URL não redireciona para Vercel subdomain

### Teste 2: Login com Google

1. Acesse: https://versatiglass.com.br/login
2. Clique em **Continuar com Google**
3. **Verifique:**
   - ✅ Redireciona para tela de autenticação do Google
   - ✅ Após autenticar, volta para `https://versatiglass.com.br`
   - ✅ **NÃO** mostra erro `error=Configuration`
   - ✅ Login bem-sucedido

### Teste 3: Busca de CEP (Funcionalidade)

1. Acesse: https://versatiglass.com.br/orcamento
2. Etapa de localização
3. Digite um CEP válido (ex: `01310100`)
4. **Verifique:**
   - ✅ Endereço carregado corretamente
   - ✅ Sem erros de CORS

### Teste 4: Redirecionamento Automático

1. Acesse: https://versati-glass.vercel.app
2. **Verifique:**
   - ✅ Redireciona automaticamente para `https://versatiglass.com.br`
   - ✅ Sem erro 404 ou warnings

---

## Troubleshooting

### Problema 1: DNS não propaga

**Sintomas:**

- Vercel mostra "Pending" após 24h
- `nslookup` não retorna IP da Vercel

**Solução:**

1. Verifique os nameservers/CNAME no painel do provedor:

   ```powershell
   nslookup -type=NS versatiglass.com.br
   nslookup -type=CNAME versatiglass.com.br
   ```

2. Se incorreto, corrija e aguarde

3. Use ferramenta de verificação: https://www.whatsmydns.net/

### Problema 2: Erro "redirect_uri_mismatch"

**Sintomas:**

```
Error 400: redirect_uri_mismatch
The redirect URI in the request: https://versatiglass.com.br/api/auth/callback/google
does not match the ones authorized for the OAuth client.
```

**Solução:**

1. Verifique que a URI está **exatamente igual** no Google Cloud Console
2. Não esqueça `/api/auth/callback/google` no final
3. Verifique protocolo (https vs http)
4. Limpe cache do navegador (Ctrl + Shift + Delete)

### Problema 3: Erro "Configuration" persiste

**Possíveis causas:**

1. **Cache do navegador:**
   - Limpe cache ou use aba anônima

2. **Variáveis de ambiente não atualizadas:**
   - Force redeploy no Vercel (ver Passo 6)

3. **Propagação lenta do Google:**
   - Aguarde 5-10 minutos após salvar no Google Cloud Console

### Problema 4: SSL não ativa

**Sintomas:**

- Navegador mostra "Conexão não segura"
- Certificado inválido ou expirado

**Solução:**

1. Vercel Dashboard → Settings → Domains
2. Verifique que o domínio mostra status **Valid**
3. Se não, clique em "Refresh" ou "Renew Certificate"
4. Aguarde 15 minutos
5. Se persistir, remova o domínio e adicione novamente

---

## Configuração Completa (Referência Final)

### Vercel Domains

```
Primary Domain: versatiglass.com.br ✅
Redirect: versati-glass.vercel.app → versatiglass.com.br
```

### DNS Configuration

**Nameservers (Opção A):**

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**OU CNAME (Opção B):**

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### Google OAuth URIs

**URIs de redirecionamento autorizadas:**

```
✅ https://versatiglass.com.br/api/auth/callback/google
✅ http://localhost:3000/api/auth/callback/google
⚪ https://versati-glass.vercel.app/api/auth/callback/google (opcional - fallback)
```

**Origens JavaScript autorizadas:**

```
✅ https://versatiglass.com.br
✅ http://localhost:3000
⚪ https://versati-glass.vercel.app (opcional - fallback)
```

### Environment Variables (Vercel Production)

```bash
NEXTAUTH_URL=https://versatiglass.com.br
NEXT_PUBLIC_APP_URL=https://versatiglass.com.br
GOOGLE_CLIENT_ID=326750104611-ej8pmihco1kmlr96ij165ocbcdrcj7qh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

---

## Checklist Final

- [ ] Domínio `versatiglass.com.br` adicionado no Vercel
- [ ] Domínio marcado como **Primary Domain**
- [ ] DNS configurado (Nameservers ou CNAME)
- [ ] Status do domínio no Vercel: **Valid** (verde)
- [ ] SSL ativo (HTTPS funcionando)
- [ ] Variáveis de ambiente atualizadas no Vercel Dashboard
- [ ] `.env.production` atualizado localmente
- [ ] Google OAuth URIs atualizadas no Google Cloud Console
- [ ] Redeploy forçado no Vercel
- [ ] Teste 1: Site carrega em `https://versatiglass.com.br` ✅
- [ ] Teste 2: Login com Google funcionando ✅
- [ ] Teste 3: Busca de CEP funcionando ✅
- [ ] Teste 4: Redirecionamento automático do Vercel subdomain ✅

---

## Status Atual

**Aguardando:** Usuário executar os passos deste guia

**Próximo passo:**

1. Adicionar domínio no Vercel Dashboard
2. Configurar DNS
3. Atualizar variáveis de ambiente
4. Atualizar Google OAuth
5. Testar login

---

## Links Úteis

- [Vercel Dashboard - Domains](https://vercel.com/docs/concepts/projects/custom-domains)
- [Vercel Dashboard - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google Cloud Console - Credenciais](https://console.cloud.google.com/apis/credentials)
- [NextAuth.js - Google Provider](https://next-auth.js.org/providers/google)
- [DNS Checker](https://www.whatsmydns.net/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

---

**Data de criação:** 2025-12-20
**Última atualização:** 2025-12-20
**Responsável:** Claude Code Assistant
