import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard Flow', () => {
  // Setup: Login as admin before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[id="email"]').fill('admin@versatiglass.com')
    await page.locator('input[id="password"]').fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()
    await page.waitForURL(/\/admin/, { timeout: 10000 })
  })

  test('should display admin dashboard with KPIs', async ({ page }) => {
    // Should show dashboard
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()

    // Should show KPI cards
    await expect(page.getByText(/receita.*mês/i)).toBeVisible()
    await expect(page.getByText(/orçamentos.*pendentes/i)).toBeVisible()
    await expect(page.getByText(/pedidos.*ativos/i)).toBeVisible()

    // Should show charts
    await expect(page.locator('svg')).toBeVisible() // Recharts renders SVG
  })

  test('should manage quotes', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/admin/orcamentos')

    // Should show quotes list
    await expect(page.getByRole('heading', { name: /orçamentos/i })).toBeVisible()

    // Should show filters
    await expect(page.getByRole('combobox', { name: /status/i })).toBeVisible()
  })

  test('should view and edit quote values', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/admin/orcamentos')

    // Click on first quote
    await page.getByRole('link', { name: /orc-/i }).first().click()

    // Should be on quote detail page
    await expect(page).toHaveURL(/\/admin\/orcamentos\/\w+/)

    // Click edit values button
    const editButton = page.getByRole('button', { name: /editar valores/i })
    if (await editButton.count()) {
      await editButton.click()

      // Should show edit dialog
      await expect(page.getByRole('dialog')).toBeVisible()

      // Update quantity
      await page.locator('input[id="quantity"]').first().fill('3')

      // Save changes
      await page.getByRole('button', { name: /salvar/i }).click()

      // Should close dialog and show success
      await expect(page.getByRole('dialog')).not.toBeVisible()
    }
  })

  test('should approve quote', async ({ page }) => {
    // Navigate to pending quotes
    await page.goto('/admin/orcamentos')
    await page.getByRole('combobox', { name: /status/i }).selectOption('PENDING')

    // Click on first pending quote
    const pendingQuote = page
      .getByRole('link', { name: /orc-/i })
      .filter({ has: page.getByText(/pendente/i) })
      .first()

    if (await pendingQuote.count()) {
      await pendingQuote.click()

      // Click approve button
      await page.getByRole('button', { name: /aprovar/i }).click()

      // Confirm
      await page.getByRole('button', { name: /confirmar/i }).click()

      // Should show success message
      await expect(page.getByText(/aprovado.*sucesso/i)).toBeVisible({
        timeout: 10000,
      })
    }
  })

  test('should manage orders', async ({ page }) => {
    // Navigate to orders
    await page.goto('/admin/pedidos')

    // Should show orders list
    await expect(page.getByRole('heading', { name: /pedidos/i })).toBeVisible()

    // Should show filters
    await expect(page.getByRole('combobox', { name: /status/i })).toBeVisible()
  })

  test('should update order status', async ({ page }) => {
    // Navigate to orders
    await page.goto('/admin/pedidos')

    // Click on first order
    await page.getByRole('link', { name: /ped-/i }).first().click()

    // Should be on order detail page
    await expect(page).toHaveURL(/\/admin\/pedidos\/\w+/)

    // Change status
    const statusSelect = page.getByRole('combobox', { name: /status/i })
    if (await statusSelect.count()) {
      await statusSelect.selectOption('IN_PRODUCTION')

      // Save
      await page.getByRole('button', { name: /salvar|atualizar/i }).click()

      // Should show success message
      await expect(page.getByText(/atualizado.*sucesso/i)).toBeVisible({
        timeout: 10000,
      })
    }
  })

  test('should manage products', async ({ page }) => {
    // Navigate to products
    await page.goto('/admin/produtos')

    // Should show products list
    await expect(page.getByRole('heading', { name: /produtos/i })).toBeVisible()

    // Should have add product button
    await expect(page.getByRole('button', { name: /adicionar.*produto/i })).toBeVisible()
  })

  test('should create new product', async ({ page }) => {
    // Navigate to products
    await page.goto('/admin/produtos')

    // Click add product
    await page.getByRole('button', { name: /adicionar.*produto/i }).click()

    // Should show product form
    await expect(page.getByRole('dialog')).toBeVisible()

    // Fill form
    await page.locator('input[id="name"]').fill('Vidro Temperado Test E2E')
    await page.locator('textarea[id="description"]').fill('Produto de teste E2E')
    await page.locator('select[id="category"]').selectOption('BOX_BANHEIRO')
    await page.locator('input[id="price"]').fill('500')
    await page.locator('input[id="stock"]').fill('10')

    // Save
    await page.getByRole('button', { name: /salvar|criar/i }).click()

    // Should close dialog and show success
    await expect(page.getByText(/criado.*sucesso/i)).toBeVisible({
      timeout: 10000,
    })
  })

  test('should manage appointments', async ({ page }) => {
    // Navigate to appointments
    await page.goto('/admin/agendamentos')

    // Should show calendar view
    await expect(page.getByText(/calendário|agenda/i)).toBeVisible()

    // Should have navigation buttons
    await expect(page.getByRole('button', { name: /hoje/i })).toBeVisible()
  })

  test('should create appointment', async ({ page }) => {
    // Navigate to appointments
    await page.goto('/admin/agendamentos')

    // Click create appointment
    await page.getByRole('button', { name: /criar.*agendamento/i }).click()

    // Should show appointment form
    await expect(page.getByRole('dialog')).toBeVisible()

    // Fill form
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    await page.locator('input[id="customer"]').fill('Test Customer')
    await page.locator('select[id="type"]').selectOption('INSTALACAO')
    await page.locator('input[id="date"]').fill(tomorrow.toISOString().split('T')[0])
    await page.locator('input[id="time"]').fill('10:00')

    // Save
    await page.getByRole('button', { name: /criar|salvar/i }).click()

    // Should show success
    await expect(page.getByText(/criado.*sucesso/i)).toBeVisible({
      timeout: 10000,
    })
  })

  test('should manage customers', async ({ page }) => {
    // Navigate to customers
    await page.goto('/admin/clientes')

    // Should show customers list
    await expect(page.getByRole('heading', { name: /clientes/i })).toBeVisible()

    // Should have search
    await expect(page.getByPlaceholder(/buscar/i)).toBeVisible()
  })

  test('should view customer profile', async ({ page }) => {
    // Navigate to customers
    await page.goto('/admin/clientes')

    // Click on first customer
    await page.getByRole('row').nth(1).click()

    // Should show customer detail
    await expect(page.getByText(/histórico.*compras/i)).toBeVisible()
    await expect(page.getByText(/orçamentos/i)).toBeVisible()
    await expect(page.getByText(/pedidos/i)).toBeVisible()
  })

  test('should view conversations', async ({ page }) => {
    // Navigate to conversations
    await page.goto('/admin/conversas')

    // Should show conversations list
    await expect(page.getByRole('heading', { name: /conversas|atendimentos/i })).toBeVisible()
  })

  test('should view conversation details', async ({ page }) => {
    // Navigate to conversations
    await page.goto('/admin/conversas')

    // Click on first conversation
    const firstConversation = page.getByRole('link').filter({ hasText: /\+55/ }).first()
    if (await firstConversation.count()) {
      await firstConversation.click()

      // Should show conversation messages
      await expect(page.getByText(/mensagens/i)).toBeVisible()

      // Should have reply input
      await expect(page.getByPlaceholder(/digite.*mensagem/i)).toBeVisible()
    }
  })

  test('should view settings', async ({ page }) => {
    // Navigate to settings
    await page.goto('/admin/configuracoes')

    // Should show settings sections
    await expect(page.getByText(/configurações/i)).toBeVisible()
    await expect(page.getByText(/horários.*disponíveis/i)).toBeVisible()
  })

  test('should update availability settings', async ({ page }) => {
    // Navigate to settings
    await page.goto('/admin/configuracoes')

    // Find availability section
    await page.getByText(/horários.*disponíveis/i).click()

    // Update Monday hours
    const mondayStart = page.getByLabel(/segunda.*início/i)
    if (await mondayStart.count()) {
      await mondayStart.fill('09:00')

      // Save
      await page.getByRole('button', { name: /salvar/i }).click()

      // Should show success
      await expect(page.getByText(/salvo.*sucesso/i)).toBeVisible({
        timeout: 10000,
      })
    }
  })

  test('should upload document to order', async ({ page }) => {
    // Navigate to orders
    await page.goto('/admin/pedidos')

    // Click on first order
    await page.getByRole('link', { name: /ped-/i }).first().click()

    // Click upload document
    const uploadButton = page.getByRole('button', { name: /upload.*documento/i })
    if (await uploadButton.count()) {
      await uploadButton.click()

      // Should show upload dialog
      await expect(page.getByRole('dialog')).toBeVisible()

      // Select document type
      await page.getByLabel(/tipo/i).selectOption('CONTRACT')

      // Upload file (mock)
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'test-document.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test pdf content'),
      })

      // Save
      await page.getByRole('button', { name: /upload|enviar/i }).click()

      // Should show success
      await expect(page.getByText(/enviado.*sucesso/i)).toBeVisible({
        timeout: 10000,
      })
    }
  })
})
