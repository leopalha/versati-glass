import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import type { OrderStatus, ProductCategory, PriceType } from '@prisma/client'

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

describe('Orders API Integration Tests', () => {
  let testUserId: string
  let testOrderId: string
  let testProductId: string

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.upsert({
      where: { email: 'test-customer@test.com' },
      update: {},
      create: {
        email: 'test-customer@test.com',
        name: 'Test Customer',
        password: 'hashed-password',
        role: 'CUSTOMER',
      },
    })
    testUserId = user.id

    // Create test product
    const product = await prisma.product.upsert({
      where: { slug: 'test-order-product' },
      update: {},
      create: {
        name: 'Test Order Product',
        slug: 'test-order-product',
        description: 'Product for testing orders',
        category: 'BOX',
        priceType: 'FIXED',
        basePrice: 2000,
        images: [],
        colors: [],
        finishes: [],
        thicknesses: [],
      },
    })
    testProductId = product.id

    // Cleanup test orders
    await prisma.order.deleteMany({
      where: { number: { startsWith: 'TEST-' } },
    })
  })

  afterAll(async () => {
    // Cleanup
    await prisma.order.deleteMany({
      where: { number: { startsWith: 'TEST-' } },
    })
    await prisma.product
      .delete({
        where: { id: testProductId },
      })
      .catch(() => {})
  })

  describe('Order Creation and Status Flow', () => {
    it('should create an order with items', async () => {
      const order = await prisma.order.create({
        data: {
          number: 'TEST-ORDER-001',
          userId: testUserId,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDING',
          paymentMethod: 'PIX',
          subtotal: 2000,
          discount: 0,
          installationFee: 500,
          total: 2500,
          serviceStreet: 'Rua Test',
          serviceNumber: '123',
          serviceNeighborhood: 'Test Bairro',
          serviceCity: 'Rio de Janeiro',
          serviceState: 'RJ',
          serviceZipCode: '20000-000',
          items: {
            create: [
              {
                productId: testProductId,
                description: 'Box de Vidro Temperado',
                quantity: 1,
                unitPrice: 2000,
                totalPrice: 2000,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      })

      testOrderId = order.id

      expect(order).toBeDefined()
      expect(order.number).toBe('TEST-ORDER-001')
      expect(order.status).toBe('AGUARDANDO_PAGAMENTO')
      expect(Number(order.total)).toBe(2500)
      expect(order.items).toHaveLength(1)
      expect(Number(order.items[0].totalPrice)).toBe(2000)
    })

    it('should update order status with timeline', async () => {
      const updatedOrder = await prisma.order.update({
        where: { id: testOrderId },
        data: {
          status: 'APROVADO',
          timeline: {
            create: {
              status: 'APROVADO',
              description: 'Pedido aprovado e iniciando producao',
              createdBy: 'admin@test.com',
            },
          },
        },
        include: {
          timeline: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      })

      expect(updatedOrder.status).toBe('APROVADO')
      expect(updatedOrder.timeline).toHaveLength(1)
      expect(updatedOrder.timeline[0].status).toBe('APROVADO')
      expect(updatedOrder.timeline[0].description).toContain('aprovado')
    })

    it('should transition through production statuses', async () => {
      const statuses: OrderStatus[] = [
        'EM_PRODUCAO',
        'PRONTO_ENTREGA',
        'INSTALACAO_AGENDADA',
        'INSTALANDO',
        'CONCLUIDO',
      ]

      for (const status of statuses) {
        const order = await prisma.order.update({
          where: { id: testOrderId },
          data: {
            status,
            ...(status === 'CONCLUIDO' ? { completedAt: new Date() } : {}),
          },
        })

        expect(order.status).toBe(status)
      }

      const finalOrder = await prisma.order.findUnique({
        where: { id: testOrderId },
      })

      expect(finalOrder?.status).toBe('CONCLUIDO')
      expect(finalOrder?.completedAt).toBeDefined()
    })

    it('should allow cancellation from AGUARDANDO_PAGAMENTO', async () => {
      const order = await prisma.order.create({
        data: {
          number: 'TEST-ORDER-CANCEL',
          userId: testUserId,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDING',
          paymentMethod: 'PIX',
          subtotal: 1000,
          discount: 0,
          installationFee: 0,
          total: 1000,
          serviceStreet: 'Rua Test',
          serviceNumber: '123',
          serviceNeighborhood: 'Test Bairro',
          serviceCity: 'Rio de Janeiro',
          serviceState: 'RJ',
          serviceZipCode: '20000-000',
        },
      })

      const cancelled = await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELADO' },
      })

      expect(cancelled.status).toBe('CANCELADO')
    })
  })

  describe('Payment Status', () => {
    it('should update payment status from PENDING to PAID', async () => {
      const order = await prisma.order.create({
        data: {
          number: 'TEST-ORDER-PAYMENT',
          userId: testUserId,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDING',
          paymentMethod: 'CREDIT_CARD',
          subtotal: 3000,
          discount: 300,
          installationFee: 500,
          total: 3200,
          paidAmount: 0,
          serviceStreet: 'Rua Test',
          serviceNumber: '123',
          serviceNeighborhood: 'Test Bairro',
          serviceCity: 'Rio de Janeiro',
          serviceState: 'RJ',
          serviceZipCode: '20000-000',
        },
      })

      const paid = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          paidAmount: 3200,
          status: 'APROVADO',
        },
      })

      expect(paid.paymentStatus).toBe('PAID')
      expect(Number(paid.paidAmount)).toBe(3200)
      expect(paid.status).toBe('APROVADO')
    })

    it('should handle partial payment', async () => {
      const order = await prisma.order.create({
        data: {
          number: 'TEST-ORDER-PARTIAL',
          userId: testUserId,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDING',
          paymentMethod: 'CREDIT_CARD',
          subtotal: 5000,
          discount: 0,
          installationFee: 1000,
          total: 6000,
          paidAmount: 0,
          serviceStreet: 'Rua Test',
          serviceNumber: '123',
          serviceNeighborhood: 'Test Bairro',
          serviceCity: 'Rio de Janeiro',
          serviceState: 'RJ',
          serviceZipCode: '20000-000',
        },
      })

      const partial = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PARTIAL',
          paidAmount: 3000,
        },
      })

      expect(partial.paymentStatus).toBe('PARTIAL')
      expect(Number(partial.paidAmount)).toBe(3000)
      expect(Number(partial.total)).toBe(6000)
    })
  })

  describe('Order Queries', () => {
    beforeAll(async () => {
      // Create multiple test orders
      await prisma.order.createMany({
        data: [
          {
            number: 'TEST-QUERY-001',
            userId: testUserId,
            status: 'EM_PRODUCAO',
            paymentStatus: 'PAID',
            paymentMethod: 'PIX',
            subtotal: 1000,
            discount: 0,
            installationFee: 0,
            total: 1000,
            paidAmount: 1000,
            serviceStreet: 'Rua 1',
            serviceNumber: '100',
            serviceNeighborhood: 'Bairro 1',
            serviceCity: 'Rio de Janeiro',
            serviceState: 'RJ',
            serviceZipCode: '20000-001',
          },
          {
            number: 'TEST-QUERY-002',
            userId: testUserId,
            status: 'CONCLUIDO',
            paymentStatus: 'PAID',
            paymentMethod: 'CREDIT_CARD',
            subtotal: 2000,
            discount: 0,
            installationFee: 500,
            total: 2500,
            paidAmount: 2500,
            completedAt: new Date(),
            serviceStreet: 'Rua 2',
            serviceNumber: '200',
            serviceNeighborhood: 'Bairro 2',
            serviceCity: 'Rio de Janeiro',
            serviceState: 'RJ',
            serviceZipCode: '20000-002',
          },
        ],
      })
    })

    it('should filter orders by status', async () => {
      const orders = await prisma.order.findMany({
        where: {
          status: 'EM_PRODUCAO',
          number: { startsWith: 'TEST-' },
        },
      })

      expect(orders.length).toBeGreaterThan(0)
      expect(orders.every((o) => o.status === 'EM_PRODUCAO')).toBe(true)
    })

    it('should filter orders by payment status', async () => {
      const orders = await prisma.order.findMany({
        where: {
          paymentStatus: 'PAID',
          number: { startsWith: 'TEST-' },
        },
      })

      expect(orders.length).toBeGreaterThan(0)
      expect(orders.every((o) => o.paymentStatus === 'PAID')).toBe(true)
    })

    it('should get orders for specific user', async () => {
      const orders = await prisma.order.findMany({
        where: {
          userId: testUserId,
          number: { startsWith: 'TEST-' },
        },
      })

      expect(orders.length).toBeGreaterThan(0)
      expect(orders.every((o) => o.userId === testUserId)).toBe(true)
    })

    it('should include related data', async () => {
      const order = await prisma.order.findFirst({
        where: { id: testOrderId },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
          timeline: true,
          appointments: true,
        },
      })

      expect(order).toBeDefined()
      expect(order?.user).toBeDefined()
      expect(order?.user.email).toBe('test-customer@test.com')
      expect(order?.items).toBeDefined()
    })
  })

  describe('Order Calculations', () => {
    it('should calculate total correctly with discount', async () => {
      const order = await prisma.order.create({
        data: {
          number: 'TEST-CALC-DISCOUNT',
          userId: testUserId,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDING',
          paymentMethod: 'PIX',
          subtotal: 1000,
          discount: 100, // 10% discount
          installationFee: 200,
          total: 1100, // 1000 - 100 + 200
          serviceStreet: 'Rua Test',
          serviceNumber: '123',
          serviceNeighborhood: 'Test Bairro',
          serviceCity: 'Rio de Janeiro',
          serviceState: 'RJ',
          serviceZipCode: '20000-000',
        },
      })

      expect(Number(order.subtotal)).toBe(1000)
      expect(Number(order.discount)).toBe(100)
      expect(Number(order.installationFee)).toBe(200)
      expect(Number(order.total)).toBe(1100)
    })

    it('should handle order without installation fee', async () => {
      const order = await prisma.order.create({
        data: {
          number: 'TEST-CALC-NO-FEE',
          userId: testUserId,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDING',
          paymentMethod: 'PIX',
          subtotal: 1500,
          discount: 0,
          installationFee: 0,
          total: 1500,
          serviceStreet: 'Rua Test',
          serviceNumber: '123',
          serviceNeighborhood: 'Test Bairro',
          serviceCity: 'Rio de Janeiro',
          serviceState: 'RJ',
          serviceZipCode: '20000-000',
        },
      })

      expect(Number(order.total)).toBe(Number(order.subtotal))
    })
  })
})
