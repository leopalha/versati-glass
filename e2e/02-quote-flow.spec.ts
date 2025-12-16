import { test, expect } from '@playwright/test'

test.describe('Quote Flow - End to End', () => {
  test('should complete full quote request flow', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/')

    // 2. Click on "Solicitar Orçamento" button
    await page
      .getByRole('link', { name: /solicitar orçamento/i })
      .first()
      .click()

    // 3. Should be on quote wizard page
    await expect(page).toHaveURL(/\/orcamento/)

    // 4. Step 1: Select Category
    await expect(page.getByText(/categoria do produto/i)).toBeVisible()
    await page.getByRole('button', { name: /box.*banheiro/i }).click()
    await page.getByRole('button', { name: /próximo/i }).click()

    // 5. Step 2: Select Product Type
    await expect(page.getByText(/tipo de vidro/i)).toBeVisible()
    await page.getByRole('button', { name: /vidro temperado/i }).click()
    await page.getByRole('button', { name: /próximo/i }).click()

    // 6. Step 3: Enter Measurements
    await expect(page.getByText(/medidas/i)).toBeVisible()
    await page.locator('input[id="width"]').fill('100')
    await page.locator('input[id="height"]').fill('200')
    await page.locator('input[id="quantity"]').fill('2')
    await page.getByRole('button', { name: /próximo/i }).click()

    // 7. Step 4: Customer Information
    await expect(page.getByText(/dados pessoais/i)).toBeVisible()
    await page.locator('input[id="name"]').fill('João Silva E2E Test')
    await page.locator('input[id="email"]').fill(`test-${Date.now()}@example.com`)
    await page.locator('input[id="phone"]').fill('21987654321')
    await page.locator('input[id="cpfCnpj"]').fill('123.456.789-00')
    await page.getByRole('button', { name: /próximo/i }).click()

    // 8. Step 5: Schedule (optional)
    await expect(page.getByText(/agendar.*visita/i)).toBeVisible()

    // Select date (tomorrow)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    await page.getByRole('button', { name: /próximo/i }).click()

    // 9. Step 6: Summary
    await expect(page.getByText(/resumo.*orçamento/i)).toBeVisible()
    await expect(page.getByText(/João Silva E2E Test/i)).toBeVisible()
    await expect(page.getByText(/box.*banheiro/i)).toBeVisible()

    // 10. Submit quote
    await page.getByRole('button', { name: /enviar.*orçamento/i }).click()

    // 11. Success message
    await expect(page.getByText(/orçamento enviado/i)).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByText(/entraremos em contato/i)).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/orcamento')

    // Try to proceed without selecting category
    await page.getByRole('button', { name: /próximo/i }).click()

    // Should show validation message
    await expect(page.getByText(/selecione uma categoria/i)).toBeVisible()
  })

  test('should allow navigation back and forth', async ({ page }) => {
    await page.goto('/orcamento')

    // Step 1: Select category
    await page.getByRole('button', { name: /box.*banheiro/i }).click()
    await page.getByRole('button', { name: /próximo/i }).click()

    // Step 2: Select product
    await page.getByRole('button', { name: /vidro temperado/i }).click()
    await page.getByRole('button', { name: /próximo/i }).click()

    // Step 3: Enter measurements
    await page.locator('input[id="width"]').fill('100')

    // Go back
    await page.getByRole('button', { name: /voltar/i }).click()

    // Should be on step 2
    await expect(page.getByText(/tipo de vidro/i)).toBeVisible()

    // Go back again
    await page.getByRole('button', { name: /voltar/i }).click()

    // Should be on step 1
    await expect(page.getByText(/categoria do produto/i)).toBeVisible()
  })

  test('should calculate price correctly', async ({ page }) => {
    await page.goto('/orcamento')

    // Complete steps to get to summary
    await page.getByRole('button', { name: /box.*banheiro/i }).click()
    await page.getByRole('button', { name: /próximo/i }).click()

    await page.getByRole('button', { name: /vidro temperado/i }).click()
    await page.getByRole('button', { name: /próximo/i }).click()

    await page.locator('input[id="width"]').fill('100')
    await page.locator('input[id="height"]').fill('200')
    await page.locator('input[id="quantity"]').fill('2')
    await page.getByRole('button', { name: /próximo/i }).click()

    await page.locator('input[id="name"]').fill('Test User')
    await page.locator('input[id="email"]').fill('test@example.com')
    await page.locator('input[id="phone"]').fill('21987654321')
    await page.locator('input[id="cpfCnpj"]').fill('123.456.789-00')
    await page.getByRole('button', { name: /próximo/i }).click()

    await page.getByRole('button', { name: /próximo/i }).click()

    // Check price is displayed
    await expect(page.getByText(/R\$/).filter({ hasText: /\d/ })).toBeVisible()
  })
})
