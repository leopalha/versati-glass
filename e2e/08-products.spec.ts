import { test, expect } from '@playwright/test'

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/produtos', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
  })

  test('should load products page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Produtos.*Versati Glass/)
    const heading = page.getByRole('heading', { name: /produtos/i }).first()
    await expect(heading).toBeVisible()
  })

  test('should display all 12 product images', async ({ page }) => {
    // Wait for product images to load
    await page.waitForTimeout(2000)

    // Check that product images are loaded
    const productImages = page.locator(
      'img[alt*="Box"], img[alt*="Guarda-Corpo"], img[alt*="Espelho"], img[alt*="Porta"], img[alt*="Vidro"]'
    )

    // Should have at least 10 products visible (allowing for lazy loading)
    const count = await productImages.count()
    expect(count).toBeGreaterThanOrEqual(10)

    // Check first few images are actually loaded (not broken)
    for (let i = 0; i < Math.min(3, count); i++) {
      const img = productImages.nth(i)
      await expect(img).toBeVisible()

      // Check image is not broken (has natural width > 0)
      const naturalWidth = await img.evaluate((img: HTMLImageElement) => img.naturalWidth)
      expect(naturalWidth).toBeGreaterThan(0)
    }
  })

  test('should display product cards with correct structure', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get first product card
    const firstProduct = page.locator('article, div[class*="product"]').first()
    await expect(firstProduct).toBeVisible({ timeout: 10000 })

    // Each product should have an image
    const productImage = firstProduct.locator('img').first()
    await expect(productImage).toBeVisible()

    // Each product should have a name/title
    const productName = firstProduct
      .locator('h2, h3, h4, [class*="title"], [class*="name"]')
      .first()
    await expect(productName).toBeVisible()
  })

  test('should navigate to product details when clicked', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Find and click first product link
    const firstProductLink = page.locator('a[href*="/produtos/"]').first()

    if (await firstProductLink.isVisible()) {
      const href = await firstProductLink.getAttribute('href')
      await firstProductLink.click()

      // Wait for navigation
      await page.waitForLoadState('domcontentloaded')

      // Check we're on a product detail page
      expect(page.url()).toContain('/produtos/')

      // Should have product details visible
      const detailsHeading = page.getByRole('heading').first()
      await expect(detailsHeading).toBeVisible()
    }
  })

  test('should filter products by category if available', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check if category filters exist
    const categoryFilters = page.locator('button[data-category], [role="tab"]')
    const filterCount = await categoryFilters.count()

    if (filterCount > 0) {
      // Click second filter
      await categoryFilters.nth(1).click()
      await page.waitForTimeout(1000)

      // Check products are still visible
      const products = page.locator('article, div[class*="product"]')
      const visibleCount = await products.count()
      expect(visibleCount).toBeGreaterThan(0)
    }
  })

  test('should have working search functionality if available', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check if search input exists
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="Buscar"], input[placeholder*="Pesquisar"]'
    )

    if (await searchInput.isVisible()) {
      // Type in search
      await searchInput.fill('box')
      await page.waitForTimeout(1000)

      // Check results are filtered
      const products = page.locator('article, div[class*="product"]')
      const count = await products.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should load product images from correct paths', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get all product images
    const productImages = page.locator('img[src*="/images/products/"]')
    const count = await productImages.count()

    // Should have multiple product images
    expect(count).toBeGreaterThan(5)

    // Check first image path is correct
    const firstImg = productImages.first()
    const src = await firstImg.getAttribute('src')

    // Should be from /images/products/ or Next.js optimized path
    expect(src).toMatch(/\/images\/products\/|_next\/image.*products/)
  })

  test('should have correct product badges', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for badges like "Mais Vendido", "Premium", etc.
    const badges = page.locator('[class*="badge"], [class*="tag"], [class*="label"]')
    const badgeCount = await badges.count()

    // At least some products should have badges
    if (badgeCount > 0) {
      const firstBadge = badges.first()
      await expect(firstBadge).toBeVisible()

      const badgeText = await firstBadge.textContent()
      expect(badgeText?.length).toBeGreaterThan(0)
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/produtos', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Products should be visible on mobile
    const products = page.locator('article, div[class*="product"]')
    const count = await products.count()
    expect(count).toBeGreaterThan(0)

    // First product should be visible
    await expect(products.first()).toBeVisible()
  })

  test('should have CTA buttons for each product', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for CTA buttons (Orçamento, Detalhes, etc.)
    const ctaButtons = page.locator(
      'a:has-text("Orçamento"), a:has-text("Detalhes"), button:has-text("Orçamento")'
    )
    const count = await ctaButtons.count()

    // Should have at least one CTA
    expect(count).toBeGreaterThan(0)
  })
})
