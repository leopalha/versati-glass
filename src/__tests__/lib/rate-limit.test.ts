import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { rateLimitSync, RATE_LIMITS } from '@/lib/rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Use fake timers for predictable time
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('rateLimitSync', () => {
    it('should allow requests within limit', () => {
      const key = 'test:user-1'
      const config = RATE_LIMITS.moderate // 20 requests per 5 minutes

      // First request should succeed
      const result1 = rateLimitSync(key, config)
      expect(result1.success).toBe(true)
      expect(result1.resetIn).toBeGreaterThan(0)

      // Second request should also succeed
      const result2 = rateLimitSync(key, config)
      expect(result2.success).toBe(true)
    })

    it('should block requests when limit exceeded', () => {
      const key = 'test:user-2'
      const config = RATE_LIMITS.strict // 5 requests per 15 minutes
      const maxRequests = config.maxRequests

      // Make max requests
      for (let i = 0; i < maxRequests; i++) {
        const result = rateLimitSync(key, config)
        expect(result.success).toBe(true)
      }

      // Next request should be blocked
      const blockedResult = rateLimitSync(key, config)
      expect(blockedResult.success).toBe(false)
      expect(blockedResult.resetIn).toBeGreaterThan(0)
    })

    it('should reset after window expires', () => {
      const key = 'test:user-3'
      const config = RATE_LIMITS.strict // 5 requests per 15 minutes
      const maxRequests = config.maxRequests
      const windowSeconds = config.windowSeconds

      // Exhaust the limit
      for (let i = 0; i < maxRequests; i++) {
        rateLimitSync(key, config)
      }

      // Should be blocked
      const blocked = rateLimitSync(key, config)
      expect(blocked.success).toBe(false)

      // Advance time past the window
      vi.advanceTimersByTime((windowSeconds + 1) * 1000)

      // Should be allowed again
      const allowed = rateLimitSync(key, config)
      expect(allowed.success).toBe(true)
    })

    it('should handle different keys independently', () => {
      const config = RATE_LIMITS.moderate
      const user1 = 'user-1'
      const user2 = 'user-2'

      // User 1 makes request
      const result1 = rateLimitSync(user1, config)
      expect(result1.success).toBe(true)

      // User 2 makes request (should have full limit)
      const result2 = rateLimitSync(user2, config)
      expect(result2.success).toBe(true)
    })

    it('should provide correct reset time', () => {
      const key = 'test:user-5'
      const config = RATE_LIMITS.moderate
      const windowSeconds = config.windowSeconds

      const result = rateLimitSync(key, config)
      expect(result.success).toBe(true)

      // Reset time should be approximately windowSeconds in the future
      expect(result.resetIn).toBeGreaterThan(windowSeconds - 2)
      expect(result.resetIn).toBeLessThanOrEqual(windowSeconds)
    })
  })

  describe('RATE_LIMITS', () => {
    it('should have strict config for sensitive endpoints', () => {
      expect(RATE_LIMITS.strict.maxRequests).toBe(5)
      expect(RATE_LIMITS.strict.windowSeconds).toBe(15 * 60) // 15 minutes
    })

    it('should have moderate config', () => {
      expect(RATE_LIMITS.moderate.maxRequests).toBe(20)
      expect(RATE_LIMITS.moderate.windowSeconds).toBe(5 * 60) // 5 minutes
    })

    it('should have lenient config', () => {
      expect(RATE_LIMITS.lenient.maxRequests).toBe(60)
      expect(RATE_LIMITS.lenient.windowSeconds).toBe(60) // 1 minute
    })

    it('should have password reset config', () => {
      expect(RATE_LIMITS.passwordReset.maxRequests).toBe(3)
      expect(RATE_LIMITS.passwordReset.windowSeconds).toBe(30 * 60) // 30 minutes
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid sequential requests', () => {
      const key = 'rapid-user'
      const config = RATE_LIMITS.moderate
      const maxRequests = config.maxRequests

      // Make requests as fast as possible
      for (let i = 0; i < maxRequests; i++) {
        const result = rateLimitSync(key, config)
        expect(result.success).toBe(true)
      }

      // Should block the next one
      const blocked = rateLimitSync(key, config)
      expect(blocked.success).toBe(false)
    })

    it('should handle requests at exact window boundary', () => {
      const key = 'boundary-user'
      const config = RATE_LIMITS.strict
      const windowSeconds = config.windowSeconds

      // First request
      const result1 = rateLimitSync(key, config)
      expect(result1.success).toBe(true)

      // Advance to exact reset time
      vi.advanceTimersByTime(result1.resetIn * 1000)

      // Should allow new request (window expired)
      const result2 = rateLimitSync(key, config)
      expect(result2.success).toBe(true)
    })

    it('should handle different case identifiers as different users', () => {
      const config = RATE_LIMITS.moderate

      const lower = rateLimitSync('test-user', config)
      const upper = rateLimitSync('TEST-USER', config)
      const mixed = rateLimitSync('Test-User', config)

      // All should be treated as different users
      expect(lower.success).toBe(true)
      expect(upper.success).toBe(true)
      expect(mixed.success).toBe(true)
    })

    it('should handle very long keys', () => {
      const longKey = 'user:' + 'a'.repeat(1000)
      const config = RATE_LIMITS.moderate

      const result = rateLimitSync(longKey, config)
      expect(result.success).toBe(true)
    })
  })
})
