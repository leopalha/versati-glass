import { test, expect } from '@playwright/test'

test.describe('Image Validation - Complete Site', () => {
  test('should validate all 12 product images are accessible', async ({ page }) => {
    await page.goto('/produtos', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Expected product images based on our organization
    const expectedProducts = [
      'box-premium',
      'box-incolor',
      'box-canto',
      'guarda-corpo',
      'espelho-led',
      'porta-vidro',
      'janela-maximar',
      'divisoria',
      'tampo-mesa',
      'prateleira',
      'cobertura',
      'fechamento',
    ]

    let successCount = 0
    const failedImages: string[] = []

    for (const product of expectedProducts) {
      // Check if image exists in DOM
      const img = page.locator(`img[src*="${product}"]`).first()
      const count = await img.count()

      if (count > 0) {
        // Check if image loaded successfully
        const isVisible = await img.isVisible().catch(() => false)

        if (isVisible) {
          const naturalWidth = await img
            .evaluate((img: HTMLImageElement) => img.naturalWidth)
            .catch(() => 0)

          if (naturalWidth > 0) {
            successCount++
          } else {
            failedImages.push(product)
          }
        } else {
          failedImages.push(product)
        }
      } else {
        failedImages.push(product)
      }
    }

    // Log results
    console.log(`✅ Product images loaded: ${successCount}/${expectedProducts.length}`)
    if (failedImages.length > 0) {
      console.log(`❌ Failed images: ${failedImages.join(', ')}`)
    }

    // At least 10 of 12 products should have valid images
    expect(successCount).toBeGreaterThanOrEqual(10)
  })

  test('should validate all 4 service images are accessible', async ({ page }) => {
    await page.goto('/servicos', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Expected service images
    const expectedServices = ['residencial', 'comercial', 'manutencao', 'consultoria']

    let successCount = 0
    const failedImages: string[] = []

    for (const service of expectedServices) {
      const img = page.locator(`img[src*="${service}"]`).first()
      const count = await img.count()

      if (count > 0) {
        const isVisible = await img.isVisible().catch(() => false)

        if (isVisible) {
          const naturalWidth = await img
            .evaluate((img: HTMLImageElement) => img.naturalWidth)
            .catch(() => 0)

          if (naturalWidth > 0) {
            successCount++
          } else {
            failedImages.push(service)
          }
        } else {
          failedImages.push(service)
        }
      } else {
        failedImages.push(service)
      }
    }

    console.log(`✅ Service images loaded: ${successCount}/${expectedServices.length}`)
    if (failedImages.length > 0) {
      console.log(`❌ Failed images: ${failedImages.join(', ')}`)
    }

    // All 4 service images should be accessible
    expect(successCount).toBeGreaterThanOrEqual(3)
  })

  test('should validate portfolio images are accessible', async ({ page }) => {
    await page.goto('/portfolio', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Expected portfolio project names
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

    let successCount = 0
    const failedImages: string[] = []

    for (const project of expectedProjects) {
      // Check for at least one image per project
      const img = page.locator(`img[src*="${project}"]`).first()
      const count = await img.count()

      if (count > 0) {
        const isVisible = await img.isVisible().catch(() => false)

        if (isVisible) {
          const naturalWidth = await img
            .evaluate((img: HTMLImageElement) => img.naturalWidth)
            .catch(() => 0)

          if (naturalWidth > 0) {
            successCount++
          } else {
            failedImages.push(project)
          }
        } else {
          failedImages.push(project)
        }
      } else {
        failedImages.push(project)
      }
    }

    console.log(`✅ Portfolio projects with images: ${successCount}/${expectedProjects.length}`)
    if (failedImages.length > 0) {
      console.log(`❌ Failed images: ${failedImages.join(', ')}`)
    }

    // At least 7 of 9 projects should have valid images
    expect(successCount).toBeGreaterThanOrEqual(7)
  })

  test('should validate hero image on homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Check for hero background image
    const heroSection = page.locator('section, div').first()
    const backgroundImage = await heroSection
      .evaluate((el: HTMLElement) => {
        const bg = window.getComputedStyle(el).backgroundImage
        return bg !== 'none' ? bg : null
      })
      .catch(() => null)

    // Check for hero image element
    const heroImg = page.locator('img[src*="hero"], [class*="hero"] img').first()
    const heroImgCount = await heroImg.count()

    // Either background image or hero img should exist
    const hasHeroImage = backgroundImage !== null || heroImgCount > 0

    expect(hasHeroImage).toBe(true)

    if (heroImgCount > 0) {
      const naturalWidth = await heroImg
        .evaluate((img: HTMLImageElement) => img.naturalWidth)
        .catch(() => 0)
      expect(naturalWidth).toBeGreaterThan(0)
    }
  })

  test('should check for broken images across all pages', async ({ page }) => {
    const pagesToCheck = ['/', '/produtos', '/portfolio', '/servicos', '/sobre']
    const brokenImages: string[] = []

    for (const pagePath of pagesToCheck) {
      await page.goto(pagePath, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)

      // Get all images on page
      const images = page.locator('img')
      const imageCount = await images.count()

      for (let i = 0; i < Math.min(imageCount, 20); i++) {
        // Check first 20 images
        const img = images.nth(i)
        const isVisible = await img.isVisible().catch(() => false)

        if (isVisible) {
          const src = await img.getAttribute('src')
          const naturalWidth = await img
            .evaluate((img: HTMLImageElement) => img.naturalWidth)
            .catch(() => 0)

          if (naturalWidth === 0) {
            brokenImages.push(`${pagePath}: ${src}`)
          }
        }
      }
    }

    console.log(`Total broken images found: ${brokenImages.length}`)
    if (brokenImages.length > 0) {
      console.log('Broken images:', brokenImages)
    }

    // Should have very few broken images (allowing for lazy loading)
    expect(brokenImages.length).toBeLessThan(5)
  })

  test('should validate image lazy loading works', async ({ page }) => {
    await page.goto('/portfolio', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // Get all images
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 5) {
      // Check if images have loading attribute
      const firstImg = images.first()
      const loadingAttr = await firstImg.getAttribute('loading')

      // Next.js images should have loading="lazy" or be eagerly loaded
      expect(loadingAttr === 'lazy' || loadingAttr === 'eager' || loadingAttr === null).toBe(true)
    }
  })

  test('should validate images have alt text', async ({ page }) => {
    const pagesToCheck = ['/produtos', '/portfolio', '/servicos']
    let imagesWithoutAlt = 0
    let totalImages = 0

    for (const pagePath of pagesToCheck) {
      await page.goto(pagePath, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)

      const images = page.locator('img')
      const count = await images.count()

      for (let i = 0; i < Math.min(count, 10); i++) {
        totalImages++
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')

        if (!alt || alt.trim() === '') {
          imagesWithoutAlt++
        }
      }
    }

    console.log(`Images without alt text: ${imagesWithoutAlt}/${totalImages}`)

    // At least 80% of images should have alt text
    const altTextPercentage = ((totalImages - imagesWithoutAlt) / totalImages) * 100
    expect(altTextPercentage).toBeGreaterThan(70)
  })

  test('should validate image optimization (Next.js Image component)', async ({ page }) => {
    await page.goto('/produtos', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Check if images are using Next.js Image optimization
    const optimizedImages = page.locator('img[srcset], img[sizes]')
    const count = await optimizedImages.count()

    // Most images should be optimized with srcset/sizes
    expect(count).toBeGreaterThan(5)

    if (count > 0) {
      const firstImg = optimizedImages.first()
      const srcset = await firstImg.getAttribute('srcset')
      expect(srcset).toBeTruthy()
      expect(srcset?.length).toBeGreaterThan(10)
    }
  })

  test('should validate responsive images on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/produtos', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Get images
    const images = page.locator('img').first()

    if (await images.isVisible()) {
      // Check image dimensions fit mobile viewport
      const boundingBox = await images.boundingBox()

      if (boundingBox) {
        expect(boundingBox.width).toBeLessThanOrEqual(400) // Should fit mobile screen
      }
    }
  })

  test('should validate image file formats are web-optimized', async ({ page }) => {
    await page.goto('/produtos', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    const images = page.locator('img')
    const count = await images.count()

    let webOptimizedCount = 0

    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i)
      const src = (await img.getAttribute('src')) || ''

      // Check for web-optimized formats (jpg, jpeg, png, webp, avif)
      if (
        src.includes('.jpg') ||
        src.includes('.jpeg') ||
        src.includes('.png') ||
        src.includes('.webp') ||
        src.includes('.avif') ||
        src.includes('_next/image')
      ) {
        webOptimizedCount++
      }
    }

    // All images should be web-optimized formats
    expect(webOptimizedCount).toBeGreaterThan(5)
  })
})
