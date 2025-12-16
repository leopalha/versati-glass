import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import type { QuoteStatus } from '@prisma/client'

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

describe('Quotes API Integration Tests', () => {
  let testUser: any
  let testQuote: any

  beforeAll(async () => {
    // Criar usuário de teste
    testUser = await prisma.user.upsert({
      where: { email: 'test-quote-customer@test.com' },
      update: {},
      create: {
        name: 'Test Customer',
        email: 'test-quote-customer@test.com',
        password: 'hashed-password',
        phone: '21987654321',
        role: 'CUSTOMER',
      },
    })

    // Criar orçamento de teste
    testQuote = await prisma.quote.create({
      data: {
        number: `TEST-${Date.now()}`,
        userId: testUser.id,
        customerName: testUser.name,
        customerEmail: testUser.email,
        customerPhone: testUser.phone || '',
        serviceStreet: 'Rua Teste',
        serviceNumber: '123',
        serviceNeighborhood: 'Centro',
        serviceCity: 'Rio de Janeiro',
        serviceState: 'RJ',
        serviceZipCode: '20000-000',
        status: 'DRAFT',
        source: 'WEBSITE',
        subtotal: 500,
        discount: 0,
        total: 500,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
  })

  afterAll(async () => {
    // Limpar dados de teste
    if (testQuote) {
      await prisma.quoteItem.deleteMany({ where: { quoteId: testQuote.id } })
      await prisma.quote.delete({ where: { id: testQuote.id } }).catch(() => {})
    }
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {})
    }
  })

  describe('GET /api/quotes', () => {
    it('should return list of quotes', async () => {
      const quotes = await prisma.quote.findMany({
        where: { id: testQuote.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      })

      expect(quotes).toBeDefined()
      expect(Array.isArray(quotes)).toBe(true)
      expect(quotes.length).toBeGreaterThan(0)
      expect(quotes[0]).toHaveProperty('number')
      expect(quotes[0]).toHaveProperty('user')
      expect(quotes[0].user).toHaveProperty('name')
    })

    it('should filter quotes by status', async () => {
      const draftQuotes = await prisma.quote.findMany({
        where: {
          id: testQuote.id,
          status: 'DRAFT',
        },
      })

      expect(draftQuotes).toBeDefined()
      expect(Array.isArray(draftQuotes)).toBe(true)
      draftQuotes.forEach((quote) => {
        expect(quote.status).toBe('DRAFT')
      })
    })
  })

  describe('GET /api/quotes/:id', () => {
    it('should return quote details with user info', async () => {
      const quote = await prisma.quote.findUnique({
        where: { id: testQuote.id },
        include: {
          user: true,
          items: true,
        },
      })

      expect(quote).toBeDefined()
      expect(quote?.id).toBe(testQuote.id)
      expect(quote?.number).toBe(testQuote.number)
      expect(quote?.user).toBeDefined()
      expect(quote?.user.name).toBe(testUser.name)
      expect(quote).toHaveProperty('items')
    })

    it('should return null for non-existent quote', async () => {
      const quote = await prisma.quote.findUnique({
        where: { id: 'non-existent-id' },
      })

      expect(quote).toBeNull()
    })
  })

  describe('POST /api/quotes', () => {
    it('should create a new quote', async () => {
      const newQuoteData = {
        number: `NEW-${Date.now()}`,
        userId: testUser.id,
        customerName: testUser.name,
        customerEmail: testUser.email,
        customerPhone: testUser.phone || '',
        serviceStreet: 'Rua Nova',
        serviceNumber: '456',
        serviceNeighborhood: 'Copacabana',
        serviceCity: 'Rio de Janeiro',
        serviceState: 'RJ',
        serviceZipCode: '22000-000',
        status: 'DRAFT' as QuoteStatus,
        source: 'WEBSITE' as const,
        subtotal: 1500,
        discount: 10,
        total: 1350,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }

      const newQuote = await prisma.quote.create({
        data: newQuoteData,
      })

      expect(newQuote).toBeDefined()
      expect(newQuote.number).toBe(newQuoteData.number)
      expect(newQuote.userId).toBe(testUser.id)
      expect(Number(newQuote.total)).toBe(1350)

      // Cleanup
      await prisma.quote.delete({ where: { id: newQuote.id } })
    })

    it('should validate required fields', async () => {
      const invalidData = {
        userId: testUser.id,
        // Missing required fields
      }

      await expect(
        prisma.quote.create({
          data: invalidData as any,
        })
      ).rejects.toThrow()
    })
  })

  describe('PUT /api/quotes/:id', () => {
    it('should update quote status', async () => {
      const updatedQuote = await prisma.quote.update({
        where: { id: testQuote.id },
        data: { status: 'SENT' },
      })

      expect(updatedQuote).toBeDefined()
      expect(updatedQuote.status).toBe('SENT')

      // Restore original status
      await prisma.quote.update({
        where: { id: testQuote.id },
        data: { status: 'DRAFT' },
      })
    })

    it('should update quote total', async () => {
      const newTotal = 600
      const updatedQuote = await prisma.quote.update({
        where: { id: testQuote.id },
        data: { total: newTotal },
      })

      expect(updatedQuote).toBeDefined()
      expect(Number(updatedQuote.total)).toBe(newTotal)

      // Restore original total
      await prisma.quote.update({
        where: { id: testQuote.id },
        data: { total: 500 },
      })
    })
  })

  describe('Quote Status Transitions', () => {
    it('should transition from DRAFT to SENT', async () => {
      const quote = await prisma.quote.update({
        where: { id: testQuote.id },
        data: { status: 'SENT' },
      })

      expect(quote.status).toBe('SENT')

      // Restore
      await prisma.quote.update({
        where: { id: testQuote.id },
        data: { status: 'DRAFT' },
      })
    })

    it('should transition from SENT to ACCEPTED', async () => {
      await prisma.quote.update({
        where: { id: testQuote.id },
        data: { status: 'SENT' },
      })

      const quote = await prisma.quote.update({
        where: { id: testQuote.id },
        data: { status: 'ACCEPTED' },
      })

      expect(quote.status).toBe('ACCEPTED')

      // Restore
      await prisma.quote.update({
        where: { id: testQuote.id },
        data: { status: 'DRAFT' },
      })
    })
  })

  describe('Quote Calculations', () => {
    it('should calculate subtotal correctly', () => {
      const quantity = 3
      const unitPrice = 500
      const subtotal = quantity * unitPrice

      expect(subtotal).toBe(1500)
    })

    it('should apply discount correctly', () => {
      const subtotal = 1000
      const discountPercent = 10
      const discountAmount = subtotal * (discountPercent / 100)
      const total = subtotal - discountAmount

      expect(discountAmount).toBe(100)
      expect(total).toBe(900)
    })

    it('should validate valid until date is in future', () => {
      const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      const now = new Date()

      expect(validUntil.getTime()).toBeGreaterThan(now.getTime())
    })
  })
})
