/**
 * FQ.7.2: Rate Limiting Middleware
 *
 * Simple in-memory rate limiter for API routes.
 * For production, consider using Redis or Upstash Rate Limit.
 */

import { logger } from './logger'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
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

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number

  /**
   * Time window in seconds
   */
  windowSeconds: number

  /**
   * Optional custom identifier (defaults to IP address)
   */
  identifier?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if a request should be rate limited
 *
 * @param request - Next.js Request object
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and headers
 */
export async function rateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { maxRequests, windowSeconds, identifier } = config

  // Get identifier (IP address or custom identifier)
  const ip = identifier || getClientIP(request)
  const key = `rate_limit:${ip}`

  const now = Date.now()
  const windowMs = windowSeconds * 1000

  // Get or create entry
  let entry = rateLimitStore.get(key)

  if (!entry || entry.resetTime < now) {
    // Create new entry
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  const success = entry.count <= maxRequests
  const remaining = Math.max(0, maxRequests - entry.count)
  const reset = Math.ceil(entry.resetTime / 1000)

  if (!success) {
    logger.warn('[RATE_LIMIT] Request blocked', {
      ip,
      count: entry.count,
      limit: maxRequests,
      resetTime: new Date(entry.resetTime).toISOString(),
    })
  }

  return {
    success,
    limit: maxRequests,
    remaining,
    reset,
  }
}

/**
 * Extract client IP address from request headers
 */
function getClientIP(request: Request): string {
  // Check common headers for proxy/CDN scenarios
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback to a default identifier
  return 'unknown'
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Strict rate limit for quote creation
   * 5 requests per 15 minutes per IP
   */
  QUOTE_CREATION: {
    maxRequests: 5,
    windowSeconds: 15 * 60, // 15 minutes
  },

  /**
   * Standard rate limit for mutations
   * 20 requests per 5 minutes per IP
   */
  MUTATIONS: {
    maxRequests: 20,
    windowSeconds: 5 * 60, // 5 minutes
  },

  /**
   * Lenient rate limit for queries
   * 60 requests per minute per IP
   */
  QUERIES: {
    maxRequests: 60,
    windowSeconds: 60, // 1 minute
  },
} as const

/**
 * Legacy API for backward compatibility
 */
export const RATE_LIMITS = {
  strict: {
    maxRequests: 5,
    windowSeconds: 15 * 60,
  },
  moderate: {
    maxRequests: 20,
    windowSeconds: 5 * 60,
  },
  lenient: {
    maxRequests: 60,
    windowSeconds: 60,
  },
  passwordReset: {
    maxRequests: 3,
    windowSeconds: 30 * 60, // 30 minutes
  },
} as const

/**
 * Legacy getClientIp function for backward compatibility
 */
export function getClientIp(request: Request): string {
  return getClientIP(request)
}

/**
 * Legacy rateLimit function signature (synchronous version)
 * For new code, use the async rateLimit function
 */
interface LegacyRateLimitResult {
  success: boolean
  resetIn: number
}

export function rateLimitSync(key: string, config: RateLimitConfig): LegacyRateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000

  let entry = rateLimitStore.get(key)

  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  entry.count++

  const success = entry.count <= config.maxRequests
  const resetIn = Math.ceil((entry.resetTime - now) / 1000)

  if (!success) {
    logger.warn('[RATE_LIMIT] Request blocked (sync)', {
      key,
      count: entry.count,
      limit: config.maxRequests,
      resetIn,
    })
  }

  return { success, resetIn }
}
