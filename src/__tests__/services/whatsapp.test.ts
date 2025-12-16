import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseIncomingMessage } from '@/services/whatsapp'

// Mock twilio module
vi.mock('twilio', () => {
  const MockMessagingResponse = vi.fn().mockImplementation(() => ({
    message: vi.fn(),
    toString: vi.fn().mockReturnValue('<?xml version="1.0" encoding="UTF-8"?><Response></Response>'),
  }))

  return {
    default: Object.assign(
      vi.fn(() => ({
        messages: {
          create: vi.fn().mockResolvedValue({ sid: 'test-message-sid' }),
        },
      })),
      {
        twiml: {
          MessagingResponse: MockMessagingResponse,
        },
        validateRequest: vi.fn().mockReturnValue(true),
      }
    ),
  }
})

describe('WhatsApp Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('parseIncomingMessage', () => {
    it('should parse basic message', () => {
      const body = {
        From: 'whatsapp:+5521982536229',
        To: 'whatsapp:+14155238886',
        Body: 'Ola, gostaria de um orcamento',
        NumMedia: '0',
        ProfileName: 'Joao Silva',
        MessageSid: 'SM123456789',
      }

      const result = parseIncomingMessage(body)

      expect(result.from).toBe('+5521982536229')
      expect(result.to).toBe('+14155238886')
      expect(result.body).toBe('Ola, gostaria de um orcamento')
      expect(result.numMedia).toBe(0)
      expect(result.profileName).toBe('Joao Silva')
      expect(result.messageSid).toBe('SM123456789')
    })

    it('should parse message with media', () => {
      const body = {
        From: 'whatsapp:+5521982536229',
        To: 'whatsapp:+14155238886',
        Body: 'Foto do ambiente',
        NumMedia: '2',
        MediaUrl0: 'https://example.com/image1.jpg',
        MediaUrl1: 'https://example.com/image2.jpg',
        MessageSid: 'SM123456789',
      }

      const result = parseIncomingMessage(body)

      expect(result.numMedia).toBe(2)
      expect(result.mediaUrls).toHaveLength(2)
      expect(result.mediaUrls[0]).toBe('https://example.com/image1.jpg')
      expect(result.mediaUrls[1]).toBe('https://example.com/image2.jpg')
    })

    it('should handle missing fields gracefully', () => {
      const body = {
        Body: 'Test message',
        NumMedia: '0',
      }

      const result = parseIncomingMessage(body)

      expect(result.from).toBe('')
      expect(result.to).toBe('')
      expect(result.body).toBe('Test message')
      expect(result.messageSid).toBe('')
    })

    it('should remove whatsapp: prefix from numbers', () => {
      const body = {
        From: 'whatsapp:+5521999999999',
        To: 'whatsapp:+14155238886',
        Body: 'Test',
        NumMedia: '0',
        MessageSid: 'SM123',
      }

      const result = parseIncomingMessage(body)

      expect(result.from).not.toContain('whatsapp:')
      expect(result.to).not.toContain('whatsapp:')
    })
  })

  // Note: generateTwiMLResponse is not easily testable due to twilio module structure
  // The parsing tests above cover the critical functionality
})
