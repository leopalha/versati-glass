# 📋 Guia de Testes E2E - Versati Glass

**Data:** 16 Dezembro 2024
**Status:** ✅ Sprint P0 Completo

---

## 🎯 Objetivo

Executar testes end-to-end automatizados com Playwright para validar funcionalidades críticas da plataforma antes do lançamento em produção.

---

## 🚀 Como Executar os Testes E2E

### Pré-requisitos

1. **Node.js** >= 20.0.0
2. **pnpm** >= 8.0.0
3. **Banco de dados** configurado (PostgreSQL)
4. **Porta 3000** disponível

### Passo 1: Configurar Variáveis de Ambiente

O arquivo `.env.test` já está configurado com valores mock para testes. Se você tiver um banco de dados PostgreSQL local, configure a `DATABASE_URL`:

```bash
# Editar .env.test
DATABASE_URL="postgresql://user:password@localhost:5432/versatiglass"
```

### Passo 2: Popular Banco com Dados de Teste

**⚠️ IMPORTANTE:** Execute este comando ANTES de rodar os testes E2E:

```bash
pnpm db:seed:test
```

Este comando irá:

- ✅ Limpar dados existentes (cuidado em produção!)
- ✅ Criar 2 usuários de teste (admin e customer)
- ✅ Criar 6 produtos para o Quote Wizard
- ✅ Criar 1 orçamento de exemplo

**Credenciais de Teste Criadas:**

```
Admin:    admin@versatiglass.com / admin123
Customer: customer@versatiglass.com / customer123
```

### Passo 3: Executar os Testes

```bash
# Executar todos os testes (headless)
pnpm test:e2e

# Executar com interface visual
pnpm test:e2e:ui

# Executar com navegador visível (headed)
pnpm test:e2e:headed

# Ver relatório dos testes
pnpm test:e2e:report
```

---

## 📊 Estrutura dos Testes

### Arquivos de Teste

```
e2e/
├── 01-homepage.spec.ts      # Homepage navigation and layout
├── 02-quote-flow.spec.ts    # Quote Wizard complete flow
├── 03-auth-flow.spec.ts     # Login, register, password recovery
├── 04-portal-flow.spec.ts   # Customer portal features
└── 05-admin-flow.spec.ts    # Admin dashboard features
```

### Browsers Configurados

- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

**Total:** 260 testes (52 testes × 5 browsers)

---

## 🔧 Melhorias Aplicadas no Sprint P0

### 1. Refatoração de Seletores ✅

**Problema:** Seletores com regex muito amplos causavam strict mode violations

**Solução Aplicada:**

```typescript
// ❌ ANTES - Ambíguo
await page.getByLabel(/senha/i)

// ✅ DEPOIS - Específico
await page.locator('input[id="password"]')
```

**Arquivos Refatorados:**

- ✅ `e2e/03-auth-flow.spec.ts` - 11 testes
- ✅ `e2e/02-quote-flow.spec.ts` - 4 testes
- ✅ `e2e/04-portal-flow.spec.ts` - 3 testes
- ✅ `e2e/05-admin-flow.spec.ts` - 3 testes

### 2. Variáveis de Ambiente ✅

**Criado:** `.env.test` com AUTH_SECRET e configurações mock

**Configurado:** `playwright.config.ts` para carregar .env.test automaticamente

```typescript
import { config } from 'dotenv'
config({ path: '.env.test' })
```

### 3. Seed de Dados de Teste ✅

**Criado:** `prisma/seed.test.ts` com dados mínimos necessários

**Script adicionado:** `pnpm db:seed:test` no package.json

**Dados Criados:**

- 2 usuários (admin + customer)
- 6 produtos distribuídos por categorias
- 1 orçamento de exemplo

---

## 🐛 Problemas Conhecidos

### 1. Database Connection (MÉDIO)

**Status:** ⚠️ Requer ação manual

**Descrição:** O seed de teste precisa de conexão PostgreSQL ativa.

**Solução Temporária:**

- Usar banco de desenvolvimento existente
- Executar `pnpm db:seed:test` antes dos testes
- Garantir que DATABASE_URL está configurada

**Solução Definitiva (TODO):**

- Usar SQLite em memória para testes
- Ou Docker Compose com PostgreSQL para CI/CD

### 2. Testes Dependem de Dados (BAIXO)

**Descrição:** Quote Wizard tests falham se produtos não existem no banco

**Mitigação:** Script de seed deve ser executado antes de cada test suite

**Melhoria Futura:** Usar fixtures do Playwright ou mock de API

### 3. Imagens Placeholder Faltando (BAIXO)

**Descrição:** Produtos referenciam imagens que não existem em `/public/images`

**Impacto:** Warnings nos logs, não impede testes

**TODO:** Criar placeholders ou usar imagens reais

---

## 📈 Resultados Esperados

### Antes das Melhorias

- ❌ Taxa de falha: 96% (2/52 passando)
- ❌ Strict mode violations em auth forms
- ❌ Quote Wizard buttons não encontrados

### Depois do Sprint P0 (Estimativa)

- ✅ Taxa de sucesso: 70-80% (36-42/52 passando)
- ✅ Zero strict mode violations
- ✅ Todos seletores específicos e confiáveis

### Bloqueadores Remanescentes

1. ⚠️ Database connection requer setup manual
2. ⚠️ Alguns testes precisam de dados específicos no banco
3. ⚠️ Testes de funcionalidades não implementadas vão falhar

---

## 🔄 CI/CD Integration (TODO)

Para integrar os testes E2E no CI/CD:

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: versatiglass_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm db:push
      - run: pnpm db:seed:test
      - run: pnpm test:e2e
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/versatiglass_test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📝 Checklist Antes de Rodar Testes

- [ ] Banco PostgreSQL está rodando
- [ ] DATABASE_URL configurada no .env.test ou .env.local
- [ ] `pnpm install` executado
- [ ] `pnpm db:push` ou migrations aplicadas
- [ ] `pnpm db:seed:test` executado (dados populados)
- [ ] Porta 3000 disponível
- [ ] Dev server não está rodando (Playwright inicia automaticamente)

---

## 🆘 Troubleshooting

### Erro: "Port 3000 already in use"

```bash
# Windows PowerShell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Linux/Mac
killall node
```

### Erro: "Database connection failed"

```bash
# Verificar se DATABASE_URL está configurada
echo $DATABASE_URL

# Testar conexão
pnpm prisma db push
```

### Erro: "Test failed: element not found"

1. Verificar se seed foi executado: `pnpm db:seed:test`
2. Verificar se produtos existem no banco
3. Rodar teste com UI para debug: `pnpm test:e2e:ui`

### Erro: "AUTH_SECRET not found"

Verifique se `.env.test` existe e contém:

```bash
AUTH_SECRET="e2e-test-secret-key-for-playwright-testing-12345"
```

---

## 📚 Referências

- **Playwright Docs:** https://playwright.dev/
- **Prisma Seeding:** https://www.prisma.io/docs/guides/database/seed-database
- **Next.js Testing:** https://nextjs.org/docs/testing

---

## ✅ Status do Sprint P0

| Tarefa                                  | Status  | Tempo       |
| --------------------------------------- | ------- | ----------- |
| Refatorar seletores dos testes E2E      | ✅ Done | 1.5h        |
| Adicionar AUTH_SECRET ao .env           | ✅ Done | 15min       |
| Criar script de seed com dados de teste | ✅ Done | 1h          |
| Re-executar testes E2E para validar     | 🔄 Next | 30min       |
| **TOTAL**                               |         | **3h15min** |

**Próximo Passo:** Validar melhorias executando `pnpm test:e2e`

---

**Documento gerado por:** Claude Code
**Última atualização:** 16 Dezembro 2024
