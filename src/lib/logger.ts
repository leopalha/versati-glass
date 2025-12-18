/**
 * Professional logging utility for Versati Glass
 *
 * Usage:
 * - logger.error() - Critical errors (always logged)
 * - logger.warn() - Warnings (logged in dev and test)
 * - logger.info() - Informational (logged in dev and test)
 * - logger.debug() - Debug info (only in development)
 *
 * In production, only errors are logged to avoid performance issues
 * and exposing sensitive information in client-side logs.
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
}

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Log critical errors - ALWAYS logged in all environments
   */
  error(message: string, error?: any) {
    const entry = this.formatMessage('error', message, error)

    console.error(`[ERROR] ${entry.timestamp} - ${message}`, error || '')

    // In production, you might want to send to error tracking service
    if (isProduction && typeof window !== 'undefined') {
      // Send to Sentry, LogRocket, etc.
      // window.trackError?.({ message, error, timestamp: entry.timestamp })
    }
  }

  /**
   * Log warnings - logged in dev and test, silent in production
   */
  warn(message: string, data?: any) {
    if (isProduction) return

    const entry = this.formatMessage('warn', message, data)
    console.warn(`[WARN] ${entry.timestamp} - ${message}`, data || '')
  }

  /**
   * Log informational messages - logged in dev and test, silent in production
   */
  info(message: string, data?: any) {
    if (isProduction) return

    const entry = this.formatMessage('info', message, data)
    console.info(`[INFO] ${entry.timestamp} - ${message}`, data || '')
  }

  /**
   * Log debug information - ONLY in development
   */
  debug(message: string, data?: any) {
    if (!isDevelopment) return

    const entry = this.formatMessage('debug', message, data)
    console.debug(`[DEBUG] ${entry.timestamp} - ${message}`, data || '')
  }

  /**
   * Log API requests (useful for debugging)
   */
  request(method: string, url: string, data?: any) {
    if (isProduction) return

    console.debug(
      `[REQUEST] ${method} ${url}`,
      data ? `\nData: ${JSON.stringify(data, null, 2)}` : ''
    )
  }

  /**
   * Log API responses (useful for debugging)
   */
  response(method: string, url: string, status: number, data?: any) {
    if (isProduction) return

    const emoji = status >= 200 && status < 300 ? '✅' : '❌'
    console.debug(
      `[RESPONSE] ${emoji} ${method} ${url} - ${status}`,
      data ? `\nData: ${JSON.stringify(data, null, 2)}` : ''
    )
  }

  /**
   * Performance measurement
   */
  time(label: string) {
    if (isProduction) return
    console.time(label)
  }

  timeEnd(label: string) {
    if (isProduction) return
    console.timeEnd(label)
  }
}

export const logger = new Logger()

// Re-export for convenience
export default logger

/**
 * ARCH-P1-2: Standardized error handling utilities
 */

export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: any
  stack?: string
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'Unknown error occurred'
}

/**
 * Convert unknown error to structured AppError
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    }
  }
  if (typeof error === 'string') {
    return { message: error }
  }
  if (error && typeof error === 'object') {
    return {
      message: getErrorMessage(error),
      details: error,
    }
  }
  return { message: 'Unknown error occurred' }
}

/**
 * Log and return standardized error for API routes
 */
export function handleApiError(error: unknown, context: string) {
  const appError = toAppError(error)
  logger.error(`[API ${context}] Error:`, appError)

  return {
    error: appError.message,
    code: appError.code,
    ...(process.env.NODE_ENV !== 'production' && { details: appError.details }),
  }
}
