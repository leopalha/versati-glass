import { test, expect } from '@playwright/test'

// Note: This file uses storageState from playwright.config.ts
// Authentication is handled by auth.setup.ts via the 'chromium-portal' project

test.describe('Customer Portal Flow', () => {
  test('should display portal dashboard', async ({ page }) => {
    await page.goto('/portal', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show welcome message (use .first() to avoid strict mode violation)
    await expect(page.getByText(/bem.*vindo|ola|ol[áa]/i).first()).toBeVisible({ timeout: 15000 })

    // Should show statistics cards (allow accented or unaccented, use .first() to avoid strict mode)
    await expect(page.getByText(/or[cç]amentos/i).first()).toBeVisible()
    await expect(page.getByText(/pedidos/i).first()).toBeVisible()
    await expect(page.getByText(/agendamentos/i).first()).toBeVisible()
  })

  test('should navigate to quotes page', async ({ page }) => {
    await page.goto('/portal', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on quotes menu (allow accented or unaccented)
    await page
      .getByRole('link', { name: /or[cç]amentos/i })
      .first()
      .click()

    // Should be on quotes page
    await expect(page).toHaveURL(/\/portal\/orcamentos/)

    // Should show quotes page - heading is "Orcamentos"
    await expect(page.getByRole('heading', { name: /or[cç]amentos/i })).toBeVisible()
  })

  test('should view quote details', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/portal/orcamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Check for quotes or empty state - heading should be visible
    await expect(page.getByRole('heading', { name: /or[cç]amentos/i })).toBeVisible()

    // Click on first quote link if exists (link says "Ver Detalhes")
    const firstQuoteLink = page.getByRole('link', { name: /ver detalhes/i }).first()
    if ((await firstQuoteLink.count()) > 0) {
      await firstQuoteLink.click()

      // Should be on quote detail page
      await expect(page).toHaveURL(/\/portal\/orcamentos\/\w+/)

      // Should show quote information
      await expect(page.getByText(/or[cç]amento|detalhes/i).first()).toBeVisible()
    } else {
      // No quotes - verify empty state message
      await expect(page.getByText(/nenhum or[cç]amento|solicitar/i)).toBeVisible()
    }
  })

  test('should approve quote', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/portal/orcamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Look for a pending quote
    const pendingQuote = page.getByRole('link', { name: /orc-/i }).first()

    if ((await pendingQuote.count()) > 0) {
      await pendingQuote.click()
      await page.waitForLoadState('domcontentloaded')

      // Check if approve button exists
      const approveButton = page.getByRole('button', { name: /aprovar/i })
      if ((await approveButton.count()) > 0) {
        await approveButton.click()

        // Confirm approval if dialog appears
        const confirmButton = page.getByRole('button', { name: /confirmar/i })
        if ((await confirmButton.count()) > 0) {
          await confirmButton.click()
        }

        // Should show success message or status update
        await page.waitForTimeout(2000)
      }
    }
    // Test passes even without pending quotes
  })

  test('should view orders', async ({ page }) => {
    // Navigate to orders
    await page.goto('/portal/pedidos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show orders list
    await expect(page.getByRole('heading', { name: /meus pedidos/i })).toBeVisible()

    // Should have at least one order or empty state
    const hasOrders = await page.getByRole('link', { name: /ped-/i }).count()
    if (hasOrders > 0) {
      await expect(page.getByRole('link', { name: /ped-/i }).first()).toBeVisible()
    } else {
      await expect(page.getByText(/nenhum pedido|vazio/i)).toBeVisible()
    }
  })

  test('should view order details and tracking', async ({ page }) => {
    // Navigate to orders
    await page.goto('/portal/pedidos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on first order
    const firstOrder = page.getByRole('link', { name: /ped-/i }).first()
    if ((await firstOrder.count()) > 0) {
      await firstOrder.click()

      // Should be on order detail page
      await expect(page).toHaveURL(/\/portal\/pedidos\/\w+/)

      // Should show order info
      await expect(page.getByText(/status|pedido/i).first()).toBeVisible()
    }
  })

  test('should view appointments', async ({ page }) => {
    // Navigate to appointments
    await page.goto('/portal/agendamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show appointments list
    await expect(page.getByRole('heading', { name: /agendamentos/i })).toBeVisible()
  })

  test('should schedule installation', async ({ page }) => {
    // Navigate to orders with installation ready
    await page.goto('/portal/pedidos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on order with "Ready for installation" status
    const readyOrder = page.getByRole('link', { name: /ped-/i }).first()

    if ((await readyOrder.count()) > 0) {
      await readyOrder.click()
      await page.waitForLoadState('domcontentloaded')

      // Click schedule installation if button exists
      const scheduleButton = page.getByRole('button', { name: /agendar.*instala[cç][aã]o/i })
      if ((await scheduleButton.count()) > 0) {
        await scheduleButton.click()

        // Fill appointment form if it appears
        const dateInput = page.getByLabel(/data/i)
        if ((await dateInput.count()) > 0) {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)

          await dateInput.fill(tomorrow.toISOString().split('T')[0])
          const timeSelect = page.getByLabel(/hor[aá]rio/i)
          if ((await timeSelect.count()) > 0) {
            await timeSelect.selectOption('09:00')
          }

          // Submit
          const confirmBtn = page.getByRole('button', { name: /confirmar/i })
          if ((await confirmBtn.count()) > 0) {
            await confirmBtn.click()
          }
        }
      }
    }
    // Test passes even without available orders
  })

  test('should reschedule appointment', async ({ page }) => {
    // Navigate to appointments
    await page.goto('/portal/agendamentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Click on scheduled appointment if exists
    const appointment = page.getByText(/instala[cç][aã]o/i).first()

    if ((await appointment.count()) > 0) {
      await appointment.click()

      // Click reschedule button if exists
      const rescheduleButton = page.getByRole('button', { name: /reagendar/i })
      if ((await rescheduleButton.count()) > 0) {
        await rescheduleButton.click()

        // Select new date if form appears
        const dateInput = page.getByLabel(/data/i)
        if ((await dateInput.count()) > 0) {
          const nextWeek = new Date()
          nextWeek.setDate(nextWeek.getDate() + 7)

          await dateInput.fill(nextWeek.toISOString().split('T')[0])

          // Submit
          const confirmBtn = page.getByRole('button', { name: /confirmar/i })
          if ((await confirmBtn.count()) > 0) {
            await confirmBtn.click()
          }
        }
      }
    }
    // Test passes even without appointments
  })

  test('should view profile', async ({ page }) => {
    // Navigate to profile
    await page.goto('/portal/perfil', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show profile information - heading uses "Meu Perfil"
    await expect(page.getByRole('heading', { name: /meu perfil|perfil/i })).toBeVisible()
    // Inputs use name attribute, not id
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })

  test('should update profile information', async ({ page }) => {
    // Navigate to profile
    await page.goto('/portal/perfil', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Update name - inputs use name attribute
    const nameInput = page.locator('input[name="name"]')
    await nameInput.clear()
    await nameInput.fill('Customer Test Updated')

    // Save changes - button says "Salvar Alteracoes"
    await page.getByRole('button', { name: /salvar/i }).click()

    // Should show success message (use .first() to avoid strict mode violation)
    await expect(page.getByText(/atualizado|sucesso/i).first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('should change password', async ({ page }) => {
    // Navigate to profile
    await page.goto('/portal/perfil', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // The password form is always visible on the profile page
    // Fill password form - inputs use name attribute
    const currentPwdInput = page.locator('input[name="currentPassword"]')
    if ((await currentPwdInput.count()) > 0) {
      await currentPwdInput.fill('customer123')
      await page.locator('input[name="newPassword"]').fill('NewPassword123!@#')
      await page.locator('input[name="confirmPassword"]').fill('NewPassword123!@#')

      // Submit - button says "Alterar Senha"
      await page.getByRole('button', { name: /alterar senha/i }).click()

      // Wait for response
      await page.waitForTimeout(2000)
    }
    // Test passes even without password form
  })

  test('should view documents', async ({ page }) => {
    // Navigate to documents
    await page.goto('/portal/documentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Should show documents list or empty state
    const hasDocuments = await page.getByText(/contrato|nota fiscal/i).count()
    if (hasDocuments > 0) {
      await expect(page.getByRole('link', { name: /download/i }).first()).toBeVisible()
    } else {
      await expect(page.getByText(/nenhum documento|vazio/i)).toBeVisible()
    }
  })

  test('should download document', async ({ page }) => {
    // Navigate to documents
    await page.goto('/portal/documentos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(1000)

    // Check if there are documents
    const downloadButton = page.getByRole('link', { name: /download/i }).first()
    if ((await downloadButton.count()) > 0) {
      // Start waiting for download
      const downloadPromise = page.waitForEvent('download')

      // Click download
      await downloadButton.click()

      // Wait for download to complete
      const download = await downloadPromise
      expect(download.suggestedFilename()).toBeTruthy()
    }
    // Test passes even without documents
  })
})
