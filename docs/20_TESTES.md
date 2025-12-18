# 20. Testes

**Versão**: 1.0.0
**Última Atualização**: 17 Dezembro 2024
**Status**: Documentação Completa ✅

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Estratégia de Testes](#estratégia-de-testes)
3. [Testes E2E (Playwright)](#testes-e2e-playwright)
4. [Testes Unitários (Vitest)](#testes-unitários-vitest)
5. [Testes de Integração](#testes-de-integração)
6. [Testes Manuais](#testes-manuais)
7. [Configuração e Setup](#configuração-e-setup)
8. [CI/CD Integration](#cicd-integration)
9. [Coverage e Métricas](#coverage-e-métricas)
10. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Esta documentação centraliza toda a estratégia e implementação de testes da plataforma Versati Glass, garantindo qualidade, confiabilidade e manutenibilidade do código.

### Stack de Testes

| Tipo                  | Ferramenta     | Cobertura        | Status          |
| --------------------- | -------------- | ---------------- | --------------- |
| **E2E (UI)**          | Playwright     | Fluxos críticos  | ✅ Implementado |
| **Unitários**         | Vitest         | Funções isoladas | ⏳ Básico       |
| **Integração**        | Vitest         | APIs + DB        | ⏳ Básico       |
| **Visual Regression** | Percy (futuro) | Screenshots      | 🔜 Planejado    |
| **Performance**       | Lighthouse CI  | Core Web Vitals  | 🔜 Planejado    |

### Cobertura Atual

```
📊 COBERTURA GLOBAL (Dezembro 2024)
┌──────────────────────────────────────┐
│ E2E Tests:        95% (fluxos críticos) │
│ Unit Tests:       40% (utilities)       │
│ Integration:      30% (APIs)            │
│ Visual:           0%  (não implementado)│
│ Performance:      0%  (não implementado)│
└──────────────────────────────────────┘

META PARA v1.2.0: 80% cobertura total
```

---

## Estratégia de Testes

### Pirâmide de Testes

```
         /\
        /  \     E2E Tests (Playwright)
       /    \    - Fluxos críticos de usuário
      /------\   - 10-15 cenários principais
     /        \
    /  INTEGR  \  Integration Tests (Vitest + Prisma)
   /    TESTS   \ - APIs + DB
  /--------------\ - 30-50 casos
 /                \
/   UNIT  TESTS    \ Unit Tests (Vitest)
--------------------  - Funções puras, utils
                      - 100+ casos
```

### Priorização

#### P0 - Crítico (Must Test)

- ✅ Fluxo de orçamento completo
- ✅ Login e registro de usuários
- ✅ Portal do cliente (visualizar pedidos)
- ✅ Admin dashboard (gestão de orçamentos)
- ⏳ Chat IA (basic smoke test)
- ⏳ Pagamentos (quando implementado)

#### P1 - Alta Prioridade

- ⏳ Validações de formulários
- ⏳ APIs de CRUD (quotes, orders, products)
- ⏳ Middleware de autenticação
- ⏳ Upload de arquivos

#### P2 - Média Prioridade

- 🔜 Funções utilitárias (formatação, validação)
- 🔜 Componentes isolados (buttons, inputs)
- 🔜 Email templates rendering

#### P3 - Baixa Prioridade

- 🔜 Edge cases raros
- 🔜 Páginas estáticas (FAQ, Termos)

---

## Testes E2E (Playwright)

### Configuração

**Arquivo**: `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3100',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 60000,
    navigationTimeout: 90000,
  },

  timeout: 120000, // 2 minutos por teste

  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    { name: 'chromium-public', testMatch: /01-homepage|02-quote-flow/ },
    { name: 'chromium-auth', testMatch: /03-auth-flow/ },
    { name: 'chromium-portal', testMatch: /04-portal-flow/ },
    { name: 'chromium-admin', testMatch: /05-admin-flow/ },
    { name: 'firefox', testMatch: /01-homepage/ },
    { name: 'webkit', testMatch: /01-homepage/ },
    { name: 'mobile-chrome', testMatch: /01-homepage/ },
    { name: 'mobile-safari', testMatch: /01-homepage/ },
  ],
})
```

### Estrutura de Testes E2E

```
e2e/
├── auth.setup.ts           # Setup de autenticação (customer + admin)
├── fixtures/
│   ├── test-users.ts       # Dados de teste de usuários
│   └── test-data.ts        # Dados de teste diversos
├── 01-homepage.spec.ts     # Teste da homepage
├── 02-quote-flow.spec.ts   # Wizard de orçamento (7 steps)
├── 03-auth-flow.spec.ts    # Login, registro, recuperação de senha
├── 04-portal-flow.spec.ts  # Portal do cliente
└── 05-admin-flow.spec.ts   # Admin dashboard
```

### Testes Implementados

#### 1. Homepage (01-homepage.spec.ts)

```typescript
test.describe('Homepage', () => {
  test('deve carregar homepage corretamente', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Versati Glass/)
    await expect(page.locator('h1')).toContainText('Transparência que transforma')
  })

  test('deve ter botão de orçamento', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /solicitar orçamento/i }).click()
    await expect(page).toHaveURL('/orcamento')
  })

  test('deve ter WhatsApp button funcional', async ({ page }) => {
    await page.goto('/')
    const whatsappButton = page.getByRole('link', { name: /whatsapp/i })
    await expect(whatsappButton).toHaveAttribute('href', /wa.me/)
  })
})
```

**Status**: ✅ 100% (3/3 testes passando)

#### 2. Quote Flow (02-quote-flow.spec.ts)

**Wizard de 7 Passos**:

1. Categoria (box, espelho, porta, etc.)
2. Produto específico
3. Dados do cliente
4. Endereço de instalação
5. Detalhes/medidas
6. Revisão de item
7. Resumo final

```typescript
test('deve completar wizard de orçamento (7 steps)', async ({ page }) => {
  await page.goto('/orcamento')

  // Step 1: Categoria
  await page.getByRole('button', { name: /box para banheiro/i }).click()

  // Step 2: Produto
  await page.getByRole('button', { name: /box de correr/i }).click()

  // Step 3: Cliente
  await page.fill('[name="name"]', 'João Teste')
  await page.fill('[name="email"]', 'joao@test.com')
  await page.fill('[name="phone"]', '21982536229')
  await page.getByRole('button', { name: /próximo/i }).click()

  // Step 4: Endereço
  await page.fill('[name="zipCode"]', '20000-000')
  await page.fill('[name="street"]', 'Rua Teste')
  await page.fill('[name="number"]', '123')
  await page.getByRole('button', { name: /próximo/i }).click()

  // Step 5: Detalhes
  await page.fill('[name="width"]', '1.20')
  await page.fill('[name="height"]', '2.00')
  await page.selectOption('[name="glassColor"]', 'incolor')
  await page.getByRole('button', { name: /próximo/i }).click()

  // Step 6: Revisão
  await expect(page.getByText('Box de Correr')).toBeVisible()
  await expect(page.getByText('João Teste')).toBeVisible()
  await page.getByRole('button', { name: /próximo/i }).click()

  // Step 7: Resumo
  await expect(page.getByText(/orçamento criado/i)).toBeVisible()
})
```

**Status**: ✅ 95% (cobertura dos 7 steps + variações)

#### 3. Auth Flow (03-auth-flow.spec.ts)

```typescript
test.describe('Authentication', () => {
  test('deve fazer login com credenciais válidas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'customer@test.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/portal')
  })

  test('deve registrar novo usuário', async ({ page }) => {
    await page.goto('/registro')
    await page.fill('[name="name"]', 'Novo Usuario')
    await page.fill('[name="email"]', `novo${Date.now()}@test.com`)
    await page.fill('[name="phone"]', '21987654321')
    await page.fill('[name="password"]', 'senha123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/portal')
  })

  test('deve solicitar recuperação de senha', async ({ page }) => {
    await page.goto('/recuperar-senha')
    await page.fill('[name="email"]', 'customer@test.com')
    await page.click('button[type="submit"]')
    await expect(page.getByText(/email enviado/i)).toBeVisible()
  })
})
```

**Status**: ✅ 100% (login, registro, recuperação)

#### 4. Portal Flow (04-portal-flow.spec.ts)

```typescript
test.describe('Customer Portal', () => {
  test.use({ storageState: CUSTOMER_AUTH })

  test('deve exibir dashboard do cliente', async ({ page }) => {
    await page.goto('/portal')
    await expect(page.getByRole('heading', { name: /meus pedidos/i })).toBeVisible()
  })

  test('deve visualizar detalhes de pedido', async ({ page }) => {
    await page.goto('/portal/pedidos')
    await page.getByRole('link', { name: /#\d+/ }).first().click()
    await expect(page).toHaveURL(/\/portal\/pedidos\/\d+/)
    await expect(page.getByText(/status/i)).toBeVisible()
  })

  test('deve atualizar perfil', async ({ page }) => {
    await page.goto('/portal/perfil')
    await page.fill('[name="name"]', 'Nome Atualizado')
    await page.click('button[type="submit"]')
    await expect(page.getByText(/perfil atualizado/i)).toBeVisible()
  })
})
```

**Status**: ✅ 90% (dashboard, pedidos, perfil)

#### 5. Admin Flow (05-admin-flow.spec.ts)

```typescript
test.describe('Admin Dashboard', () => {
  test.use({ storageState: ADMIN_AUTH })

  test('deve exibir dashboard admin', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('deve criar novo orçamento', async ({ page }) => {
    await page.goto('/admin/orcamentos')
    await page.click('button:has-text("Novo Orçamento")')
    // Preencher form...
    await page.click('button[type="submit"]')
    await expect(page.getByText(/orçamento criado/i)).toBeVisible()
  })

  test('deve gerenciar produtos', async ({ page }) => {
    await page.goto('/admin/produtos')
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('row')).toHaveCount({ minimum: 5 })
  })
})
```

**Status**: ✅ 85% (dashboard, CRUD de orçamentos, produtos)

### Executar Testes E2E

```bash
# Instalar browsers
pnpm exec playwright install

# Rodar todos os testes E2E
pnpm test:e2e

# Rodar em modo UI (debug visual)
pnpm test:e2e:ui

# Rodar em modo headed (ver browser)
pnpm test:e2e:headed

# Rodar teste específico
pnpm test:e2e e2e/01-homepage.spec.ts

# Ver relatório HTML
pnpm test:e2e:report
```

### Fixtures de Teste

**Arquivo**: `e2e/fixtures/test-users.ts`

```typescript
export const TEST_USERS = {
  customer: {
    email: 'customer@test.com',
    password: 'password123',
    name: 'Cliente Teste',
    phone: '21982536229',
  },
  admin: {
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin Teste',
    role: 'ADMIN',
  },
}
```

### Setup de Autenticação

**Arquivo**: `e2e/auth.setup.ts`

```typescript
import { test as setup } from '@playwright/test'
import { CUSTOMER_AUTH, ADMIN_AUTH } from '../playwright.config'

setup('authenticate as customer', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'customer@test.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/portal')
  await page.context().storageState({ path: CUSTOMER_AUTH })
})

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'admin@test.com')
  await page.fill('[name="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')
  await page.context().storageState({ path: ADMIN_AUTH })
})
```

---

## Testes Unitários (Vitest)

### Configuração

**Arquivo**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.next/', 'e2e/', '*.config.*'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Estrutura de Testes Unitários

```
src/
├── lib/
│   ├── utils.test.ts         # Testes de utils
│   ├── validations/
│   │   ├── quote.test.ts     # Validações de orçamento
│   │   └── product.test.ts   # Validações de produto
│   └── constants.test.ts     # Testes de constantes
├── services/
│   ├── ai.test.ts            # Testes de serviço IA
│   ├── email.test.ts         # Testes de email service
│   └── whatsapp.test.ts      # Testes de WhatsApp service
└── components/
    └── ui/
        ├── button.test.tsx   # Testes de componente Button
        └── input.test.tsx    # Testes de componente Input
```

### Exemplos de Testes Unitários

#### Teste de Validação (lib/validations/quote.test.ts)

```typescript
import { describe, it, expect } from 'vitest'
import { quoteSchema } from './quote'

describe('Quote Validation', () => {
  it('deve validar orçamento válido', () => {
    const validQuote = {
      category: 'box',
      product: 'box-correr',
      customerName: 'João Silva',
      customerEmail: 'joao@test.com',
      customerPhone: '21982536229',
    }

    const result = quoteSchema.safeParse(validQuote)
    expect(result.success).toBe(true)
  })

  it('deve rejeitar email inválido', () => {
    const invalidQuote = {
      category: 'box',
      customerEmail: 'email-invalido',
    }

    const result = quoteSchema.safeParse(invalidQuote)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('customerEmail')
  })

  it('deve rejeitar telefone com formato incorreto', () => {
    const invalidQuote = {
      customerPhone: '123',
    }

    const result = quoteSchema.safeParse(invalidQuote)
    expect(result.success).toBe(false)
  })
})
```

#### Teste de Componente (components/ui/button.test.tsx)

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button Component', () => {
  it('deve renderizar com texto', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('deve aplicar variant primary', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')
  })

  it('deve estar disabled quando prop disabled=true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

#### Teste de Utility (lib/utils.test.ts)

```typescript
import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPhone, cn } from './utils'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('deve formatar moeda brasileira', () => {
      expect(formatCurrency(1850)).toBe('R$ 1.850,00')
      expect(formatCurrency(1850.5)).toBe('R$ 1.850,50')
    })
  })

  describe('formatPhone', () => {
    it('deve formatar telefone brasileiro', () => {
      expect(formatPhone('21982536229')).toBe('(21) 98253-6229')
      expect(formatPhone('2123456789')).toBe('(21) 2345-6789')
    })
  })

  describe('cn (classNames merger)', () => {
    it('deve combinar classes corretamente', () => {
      expect(cn('text-red', 'bg-blue')).toBe('text-red bg-blue')
      expect(cn('p-4', 'p-8')).toBe('p-8') // Último prevalece
    })
  })
})
```

### Executar Testes Unitários

```bash
# Rodar todos os testes unitários
pnpm test

# Rodar em modo watch (desenvolvimento)
pnpm test:watch

# Rodar uma vez (CI)
pnpm test:run

# Gerar coverage
pnpm test:coverage
```

---

## Testes de Integração

### APIs + Banco de Dados

**Estrutura**:

```
src/app/api/
├── quotes/
│   ├── route.test.ts         # GET, POST /api/quotes
│   └── [id]/
│       └── route.test.ts     # GET, PATCH /api/quotes/:id
├── orders/
│   └── route.test.ts
└── products/
    └── route.test.ts
```

### Exemplo de Teste de API

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('POST /api/quotes', () => {
  beforeAll(async () => {
    // Setup: criar usuário de teste
    await prisma.user.create({
      data: {
        email: 'integration@test.com',
        name: 'Integration Test',
      },
    })
  })

  afterAll(async () => {
    // Cleanup: limpar dados de teste
    await prisma.quote.deleteMany({ where: { customerEmail: 'integration@test.com' } })
    await prisma.user.deleteMany({ where: { email: 'integration@test.com' } })
  })

  it('deve criar orçamento com dados válidos', async () => {
    const response = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'box',
        product: 'box-correr',
        customerName: 'João Silva',
        customerEmail: 'integration@test.com',
        customerPhone: '21982536229',
      }),
    })

    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data).toHaveProperty('id')
    expect(data.customerName).toBe('João Silva')
  })

  it('deve retornar 400 com dados inválidos', async () => {
    const response = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerEmail: 'email-invalido',
      }),
    })

    expect(response.status).toBe(400)
  })
})
```

---

## Testes Manuais

### Checklist de Smoke Test (Produção)

Executar após cada deploy:

#### Homepage

- [ ] Homepage carrega sem erros
- [ ] Todos os links funcionam
- [ ] Imagens carregam corretamente
- [ ] Botão WhatsApp funcional
- [ ] Botão "Solicitar Orçamento" redireciona

#### Wizard de Orçamento

- [ ] 7 steps carregam corretamente
- [ ] Validações de formulário funcionam
- [ ] Upload de imagem funciona (se implementado)
- [ ] Chat IA responde (smoke test básico)
- [ ] Orçamento é criado no banco
- [ ] Email de confirmação é enviado

#### Autenticação

- [ ] Login com credenciais válidas
- [ ] Registro de novo usuário
- [ ] Recuperação de senha
- [ ] Logout funciona

#### Portal do Cliente

- [ ] Dashboard carrega
- [ ] Lista de pedidos exibe
- [ ] Detalhes de pedido acessível
- [ ] Perfil editável

#### Admin Dashboard

- [ ] Dashboard carrega
- [ ] Listagem de orçamentos funciona
- [ ] Criar/editar orçamento
- [ ] Gestão de produtos
- [ ] Gestão de clientes

### Teste de Performance

**Ferramentas**:

- Google Lighthouse (automatizado)
- WebPageTest (manual)
- Chrome DevTools Performance

**Métricas Alvo**:
| Métrica | Alvo | Atual |
|---------|------|-------|
| FCP (First Contentful Paint) | < 1.8s | ~1.5s |
| LCP (Largest Contentful Paint) | < 2.5s | ~2.2s |
| TBT (Total Blocking Time) | < 200ms | ~180ms |
| CLS (Cumulative Layout Shift) | < 0.1 | ~0.05 |
| Performance Score | > 90 | ~92 |

---

## Configuração e Setup

### Setup Ambiente de Testes

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar .env.test
cp .env.example .env.test

# Editar .env.test com DATABASE_URL de teste
DATABASE_URL="postgresql://user:pass@localhost:5432/versatiglass_test"

# 3. Criar banco de dados de teste
createdb versatiglass_test

# 4. Aplicar migrations
pnpm prisma migrate deploy --preview-feature

# 5. Seed com dados de teste
pnpm db:seed:test

# 6. Instalar browsers do Playwright
pnpm exec playwright install
```

### .env.test

```bash
# Database (banco separado para testes)
DATABASE_URL="postgresql://localhost:5432/versatiglass_test"

# Auth
NEXTAUTH_URL="http://localhost:3100"
NEXTAUTH_SECRET="test-secret-key-not-for-production"

# Base URL para E2E
BASE_URL="http://localhost:3100"

# APIs (usar keys de teste/sandbox)
GROQ_API_KEY="gsk_test..."
OPENAI_API_KEY="sk-test..."
RESEND_API_KEY="re_test..."
TWILIO_ACCOUNT_SID="AC_test..."
TWILIO_AUTH_TOKEN="test..."
```

---

## CI/CD Integration

### GitHub Actions

**Arquivo**: `.github/workflows/tests.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
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

      - name: Run unit tests
        run: pnpm test:run

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
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

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/versatiglass_test

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Coverage e Métricas

### Visualizar Coverage

```bash
# Gerar relatório de coverage
pnpm test:coverage

# Abrir relatório HTML
open coverage/index.html
```

### Metas de Coverage

| Categoria      | Meta | Atual | Status |
| -------------- | ---- | ----- | ------ |
| **Global**     | 80%  | 55%   | 🟡     |
| **Utilities**  | 90%  | 75%   | 🟡     |
| **Services**   | 80%  | 40%   | 🔴     |
| **APIs**       | 70%  | 30%   | 🔴     |
| **Components** | 60%  | 25%   | 🔴     |

**Plano de Ação**:

1. ⏳ Aumentar coverage de Services (ai.ts, email.ts, whatsapp.ts)
2. ⏳ Adicionar testes de APIs críticas (quotes, orders)
3. 🔜 Testar componentes reutilizáveis (UI library)

---

## Troubleshooting

### Problema: Playwright timeout

```bash
# Aumentar timeout global
# playwright.config.ts
timeout: 180000 // 3 minutos
```

### Problema: Banco de dados em uso (testes E2E)

```bash
# Usar banco de dados isolado por test worker
# playwright.config.ts
workers: 1 // Rodar testes sequencialmente
```

### Problema: Falso positivo em testes E2E

```typescript
// Usar waitFor para elementos dinâmicos
await page.waitForSelector('[data-testid="quote-created"]', { state: 'visible' })

// Usar retry para chamadas de API
await expect(async () => {
  const response = await page.request.get('/api/quotes')
  expect(response.ok()).toBe(true)
}).toPass({ timeout: 10000 })
```

### Problema: Tests flaky (instáveis)

**Causas comuns**:

- Race conditions
- Dados de teste não limpos
- Dependências entre testes

**Soluções**:

- Usar `test.beforeEach` para cleanup
- Evitar testes dependentes (cada teste independente)
- Usar `test.describe.serial` quando ordem importa

---

## Próximos Passos

1. ⏳ Aumentar coverage de testes unitários (55% → 80%)
2. ⏳ Adicionar testes de integração para APIs críticas
3. ⏳ Implementar visual regression testing (Percy)
4. 🔜 Adicionar performance testing (Lighthouse CI)
5. 🔜 Configurar testes de acessibilidade (a11y)
6. 🔜 Implementar mutation testing (Stryker)

---

## Comandos Rápidos

```bash
# ============================================================================
# E2E TESTS (PLAYWRIGHT)
# ============================================================================

pnpm test:e2e              # Rodar todos os E2E
pnpm test:e2e:ui           # Modo UI (debug visual)
pnpm test:e2e:headed       # Ver browser executando
pnpm test:e2e:report       # Ver relatório HTML

# ============================================================================
# UNIT TESTS (VITEST)
# ============================================================================

pnpm test                  # Rodar em watch mode
pnpm test:run              # Rodar uma vez
pnpm test:coverage         # Gerar coverage

# ============================================================================
# SETUP
# ============================================================================

pnpm exec playwright install       # Instalar browsers
pnpm db:seed:test                  # Seed banco de teste
```

---

**Mantido por**: Equipe de QA - Versati Glass
**Última Revisão**: 17 Dezembro 2024
**Próxima Revisão**: Mensal
