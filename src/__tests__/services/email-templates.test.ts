import { describe, it, expect } from 'vitest'
import {
  generateQuoteSentEmailHtml,
  generateOrderApprovedEmailHtml,
  generateOrderStatusUpdateEmailHtml,
  generateInstallationScheduledEmailHtml,
  generateAppointmentReminderEmailHtml,
  generateInstallationCompletedEmailHtml,
} from '@/services/email-templates'

describe('Email Templates', () => {
  describe('generateQuoteSentEmailHtml', () => {
    it('should generate HTML for quote sent email', () => {
      const html = generateQuoteSentEmailHtml({
        customerName: 'João Silva',
        quoteNumber: 'ORC-2024-001',
        total: 'R$ 5.000,00',
        validUntil: '31/12/2024',
        portalUrl: 'https://versatiglass.com/portal/orcamentos/123',
        items: [
          {
            description: 'Porta de Vidro Temperado',
            quantity: 2,
            price: 'R$ 2.500,00',
          },
        ],
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('João Silva')
      expect(html).toContain('ORC-2024-001')
      expect(html).toContain('R$ 5.000,00')
      expect(html).toContain('31/12/2024')
      expect(html).toContain('Porta de Vidro Temperado')
      expect(html).toContain('Versati Glass')
    })

    it('should include all items in the email', () => {
      const html = generateQuoteSentEmailHtml({
        customerName: 'Maria Santos',
        quoteNumber: 'ORC-2024-002',
        total: 'R$ 10.000,00',
        validUntil: '15/01/2025',
        portalUrl: 'https://versatiglass.com/portal/orcamentos/456',
        items: [
          { description: 'Item 1', quantity: 1, price: 'R$ 5.000,00' },
          { description: 'Item 2', quantity: 2, price: 'R$ 2.500,00' },
        ],
      })

      expect(html).toContain('Item 1')
      expect(html).toContain('Item 2')
    })
  })

  describe('generateOrderApprovedEmailHtml', () => {
    it('should generate HTML for order approved email', () => {
      const html = generateOrderApprovedEmailHtml({
        customerName: 'Pedro Costa',
        orderNumber: 'PED-2024-001',
        total: 'R$ 8.500,00',
        estimatedDelivery: '10/01/2025',
        portalUrl: 'https://versatiglass.com/portal/pedidos/789',
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Pedro Costa')
      expect(html).toContain('PED-2024-001')
      expect(html).toContain('R$ 8.500,00')
      expect(html).toContain('10/01/2025')
    })

    it('should include order information', () => {
      const html = generateOrderApprovedEmailHtml({
        customerName: 'Ana Lima',
        orderNumber: 'PED-2024-002',
        total: 'R$ 6.000,00',
        estimatedDelivery: '20/01/2025',
        portalUrl: 'https://versatiglass.com/portal/pedidos/790',
      })

      expect(html).toContain('PED-2024-002')
      expect(html).toContain('Ana Lima')
    })
  })

  describe('generateOrderStatusUpdateEmailHtml', () => {
    it('should generate HTML for order status update', () => {
      const html = generateOrderStatusUpdateEmailHtml({
        customerName: 'João Silva',
        orderNumber: 'PED-2024-001',
        status: 'Em Produção',
        message: 'Seu pedido está sendo fabricado',
        icon: '🔨',
        portalUrl: 'https://versatiglass.com/portal/pedidos/123',
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Em Produção')
      expect(html).toContain('Seu pedido está sendo fabricado')
      expect(html).toContain('🔨')
    })

    it('should work with different status types', () => {
      const statuses = [
        { status: 'Concluído', icon: '✅' },
        { status: 'Cancelado', icon: '❌' },
        { status: 'Em Transporte', icon: '🚚' },
      ]

      statuses.forEach(({ status, icon }) => {
        const html = generateOrderStatusUpdateEmailHtml({
          customerName: 'Cliente Teste',
          orderNumber: 'PED-2024-001',
          status,
          message: `Status atualizado para ${status}`,
          icon,
          portalUrl: 'https://versatiglass.com/portal/pedidos/123',
        })

        expect(html).toContain(status)
        expect(html).toContain(icon)
      })
    })
  })

  describe('generateInstallationScheduledEmailHtml', () => {
    it('should generate HTML for installation scheduled', () => {
      const html = generateInstallationScheduledEmailHtml({
        customerName: 'Carlos Mendes',
        orderNumber: 'PED-2024-003',
        date: '25/01/2025',
        time: '14:00',
        address: 'Rua das Flores, 123',
        estimatedDuration: '2 horas',
        portalUrl: 'https://versatiglass.com/portal/agendamentos',
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Carlos Mendes')
      expect(html).toContain('PED-2024-003')
      expect(html).toContain('25/01/2025')
      expect(html).toContain('14:00')
      expect(html).toContain('Rua das Flores, 123')
    })
  })

  describe('generateAppointmentReminderEmailHtml', () => {
    it('should generate HTML for appointment reminder', () => {
      const html = generateAppointmentReminderEmailHtml({
        customerName: 'Fernanda Alves',
        appointmentDate: '16/01/2025',
        appointmentTime: '10:00',
        serviceAddress: 'Av. Principal, 456',
        estimatedDuration: '2 horas',
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Fernanda Alves')
      expect(html).toContain('16/01/2025')
      expect(html).toContain('10:00')
      expect(html).toContain('Av. Principal, 456')
      expect(html).toContain('2 horas')
      expect(html).toContain('⏰')
    })

    it('should include reminder instructions', () => {
      const html = generateAppointmentReminderEmailHtml({
        customerName: 'Roberto Silva',
        appointmentDate: '20/01/2025',
        appointmentTime: '15:00',
        serviceAddress: 'Rua Central, 789',
        estimatedDuration: '3 horas',
      })

      expect(html).toContain('amanha')
      expect(html).toContain('Versati Glass')
    })
  })

  describe('generateInstallationCompletedEmailHtml', () => {
    it('should generate HTML for installation completed', () => {
      const html = generateInstallationCompletedEmailHtml({
        customerName: 'Juliana Costa',
        orderNumber: 'PED-2024-004',
        completionDate: '30/01/2025',
      })

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Juliana Costa')
      expect(html).toContain('PED-2024-004')
      expect(html).toContain('30/01/2025')
      expect(html).toContain('✅')
      expect(html).toContain('Instalacao Concluida')
    })

    it('should include thank you message', () => {
      const html = generateInstallationCompletedEmailHtml({
        customerName: 'Ricardo Souza',
        orderNumber: 'PED-2024-005',
        completionDate: '05/02/2025',
      })

      expect(html).toContain('Agradecemos pela confianca')
    })
  })

  describe('HTML Structure', () => {
    it('all templates should have proper HTML structure', () => {
      const templates = [
        generateQuoteSentEmailHtml({
          customerName: 'Test',
          quoteNumber: 'ORC-001',
          total: 'R$ 1.000,00',
          validUntil: '31/12/2024',
          portalUrl: 'https://test.com',
          items: [],
        }),
        generateOrderApprovedEmailHtml({
          customerName: 'Test',
          orderNumber: 'PED-001',
          total: 'R$ 1.000,00',
          estimatedDelivery: '31/12/2024',
          portalUrl: 'https://test.com',
        }),
        generateInstallationCompletedEmailHtml({
          customerName: 'Test',
          orderNumber: 'PED-001',
          completionDate: '31/12/2024',
        }),
      ]

      templates.forEach((html) => {
        expect(html).toContain('<!DOCTYPE html>')
        expect(html).toContain('<html>')
        expect(html).toContain('</html>')
        expect(html).toContain('<head>')
        expect(html).toContain('</head>')
        expect(html).toContain('<body')
        expect(html).toContain('</body>')
        expect(html).toContain('charset="utf-8"')
        expect(html).toContain('Versati Glass')
      })
    })

    it('all templates should be mobile responsive', () => {
      const html = generateQuoteSentEmailHtml({
        customerName: 'Test',
        quoteNumber: 'ORC-001',
        total: 'R$ 1.000,00',
        validUntil: '31/12/2024',
        portalUrl: 'https://test.com',
        items: [],
      })

      expect(html).toContain('viewport')
      expect(html).toContain('width=device-width')
    })
  })
})
