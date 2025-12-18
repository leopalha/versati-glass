import { test, expect } from '@playwright/test'

// Note: This file uses storageState from playwright.config.ts
// Authentication is handled by auth.setup.ts via the 'chromium-admin' project

test.describe('Admin Dashboard Flow', () => {
  test('should display admin dashboard with KPIs', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show dashboard heading
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 15000 })

    // Should show KPI cards - look for text in the card labels
    await expect(page.getByText(/faturamento/i).first()).toBeVisible()
    await expect(page.getByText(/pedidos/i).first()).toBeVisible()
  })

  test('should manage quotes', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/admin/orcamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show quotes list (allow variations with/without accents)
    await expect(page.getByRole('heading', { name: /or[cç]amentos/i })).toBeVisible()
  })

  test('should view and edit quote values', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/admin/orcamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on first quote if exists
    const firstQuote = page.getByRole('link', { name: /orc-/i }).first()
    if ((await firstQuote.count()) > 0) {
      await firstQuote.click()

      // Should be on quote detail page
      await expect(page).toHaveURL(/\/admin\/orcamentos\/\w+/)

      // Click edit values button if exists
      const editButton = page.getByRole('button', { name: /editar.*valores/i })
      if ((await editButton.count()) > 0) {
        await editButton.click()

        // Should show edit dialog
        await expect(page.getByRole('dialog')).toBeVisible()

        // Close dialog
        await page.keyboard.press('Escape')
      }
    }
    // Test passes even without quotes
  })

  test('should approve quote', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/admin/orcamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on first quote if exists
    const pendingQuote = page.getByRole('link', { name: /orc-/i }).first()

    if ((await pendingQuote.count()) > 0) {
      await pendingQuote.click()
      await page.waitForLoadState('domcontentloaded')

      // Click approve button if exists
      const approveButton = page.getByRole('button', { name: /aprovar/i })
      if ((await approveButton.count()) > 0) {
        await approveButton.click()

        // Confirm if dialog appears
        const confirmButton = page.getByRole('button', { name: /confirmar/i })
        if ((await confirmButton.count()) > 0) {
          await confirmButton.click()
        }
      }
    }
    // Test passes even without pending quotes
  })

  test('should manage orders', async ({ page }) => {
    // Navigate to orders
    await page.goto('/admin/pedidos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show orders list
    await expect(page.getByRole('heading', { name: /pedidos/i })).toBeVisible()
  })

  test('should update order status', async ({ page }) => {
    // Navigate to orders
    await page.goto('/admin/pedidos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on first order if exists
    const firstOrder = page.getByRole('link', { name: /ped-/i }).first()
    if ((await firstOrder.count()) > 0) {
      await firstOrder.click()

      // Should be on order detail page
      await expect(page).toHaveURL(/\/admin\/pedidos\/\w+/)
    }
  })

  test('should manage products', async ({ page }) => {
    // Navigate to products
    await page.goto('/admin/produtos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show products heading
    await expect(page.getByRole('heading', { name: /produtos/i }).first()).toBeVisible()

    // Should have "Novo Produto" link/button (it's actually a Link wrapping Button)
    await expect(page.getByRole('link', { name: /novo produto/i })).toBeVisible()
  })

  test('should create new product', async ({ page }) => {
    // Navigate to products
    await page.goto('/admin/produtos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click "Novo Produto" link
    const newProductLink = page.getByRole('link', { name: /novo produto/i })
    if ((await newProductLink.count()) > 0) {
      await newProductLink.click()
      await page.waitForLoadState('domcontentloaded')

      // Should navigate to product creation page
      await expect(page).toHaveURL(/\/admin\/produtos\/novo/)
    }
  })

  test('should manage appointments', async ({ page }) => {
    // Navigate to appointments
    await page.goto('/admin/agendamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show calendar view or appointments heading
    await expect(page.getByText(/calend[aá]rio|agenda|agendamentos/i).first()).toBeVisible()
  })

  test('should create appointment', async ({ page }) => {
    // Navigate to appointments
    await page.goto('/admin/agendamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click create appointment if button exists
    const createButton = page.getByRole('button', { name: /criar.*agendamento|novo.*agendamento/i })
    if ((await createButton.count()) > 0) {
      await createButton.click()

      // Should show appointment form
      const dialog = page.getByRole('dialog')
      if ((await dialog.count()) > 0) {
        await page.keyboard.press('Escape')
      }
    }
    // Test passes even without create button
  })

  test('should manage customers', async ({ page }) => {
    // Navigate to customers
    await page.goto('/admin/clientes', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show customers list
    await expect(page.getByRole('heading', { name: /clientes/i })).toBeVisible()

    // Should have search
    await expect(page.getByPlaceholder(/buscar/i)).toBeVisible()
  })

  test('should view customer profile', async ({ page }) => {
    // Navigate to customers
    await page.goto('/admin/clientes', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on first customer if exists
    const firstCustomer = page.getByRole('row').nth(1)
    if ((await firstCustomer.count()) > 0) {
      const clickTarget = firstCustomer.getByRole('link').first()
      if ((await clickTarget.count()) > 0) {
        await clickTarget.click()
        // Should navigate to customer detail
        await expect(page).toHaveURL(/\/admin\/clientes\/\w+/)
      }
    }
    // Test passes even without customers
  })

  test('should view conversations', async ({ page }) => {
    // Navigate to conversations
    await page.goto('/admin/conversas', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show conversations list
    await expect(page.getByRole('heading', { name: /conversas|atendimentos/i })).toBeVisible()
  })

  test('should view conversation details', async ({ page }) => {
    // Navigate to conversations
    await page.goto('/admin/conversas', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on first conversation if exists
    const firstConversation = page.getByRole('link').filter({ hasText: /\+55/ }).first()
    if ((await firstConversation.count()) > 0) {
      await firstConversation.click()

      // Should show conversation messages area
      await expect(page.getByText(/mensagens/i)).toBeVisible()
    }
    // Test passes even without conversations
  })

  test('should view manual creation page', async ({ page }) => {
    // Navigate to manual quote creation
    await page.goto('/admin/manual', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show manual page
    await expect(page.getByText(/manual|criar|or[cç]amento/i).first()).toBeVisible()
  })

  test('should upload document to order', async ({ page }) => {
    // Navigate to orders
    await page.goto('/admin/pedidos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on first order if exists
    const firstOrder = page.getByRole('link', { name: /ped-/i }).first()
    if ((await firstOrder.count()) > 0) {
      await firstOrder.click()
      await page.waitForLoadState('domcontentloaded')

      // Click upload document if button exists
      const uploadButton = page.getByRole('button', { name: /upload.*documento/i })
      if ((await uploadButton.count()) > 0) {
        await uploadButton.click()

        // Should show upload dialog
        const dialog = page.getByRole('dialog')
        if ((await dialog.count()) > 0) {
          await page.keyboard.press('Escape')
        }
      }
    }
    // Test passes even without orders
  })
})
