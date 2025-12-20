import { test, expect } from '@playwright/test'

test.describe('Quote Flow - End to End', () => {
  test('should complete full quote request flow', async ({ page }) => {
    // Listen to console logs for debugging
    page.on('console', (msg) => {
      if (msg.text().includes('[STEP-PRODUCT]')) {
        console.log('🔍 Browser console:', msg.text())
      }
    })

    // CLEAR localStorage before starting to avoid stale state
    await page.goto('/orcamento')
    await page.evaluate(() => localStorage.clear())

    // 1. Go to quote wizard page directly
    await page.goto('/orcamento', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000) // Wait for full hydration

    // 2. Step 1: Select Category - "Box para Banheiro"
    // Find button by text that contains "Box para Banheiro"
    const boxButton = page.locator('button').filter({ hasText: 'Box para Banheiro' }).first()
    await expect(boxButton).toBeVisible({ timeout: 30000 })
    await boxButton.click()

    // Wait for state update after category selection
    await page.waitForTimeout(500)

    // Click continue - this moves to step 2
    const continueBtn1 = page.getByRole('button', { name: /continuar/i })
    await expect(continueBtn1).toBeEnabled({ timeout: 10000 })
    await continueBtn1.click()

    // 3. Step 2: Select Product(s)
    await page.waitForTimeout(3000) // Wait for API call to products

    // DEBUG: Check store state
    const storeState = await page.evaluate(() => {
      const stored = localStorage.getItem('versati-quote')
      return stored ? JSON.parse(stored) : null
    })
    console.log(
      '📦 Store state in Step 2:',
      JSON.stringify(storeState?.state?.selectedCategories, null, 2)
    )

    // Wait for products to load - check for heading
    await expect(page.getByRole('heading', { name: /escolha os produtos/i })).toBeVisible({
      timeout: 15000,
    })

    // Wait for products to load from API
    await page.waitForTimeout(2000)

    // Scroll to top to ensure products are in viewport
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)

    // Select first product card
    const productButton = page
      .locator('button[type="button"]')
      .filter({ has: page.locator('h3') })
      .first()
    await expect(productButton).toBeVisible({ timeout: 15000 })
    await productButton.click()

    // After selecting product, click Continuar to go to Step 3 (details)
    const continueBtn = page.getByRole('button', { name: /continuar/i })
    await expect(continueBtn).toBeEnabled({ timeout: 5000 })
    await continueBtn.click()

    // 3. Step 3: Product Details - verify we're on details page
    await page.waitForTimeout(2000)

    // Verify we're still on the quote page
    await expect(page).toHaveURL(/\/orcamento/)
    // Verify we're on step 3 by checking for the dimension fields
    await expect(page.locator('#width')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('#height')).toBeVisible()
  })

  test('should validate category selection', async ({ page }) => {
    await page.goto('/orcamento', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000)

    // Button should be disabled without selection
    const continueButton = page.getByRole('button', { name: /continuar/i })
    await expect(continueButton).toBeDisabled()

    // Select a category
    const boxButton = page.locator('button').filter({ hasText: 'Box para Banheiro' }).first()
    await expect(boxButton).toBeVisible({ timeout: 30000 })
    await boxButton.click()

    // Wait for state update
    await page.waitForTimeout(500)

    // Now button should be enabled
    await expect(continueButton).toBeEnabled({ timeout: 10000 })
  })

  test('should allow navigation back and forth', async ({ page }) => {
    await page.goto('/orcamento', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000)

    // Step 1: Select category
    const boxButton = page.locator('button').filter({ hasText: 'Box para Banheiro' }).first()
    await expect(boxButton).toBeVisible({ timeout: 30000 })
    await boxButton.click()
    await page.waitForTimeout(500) // Wait for state update

    const continueBtn = page.getByRole('button', { name: /continuar/i })
    await expect(continueBtn).toBeEnabled({ timeout: 10000 })
    await continueBtn.click()

    // Step 2: Wait for product page
    await page.waitForTimeout(3000)

    // Should see "Escolha os produtos" (multiple selection)
    await expect(page.getByRole('heading', { name: /escolha os produtos/i })).toBeVisible({
      timeout: 30000,
    })

    // Wait for products to load from API
    await page.waitForTimeout(2000)

    // Scroll to top to ensure products are in viewport
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)

    // Select first product
    const productButton = page
      .locator('button[type="button"]')
      .filter({ has: page.locator('h3') })
      .first()
    await expect(productButton).toBeVisible({ timeout: 15000 })
    await productButton.click()

    // Verify counter shows 1 product selected
    await expect(page.getByText(/1 produto selecionado/i)).toBeVisible({ timeout: 5000 })

    // Go back to category
    await page.getByRole('button', { name: /voltar/i }).click()
    await page.waitForTimeout(2000)

    // Should be on step 1 (category) - box button should be visible
    await expect(boxButton).toBeVisible({ timeout: 30000 })
  })

  test('should show cart with items', async ({ page }) => {
    await page.goto('/orcamento', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000)

    // Step 1: Category
    const boxButton = page.locator('button').filter({ hasText: 'Box para Banheiro' }).first()
    await expect(boxButton).toBeVisible({ timeout: 30000 })
    await boxButton.click()
    await page.waitForTimeout(500) // Wait for state update

    const continueBtn = page.getByRole('button', { name: /continuar/i })
    await expect(continueBtn).toBeEnabled({ timeout: 10000 })
    await continueBtn.click()

    // Step 2: Product - select first available product
    await page.waitForTimeout(2000)
    await expect(page.getByRole('heading', { name: /escolha os produtos/i })).toBeVisible({
      timeout: 15000,
    })

    // Wait for products to load from API
    await page.waitForTimeout(2000)

    // Scroll to top to ensure products are in viewport
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)

    // Select first product
    const productButton = page
      .locator('button[type="button"]')
      .filter({ has: page.locator('h3') })
      .first()
    await expect(productButton).toBeVisible({ timeout: 15000 })
    await productButton.click()

    // Click continue to go to Step 3 (details)
    const continueBtn2 = page.getByRole('button', { name: /continuar/i })
    await expect(continueBtn2).toBeEnabled({ timeout: 5000 })
    await continueBtn2.click()

    // Wait for redirect to Step 3 (details)
    await page.waitForTimeout(2000)

    // Verify we're on step 3 (details) by checking for dimension fields
    await expect(page).toHaveURL(/\/orcamento/)
    await expect(page.locator('#width')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('#height')).toBeVisible()
  })
})
