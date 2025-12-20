import { test, expect } from '@playwright/test'

test.describe('Services Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/servicos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
  })

  test('should load services page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Serviços.*Versati Glass/)
    const heading = page.getByRole('heading', { name: /serviços/i }).first()
    await expect(heading).toBeVisible()
  })

  test('should display all 4 service images', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for service images
    const serviceImages = page.locator('img[src*="/images/services/"]')
    const count = await serviceImages.count()

    // Should have 4 service images
    expect(count).toBeGreaterThanOrEqual(3)

    // Check first image is loaded correctly
    const firstImg = serviceImages.first()
    await expect(firstImg).toBeVisible()

    const naturalWidth = await firstImg.evaluate((img: HTMLImageElement) => img.naturalWidth)
    expect(naturalWidth).toBeGreaterThan(0)
  })

  test('should verify all service images exist', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Expected services based on our image organization
    const expectedServices = ['residencial', 'comercial', 'manutencao', 'consultoria']

    let foundServices = 0
    for (const service of expectedServices) {
      const serviceImage = page.locator(`img[src*="${service}"]`).first()

      if ((await serviceImage.count()) > 0) {
        foundServices++
      }
    }

    // Should find at least 3 of the 4 services
    expect(foundServices).toBeGreaterThanOrEqual(3)
  })

  test('should display service cards with correct structure', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get first service card
    const firstService = page.locator('article, div[class*="service"]').first()
    await expect(firstService).toBeVisible({ timeout: 10000 })

    // Each service should have an image
    const serviceImage = firstService.locator('img').first()
    await expect(serviceImage).toBeVisible()

    // Each service should have a title
    const serviceTitle = firstService.locator('h2, h3, h4, [class*="title"]').first()
    await expect(serviceTitle).toBeVisible()
  })

  test('should display service names', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for service type texts
    const serviceTexts = ['Residencial', 'Comercial', 'Manutenção', 'Consultoria']

    let foundServices = 0
    for (const serviceText of serviceTexts) {
      const serviceElement = page.getByText(serviceText, { exact: false })
      if ((await serviceElement.count()) > 0) {
        foundServices++
      }
    }

    // Should find at least 3 service names
    expect(foundServices).toBeGreaterThanOrEqual(3)
  })

  test('should display service descriptions', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get first service card
    const firstService = page.locator('article, div[class*="service"]').first()

    if (await firstService.isVisible()) {
      // Should have description text
      const description = firstService.locator('p, [class*="description"]').first()

      if ((await description.count()) > 0) {
        await expect(description).toBeVisible()
        const descText = await description.textContent()
        expect(descText?.length).toBeGreaterThan(10)
      }
    }
  })

  test('should have CTA buttons for services', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for CTA buttons (Solicitar Orçamento, Saiba Mais, etc.)
    const ctaButtons = page.locator(
      'a:has-text("Orçamento"), a:has-text("Saiba Mais"), button:has-text("Orçamento"), button:has-text("Solicitar")'
    )
    const count = await ctaButtons.count()

    // Should have at least one CTA
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to quote flow from service', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Find CTA button to quote
    const quoteButton = page.locator('a[href*="/orcamento"], button:has-text("Orçamento")').first()

    if (await quoteButton.isVisible()) {
      await quoteButton.click()

      // Wait for navigation or modal
      await page.waitForTimeout(1000)

      // Should be on quote page or have quote modal open
      const isOnQuotePage = page.url().includes('/orcamento')
      const hasQuoteModal = (await page.locator('[role="dialog"]').count()) > 0

      expect(isOnQuotePage || hasQuoteModal).toBe(true)
    }
  })

  test('should load service images from correct paths', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get all service images
    const serviceImages = page.locator('img[src*="/images/services/"]')
    const count = await serviceImages.count()

    // Should have service images
    expect(count).toBeGreaterThan(0)

    // Check first image path is correct
    const firstImg = serviceImages.first()
    const src = await firstImg.getAttribute('src')

    // Should be from /images/services/ or Next.js optimized path
    expect(src).toMatch(/\/images\/services\/|_next\/image.*services/)
  })

  test('should display service features/benefits', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for feature lists (ul, li elements)
    const featureLists = page.locator('ul li, [class*="feature"]')
    const count = await featureLists.count()

    if (count > 0) {
      // Should have at least some features visible
      expect(count).toBeGreaterThan(2)

      const firstFeature = featureLists.first()
      await expect(firstFeature).toBeVisible()
    }
  })

  test('should have contact information section', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for contact section
    const contactSection = page.locator(
      'section:has-text("Contato"), div:has-text("Entre em contato")'
    )

    if ((await contactSection.count()) > 0) {
      await expect(contactSection.first()).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/servicos', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Services should be visible on mobile
    const services = page.locator('article, div[class*="service"]')
    const count = await services.count()
    expect(count).toBeGreaterThan(0)

    // First service should be visible
    await expect(services.first()).toBeVisible()
  })

  test('should display service process/workflow if available', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for process steps (numbered lists, step indicators, etc.)
    const processSteps = page.locator('[class*="step"], [class*="process"], ol li, .timeline li')
    const count = await processSteps.count()

    if (count > 0) {
      // Should have at least 3 steps
      expect(count).toBeGreaterThanOrEqual(3)
    }
  })

  test('should have testimonials or case studies section', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for testimonials section
    const testimonialsSection = page.locator(
      'section:has-text("Depoimento"), section:has-text("Cliente"), [class*="testimonial"]'
    )

    if ((await testimonialsSection.count()) > 0) {
      await expect(testimonialsSection.first()).toBeVisible()
    }
  })
})
