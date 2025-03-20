import jwt from 'jsonwebtoken'
// SessionTokenUtil.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { manageClientUserToken } from '../jwt'
import { createRenderToken, createSessionSharingMiddleware, SessionTokenUtil } from './session'

// Mock dependencies - minimal approach
vi.mock('../jwt', () => ({
  manageClientUserToken: vi.fn().mockReturnValue('mocked-token'),
}))

// Browser environment setup helper
function mockBrowser() {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document

  const mockElement = {
    style: {},
    contentWindow: { postMessage: vi.fn() },
    onerror: null,
    parentNode: { removeChild: vi.fn() },
  }

  // Create a mock function and store the reference
  const addEventListenerMock = vi.fn()

  globalThis.window = {
    location: { href: 'https://example.com' },
    addEventListener: addEventListenerMock,
    removeEventListener: vi.fn(),
  } as any

  globalThis.document = {
    createElement: vi.fn(() => mockElement),
    body: { appendChild: vi.fn() },
  } as any

  return {
    cleanup: () => {
      globalThis.window = originalWindow
      globalThis.document = originalDocument
    },
    mockElement,
    // Use the stored reference directly
    triggerMessage: (data: any, origin = 'https://app.example.com') => {
      const handler = addEventListenerMock.mock.calls[0][1]
      handler({ origin, data, source: { postMessage: vi.fn() } })
    },
  }
}

describe('session Token Sharing', () => {
  describe('sessionTokenUtil', () => {
    let browser: ReturnType<typeof mockBrowser>

    beforeEach(() => {
      browser = mockBrowser()
      vi.useFakeTimers()
    })

    afterEach(() => {
      browser.cleanup()
      vi.clearAllMocks()
      vi.useRealTimers()
    })

    it('identifies root domain correctly and retrieves token appropriately', async () => {
      const util = new SessionTokenUtil({
        appUrl: 'https://example.com',
        endpoint: '/session-auth',
        tokenKey: 'auth_token',
      })

      // Test domain recognition
      const testCases = [
        { url: 'https://example.com/page', isRoot: true },
        { url: 'https://sub.example.com/page', isRoot: true },
        { url: 'http://localhost:3000', isRoot: true },
        { url: 'https://customer-site.com/page', isRoot: false },
      ]

      for (const { url, isRoot } of testCases) {
        globalThis.window.location.href = url
        expect(util.isRootDomain(), `URL ${url} should ${isRoot ? '' : 'not '}be recognized as root domain`).toBe(isRoot)
      }

      // Test token retrieval logic for root domain
      globalThis.window.location.href = 'https://example.com/page'
      const token = await util.getAuthToken()

      expect(token).toBe('mocked-token')
      expect(manageClientUserToken).toHaveBeenCalledWith({ key: 'auth_token' })
    })

    it('manages token cache lifecycle correctly', async () => {
      const util = new SessionTokenUtil({
        appUrl: 'https://app.example.com',
        endpoint: '/session-auth',
        tokenKey: 'auth_token',
        cacheDurationMs: 10000,
      })

      // Mock iframe token retrieval
      vi.spyOn(util, 'requestTokenViaIframe').mockResolvedValue({
        token: 'iframe-token-123',
        reason: 'test',
      })

      // Set to non-root domain
      globalThis.window.location.href = 'https://customer.com/page'

      // First request - should use iframe
      const token1 = await util.getSharedSessionToken()
      expect(token1).toBe('iframe-token-123')
      expect(util.requestTokenViaIframe).toHaveBeenCalledTimes(1)

      // Second request within cache duration - should use cache
      const token2 = await util.getSharedSessionToken()
      expect(token2).toBe('iframe-token-123')
      expect(util.requestTokenViaIframe).toHaveBeenCalledTimes(1)

      // Advance time past cache duration
      vi.advanceTimersByTime(11000)

      // Request after cache expiry - should refresh
      await util.getSharedSessionToken()
      expect(util.requestTokenViaIframe).toHaveBeenCalledTimes(2)
    })

    it('handles iframe communication for token retrieval', async () => {
      const util = new SessionTokenUtil({
        appUrl: 'https://app.example.com',
        endpoint: '/session-auth',
        tokenKey: 'auth_token',
        timeoutMs: 1000,
      })

      // Not on root domain
      globalThis.window.location.href = 'https://customer.com/page'

      // Start token request
      const tokenPromise = util.requestTokenViaIframe()

      // Verify iframe setup
      expect(document.createElement).toHaveBeenCalledWith('iframe')
      expect(document.body.appendChild).toHaveBeenCalled()
      expect(globalThis.window.addEventListener).toHaveBeenCalled()

      // Simulate iframe ready message
      setTimeout(() => {
        browser.triggerMessage('AUTH_FRAME_READY')

        // Then simulate token response
        setTimeout(() => {
          browser.triggerMessage({
            type: 'AUTH_TOKEN_RESPONSE',
            token: 'shared-session-token',
            timestamp: Date.now(),
            reason: 'test-success',
          })
        }, 100)
      }, 100)

      // Advance timer to trigger both events
      vi.advanceTimersByTime(250)

      // Check result
      const result = await tokenPromise
      expect(result.token).toBe('shared-session-token')

      // Verify cleanup occurred
      expect(globalThis.window.removeEventListener).toHaveBeenCalled()
      expect(browser.mockElement.parentNode.removeChild).toHaveBeenCalled()
    })

    it('handles timeout during iframe communication', async () => {
      const util = new SessionTokenUtil({
        appUrl: 'https://app.example.com',
        endpoint: '/session-auth',
        tokenKey: 'auth_token',
        timeoutMs: 500,
      })

      // Start token request but never trigger a response
      globalThis.window.location.href = 'https://customer.com/page'
      const tokenPromise = util.requestTokenViaIframe()

      // Advance time past timeout
      vi.advanceTimersByTime(600)

      // Verify timeout handling
      const result = await tokenPromise
      expect(result.token).toBeUndefined()
      expect(result.reason).toBe('timeout')

      // Verify cleanup occurred
      expect(globalThis.window.removeEventListener).toHaveBeenCalled()
      expect(browser.mockElement.parentNode.removeChild).toHaveBeenCalled()
    })
  })

  describe('createRenderToken', () => {
    const TOKEN_SECRET = 'test-secret-key'

    it('creates valid JWT token with configurable expiration', () => {
      // Default expiration (3 minutes)
      const token1 = createRenderToken({ tokenSecret: TOKEN_SECRET })
      const decoded1 = jwt.verify(token1, TOKEN_SECRET) as any
      expect(decoded1.renderedAt).toBeDefined()
      expect(decoded1.exp - decoded1.iat).toBe(180)

      // Custom expiration
      const token2 = createRenderToken({
        tokenSecret: TOKEN_SECRET,
        expiresIn: 600, // 10 minutes
      })
      const decoded2 = jwt.verify(token2, TOKEN_SECRET) as any
      expect(decoded2.exp - decoded2.iat).toBe(600)
    })

    it('throws error when tokenSecret is missing', () => {
      expect(() => createRenderToken({ tokenSecret: '' }))
        .toThrow('tokenSecret is not available for renderToken')
    })
  })

  describe('createSessionSharingMiddleware', () => {
    // Helper to create mock request and response objects
    const mockReq = (overrides = {}) => ({
      headers: { referer: 'https://customer.com', origin: 'https://customer.com' },
      query: {},
      cookies: { auth_token: 'user-token-abc' },
      ip: '127.0.0.1',
      ...overrides,
    })

    const mockRes = () => ({
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      end: vi.fn(),
      set: vi.fn(),
    })

    it('enforces security requirements to prevent session jacking', () => {
      const middleware = createSessionSharingMiddleware({
        userTokenKey: 'auth_token',
        renderTokenSecret: 'secret',
      })

      const res = mockRes()

      // Test security validations
      // 1. Missing referer
      middleware(
        mockReq({ headers: { referer: undefined } }) as any,
        res as any,
        vi.fn(),
      )
      expect(res.status).toHaveBeenCalledWith(403)
      vi.clearAllMocks()

      // 2. Missing renderToken
      middleware(
        mockReq() as any,
        res as any,
        vi.fn(),
      )
      expect(res.status).toHaveBeenCalledWith(403)
      vi.clearAllMocks()

      // 3. Invalid renderToken
      middleware(
        mockReq({ query: { renderToken: 'invalid-token' } }) as any,
        res as any,
        vi.fn(),
      )
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('delivers secure HTML with embedded token for valid requests', () => {
      // Create valid renderToken with proper expiration
      const tokenSecret = 'secret-key'
      const validToken = jwt.sign({ renderedAt: Date.now().toString() }, tokenSecret)

      const middleware = createSessionSharingMiddleware({
        userTokenKey: 'auth_token',
        renderTokenSecret: tokenSecret,
      })

      const req = mockReq({ query: { renderToken: validToken } })
      const res = mockRes()

      middleware(req as any, res as any, vi.fn())

      // Verify security headers
      expect(res.set).toHaveBeenCalledWith(expect.objectContaining({
        'Access-Control-Allow-Credentials': 'true',
        'Content-Security-Policy': expect.stringContaining('default-src'),
        'Access-Control-Allow-Origin': 'https://customer.com',
      }))

      // Verify HTML content
      const html = res.send.mock.calls[0][0]

      // Key components of the secure iframe
      expect(html).toContain('user-token-abc') // Contains the auth token
      expect(html).toContain('window.addEventListener(\'message\'') // Message handling
      expect(html).toContain('window.parent.postMessage') // Communication with parent
      expect(html).toContain('timestamp: Date.now()') // Adds timestamp for freshness check
    })
  })
})
