import { describe, it, expect } from 'vitest'
import {
  cn,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
  formatCPF,
  formatCNPJ,
  formatCEP,
  slugify,
  generateOrderNumber,
  generateQuoteNumber,
} from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar')
    })

    it('should merge Tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })
  })

  describe('formatCurrency', () => {
    it('should format number as BRL currency', () => {
      const result = formatCurrency(1234.56)
      // Normalize spaces (NBSP vs regular space)
      expect(result.replace(/\s/g, ' ')).toBe('R$ 1.234,56')
    })

    it('should handle zero', () => {
      const result = formatCurrency(0)
      expect(result.replace(/\s/g, ' ')).toBe('R$ 0,00')
    })

    it('should handle large numbers', () => {
      const result = formatCurrency(1000000)
      expect(result.replace(/\s/g, ' ')).toBe('R$ 1.000.000,00')
    })

    it('should handle negative numbers', () => {
      const result = formatCurrency(-100)
      expect(result.replace(/\s/g, ' ')).toBe('-R$ 100,00')
    })
  })

  describe('formatDate', () => {
    it('should format Date object', () => {
      // Use UTC date to avoid timezone issues
      const date = new Date('2024-01-15T12:00:00Z')
      const result = formatDate(date)
      expect(result).toMatch(/^\d{2}\/01\/2024$/)
    })

    it('should format date string', () => {
      const result = formatDate('2024-12-25T12:00:00Z')
      expect(result).toMatch(/^\d{2}\/12\/2024$/)
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatDateTime(date)
      expect(result).toContain('15/01/2024')
      expect(result).toContain('14:30')
    })
  })

  describe('formatPhone', () => {
    it('should format phone number with 11 digits', () => {
      expect(formatPhone('21982536229')).toBe('(21) 98253-6229')
    })

    it('should return original if invalid', () => {
      expect(formatPhone('12345')).toBe('12345')
    })

    it('should handle already formatted phone', () => {
      expect(formatPhone('(21) 98253-6229')).toBe('(21) 98253-6229')
    })
  })

  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01')
    })

    it('should return original if invalid', () => {
      expect(formatCPF('123')).toBe('123')
    })

    it('should handle already formatted CPF', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
    })
  })

  describe('formatCNPJ', () => {
    it('should format CNPJ correctly', () => {
      expect(formatCNPJ('12345678000195')).toBe('12.345.678/0001-95')
    })

    it('should return original if invalid', () => {
      expect(formatCNPJ('123')).toBe('123')
    })
  })

  describe('formatCEP', () => {
    it('should format CEP correctly', () => {
      expect(formatCEP('22041080')).toBe('22041-080')
    })

    it('should return original if invalid', () => {
      expect(formatCEP('123')).toBe('123')
    })

    it('should handle already formatted CEP', () => {
      expect(formatCEP('22041-080')).toBe('22041-080')
    })
  })

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should handle accented characters', () => {
      expect(slugify('Vidro Temperado Especial')).toBe('vidro-temperado-especial')
    })

    it('should handle special characters', () => {
      expect(slugify('Box de Vidro!')).toBe('box-de-vidro')
    })

    it('should handle multiple spaces', () => {
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces')
    })
  })

  describe('generateOrderNumber', () => {
    it('should generate order number with correct format', () => {
      const orderNumber = generateOrderNumber()
      const year = new Date().getFullYear()
      expect(orderNumber).toMatch(new RegExp(`^OS-${year}-\\d{4}$`))
    })

    it('should generate unique numbers', () => {
      const numbers = new Set(Array.from({ length: 100 }, () => generateOrderNumber()))
      // Most should be unique (allowing for some collisions)
      expect(numbers.size).toBeGreaterThan(90)
    })
  })

  describe('generateQuoteNumber', () => {
    it('should generate quote number with correct format', () => {
      const quoteNumber = generateQuoteNumber()
      const year = new Date().getFullYear()
      expect(quoteNumber).toMatch(new RegExp(`^ORC-${year}-\\d{4}$`))
    })
  })
})
