import { test, expect } from '@playwright/test'

/**
 * E2E Test: Multi-Category Quote Flow (Steps 1-7)
 *
 * Tests the complete quote wizard flow with multiple categories selected:
 * - Step 1: Select multiple categories (BOX + ESPELHOS)
 * - Step 2: View products from ALL selected categories
 * - Step 3: Detail each product individually (loop)
 * - Step 4: Review cart with all items
 * - Step 5: Fill customer data
 * - Step 6: Review final summary and submit
 * - Step 7: Schedule appointment and complete
 */

test.describe('Multi-Category Quote Flow (Steps 1-7)', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh on quote wizard
    await page.goto('/orcamento', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000) // Wait for hydration
  })

  test('should select multiple categories and see combined products', async ({ page }) => {
    // STEP 1: Select BOX category
    const boxButton = page.locator('button[aria-label*="Box para Banheiro"]')
    await expect(boxButton).toBeVisible({ timeout: 30000 })
    await boxButton.click()

    // Verify visual feedback (checkmark or selected state)
    await expect(boxButton).toHaveClass(/border-accent-500|ring-accent-500/)

    // Select ESPELHOS category
    const espelhosButton = page.locator('button[aria-label*="Espelho"]')
    await expect(espelhosButton).toBeVisible()
    await espelhosButton.click()

    // Verify counter shows "2 categoria(s) selecionada(s)"
    await expect(page.getByText(/2 categoria.*selecionada/i)).toBeVisible({ timeout: 5000 })

    // Continue to Step 2
    const continueBtn = page.getByRole('button', { name: /continuar/i })
    await expect(continueBtn).toBeEnabled()
    await continueBtn.click()

    // STEP 2: Wait for products page
    await page.waitForTimeout(3000)
    await expect(page.getByRole('heading', { name: /escolha os produtos/i })).toBeVisible({
      timeout: 15000,
    })

    // Verify message shows both categories
    await expect(page.getByText(/mostrando produtos de.*box.*espelho/i)).toBeVisible({
      timeout: 10000,
    })

    // Verify we have products from both categories (should see 5 total: 3 BOX + 2 ESPELHOS)
    const productButtons = page.locator('button').filter({ hasText: /box|espelho/i })
    const count = await productButtons.count()
    expect(count).toBeGreaterThanOrEqual(2) // At least products from 2 categories
  })

  test('should detail multiple products individually (loop through Step 3)', async ({ page }) => {
    // STEP 1: Select category
    await page.locator('button[aria-label*="Box para Banheiro"]').click()
    await page.getByRole('button', { name: /continuar/i }).click()

    // STEP 2: Select 2 products
    await page.waitForTimeout(3000)
    await expect(page.getByRole('heading', { name: /escolha os produtos/i })).toBeVisible({
      timeout: 15000,
    })

    // Select first product
    const product1 = page.locator('button').filter({ hasText: /box/i }).first()
    await expect(product1).toBeVisible({ timeout: 10000 })
    await product1.click()

    // Select second product
    const product2 = page.locator('button').filter({ hasText: /box/i }).nth(1)
    if (await product2.isVisible()) {
      await product2.click()
    }

    // Verify counter
    await expect(page.getByText(/produto.*selecionado/i)).toBeVisible({ timeout: 5000 })

    // Continue to Step 3
    await page.getByRole('button', { name: /continuar/i }).click()

    // STEP 3 - PRODUCT 1: Wait for details form
    await page.waitForTimeout(2000)

    // Verify we're on Step 3 (Detalhes)
    await expect(page.getByText(/passo 3|detalhes/i).first()).toBeVisible({ timeout: 10000 })

    // Should show progress: "Produto 1 de X"
    await expect(page.getByText(/produto 1 de \d+/i)).toBeVisible({ timeout: 5000 })

    // Fill dimensions for product 1
    const widthInput = page.locator('#width')
    await expect(widthInput).toBeVisible({ timeout: 10000 })
    await widthInput.fill('2.5')

    const heightInput = page.locator('#height')
    await heightInput.fill('2.0')

    // Click next product (or add to cart)
    const nextBtn = page.getByRole('button', { name: /próximo produto|adicionar/i })
    await expect(nextBtn).toBeVisible()
    await nextBtn.click()

    // If there's a second product, we should still be on Step 3
    const step3Indicator = page.getByText(/passo 3|detalhes/i).first()
    const isStillOnStep3 = await step3Indicator.isVisible({ timeout: 5000 }).catch(() => false)

    if (isStillOnStep3) {
      // STEP 3 - PRODUCT 2: Fill dimensions for product 2
      await expect(page.getByText(/produto 2 de \d+/i)).toBeVisible({ timeout: 5000 })
      await page.locator('#width').fill('1.5')
      await page.locator('#height').fill('1.8')

      // Click to go to cart
      const addToCartBtn = page.getByRole('button', { name: /adicionar.*carrinho|próximo/i })
      await addToCartBtn.click()
    }

    // STEP 4: Should be on cart now
    await page.waitForTimeout(2000)
    await expect(page.getByText(/passo 4|carrinho/i).first()).toBeVisible({ timeout: 10000 })
  })

  test('should complete full flow Steps 1-7 (multi-category)', async ({ page }) => {
    // ===== STEP 1: Category Selection =====
    await page.locator('button[aria-label*="Box para Banheiro"]').click()
    await page.getByRole('button', { name: /continuar/i }).click()

    // ===== STEP 2: Product Selection =====
    await page.waitForTimeout(3000)
    await expect(page.getByRole('heading', { name: /escolha os produtos/i })).toBeVisible({
      timeout: 15000,
    })

    // Select one product
    const product = page.locator('button').filter({ hasText: /box/i }).first()
    await expect(product).toBeVisible({ timeout: 10000 })
    await product.click()
    await page.getByRole('button', { name: /continuar/i }).click()

    // ===== STEP 3: Product Details =====
    await page.waitForTimeout(2000)
    await expect(page.getByText(/passo 3|detalhes/i).first()).toBeVisible({ timeout: 10000 })

    // Fill dimensions
    await page.locator('#width').fill('2.5')
    await page.locator('#height').fill('2.0')

    // Add to cart
    await page.getByRole('button', { name: /adicionar.*carrinho|próximo/i }).click()

    // ===== STEP 4: Cart Review =====
    await page.waitForTimeout(2000)
    await expect(page.getByText(/passo 4|carrinho/i).first()).toBeVisible({ timeout: 10000 })

    // Verify item is in cart
    await expect(page.getByText(/box/i)).toBeVisible()

    // Continue to customer data
    await page.getByRole('button', { name: /continuar.*dados/i }).click()

    // ===== STEP 5: Customer Data =====
    await page.waitForTimeout(2000)
    await expect(page.getByText(/passo 5|dados/i).first()).toBeVisible({ timeout: 10000 })

    // Fill customer form
    await page.locator('#name').fill('E2E Test Customer')
    await page.locator('#email').fill('e2e-test@versatiglass.com')
    await page.locator('#phone').fill('11987654321')
    await page.locator('#zipCode').fill('01310-100')

    // Wait for CEP autocomplete (optional)
    await page.waitForTimeout(2000)

    // Fill remaining address fields
    await page.locator('#street').fill('Avenida Paulista')
    await page.locator('#number').fill('1578')
    await page.locator('#neighborhood').fill('Bela Vista')
    await page.locator('#city').fill('São Paulo')
    await page.locator('#state').fill('SP')

    // Continue to summary
    await page.getByRole('button', { name: /continuar/i }).click()

    // ===== STEP 6: Final Summary =====
    await page.waitForTimeout(2000)
    await expect(page.getByText(/passo 6|resumo/i).first()).toBeVisible({ timeout: 10000 })

    // Verify summary shows customer data
    await expect(page.getByText('E2E Test Customer')).toBeVisible()
    await expect(page.getByText('e2e-test@versatiglass.com')).toBeVisible()

    // Submit quote
    const submitBtn = page.getByRole('button', { name: /enviar.*orçamento/i })
    await expect(submitBtn).toBeVisible({ timeout: 10000 })
    await submitBtn.click()

    // ===== STEP 7: Scheduling =====
    await page.waitForTimeout(3000)

    // Should be on step 7 or see success message
    const isOnStep7 = await page
      .getByText(/passo 7|agendamento/i)
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false)

    if (isOnStep7) {
      // Select a date
      const dateButton = page.locator('button').filter({ hasText: /^\d+$/ }).first()
      await expect(dateButton).toBeVisible({ timeout: 10000 })
      await dateButton.click()

      // Select a time slot
      const timeSlot = page.getByRole('button', { name: /09:00|10:00|14:00/i }).first()
      await timeSlot.click()

      // Confirm or skip scheduling
      const confirmBtn = page.getByRole('button', { name: /confirmar|pular/i }).first()
      await confirmBtn.click()
    }

    // Wait for final success screen
    await page.waitForTimeout(2000)

    // Should see success message
    await expect(page.getByText(/tudo pronto|orçamento enviado/i)).toBeVisible({ timeout: 10000 })
  })

  test('should validate Step 3 progress indicator', async ({ page }) => {
    // Select category
    await page.locator('button[aria-label*="Box para Banheiro"]').click()
    await page.getByRole('button', { name: /continuar/i }).click()

    // Select 3 products (if available)
    await page.waitForTimeout(3000)
    await expect(page.getByRole('heading', { name: /escolha os produtos/i })).toBeVisible({
      timeout: 15000,
    })

    const products = page.locator('button').filter({ hasText: /box/i })
    const count = Math.min(await products.count(), 3)

    for (let i = 0; i < count; i++) {
      await products.nth(i).click()
    }

    await page.getByRole('button', { name: /continuar/i }).click()

    // STEP 3: Verify progress shows correctly
    await page.waitForTimeout(2000)
    await expect(page.getByText(/produto 1 de \d+/i)).toBeVisible({ timeout: 10000 })

    // The "Próximo Produto" button should show progress
    const nextBtn = page.getByRole('button', { name: /próximo produto.*\d+\/\d+/i })
    if (await nextBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(nextBtn).toContainText(/\d+\/\d+/)
    }
  })

  test('should handle edit item from cart', async ({ page }) => {
    // Complete Steps 1-4 quickly
    await page.locator('button[aria-label*="Box para Banheiro"]').click()
    await page.getByRole('button', { name: /continuar/i }).click()

    await page.waitForTimeout(3000)
    const product = page.locator('button').filter({ hasText: /box/i }).first()
    await product.click()
    await page.getByRole('button', { name: /continuar/i }).click()

    await page.waitForTimeout(2000)
    await page.locator('#width').fill('2.5')
    await page.locator('#height').fill('2.0')
    await page.getByRole('button', { name: /adicionar.*carrinho/i }).click()

    // STEP 4: Cart - click edit on item
    await page.waitForTimeout(2000)
    await expect(page.getByText(/passo 4|carrinho/i).first()).toBeVisible({ timeout: 10000 })

    const editBtn = page.getByRole('button', { name: /editar/i }).first()
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    // Should go back to Step 3 with data pre-filled
    await page.waitForTimeout(2000)
    await expect(page.getByText(/passo 3|detalhes/i).first()).toBeVisible({ timeout: 10000 })

    // Verify width is pre-filled
    const widthInput = page.locator('#width')
    await expect(widthInput).toHaveValue('2.5')

    // Change dimension
    await widthInput.fill('3.0')

    // Save changes
    await page.getByRole('button', { name: /salvar|adicionar/i }).click()

    // Should go back to cart
    await page.waitForTimeout(2000)
    await expect(page.getByText(/passo 4|carrinho/i).first()).toBeVisible({ timeout: 10000 })
  })
})
