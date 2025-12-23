/**
 * FQ.7.2: Rate Limiting Middleware
 *
 * Distributed rate limiter using Upstash Redis for serverless environments.
 * Falls back to in-memory rate limiting if Redis is not configured.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { logger } from './logger'

// ============================================================================
// UPSTASH REDIS CONFIGURATION
// ============================================================================

let redis: Redis | null = null
const ratelimiters: Map<string, Ratelimit> = new Map()

/**
 * Check if Upstash Redis is configured
 */
function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

/**
 * Initialize Redis client (lazy loading)
 */
function getRedis(): Redis | null {
  if (!isRedisConfigured()) {
    return null
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    logger.info('[RATE_LIMIT] Upstash Redis initialized')
  }

  return redis
}

/**
 * Get or create a ratelimiter for specific configuration
 */
function getRatelimiter(config: RateLimitConfig): Ratelimit | null {
  const redisClient = getRedis()
  if (!redisClient) {
    return null
  }

  const key = `${config.maxRequests}-${config.windowSeconds}`

  if (!ratelimiters.has(key)) {
    const ratelimiter = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowSeconds} s`),
      analytics: true,
      prefix: 'versati_glass',
    })
    ratelimiters.set(key, ratelimiter)
    logger.debug('[RATE_LIMIT] Created new ratelimiter', { key, config })
  }

  return ratelimiters.get(key)!
}

// ============================================================================
// IN-MEMORY FALLBACK (for development or when Redis is not configured)
// ============================================================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting (fallback)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// MAIN RATE LIMIT FUNCTION
// ============================================================================

/**
 * Check if a request should be rate limited
 *
 * Uses Upstash Redis if configured, otherwise falls back to in-memory rate limiting.
 *
 * @param request - Next.js Request object
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and headers
 */
export async function rateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { identifier } = config

  // Get identifier (IP address or custom identifier)
  const ip = identifier || getClientIP(request)
  const key = ip

  // Try to use Redis-based rate limiting
  const ratelimiter = getRatelimiter(config)

  if (ratelimiter) {
    try {
      const result = await ratelimiter.limit(key)

      if (!result.success) {
        logger.warn('[RATE_LIMIT] Request blocked (Redis)', {
          ip,
          limit: result.limit,
          remaining: result.remaining,
          reset: new Date(result.reset).toISOString(),
        })
      }

      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: Math.ceil(result.reset / 1000),
      }
    } catch (error) {
      logger.error('[RATE_LIMIT] Redis error, falling back to in-memory', error)
      // Fall through to in-memory implementation
    }
  }

  // Fallback: In-memory rate limiting
  return rateLimitInMemory(key, config)
}

/**
 * In-memory rate limiting (fallback when Redis is not available)
 */
function rateLimitInMemory(key: string, config: RateLimitConfig): RateLimitResult {
  const { maxRequests, windowSeconds } = config

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
    logger.warn('[RATE_LIMIT] Request blocked (in-memory)', {
      key,
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

// ============================================================================
// PRESET RATE LIMIT CONFIGURATIONS
// ============================================================================

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Strict rate limit for quote creation
   * In development: 50 requests per 5 minutes
   * In production: 5 requests per 15 minutes per IP
   */
  QUOTE_CREATION: {
    maxRequests: process.env.NODE_ENV === 'development' ? 50 : 5,
    windowSeconds: process.env.NODE_ENV === 'development' ? 5 * 60 : 15 * 60,
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

// ============================================================================
// LEGACY API (for backward compatibility)
// ============================================================================

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
  const result = rateLimitInMemory(key, config)
  const resetIn = result.reset - Math.floor(Date.now() / 1000)

  return {
    success: result.success,
    resetIn: Math.max(0, resetIn),
  }
}
