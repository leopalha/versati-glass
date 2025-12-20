# 🚀 COMANDOS PARA DEPLOY - VERSATI GLASS

**Data:** 19 Dezembro 2024
**Objetivo:** Comandos passo a passo para executar o deploy

---

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se que:

- ✅ Node.js instalado (v18+ ou v20+)
- ✅ Git configurado
- ✅ Conta Vercel criada
- ✅ Railway database configurado
- ✅ Todas as variáveis de ambiente no `.env`

---

## 🔍 FASE 1: VERIFICAÇÃO RÁPIDA

### 1.1 Verificar Estrutura de Imagens

```powershell
cd "d:\VERSATI GLASS"

# Contar imagens de produtos
(Get-ChildItem "public\images\products\*.jpg").Count
# Resultado esperado: 12

# Contar imagens de serviços
(Get-ChildItem "public\images\services\*.jpg").Count
# Resultado esperado: 4

# Contar imagens de portfolio
(Get-ChildItem "public\images\portfolio\*.jpg").Count
# Resultado esperado: 27

# Verificar hero background
Test-Path "public\images\hero-bg.jpg"
# Resultado esperado: True
```

### 1.2 Verificar Arquivos Essenciais

```powershell
# Verificar arquivos críticos
Test-Path "package.json"           # True
Test-Path "next.config.mjs"        # True
Test-Path "tsconfig.json"          # True
Test-Path "prisma/schema.prisma"   # True
Test-Path ".env"                   # True
```

### 1.3 Verificar Dependências

```powershell
# Verificar se node_modules existe
Test-Path "node_modules"
# Se False, execute: npm install
```

---

## 🏗️ FASE 2: BUILD DE PRODUÇÃO

### 2.1 Limpar Cache (Opcional mas Recomendado)

```powershell
# Remover cache anterior
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
```

### 2.2 Gerar Prisma Client

```powershell
# Gerar Prisma Client
npx prisma generate
```

**Resultado esperado:**

```
✔ Generated Prisma Client
```

### 2.3 Executar Build

```powershell
# Build de produção
npm run build
```

**O que esperar:**

- ✅ Prisma generate completa
- ✅ Next.js compila todas as páginas
- ✅ Zero erros TypeScript
- ✅ Warnings aceitáveis (não críticos)
- ✅ Mensagem final: "Compiled successfully"

**Tempo estimado:** 2-5 minutos

### 2.4 Verificar Build

```powershell
# Verificar se .next foi criado
Test-Path ".next"
# Resultado esperado: True

# Verificar tamanho do build
(Get-ChildItem ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
# Resultado esperado: 50-200 MB (normal para Next.js)
```

---

## 🧪 FASE 3: TESTE LOCAL

### 3.1 Iniciar Servidor de Produção

```powershell
# Iniciar servidor de produção (porta 3000)
npm run start
```

**Resultado esperado:**

```
> next start
▲ Next.js 14.x
- Local: http://localhost:3000
```

### 3.2 Testes Manuais

Abra navegador em `http://localhost:3000` e teste:

**Páginas Públicas:**

- [ ] `/` - Homepage carrega com hero background
- [ ] `/produtos` - 12 produtos aparecem com imagens
- [ ] `/portfolio` - 9 projetos com imagens
- [ ] `/orcamento` - Wizard abre corretamente
- [ ] `/contato` - Formulário visível
- [ ] `/sobre` - Página carrega

**Funcionalidades:**

- [ ] Chat IA abre no canto inferior direito
- [ ] Imagens carregam sem erro 404
- [ ] Menu de navegação funciona
- [ ] Links não quebrados

**Admin (se tiver credenciais):**

- [ ] `/admin` - Login funciona
- [ ] Dashboard carrega

### 3.3 Verificar Console do Navegador

Abra DevTools (F12) e verifique:

- ❌ Nenhum erro vermelho no console
- ⚠️ Warnings amarelos são aceitáveis
- ✅ Imagens carregam (tab Network)

### 3.4 Parar Servidor

```powershell
# Pressione Ctrl+C para parar
# Ou feche o terminal
```

---

## 📦 FASE 4: PREPARAÇÃO GIT

### 4.1 Verificar Status

```powershell
git status
```

### 4.2 Adicionar Arquivos

```powershell
# Adicionar todos os arquivos
git add .

# Verificar o que será commitado
git status
```

### 4.3 Commit

```powershell
git commit -m "feat: Finaliza preparacao completa para deploy - 100% pronto

- 44 imagens organizadas (produtos, servicos, portfolio, hero)
- 282 arquivos TypeScript
- 100+ componentes funcionais
- 20+ paginas publicas e admin
- 40+ API routes
- Todas integracoes configuradas
- Documentacao completa (10+ docs)
- Build de producao testado
- Zero erros criticos

Ready for production deploy!"
```

### 4.4 Push para GitHub

```powershell
# Push para branch main
git push origin main
```

---

## 🚀 FASE 5: DEPLOY VERCEL

### Opção A: Deploy via Interface Web (RECOMENDADO)

#### 5.1 Acessar Vercel

1. Ir para https://vercel.com
2. Login com GitHub
3. Clicar em "Add New Project"

#### 5.2 Importar Repositório

1. Selecionar repositório "versati-glass"
2. Clicar em "Import"

#### 5.3 Configurar Projeto

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### 5.4 Adicionar Environment Variables

Copiar do `.env` local e adicionar:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=[GERAR NOVO PARA PRODUÇÃO]
NEXTAUTH_URL=https://versati-glass.vercel.app
GROQ_API_KEY=...
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=...
RESEND_API_KEY=...
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**IMPORTANTE: Gerar novo NEXTAUTH_SECRET**

```powershell
# Executar localmente para gerar secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Copiar output e usar como NEXTAUTH_SECRET
```

#### 5.5 Deploy

1. Clicar em "Deploy"
2. Aguardar build (2-5 minutos)
3. Verificar logs se houver erro

---

### Opção B: Deploy via CLI

#### 5.1 Instalar Vercel CLI

```powershell
npm install -g vercel
```

#### 5.2 Login

```powershell
vercel login
```

#### 5.3 Deploy

```powershell
# Deploy para produção
vercel --prod
```

Seguir prompts:

- Set up and deploy? **Y**
- Which scope? [sua conta]
- Link to existing project? **N**
- What's your project's name? **versati-glass**
- In which directory? **./**
- Override settings? **N**

---

## 🌐 FASE 6: CONFIGURAR DOMÍNIO CUSTOM (OPCIONAL)

### 6.1 No Painel Vercel

1. Ir para projeto → Settings → Domains
2. Adicionar domínio: `versatiglass.com.br`
3. Adicionar domínio: `www.versatiglass.com.br`

### 6.2 Configurar DNS

No seu provedor de DNS:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 6.3 Aguardar Propagação

- Tempo: 5 minutos a 48 horas
- Verificar: https://dnschecker.org

---

## ✅ FASE 7: VERIFICAÇÃO PÓS-DEPLOY

### 7.1 Testar Site em Produção

Acessar: `https://versati-glass.vercel.app` (ou seu domínio)

**Checklist:**

- [ ] Homepage carrega
- [ ] Todas as imagens aparecem
- [ ] Chat IA funciona
- [ ] Wizard de orçamento funciona
- [ ] Formulários enviam
- [ ] Admin login funciona
- [ ] Nenhum erro 404
- [ ] Performance aceitável (< 3s)

### 7.2 Verificar Logs

No painel Vercel:

- Deployments → [seu deploy] → Logs
- Verificar se há erros

### 7.3 Testar Integrações

**Chat IA:**

- [ ] Groq responde
- [ ] OpenAI Vision funciona (upload imagem)

**WhatsApp:**

- [ ] Mensagens chegam
- [ ] Webhook funciona

**Email:**

- [ ] Orçamentos são enviados

**Pagamentos:**

- [ ] PIX gera QR Code
- [ ] Cartão processa

---

## 🔧 TROUBLESHOOTING

### Problema: Build falha com erro TypeScript

**Solução:**

```powershell
npm run lint
npm run build
```

### Problema: Imagens não aparecem em produção

**Solução:**
Verificar `next.config.mjs`:

```javascript
images: {
  remotePatterns: [{ protocol: 'https', hostname: '**' }]
}
```

### Problema: Erro de conexão com banco

**Solução:**
Verificar `DATABASE_URL` nas variáveis de ambiente da Vercel

### Problema: Chat IA não responde

**Solução:**
Verificar `GROQ_API_KEY` e `OPENAI_API_KEY` na Vercel

### Problema: 404 em algumas páginas

**Solução:**

```powershell
# Limpar cache e rebuild
Remove-Item ".next" -Recurse -Force
npm run build
```

---

## 📊 COMANDOS DE MONITORAMENTO

### Verificar Logs em Tempo Real (após deploy)

```powershell
# Via Vercel CLI
vercel logs [deployment-url]
```

### Verificar Performance

```
Google PageSpeed Insights:
https://pagespeed.web.dev/

Lighthouse (Chrome DevTools):
F12 → Lighthouse → Analyze
```

---

## 🎯 CHECKLIST FINAL

### Pré-Deploy

- [ ] `npm run build` executa sem erros
- [ ] `npm run start` funciona localmente
- [ ] Todas as imagens carregam
- [ ] Todas as páginas funcionais
- [ ] Git commit e push concluídos

### Deploy

- [ ] Vercel deploy bem-sucedido
- [ ] Variáveis de ambiente configuradas
- [ ] Build logs sem erros críticos

### Pós-Deploy

- [ ] Site acessível em produção
- [ ] Todas as funcionalidades testadas
- [ ] Integrações funcionando
- [ ] Performance aceitável
- [ ] SEO configurado (Google Analytics, GTM)

---

## 🆘 SUPORTE

### Documentação Oficial

- **Next.js:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs
- **Prisma:** https://www.prisma.io/docs

### Logs e Debugging

```
Vercel Dashboard → [Projeto] → Deployments → [Deploy] → Logs
```

---

## 🎉 SUCESSO!

Se todos os passos acima foram concluídos:

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║  ✅ VERSATI GLASS ESTÁ NO AR! 🎉                     ║
║                                                       ║
║  URL: https://versati-glass.vercel.app               ║
║  Status: ✅ 100% Operacional                         ║
║  Performance: ✅ Otimizado                           ║
║  Funcionalidades: ✅ Todas funcionando               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

**Criado por:** Claude Code Agent
**Data:** 19 Dezembro 2024
**Versão:** 1.0
**Plataforma:** Versati Glass
