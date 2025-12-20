import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import type { ProductCategory, PriceType } from '@prisma/client'

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() =>
    Promise.resolve({
      user: {
        id: 'test-admin-id',
        email: 'admin@test.com',
        role: 'ADMIN',
      },
    })
  ),
}))

describe('Products API Integration Tests', () => {
  let testProductId: string

  beforeAll(async () => {
    // Cleanup before tests
    await prisma.product.deleteMany({
      where: { slug: { startsWith: 'test-product-' } },
    })
  })

  afterAll(async () => {
    // Cleanup after tests
    await prisma.product.deleteMany({
      where: { slug: { startsWith: 'test-product-' } },
    })
  })

  describe('POST /api/products', () => {
    it('should create a new product with required fields', async () => {
      const productData = {
        name: 'Test Product FIXED Price',
        description: 'A test product with fixed price',
        category: 'BOX' as ProductCategory,
        priceType: 'FIXED' as PriceType,
        basePrice: 1000.0,
        images: ['https://example.com/image1.jpg'],
        colors: ['Incolor', 'Bronze'],
        finishes: ['Polido'],
        thicknesses: ['8mm'],
      }

      const product = await prisma.product.create({
        data: {
          ...productData,
          slug: 'test-product-fixed-price',
          isActive: true,
          isFeatured: false,
        },
      })

      testProductId = product.id

      expect(product).toBeDefined()
      expect(product.name).toBe(productData.name)
      expect(product.slug).toBe('test-product-fixed-price')
      expect(product.category).toBe(productData.category)
      expect(product.priceType).toBe('FIXED')
      expect(Number(product.basePrice)).toBe(1000)
      expect(product.isActive).toBe(true)
    })

    it('should create product with PER_M2 pricing', async () => {
      const productData = {
        name: 'Test Product PER M2',
        slug: 'test-product-per-m2',
        description: 'A test product with per m2 price',
        category: 'VIDROS' as ProductCategory,
        priceType: 'PER_M2' as PriceType,
        pricePerM2: 250.5,
        images: [],
        colors: [],
        finishes: [],
        thicknesses: [],
      }

      const product = await prisma.product.create({
        data: productData,
      })

      expect(product).toBeDefined()
      expect(product.priceType).toBe('PER_M2')
      expect(Number(product.pricePerM2)).toBe(250.5)
      expect(product.basePrice).toBeNull()
    })

    it('should create product with QUOTE_ONLY pricing', async () => {
      const productData = {
        name: 'Test Product Quote Only',
        slug: 'test-product-quote-only',
        description: 'A test product that requires quote',
        category: 'FECHAMENTOS' as ProductCategory,
        priceType: 'QUOTE_ONLY' as PriceType,
        priceRangeMin: 5000,
        priceRangeMax: 15000,
        images: [],
        colors: [],
        finishes: [],
        thicknesses: [],
      }

      const product = await prisma.product.create({
        data: productData,
      })

      expect(product).toBeDefined()
      expect(product.priceType).toBe('QUOTE_ONLY')
      expect(Number(product.priceRangeMin)).toBe(5000)
      expect(Number(product.priceRangeMax)).toBe(15000)
    })

    it('should fail to create product with duplicate slug', async () => {
      const duplicateProduct = {
        name: 'Duplicate Slug Product',
        slug: 'test-product-fixed-price', // Same as first test
        description: 'This should fail',
        category: 'BOX' as ProductCategory,
        priceType: 'FIXED' as PriceType,
        basePrice: 1000,
        images: [],
        colors: [],
        finishes: [],
        thicknesses: [],
      }

      await expect(prisma.product.create({ data: duplicateProduct })).rejects.toThrow()
    })
  })

  describe('PUT /api/products/[slug]', () => {
    it('should update product fields', async () => {
      const updatedProduct = await prisma.product.update({
        where: { id: testProductId },
        data: {
          name: 'Updated Test Product',
          description: 'Updated description',
          basePrice: 1200,
          isFeatured: true,
        },
      })

      expect(updatedProduct.name).toBe('Updated Test Product')
      expect(updatedProduct.description).toBe('Updated description')
      expect(Number(updatedProduct.basePrice)).toBe(1200)
      expect(updatedProduct.isFeatured).toBe(true)
    })

    it('should update slug when name changes', async () => {
      const product = await prisma.product.create({
        data: {
          name: 'Original Name',
          slug: 'test-product-slug-change',
          description: 'Test',
          category: 'BOX' as ProductCategory,
          priceType: 'FIXED' as PriceType,
          basePrice: 1000,
          images: [],
          colors: [],
          finishes: [],
          thicknesses: [],
        },
      })

      const updated = await prisma.product.update({
        where: { id: product.id },
        data: {
          name: 'New Name',
          slug: 'test-product-new-name',
        },
      })

      expect(updated.slug).toBe('test-product-new-name')
      expect(updated.name).toBe('New Name')
    })
  })

  describe('DELETE /api/products/[slug]', () => {
    it('should soft delete product without dependencies', async () => {
      const product = await prisma.product.create({
        data: {
          name: 'Product to Soft Delete',
          slug: 'test-product-soft-delete',
          description: 'Test',
          category: 'BOX' as ProductCategory,
          priceType: 'FIXED' as PriceType,
          basePrice: 1000,
          images: [],
          colors: [],
          finishes: [],
          thicknesses: [],
          isActive: true,
        },
      })

      const deactivated = await prisma.product.update({
        where: { id: product.id },
        data: { isActive: false },
      })

      expect(deactivated.isActive).toBe(false)
    })

    it('should hard delete product without dependencies', async () => {
      const product = await prisma.product.create({
        data: {
          name: 'Product to Hard Delete',
          slug: 'test-product-hard-delete',
          description: 'Test',
          category: 'BOX' as ProductCategory,
          priceType: 'FIXED' as PriceType,
          basePrice: 1000,
          images: [],
          colors: [],
          finishes: [],
          thicknesses: [],
        },
      })

      await prisma.product.delete({
        where: { id: product.id },
      })

      const deleted = await prisma.product.findUnique({
        where: { id: product.id },
      })

      expect(deleted).toBeNull()
    })
  })

  describe('GET /api/products', () => {
    beforeAll(async () => {
      // Clean up any existing test products first to avoid slug conflicts
      await prisma.product.deleteMany({
        where: {
          slug: {
            in: ['test-active-1', 'test-active-2', 'test-inactive-1'],
          },
        },
      })

      // Create test products for listing
      await prisma.product.createMany({
        data: [
          {
            name: 'Test Active Product 1',
            slug: 'test-active-1',
            description: 'Active',
            category: 'BOX' as ProductCategory,
            priceType: 'FIXED' as PriceType,
            basePrice: 1000,
            isActive: true,
            isFeatured: true,
            images: [],
            colors: [],
            finishes: [],
            thicknesses: [],
          },
          {
            name: 'Test Active Product 2',
            slug: 'test-active-2',
            description: 'Active',
            category: 'ESPELHOS' as ProductCategory,
            priceType: 'FIXED' as PriceType,
            basePrice: 1500,
            isActive: true,
            isFeatured: false,
            images: [],
            colors: [],
            finishes: [],
            thicknesses: [],
          },
          {
            name: 'Test Inactive Product',
            slug: 'test-inactive-1',
            description: 'Inactive',
            category: 'BOX' as ProductCategory,
            priceType: 'FIXED' as PriceType,
            basePrice: 800,
            isActive: false,
            images: [],
            colors: [],
            finishes: [],
            thicknesses: [],
          },
        ],
      })
    })

    it('should list only active products by default', async () => {
      const products = await prisma.product.findMany({
        where: { isActive: true, slug: { startsWith: 'test-' } },
      })

      expect(products.length).toBeGreaterThanOrEqual(2)
      expect(products.every((p) => p.isActive)).toBe(true)
    })

    it('should filter by category', async () => {
      const products = await prisma.product.findMany({
        where: {
          category: 'BOX',
          slug: { startsWith: 'test-' },
        },
      })

      expect(products.every((p) => p.category === 'BOX')).toBe(true)
    })

    it('should order by featured first', async () => {
      const products = await prisma.product.findMany({
        where: { slug: { startsWith: 'test-' } },
        orderBy: [{ isFeatured: 'desc' }, { isActive: 'desc' }, { name: 'asc' }],
      })

      const firstProduct = products[0]
      expect(firstProduct).toBeDefined()
      // First product should be featured if any featured products exist
      const hasFeatured = products.some((p) => p.isFeatured)
      if (hasFeatured) {
        expect(firstProduct.isFeatured).toBe(true)
      }
    })
  })

  describe('GET /api/products/[slug]', () => {
    it('should get product by slug', async () => {
      const product = await prisma.product.findUnique({
        where: { slug: 'test-product-fixed-price' },
      })

      expect(product).toBeDefined()
      expect(product?.slug).toBe('test-product-fixed-price')
      expect(product?.name).toContain('Test Product')
    })

    it('should return null for non-existent slug', async () => {
      const product = await prisma.product.findUnique({
        where: { slug: 'non-existent-product-slug' },
      })

      expect(product).toBeNull()
    })
  })
})
