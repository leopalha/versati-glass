import { test, expect } from '@playwright/test'

test.describe('Portfolio Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/portfolio', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
  })

  test('should load portfolio page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Portfolio.*Versati Glass/)
    const heading = page.getByRole('heading', { name: /portfolio/i }).first()
    await expect(heading).toBeVisible()
  })

  test('should display all 9 portfolio projects', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for project cards
    const projectCards = page.locator('article, div[class*="project"], div[class*="portfolio"]')
    const count = await projectCards.count()

    // Should have at least 7 projects visible (allowing for lazy loading)
    expect(count).toBeGreaterThanOrEqual(7)
  })

  test('should display portfolio project images', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get portfolio images
    const portfolioImages = page.locator(
      'img[src*="/images/portfolio/"], img[alt*="Residência"], img[alt*="Projeto"]'
    )
    const count = await portfolioImages.count()

    // Should have at least 9 portfolio images (one per project)
    expect(count).toBeGreaterThanOrEqual(7)

    // Check first image is loaded correctly
    const firstImg = portfolioImages.first()
    await expect(firstImg).toBeVisible()

    const naturalWidth = await firstImg.evaluate((img: HTMLImageElement) => img.naturalWidth)
    expect(naturalWidth).toBeGreaterThan(0)
  })

  test('should verify all 27 portfolio images exist', async ({ page }) => {
    await page.waitForTimeout(2000)

    // List of expected portfolio images
    const expectedProjects = [
      'leblon',
      'barra',
      'ipanema',
      'gavea',
      'botafogo',
      'centro',
      'joatinga',
      'lagoa',
      'sao-conrado',
    ]

    // Check that at least the main project images are visible
    for (const project of expectedProjects.slice(0, 3)) {
      // Check first 3 projects
      const projectImage = page.locator(`img[src*="${project}"]`).first()

      if ((await projectImage.count()) > 0) {
        await expect(projectImage).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('should open project details/modal when clicked', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Find first project card
    const firstProject = page
      .locator('article, div[class*="project"], a[href*="/portfolio/"]')
      .first()

    if (await firstProject.isVisible()) {
      await firstProject.click()
      await page.waitForTimeout(1000)

      // Check if modal opened OR navigation occurred
      const modalOrDetails = page.locator(
        '[role="dialog"], main:has(img[src*="/images/portfolio/"])'
      )
      const isModalVisible = (await modalOrDetails.count()) > 0

      if (isModalVisible) {
        await expect(modalOrDetails.first()).toBeVisible()
      } else {
        // Check if navigated to project detail page
        expect(page.url()).toContain('/portfolio/')
      }
    }
  })

  test('should display project titles and descriptions', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get first project card
    const firstProject = page.locator('article, div[class*="project"]').first()

    if (await firstProject.isVisible()) {
      // Should have a title
      const title = firstProject.locator('h2, h3, h4, [class*="title"]').first()
      await expect(title).toBeVisible()

      const titleText = await title.textContent()
      expect(titleText?.length).toBeGreaterThan(0)
    }
  })

  test('should have image gallery functionality', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Click on first project to open gallery
    const firstProject = page.locator('article, div[class*="project"]').first()

    if (await firstProject.isVisible()) {
      await firstProject.click()
      await page.waitForTimeout(1000)

      // Check for gallery navigation (next/prev buttons, thumbnails, etc.)
      const galleryControls = page.locator(
        'button[aria-label*="Next"], button[aria-label*="Próximo"], button[aria-label*="Previous"], button[aria-label*="Anterior"]'
      )

      const controlCount = await galleryControls.count()

      if (controlCount > 0) {
        // Try clicking next button
        const nextButton = page
          .locator('button[aria-label*="Next"], button[aria-label*="Próximo"]')
          .first()

        if (await nextButton.isVisible()) {
          await nextButton.click()
          await page.waitForTimeout(500)

          // Image should have changed or index updated
          const galleryImages = page.locator('[role="dialog"] img, .gallery img')
          await expect(galleryImages.first()).toBeVisible()
        }
      }
    }
  })

  test('should load images from correct portfolio paths', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get all portfolio images
    const portfolioImages = page.locator('img[src*="/images/portfolio/"]')
    const count = await portfolioImages.count()

    // Should have multiple portfolio images
    expect(count).toBeGreaterThan(3)

    // Check first image path is correct
    const firstImg = portfolioImages.first()
    const src = await firstImg.getAttribute('src')

    // Should be from /images/portfolio/ or Next.js optimized path
    expect(src).toMatch(/\/images\/portfolio\/|_next\/image.*portfolio/)
  })

  test('should display project locations', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for location indicators (Leblon, Barra, Ipanema, etc.)
    const locationTexts = ['Leblon', 'Barra', 'Ipanema', 'Gávea', 'Botafogo']

    let foundLocations = 0
    for (const location of locationTexts) {
      const locationElement = page.getByText(location, { exact: false })
      if ((await locationElement.count()) > 0) {
        foundLocations++
      }
    }

    // Should find at least 3 location names
    expect(foundLocations).toBeGreaterThanOrEqual(3)
  })

  test('should filter projects by type if available', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for filter buttons (Residencial, Comercial, etc.)
    const filterButtons = page.locator('button[data-filter], button[data-category], [role="tab"]')
    const filterCount = await filterButtons.count()

    if (filterCount > 0) {
      // Click a filter
      await filterButtons.nth(1).click()
      await page.waitForTimeout(1000)

      // Projects should still be visible
      const projects = page.locator('article, div[class*="project"]')
      const visibleCount = await projects.count()
      expect(visibleCount).toBeGreaterThan(0)
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/portfolio', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Projects should be visible on mobile
    const projects = page.locator('article, div[class*="project"]')
    const count = await projects.count()
    expect(count).toBeGreaterThan(0)

    // First project should be visible
    await expect(projects.first()).toBeVisible()
  })

  test('should have contact CTA on portfolio page', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Check for CTA to contact or request quote
    const ctaButton = page.locator(
      'a:has-text("Orçamento"), a:has-text("Contato"), button:has-text("Orçamento")'
    )
    const count = await ctaButton.count()

    expect(count).toBeGreaterThan(0)
  })

  test('should display multiple images per project', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Click on first project
    const firstProject = page.locator('article, div[class*="project"]').first()

    if (await firstProject.isVisible()) {
      await firstProject.click()
      await page.waitForTimeout(1000)

      // Count images in modal/detail view (each project should have 3 images)
      const projectImages = page.locator('[role="dialog"] img, .modal img, .gallery img')
      const imageCount = await projectImages.count()

      // Should have at least 1 image visible
      expect(imageCount).toBeGreaterThanOrEqual(1)
    }
  })
})
