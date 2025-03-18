// sessionToken.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { manageClientUserToken } from '../jwt'
import { createSessionSharingMiddleware, SessionTokenUtil } from '../session'

// Mock dependencies
vi.mock('../jwt', () => ({
  manageClientUserToken: vi.fn().mockImplementation(() => undefined),
}))

// Mock log to prevent console output during tests
vi.mock('../plugin-log', () => ({
  log: {
    contextLogger: () => ({
      warn: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    }),
  },
}))

describe('sessionTokenUtil', () => {
  // Common test settings
  const testSettings = {
    rootDomain: 'fiction.com',
    endpoint: '/api/session-surface',
    tokenKey: 'fictionAuthToken',
    timeoutMs: 500, // Short timeout for tests
    cacheDurationMs: 1000,
  }

  let sessionTokenUtil: SessionTokenUtil
  let originalWindow: any

  beforeEach(() => {
    // Save original window
    originalWindow = globalThis.window

    // Setup mock window
    globalThis.window = {
      location: {
        href: 'https://example.com',
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      document: {
        body: {
          appendChild: vi.fn(),
          removeChild: vi.fn(),
        },
        createElement: vi.fn(() => ({
          style: {},
          contentWindow: {
            postMessage: vi.fn(),
          },
          parentNode: {
            removeChild: vi.fn(),
          },
        })),
      },
    } as any

    // Create instance for each test
    sessionTokenUtil = new SessionTokenUtil(testSettings)

    // Reset mocks
    vi.resetAllMocks()
  })

  afterEach(() => {
    // Restore original window
    globalThis.window = originalWindow
    vi.resetAllMocks()
  })

  describe('getAuthToken', () => {
    it('should use cookie auth token on root domain', async () => {
      // Setup
      globalThis.window.location.href = 'https://fiction.com/some/path'
      const expectedToken = 'test-token-123'
      vi.mocked(manageClientUserToken).mockReturnValue(expectedToken)

      // Execute
      const result = await sessionTokenUtil.getAuthToken()

      // Verify
      expect(manageClientUserToken).toHaveBeenCalledWith({ key: testSettings.tokenKey })
      expect(result).toBe(expectedToken)
    })

    it('should use cookie auth token on subdomain', async () => {
      // Setup
      globalThis.window.location.href = 'https://app.fiction.com/dashboard'
      const expectedToken = 'test-token-456'
      vi.mocked(manageClientUserToken).mockReturnValue(expectedToken)

      // Execute
      const result = await sessionTokenUtil.getAuthToken()

      // Verify
      expect(manageClientUserToken).toHaveBeenCalledWith({ key: testSettings.tokenKey })
      expect(result).toBe(expectedToken)
    })

    it('should use iframe token sharing on custom domain', async () => {
      // Setup for custom domain
      globalThis.window.location.href = 'https://custom-domain.com/page'

      // Mock implementation of requestTokenViaIframe
      const expectedToken = 'shared-token-789'
      sessionTokenUtil.requestTokenViaIframe = vi.fn().mockResolvedValue(expectedToken)

      // Execute
      const result = await sessionTokenUtil.getAuthToken()

      // Verify
      expect(sessionTokenUtil.requestTokenViaIframe).toHaveBeenCalled()
      expect(result).toBe(expectedToken)
    })

    it('should return undefined if window is not defined', async () => {
      // Setup - remove window
      globalThis.window = undefined as any

      // Execute
      const result = await sessionTokenUtil.getAuthToken()

      // Verify
      expect(result).toBeUndefined()
    })
  })

  describe('getSharedSessionToken', () => {
    it('should return cached token if available and not expired', async () => {
      // Setup - set cached token
      const cachedToken = 'cached-token-123'
      sessionTokenUtil.cachedToken = cachedToken
      sessionTokenUtil.cacheTimestamp = Date.now()
      sessionTokenUtil.requestTokenViaIframe = vi.fn()

      // Execute
      const result = await sessionTokenUtil.getSharedSessionToken()

      // Verify
      expect(result).toBe(cachedToken)
      expect(sessionTokenUtil.requestTokenViaIframe).not.toHaveBeenCalled()
    })

    it('should request new token if cache is expired', async () => {
      // Setup - set expired cached token
      const cachedToken = 'old-cached-token'
      const newToken = 'new-token-456'
      sessionTokenUtil.cachedToken = cachedToken
      sessionTokenUtil.cacheTimestamp = Date.now() - (testSettings.cacheDurationMs + 1000)
      sessionTokenUtil.requestTokenViaIframe = vi.fn().mockResolvedValue(newToken)

      // Execute
      const result = await sessionTokenUtil.getSharedSessionToken()

      // Verify
      expect(sessionTokenUtil.requestTokenViaIframe).toHaveBeenCalled()
      expect(result).toBe(newToken)
    })

    it('should handle error from requestTokenViaIframe', async () => {
      // Setup - mock error
      sessionTokenUtil.requestTokenViaIframe = vi.fn().mockRejectedValue(new Error('Test error'))

      // Execute
      const result = await sessionTokenUtil.getSharedSessionToken()

      // Verify
      expect(result).toBeUndefined()
    })
  })
})

describe('createSessionSharingMiddleware', () => {
  const tokenKey = 'fictionAuthToken'
  const mockToken = 'test-auth-token-123'

  let middleware: any
  let mockReq: any
  let mockRes: any

  beforeEach(() => {
    // Create middleware
    middleware = createSessionSharingMiddleware(tokenKey)

    // Setup mock request
    mockReq = {
      headers: {
        origin: 'https://custom-domain.com',
        referer: 'https://custom-domain.com/some-page',
      },
      cookies: {
        [tokenKey]: mockToken,
      },
    }

    // Setup mock response
    mockRes = {
      header: vi.fn(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      end: vi.fn(),
    }
  })

  it('should return 401 when no auth token is present', () => {
    // Setup - remove token
    mockReq.cookies = {}

    // Execute
    middleware(mockReq, mockRes)

    // Verify
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.send).toHaveBeenCalledWith('Unauthorized')
  })

  it('should return 403 when no referer is present', () => {
    // Setup - remove referer
    mockReq.headers.referer = ''

    // Execute
    middleware(mockReq, mockRes)

    // Verify
    expect(mockRes.status).toHaveBeenCalledWith(403)
    expect(mockRes.send).toHaveBeenCalledWith('Forbidden')
  })

  it('should set correct headers and return html with token', () => {
    // Execute
    middleware(mockReq, mockRes)

    // Verify
    expect(mockRes.header).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true')
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.send).toHaveBeenCalledWith(expect.stringContaining(mockToken))
  })

  it('should handle errors gracefully', () => {
    // Setup - cause an error
    mockRes.header = vi.fn().mockImplementation(() => {
      throw new Error('Test error')
    })

    // Execute
    middleware(mockReq, mockRes)

    // Verify
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.end).toHaveBeenCalledWith('Error')
  })
})
