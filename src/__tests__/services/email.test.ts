import { describe, it, expect } from 'vitest'
import {
  generateQuoteEmailHtml,
  generateOrderConfirmationHtml,
  generateAppointmentReminderHtml,
  generatePasswordResetHtml,
} from '@/services/email'

describe('Email Templates', () => {
  describe('generateQuoteEmailHtml', () => {
    it('should generate quote email with all data', () => {
      const html = generateQuoteEmailHtml({
        customerName: 'Joao Silva',
        quoteNumber: 'ORC-2024-0001',
        total: 'R$ 5.000,00',
        validUntil: '15/02/2024',
        portalUrl: 'https://versatiglass.com.br/portal/orcamentos/123',
        items: [
          { description: 'Box de Vidro Temperado', quantity: 1, price: 'R$ 3.000,00' },
          { description: 'Espelho Decorativo', quantity: 2, price: 'R$ 2.000,00' },
        ],
      })

      expect(html).toContain('Joao Silva')
      expect(html).toContain('ORC-2024-0001')
      expect(html).toContain('R$ 5.000,00')
      expect(html).toContain('15/02/2024')
      expect(html).toContain('Box de Vidro Temperado')
      expect(html).toContain('Espelho Decorativo')
      expect(html).toContain('Ver Orcamento Completo')
      expect(html).toContain('versatiglass.com.br/portal/orcamentos/123')
    })

    it('should include Versati Glass branding', () => {
      const html = generateQuoteEmailHtml({
        customerName: 'Test',
        quoteNumber: 'TEST',
        total: 'R$ 0',
        validUntil: '01/01/2024',
        portalUrl: 'http://test.com',
        items: [],
      })

      expect(html).toContain('Versati Glass')
      expect(html).toContain('#d4af37') // Gold color
    })
  })

  describe('generateOrderConfirmationHtml', () => {
    it('should generate order confirmation email', () => {
      const html = generateOrderConfirmationHtml({
        customerName: 'Maria Santos',
        orderNumber: 'OS-2024-0001',
        total: 'R$ 10.000,00',
        portalUrl: 'https://versatiglass.com.br/portal/pedidos/456',
      })

      expect(html).toContain('Maria Santos')
      expect(html).toContain('OS-2024-0001')
      expect(html).toContain('R$ 10.000,00')
      expect(html).toContain('Pedido Confirmado!')
      expect(html).toContain('Acompanhar Pedido')
      expect(html).toContain('versatiglass.com.br/portal/pedidos/456')
    })

    it('should include success indicator', () => {
      const html = generateOrderConfirmationHtml({
        customerName: 'Test',
        orderNumber: 'TEST',
        total: 'R$ 0',
        portalUrl: 'http://test.com',
      })

      expect(html).toContain('#22c55e') // Green color for success
    })
  })

  describe('generateAppointmentReminderHtml', () => {
    it('should generate appointment reminder email', () => {
      const html = generateAppointmentReminderHtml({
        customerName: 'Pedro Costa',
        type: 'Instalacao',
        date: 'quinta-feira, 15 de fevereiro',
        time: '09:00',
        address: 'Rua das Flores, 123, Copacabana, Rio de Janeiro',
        portalUrl: 'https://versatiglass.com.br/portal/agendamentos',
      })

      expect(html).toContain('Pedro Costa')
      expect(html).toContain('Instalacao')
      expect(html).toContain('quinta-feira, 15 de fevereiro')
      expect(html).toContain('09:00')
      expect(html).toContain('Rua das Flores, 123')
      expect(html).toContain('Lembrete de Agendamento')
      expect(html).toContain('Ver Detalhes')
    })

    it('should include calendar and location icons', () => {
      const html = generateAppointmentReminderHtml({
        customerName: 'Test',
        type: 'Test',
        date: '01/01/2024',
        time: '10:00',
        address: 'Test Address',
        portalUrl: 'http://test.com',
      })

      expect(html).toContain('Data e Horario')
      expect(html).toContain('Endereco')
    })
  })

  describe('generatePasswordResetHtml', () => {
    it('should generate password reset email', () => {
      const html = generatePasswordResetHtml({
        resetUrl: 'https://versatiglass.com.br/reset-password?token=abc123',
      })

      expect(html).toContain('Redefinir Senha')
      expect(html).toContain('reset-password?token=abc123')
      expect(html).toContain('Este link expira em 1 hora')
      expect(html).toContain('Se voce nao solicitou')
    })

    it('should have security warning', () => {
      const html = generatePasswordResetHtml({
        resetUrl: 'http://test.com/reset',
      })

      expect(html).toContain('ignore este email')
    })
  })
})
