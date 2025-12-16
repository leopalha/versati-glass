# 🧪 E2E Testing with Playwright - Versati Glass

**Data:** 16 Dezembro 2024
**Status:** ✅ Implementado

---

## 📋 Overview

Testes End-to-End (E2E) usando **Playwright** para validar fluxos críticos da aplicação em navegadores reais.

---

## 🎯 Cobertura de Testes

### 1. Homepage (01-homepage.spec.ts)

- ✅ Carregamento da página
- ✅ Hero section visível
- ✅ Navegação para produtos
- ✅ Navegação para serviços
- ✅ Informações de contato
- ✅ Responsividade mobile

### 2. Quote Flow (02-quote-flow.spec.ts)

- ✅ Fluxo completo de orçamento (6 steps)
- ✅ Validação de campos obrigatórios
- ✅ Navegação back/forward
- ✅ Cálculo de preço

### 3. Authentication (03-auth-flow.spec.ts)

- ✅ Registro de novo usuário
- ✅ Login com credenciais válidas
- ✅ Erro com credenciais inválidas
- ✅ Validação de email
- ✅ Validação de senha
- ✅ Confirmação de senha
- ✅ Logout
- ✅ Redirect em rotas protegidas
- ✅ Remember me
- ✅ Recuperação de senha

### 4. Customer Portal (04-portal-flow.spec.ts)

- ✅ Dashboard do portal
- ✅ Visualizar orçamentos
- ✅ Aprovar orçamento
- ✅ Visualizar pedidos
- ✅ Tracking de pedidos
- ✅ Visualizar agendamentos
- ✅ Agendar instalação
- ✅ Reagendar instalação
- ✅ Perfil do usuário
- ✅ Alterar senha
- ✅ Visualizar documentos
- ✅ Download de documentos

### 5. Admin Dashboard (05-admin-flow.spec.ts)

- ✅ Dashboard com KPIs
- ✅ Gerenciar orçamentos
- ✅ Editar valores de orçamento
- ✅ Aprovar orçamento
- ✅ Gerenciar pedidos
- ✅ Atualizar status de pedido
- ✅ Gerenciar produtos
- ✅ Criar novo produto
- ✅ Gerenciar agendamentos
- ✅ Criar agendamento
- ✅ Gerenciar clientes
- ✅ Perfil do cliente
- ✅ Ver conversas
- ✅ Configurações
- ✅ Upload de documentos

---

## 🚀 Instalação

### 1. Instalar Playwright

```bash
# Já instalado via pnpm
pnpm add -D @playwright/test

# Instalar browsers
npx playwright install
```

### 2. Configuração

Arquivo `playwright.config.ts` já configurado com:

- ✅ Testes em `./e2e`
- ✅ Parallelização
- ✅ Retries em CI
- ✅ Screenshots on failure
- ✅ Trace on retry
- ✅ 5 browsers configurados:
  - Chrome Desktop
  - Firefox Desktop
  - Safari Desktop
  - Mobile Chrome
  - Mobile Safari

---

## 📝 Executando Testes

### Todos os testes

```bash
pnpm test:e2e
```

### Com UI interativa

```bash
pnpm test:e2e:ui
```

### Com browser visível (headed)

```bash
pnpm test:e2e:headed
```

### Teste específico

```bash
pnpm test:e2e e2e/02-quote-flow.spec.ts
```

### Apenas Chrome

```bash
pnpm test:e2e --project=chromium
```

### Apenas Mobile

```bash
pnpm test:e2e --project="Mobile Chrome"
```

### Debug mode

```bash
pnpm test:e2e --debug
```

---

## 📊 Relatórios

### Ver último relatório

```bash
pnpm test:e2e:report
```

### Gerar relatório HTML

```bash
pnpm test:e2e --reporter=html
```

### Output estruturado

```bash
pnpm test:e2e --reporter=json > test-results.json
```

---

## 🎯 Melhores Práticas

### 1. Seletores Robustos

```typescript
// ✅ Bom: Por role
await page.getByRole('button', { name: /enviar/i })

// ✅ Bom: Por label
await page.getByLabel(/email/i)

// ✅ Bom: Por texto
await page.getByText(/bem-vindo/i)

// ❌ Ruim: Por classe CSS
await page.locator('.btn-submit')

// ❌ Ruim: Por XPath frágil
await page.locator('//div[3]/button[1]')
```

### 2. Esperas Inteligentes

```typescript
// ✅ Bom: Auto-waiting do Playwright
await page.getByRole('button').click()

// ✅ Bom: waitForURL
await page.waitForURL(/\/portal/)

// ✅ Bom: waitFor com timeout customizado
await expect(page.getByText(/sucesso/i)).toBeVisible({ timeout: 10000 })

// ❌ Ruim: sleep fixo
await page.waitForTimeout(5000)
```

### 3. Isolamento de Testes

```typescript
// ✅ Bom: beforeEach para setup
test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await login(page)
})

// ✅ Bom: Dados únicos por teste
const testEmail = `test-${Date.now()}@example.com`

// ❌ Ruim: Estado compartilhado
let sharedOrderId // Pode causar race conditions
```

### 4. Assertions Claras

```typescript
// ✅ Bom: Assertions específicas
await expect(page).toHaveURL(/\/portal/)
await expect(page.getByText(/aprovado/i)).toBeVisible()

// ❌ Ruim: Assertions genéricas
expect(true).toBe(true)
```

---

## 🔧 Configuração de CI/CD

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Vercel (preview deployments)

```bash
# Test against preview deployment
BASE_URL=https://preview-url.vercel.app pnpm test:e2e
```

---

## 📸 Screenshots e Videos

### Capturar screenshots

```typescript
// No teste
await page.screenshot({ path: 'screenshot.png' })

// Em caso de falha (automático)
// Configurado em playwright.config.ts
screenshot: 'only-on-failure'
```

### Gravar vídeos

```typescript
// playwright.config.ts
use: {
  video: 'retain-on-failure'
}
```

### Traces

```bash
# Ver trace de teste falhado
npx playwright show-trace trace.zip
```

---

## 🔍 Debug

### UI Mode (melhor opção)

```bash
pnpm test:e2e:ui
```

Features:

- ✅ Ver testes em tempo real
- ✅ Time travel debugging
- ✅ Network inspector
- ✅ Console logs
- ✅ Source code viewer

### Debug com VSCode

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug E2E Tests",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": ["test", "--debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Playwright Inspector

```bash
# Abre inspetor visual
PWDEBUG=1 pnpm test:e2e
```

---

## 🎭 Cenários Avançados

### 1. Autenticação

```typescript
// Salvar estado de autenticação
test('login', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('admin@versatiglass.com')
  await page.getByLabel(/senha/i).fill('admin123')
  await page.getByRole('button', { name: /entrar/i }).click()

  // Salvar cookies
  await page.context().storageState({ path: 'auth.json' })
})

// Reusar em outros testes
test.use({ storageState: 'auth.json' })
```

### 2. Mock de APIs

```typescript
test('test with mocked API', async ({ page }) => {
  // Interceptar e mockar
  await page.route('**/api/quotes', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ quotes: [] }),
    })
  })

  await page.goto('/portal/orcamentos')
})
```

### 3. Upload de Arquivos

```typescript
test('upload document', async ({ page }) => {
  await page.setInputFiles('input[type="file"]', {
    name: 'test.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('test content'),
  })
})
```

### 4. Geolocalização

```typescript
test.use({
  geolocation: { longitude: -43.2096, latitude: -22.9068 }, // Rio de Janeiro
  permissions: ['geolocation'],
})

test('test with location', async ({ page }) => {
  await page.goto('/contato')
  // Botão "Usar minha localização" vai funcionar
})
```

### 5. Device Emulation

```typescript
test.use({
  ...devices['iPhone 12'],
  locale: 'pt-BR',
  timezoneId: 'America/Sao_Paulo',
})

test('mobile test', async ({ page }) => {
  // Teste em iPhone 12
})
```

---

## 📊 Performance Testing

### Medir Core Web Vitals

```typescript
import { test, expect } from '@playwright/test'

test('measure page performance', async ({ page }) => {
  await page.goto('/')

  // Pegar métricas de performance
  const metrics = await page.evaluate(() => JSON.stringify(window.performance.timing))

  const timing = JSON.parse(metrics)
  const loadTime = timing.loadEventEnd - timing.navigationStart

  // Validar performance
  expect(loadTime).toBeLessThan(3000) // < 3s
})
```

---

## 🚨 Troubleshooting

### Testes falhando localmente

```bash
# Limpar cache
npx playwright cache clear

# Reinstalar browsers
npx playwright install --force

# Verificar versão
npx playwright --version
```

### Timeouts

```typescript
// Aumentar timeout global
// playwright.config.ts
export default defineConfig({
  timeout: 60000, // 60s
})

// Ou por teste
test('slow test', async ({ page }) => {
  test.setTimeout(120000) // 120s
  // ...
})
```

### Elementos não encontrados

```typescript
// Ver página antes de falhar
await page.screenshot({ path: 'debug.png', fullPage: true })
await page.pause() // Pausa execução
```

### CI falhando mas local funciona

```bash
# Rodar no modo CI localmente
CI=true pnpm test:e2e

# Ou com Docker
docker run -it --rm -v $(pwd):/work/ -w /work/ mcr.microsoft.com/playwright:latest pnpm test:e2e
```

---

## 📈 Métricas

### Coverage Esperado

```yaml
Fluxos Críticos: 100%
  - Quote creation ✅
  - Authentication ✅
  - Order tracking ✅
  - Admin operations ✅

Páginas Principais: 90%
  - Homepage ✅
  - Products ✅
  - Services ✅
  - Portal ✅
  - Admin ✅

Edge Cases: 70%
  - Error handling
  - Validations
  - Loading states
```

### Tempo de Execução

```
Sequencial: ~10-15 min (todos os browsers)
Paralelo: ~3-5 min (workers: 4)
CI: ~5-8 min (paralelo com retry)
```

---

## 📚 Recursos

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD](https://playwright.dev/docs/ci)

---

## ✅ Checklist

- [x] Playwright instalado
- [x] 5 suítes de teste criadas
- [x] playwright.config.ts configurado
- [x] Scripts npm adicionados
- [x] Browsers configurados
- [ ] CI/CD configurado
- [ ] Testes executando em produção
- [ ] Alertas configurados para falhas
- [ ] Dashboard de métricas

---

_Última atualização: 16 Dezembro 2024_
