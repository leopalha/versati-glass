import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Versati Glass/)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')

    // Check hero heading
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()

    // Check CTA buttons
    const ctaButton = page.getByRole('link', { name: /solicitar orçamento/i })
    await expect(ctaButton).toBeVisible()
  })

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/')

    // Click products link
    await page
      .getByRole('link', { name: /produtos/i })
      .first()
      .click()

    // Wait for navigation
    await page.waitForURL(/\/produtos/)

    // Check products page loaded
    const heading = page.getByRole('heading', { name: /produtos/i })
    await expect(heading).toBeVisible()
  })

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/')

    // Click services link
    await page
      .getByRole('link', { name: /serviços/i })
      .first()
      .click()

    // Wait for navigation
    await page.waitForURL(/\/servicos/)

    // Check services page loaded
    const heading = page.getByRole('heading', { name: /serviços/i })
    await expect(heading).toBeVisible()
  })

  test('should display contact information', async ({ page }) => {
    await page.goto('/')

    // Check phone number (use .first() since phone appears in header and footer)
    const phone = page.getByText(/\+55.*21.*98253-6229/).first()
    await expect(phone).toBeVisible()

    // Check WhatsApp button
    const whatsapp = page.getByRole('link', { name: /whatsapp/i })
    await expect(whatsapp).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check mobile menu button exists
    const menuButton = page.getByRole('button', { name: /menu/i })
    await expect(menuButton).toBeVisible()

    // Open mobile menu
    await menuButton.click()

    // Check navigation items visible (use .first() to avoid strict mode violation)
    await expect(page.getByRole('link', { name: /produtos/i }).first()).toBeVisible()
  })
})
