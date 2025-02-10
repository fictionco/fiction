import type { NextFunction, Request, Response } from 'express'

/**
 * Rate limiting configuration and storage
 */
class RateLimiter {
  private readonly windowMs: number
  private readonly maxRequests: number
  private readonly store = new Map<string, { count: number, resetTime: number }>()

  constructor(options: { windowMs?: number, maxRequests?: number } = {}) {
    this.windowMs = options.windowMs || 60 * 1000 // Default: 1 minute window
    this.maxRequests = options.maxRequests || 60 // Default: 60 requests per window
  }

  /**
   * Cleanup expired entries periodically
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.store.entries()) {
      if (now >= value.resetTime) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Get client identifier from request
   */
  private getClientIdentifier(req: Request): string {
    // Use X-Forwarded-For if behind proxy, fallback to remote address
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || ''
    return `${clientIp}:${req.path}`
  }

  /**
   * Check if request should be rate limited
   */
  public isRateLimited(req: Request): { limited: boolean, remainingRequests: number, resetTime: number } {
    this.cleanup() // Clean expired entries

    const now = Date.now()
    const identifier = this.getClientIdentifier(req)
    const entry = this.store.get(identifier)

    if (!entry) {
      // First request from this client
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      })
      return { limited: false, remainingRequests: this.maxRequests - 1, resetTime: now + this.windowMs }
    }

    if (now > entry.resetTime) {
      // Window expired, reset counter
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      })
      return { limited: false, remainingRequests: this.maxRequests - 1, resetTime: now + this.windowMs }
    }

    // Update existing entry
    entry.count++
    this.store.set(identifier, entry)

    const remaining = Math.max(0, this.maxRequests - entry.count)
    return {
      limited: entry.count > this.maxRequests,
      remainingRequests: remaining,
      resetTime: entry.resetTime,
    }
  }
}

/**
 * Create rate limiting middleware
 */
export function createRateLimiter(options?: { windowMs?: number, maxRequests?: number }) {
  const limiter = new RateLimiter(options)

  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = limiter.isRateLimited(req)

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', String(options?.maxRequests || 100))
    res.setHeader('X-RateLimit-Remaining', String(result.remainingRequests))
    res.setHeader('X-RateLimit-Reset', String(result.resetTime))

    if (result.limited) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      })
      return
    }

    next()
  }
}
