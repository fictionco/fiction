import type express from 'express'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { detectRecursivePath, securityMiddleware } from '../securityMiddleware'


describe('detectRecursivePath', () => {
  it('returns false for normal paths without repetition', () => {
    expect(detectRecursivePath({ pathname: '/users/john/profile', maxLength: 500 })).toBe(false);
    expect(detectRecursivePath({ pathname: '/blog/post/123', maxLength: 500 })).toBe(false);
  });

  it('returns true when total path length exceeds maxLength', () => {
    const longPath = '/a'.repeat(501);
    expect(detectRecursivePath({ pathname: longPath, maxLength: 500 })).toBe(true);
  });

  it('returns true for segments over checkLength chars with repeating patterns at end', () => {
    const repeatingEnd = '/users/' + 'abc'.repeat(20); // 60 chars in last segment
    expect(detectRecursivePath({ pathname: repeatingEnd, maxLength: 500, checkLength: 50 })).toBe(true);
  });

  it('returns true for middle segments over checkLength chars with repeating patterns', () => {
    const repeatingMiddle = '/blog/' + 'bla'.repeat(18) + '/whatever'; // 54 chars in middle segment
    expect(detectRecursivePath({ pathname: repeatingMiddle, maxLength: 500, checkLength: 50 })).toBe(true);
  });

  it('returns false for long segments without repetition', () => {
    const longNonRepeating = '/users/' + 'abcdefghijklmnopqrstuvwxyz'.repeat(2); // 52 chars
    expect(detectRecursivePath({ pathname: longNonRepeating, maxLength: 500, checkLength: 50 })).toBe(false);
  });

  it('handles empty or root paths', () => {
    expect(detectRecursivePath({ pathname: '', maxLength: 500 })).toBe(false);
    expect(detectRecursivePath({ pathname: '/', maxLength: 500 })).toBe(false);
  });

  it('respects custom checkLength', () => {
    const repeatingShort = '/users/' + 'xyz'.repeat(10); // 30 chars
    expect(detectRecursivePath({ pathname: repeatingShort, maxLength: 500, checkLength: 25 })).toBe(true);
    expect(detectRecursivePath({ pathname: repeatingShort, maxLength: 500, checkLength: 40 })).toBe(false);
  });
});
describe('security Middleware', () => {
  let req: Partial<express.Request>
  let res: Partial<express.Response>
  let next: express.NextFunction

  beforeEach(() => {
    // Enable fake timers
    vi.useFakeTimers()
    // Reset mocks for each test
    req = {
      protocol: 'http',
      host: 'www.test.com',
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

  afterEach(() => {
    // Restore real timers
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('allows normal requests to pass through', () => {
    securityMiddleware(req as express.Request, res as express.Response, next)
    expect(next).toHaveBeenCalled()
  })

  it('blocks PHP probe attempts and increments block counter', () => {
    req = {
      ...req,
      originalUrl: '/wp-admin/index.php',
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
      originalUrl: '/wp-admin',
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
      originalUrl: '/phpinfo',
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
      originalUrl: '/normal-path',
    }
    securityMiddleware(req as express.Request, res as express.Response, next)

    expect(next).toHaveBeenCalled()
  })
})
