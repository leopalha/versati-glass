import { test, expect } from '@playwright/test'

test.describe('Customer Portal Flow', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    // Login as customer
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('customer@versatiglass.com')
    await page.getByLabel(/senha/i).fill('customer123')
    await page.getByRole('button', { name: /entrar/i }).click()

    // Wait for redirect to portal
    await page.waitForURL(/\/portal/, { timeout: 10000 })
  })

  test('should display portal dashboard', async ({ page }) => {
    // Should show welcome message
    await expect(page.getByText(/bem.*vindo|olá/i)).toBeVisible()

    // Should show statistics cards
    await expect(page.getByText(/orçamentos/i)).toBeVisible()
    await expect(page.getByText(/pedidos/i)).toBeVisible()
    await expect(page.getByText(/agendamentos/i)).toBeVisible()
  })

  test('should navigate to quotes page', async ({ page }) => {
    // Click on quotes menu
    await page.getByRole('link', { name: /orçamentos/i }).click()

    // Should be on quotes page
    await expect(page).toHaveURL(/\/portal\/orcamentos/)

    // Should show quotes list
    await expect(page.getByRole('heading', { name: /meus orçamentos/i })).toBeVisible()
  })

  test('should view quote details', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/portal/orcamentos')

    // Click on first quote
    await page.getByRole('link', { name: /orc-/i }).first().click()

    // Should be on quote detail page
    await expect(page).toHaveURL(/\/portal\/orcamentos\/\w+/)

    // Should show quote information
    await expect(page.getByText(/número.*orçamento/i)).toBeVisible()
    await expect(page.getByText(/status/i)).toBeVisible()
    await expect(page.getByText(/valor total/i)).toBeVisible()
  })

  test('should approve quote', async ({ page }) => {
    // Navigate to quotes
    await page.goto('/portal/orcamentos')

    // Click on first pending quote
    await page
      .getByRole('link', { name: /orc-/i })
      .filter({ has: page.getByText(/pendente/i) })
      .first()
      .click()

    // Click approve button
    await page.getByRole('button', { name: /aprovar/i }).click()

    // Confirm approval
    await page.getByRole('button', { name: /confirmar/i }).click()

    // Should show success message
    await expect(page.getByText(/aprovado.*sucesso/i)).toBeVisible({
      timeout: 10000,
    })

    // Status should update
    await expect(page.getByText(/aprovado/i)).toBeVisible()
  })

  test('should view orders', async ({ page }) => {
    // Navigate to orders
    await page.goto('/portal/pedidos')

    // Should show orders list
    await expect(page.getByRole('heading', { name: /meus pedidos/i })).toBeVisible()

    // Should have at least one order or empty state
    const hasOrders = await page.getByRole('link', { name: /ped-/i }).count()
    if (hasOrders > 0) {
      await expect(page.getByRole('link', { name: /ped-/i }).first()).toBeVisible()
    } else {
      await expect(page.getByText(/nenhum pedido/i)).toBeVisible()
    }
  })

  test('should view order details and tracking', async ({ page }) => {
    // Navigate to orders
    await page.goto('/portal/pedidos')

    // Click on first order
    const firstOrder = page.getByRole('link', { name: /ped-/i }).first()
    if (await firstOrder.count()) {
      await firstOrder.click()

      // Should be on order detail page
      await expect(page).toHaveURL(/\/portal\/pedidos\/\w+/)

      // Should show order tracking
      await expect(page.getByText(/status.*pedido/i)).toBeVisible()
      await expect(page.getByText(/data.*entrega/i)).toBeVisible()
    }
  })

  test('should view appointments', async ({ page }) => {
    // Navigate to appointments
    await page.goto('/portal/agendamentos')

    // Should show appointments list
    await expect(page.getByRole('heading', { name: /agendamentos/i })).toBeVisible()
  })

  test('should schedule installation', async ({ page }) => {
    // Navigate to orders with installation ready
    await page.goto('/portal/pedidos')

    // Click on order with "Ready for installation" status
    const readyOrder = page
      .getByRole('link', { name: /ped-/i })
      .filter({ has: page.getByText(/pronto.*instalação/i) })
      .first()

    if (await readyOrder.count()) {
      await readyOrder.click()

      // Click schedule installation
      await page.getByRole('button', { name: /agendar instalação/i }).click()

      // Fill appointment form
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      await page.getByLabel(/data/i).fill(tomorrow.toISOString().split('T')[0])
      await page.getByLabel(/horário/i).selectOption('09:00')
      await page.getByLabel(/endereço/i).fill('Rua Test, 123')

      // Submit
      await page.getByRole('button', { name: /confirmar/i }).click()

      // Should show success message
      await expect(page.getByText(/agendado.*sucesso/i)).toBeVisible({
        timeout: 10000,
      })
    }
  })

  test('should reschedule appointment', async ({ page }) => {
    // Navigate to appointments
    await page.goto('/portal/agendamentos')

    // Click on scheduled appointment
    const appointment = page
      .getByText(/instalação/i)
      .filter({ has: page.getByText(/agendado/i) })
      .first()

    if (await appointment.count()) {
      await appointment.click()

      // Click reschedule button
      await page.getByRole('button', { name: /reagendar/i }).click()

      // Select new date
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)

      await page.getByLabel(/data/i).fill(nextWeek.toISOString().split('T')[0])
      await page.getByLabel(/horário/i).selectOption('14:00')

      // Submit
      await page.getByRole('button', { name: /confirmar/i }).click()

      // Should show success message
      await expect(page.getByText(/reagendado.*sucesso/i)).toBeVisible({
        timeout: 10000,
      })
    }
  })

  test('should view profile', async ({ page }) => {
    // Navigate to profile
    await page.goto('/portal/perfil')

    // Should show profile information
    await expect(page.getByRole('heading', { name: /meu perfil/i })).toBeVisible()
    await expect(page.getByLabel(/nome/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/telefone/i)).toBeVisible()
  })

  test('should update profile information', async ({ page }) => {
    // Navigate to profile
    await page.goto('/portal/perfil')

    // Update name
    await page.getByLabel(/nome/i).fill('Updated Name')

    // Update phone
    await page.getByLabel(/telefone/i).fill('21999999999')

    // Save changes
    await page.getByRole('button', { name: /salvar/i }).click()

    // Should show success message
    await expect(page.getByText(/atualizado.*sucesso/i)).toBeVisible({
      timeout: 10000,
    })
  })

  test('should change password', async ({ page }) => {
    // Navigate to profile
    await page.goto('/portal/perfil')

    // Click change password
    await page.getByRole('button', { name: /alterar senha/i }).click()

    // Fill password form
    await page.getByLabel(/senha atual/i).fill('customer123')
    await page.getByLabel(/nova senha/i).fill('NewPassword123!@#')
    await page.getByLabel(/confirmar.*senha/i).fill('NewPassword123!@#')

    // Submit
    await page.getByRole('button', { name: /salvar|confirmar/i }).click()

    // Should show success message
    await expect(page.getByText(/senha.*alterada.*sucesso/i)).toBeVisible({
      timeout: 10000,
    })
  })

  test('should view documents', async ({ page }) => {
    // Navigate to documents
    await page.goto('/portal/documentos')

    // Should show documents list or empty state
    const hasDocuments = await page.getByText(/contrato|nota fiscal/i).count()
    if (hasDocuments > 0) {
      await expect(page.getByRole('link', { name: /download/i }).first()).toBeVisible()
    } else {
      await expect(page.getByText(/nenhum documento/i)).toBeVisible()
    }
  })

  test('should download document', async ({ page }) => {
    // Navigate to documents
    await page.goto('/portal/documentos')

    // Check if there are documents
    const downloadButton = page.getByRole('link', { name: /download/i }).first()
    if (await downloadButton.count()) {
      // Start waiting for download
      const downloadPromise = page.waitForEvent('download')

      // Click download
      await downloadButton.click()

      // Wait for download to complete
      const download = await downloadPromise
      expect(download.suggestedFilename()).toBeTruthy()
    }
  })
})
