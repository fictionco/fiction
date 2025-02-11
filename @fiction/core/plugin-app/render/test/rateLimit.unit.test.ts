import type { Request, Response } from 'express'
import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRateLimiter } from '../rateLimitingMiddleware'

describe('rate Limiter', () => {
  // Mock request, response and next function
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: Mock
  let headers: Record<string, string>

  beforeEach(() => {
    // Reset time to a known value for consistent testing
    vi.useFakeTimers()

    headers = {}
    mockReq = {
      socket: { remoteAddress: '127.0.0.1' } as Partial<Request['socket']>,
      path: '/test',
      headers: {},
    } as Partial<Request>

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockImplementation((key: string, value: string) => {
        headers[key] = value
      }),
    }

    mockNext = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('basic Rate Limiting', () => {
    it('should allow requests within rate limit', () => {
      const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 2 })

      // First request
      limiter(mockReq as Request, mockRes as Response, mockNext)
      expect(mockNext).toHaveBeenCalled()
      expect(headers['X-RateLimit-Remaining']).toBe('1')

      // Second request
      limiter(mockReq as Request, mockRes as Response, mockNext)
      expect(mockNext).toHaveBeenCalled()
      expect(headers['X-RateLimit-Remaining']).toBe('0')
    })

    it('should block requests over rate limit', () => {
      const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 2 })

      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        limiter(mockReq as Request, mockRes as Response, mockNext)
      }

      // Third request should be blocked
      expect(mockRes.status).toHaveBeenCalledWith(429)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
        }),
      )
    })
  })

  describe('time Window Behavior', () => {
    it('should reset counter after window expires', () => {
      const windowMs = 60000 // 1 minute
      const limiter = createRateLimiter({ windowMs, maxRequests: 2 })

      // Use up the limit
      limiter(mockReq as Request, mockRes as Response, mockNext)
      limiter(mockReq as Request, mockRes as Response, mockNext)
      expect(headers['X-RateLimit-Remaining']).toBe('0')

      // Advance time past window
      vi.advanceTimersByTime(windowMs + 1000)

      // Should be able to make requests again
      limiter(mockReq as Request, mockRes as Response, mockNext)
      expect(mockNext).toHaveBeenCalled()
      expect(headers['X-RateLimit-Remaining']).toBe('1')
    })
  })

  describe('client Identification', () => {
    it('should track requests by IP address', () => {
      const limiter = createRateLimiter({ maxRequests: 2 })

      // Request from first IP
      mockReq = {
        ...mockReq,
        socket: { remoteAddress: '1.1.1.1' } as Partial<Request['socket']>,
      } as Partial<Request>
      limiter(mockReq as Request, mockRes as Response, mockNext)
      expect(mockNext).toHaveBeenCalled()

      mockReq = {
        ...mockReq,
        socket: { remoteAddress: '2.2.2.2' } as Partial<Request['socket']>,
      } as Partial<Request>
      limiter(mockReq as Request, mockRes as Response, mockNext)
      expect(mockNext).toHaveBeenCalled()

      // Both IPs should have their own counters
      expect(headers['X-RateLimit-Remaining']).toBe('1')
    })

    it('should use X-Forwarded-For header when present', () => {
      const limiter = createRateLimiter({ maxRequests: 2 })

      // Set X-Forwarded-For header
      mockReq.headers = { 'x-forwarded-for': '3.3.3.3' }

      limiter(mockReq as Request, mockRes as Response, mockNext)
      expect(mockNext).toHaveBeenCalled()
      expect(headers['X-RateLimit-Remaining']).toBe('1')
    })
  })

  describe('headers', () => {
    it('should set correct rate limit headers', () => {
      const limiter = createRateLimiter({ maxRequests: 100 })

      limiter(mockReq as Request, mockRes as Response, mockNext)

      expect(headers).toMatchObject({
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '99',
        'X-RateLimit-Reset': expect.any(String),
      })
    })
  })

  describe('error Handling', () => {
    it('should handle malformed headers gracefully', () => {
      const limiter = createRateLimiter()
      mockReq.headers = { 'x-forwarded-for': undefined }

      expect(() => {
        limiter(mockReq as Request, mockRes as Response, mockNext)
      }).not.toThrow()
    })
  })

  describe('cleanup', () => {
    it('should cleanup expired entries', async () => {
      const windowMs = 1000 // 1 second window
      const limiter = createRateLimiter({ windowMs, maxRequests: 2 })

      // Make initial request
      limiter(mockReq as Request, mockRes as Response, mockNext)

      // Advance time past window
      vi.advanceTimersByTime(windowMs + 100)

      // Make another request - should reset counter
      limiter(mockReq as Request, mockRes as Response, mockNext)
      expect(headers['X-RateLimit-Remaining']).toBe('1')
    })
  })

  describe('configuration', () => {
    it('should use default values when no config provided', () => {
      const limiter = createRateLimiter()

      limiter(mockReq as Request, mockRes as Response, mockNext)

      expect(headers['X-RateLimit-Limit']).toBe('100') // Default max requests
      expect(mockNext).toHaveBeenCalled()
    })

    it('should respect custom configuration', () => {
      const limiter = createRateLimiter({
        windowMs: 30000, // 30 seconds
        maxRequests: 5,
      })

      limiter(mockReq as Request, mockRes as Response, mockNext)

      expect(headers['X-RateLimit-Limit']).toBe('5')
      expect(mockNext).toHaveBeenCalled()
    })
  })
})
