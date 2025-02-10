import type express from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { securityMiddleware } from '../securityMiddleware'

describe('security Middleware', () => {
  let req: Partial<express.Request>
  let res: Partial<express.Response>
  let next: express.NextFunction

  beforeEach(() => {
    // Enable fake timers
    vi.useFakeTimers()
    // Reset mocks for each test
    req = {
      path: '/normal-path',
      originalUrl: '/normal-path',
      headers: {},
      socket: { remoteAddress: '1.1.1.1' } as Partial<express.Request['socket']>,
      get: vi.fn().mockReturnValue('normal-user-agent'),
    } as Partial<express.Request>

    res = {
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
    }

    next = vi.fn()

    // Mock Date.now() for consistent testing
    vi.setSystemTime(new Date('2025-02-10'))
  })

  it('allows normal requests to pass through', () => {
    securityMiddleware(req as express.Request, res as express.Response, next)
    expect(next).toHaveBeenCalled()
  })

  it('blocks PHP probe attempts and increments block counter', () => {
    req = {
      ...req,
      path: '/wp-admin/index.php',
    }

    // Make three suspicious requests
    for (let i = 0; i < 3; i++) {
      securityMiddleware(req as express.Request, res as express.Response, next)
    }

    expect(res.status).toHaveBeenLastCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('blocks malicious user agents', () => {
    req.get = vi.fn().mockReturnValue('nmap scanner')

    securityMiddleware(req as express.Request, res as express.Response, next)

    expect(res.status).toHaveBeenLastCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('detects path traversal attempts', () => {
    req.originalUrl = '/../../../etc/passwd'

    securityMiddleware(req as express.Request, res as express.Response, next)

    expect(res.status).toHaveBeenLastCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('handles X-Forwarded-For header correctly', () => {
    req = {
      ...req,
      headers: { 'x-forwarded-for': '5.5.5.5, 2.2.2.2' },
      path: '/wp-admin',
    }

    // Make multiple requests to ensure blocking works with forwarded IP
    for (let i = 0; i < 3; i++) {
      securityMiddleware(req as express.Request, res as express.Response, next)
    }

    expect(res.status).toHaveBeenLastCalledWith(403)
  })

  it('allows blocked IPs after expiration', () => {
    const ip = '3.3.3.3'
    req = {
      ...req,
      path: '/phpinfo',
      socket: { remoteAddress: ip } as Partial<express.Request['socket']>,
    } as Partial<express.Request>

    // Make enough requests to get blocked
    for (let i = 0; i < 3; i++) {
      securityMiddleware(req as express.Request, res as express.Response, next)
    }

    // Advance time past block duration
    vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 1000)

    // Reset mocks
    next = vi.fn()
    res.status = vi.fn().mockReturnThis()
    res.end = vi.fn()

    // Make another request - should be allowed
    req = {
      ...req,
      path: '/normal-path',
    }
    securityMiddleware(req as express.Request, res as express.Response, next)

    expect(next).toHaveBeenCalled()
  })
})
