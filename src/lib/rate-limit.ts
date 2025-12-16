/**
 * Simple in-memory rate limiter for Next.js API routes
 * For production, consider using Redis-based solution
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now()
      const entries = Array.from(rateLimitStore.entries())
      for (const [key, entry] of entries) {
        if (entry.resetTime < now) {
          rateLimitStore.delete(key)
        }
      }
    },
    5 * 60 * 1000
  )
}

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  windowInSeconds: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (IP, user ID, etc.)
 * @param options - Rate limit configuration
 * @returns Rate limit result with remaining requests and reset time
 */
export function rateLimit(identifier: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const windowMs = options.windowInSeconds * 1000
  const entry = rateLimitStore.get(identifier)

  // If no entry or window has expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      remaining: options.limit - 1,
      resetIn: options.windowInSeconds,
    }
  }

  // Increment count
  entry.count++

  // Check if over limit
  if (entry.count > options.limit) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetIn,
    }
  }

  return {
    success: true,
    remaining: options.limit - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return 'unknown'
}

// Preset configurations
export const RATE_LIMITS = {
  /** Login: 5 attempts per minute */
  login: { limit: 5, windowInSeconds: 60 },
  /** Password reset: 3 attempts per 15 minutes */
  passwordReset: { limit: 3, windowInSeconds: 900 },
  /** API general: 100 requests per minute */
  api: { limit: 100, windowInSeconds: 60 },
  /** Strict: 10 requests per minute */
  strict: { limit: 10, windowInSeconds: 60 },
  /** WhatsApp webhook: 1000 per minute (high volume) */
  webhook: { limit: 1000, windowInSeconds: 60 },
} as const
