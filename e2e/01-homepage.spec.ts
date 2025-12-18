import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await expect(page).toHaveTitle(/Versati Glass/)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000)

    // Check hero heading
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()

    // Check CTA button - look for text content instead of role
    const ctaButton = page.getByText(/fazer orçamento/i).first()
    await expect(ctaButton).toBeVisible({ timeout: 30000 })
  })

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000)

    // Click products link in header navigation
    const productsLink = page.locator('header a[href="/produtos"], nav a[href="/produtos"]').first()
    if (await productsLink.isVisible().catch(() => false)) {
      await productsLink.click()
    } else {
      // Fallback to text-based search
      await page.getByRole('link', { name: /produtos/i }).first().click()
    }

    // Wait for navigation
    await page.waitForURL(/\/produtos/, { timeout: 60000 })
    await page.waitForLoadState('domcontentloaded')

    // Check products page loaded - use .first() to avoid strict mode violation
    const heading = page.getByRole('heading', { name: /produtos/i })
    await expect(heading.first()).toBeVisible()
  })

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000)

    // Click services link in header navigation
    const servicesLink = page.locator('header a[href="/servicos"], nav a[href="/servicos"]').first()
    if (await servicesLink.isVisible().catch(() => false)) {
      await servicesLink.click()
    } else {
      // Fallback to text-based search
      await page.getByRole('link', { name: /serviços/i }).first().click()
    }

    // Wait for navigation
    await page.waitForURL(/\/servicos/, { timeout: 60000 })
    await page.waitForLoadState('domcontentloaded')

    // Check services page loaded - heading is "Nossos Serviços"
    const heading = page.getByRole('heading', { name: /serviços/i }).first()
    await expect(heading).toBeVisible()
  })

  test('should display contact information', async ({ page }) => {
    // Use desktop viewport to ensure header elements are visible
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000)

    // Check phone number in header (it's a link with tel: href)
    const phone = page.locator('a[href*="tel:"]').first()
    await expect(phone).toBeVisible({ timeout: 15000 })

    // Check WhatsApp button (floating button at bottom right with wa.me link)
    const whatsapp = page.locator('a[href*="wa.me"]').first()
    await expect(whatsapp).toBeVisible({ timeout: 15000 })
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000)

    // Check mobile menu button exists - it has aria-label="Menu"
    const menuButton = page.locator('button[aria-label="Menu"]')
    await expect(menuButton).toBeVisible({ timeout: 15000 })

    // Open mobile menu
    await menuButton.click()
    await page.waitForTimeout(500)

    // Check navigation items visible after menu is open
    await expect(page.getByRole('link', { name: /produtos/i }).first()).toBeVisible({ timeout: 10000 })
  })
})
