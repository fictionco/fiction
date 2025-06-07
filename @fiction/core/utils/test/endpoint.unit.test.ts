import type { User } from '@fiction/core/plugin-user'
import type { Request } from 'express'
import { FictionEnv } from '@fiction/core/plugin-env'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createTestUtils } from '../../test-utils/init'
import { Endpoint } from '../endpoint'
import { setAuthorizedUser } from '../endpointServer'
import { createUserToken } from '../jwt'

describe('setAuthorizedUser', () => {
  const testUtils = createTestUtils()
  const fictionUser = testUtils.fictionUser
  const tokenSecret = 'test-secret-key-123'
  let mockRequest: Partial<Request> & { headers: Record<string, string>, body: Record<string, any> }
  let testUser: Partial<User>

  beforeEach(() => {
    mockRequest = {
      headers: {},
      body: {},
    }

    testUser = {
      userId: 'test-user-123',
      email: 'test@example.com',
      orgs: [{
        orgId: 'test-org-123',
        relation: {
          access: 'owner',
        },
      }],
    }

    // Set token secret for the fiction user instance
    vi.spyOn(fictionUser, 'settings', 'get').mockReturnValue({
      tokenSecret,
    } as any)

    // Mock only the user query service
    vi.spyOn(fictionUser.queries.ManageUser, 'serve').mockResolvedValue({
      data: testUser as User,
      status: 'success',
      isNew: false,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should throw error if no fictionUser is provided', async () => {
    await expect(
      setAuthorizedUser({
        fictionUser: undefined as any,
        request: mockRequest as Request,
        serverName: 'TestServer',
      }),
    ).rejects.toThrow('no fictionUser instance for endpoint authorization (TestServer)')
  })

  it('should handle request with no authorization token', async () => {
    const result = await setAuthorizedUser({
      fictionUser,
      request: mockRequest as Request,
    })

    expect(result.bearer).toBeUndefined()
    expect(result.bearerToken).toBeUndefined()
    expect(fictionUser.queries.ManageUser.serve).not.toHaveBeenCalled()
  })

  it('should process valid Bearer token and set user', async () => {
    // Create a real JWT token
    const token = createUserToken({
      user: testUser,
      tokenSecret,
    })

    mockRequest.headers.authorization = `Bearer ${token}`

    const result = await setAuthorizedUser({
      fictionUser,
      request: mockRequest as Request,
    })

    expect(result.bearerToken).toBe(token)
    expect(result.bearer).toEqual(testUser)
    expect(fictionUser.queries.ManageUser.serve).toHaveBeenCalledWith(
      { where: { userId: testUser.userId }, _action: 'retrieve' },
      { server: true },
    )
  })

  it('should process valid x-access-token and set user', async () => {
    const token = createUserToken({
      user: testUser,
      tokenSecret,
    })

    mockRequest.headers['x-access-token'] = token

    const result = await setAuthorizedUser({
      fictionUser,
      request: mockRequest as Request,
    })

    expect(result.bearerToken).toBe(token)
    expect(result.bearer).toEqual(testUser)
  })

  it('should handle invalid token format', async () => {
    mockRequest.headers.authorization = 'Bearer invalid.token.format'

    await expect(
      setAuthorizedUser({
        fictionUser,
        request: mockRequest as Request,
      }),
    ).rejects.toThrow('token verification failed')
  })

  it('should handle expired token', async () => {
    const token = createUserToken({
      user: testUser,
      tokenSecret,
      expiresIn: 0, // Expired immediately
    })

    mockRequest.headers.authorization = `Bearer ${token}`

    await expect(
      setAuthorizedUser({
        fictionUser,
        request: mockRequest as Request,
      }),
    ).rejects.toThrow('token verification failed')
  })

  it('should handle user not found in database', async () => {
    // Mock user query to return no user
    vi.spyOn(fictionUser.queries.ManageUser, 'serve').mockResolvedValueOnce({
      data: undefined,
      status: 'success',
      isNew: false,
    })

    const token = createUserToken({
      user: testUser,
      tokenSecret,
    })

    mockRequest.headers.authorization = `Bearer ${token}`

    const result = await setAuthorizedUser({
      fictionUser,
      request: mockRequest as Request,
    })

    expect(result.bearerToken).toBe(token)
    expect(result.bearer).toBeUndefined()
  })

  it('should set organization relation and access level when orgId matches', async () => {
    const token = createUserToken({
      user: testUser,
      tokenSecret,
    })

    mockRequest.headers.authorization = `Bearer ${token}`
    mockRequest.body = { orgId: 'test-org-123' }

    const result = await setAuthorizedUser({
      fictionUser,
      request: mockRequest as Request,
    })

    expect(result.bearer?.relation).toBeDefined()
    expect(result.bearer?.relation?.accessLevel).toBe(1000) // Owner access level
  })

  it('should handle malformed Bearer token', async () => {
    mockRequest.headers.authorization = 'Bearer'

    const result = await setAuthorizedUser({
      fictionUser,
      request: mockRequest as Request,
    })

    expect(result.bearerToken).toBeUndefined()
    expect(result.bearer).toBeUndefined()
    expect(fictionUser.queries.ManageUser.serve).not.toHaveBeenCalled()
  })
})

const mockData = { sampleData: 123 }
const mockAxiosResponse = { data: { status: 'success', data: mockData } }
vi.mock('axios', () => ({
  request: vi.fn(async () => Promise.resolve({ data: mockAxiosResponse })),
}))
vi.mock('express')

describe('endpoint class', () => {
  let endpoint: Endpoint
  const mockServerUrl = 'http://localhost:3000'
  const mockBasePath = '/test'
  const apiPrefix = '/api'
  const mockKey = 'testEndpoint'
  const mockRequestHandler = vi.fn().mockResolvedValue({ status: 'success' })

  beforeEach(() => {
    endpoint = new Endpoint({
      fictionEnv: new FictionEnv({ cwd: '/' }),
      serverUrl: mockServerUrl,
      basePath: mockBasePath,
      key: mockKey,
      requestHandler: mockRequestHandler,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should correctly compute requestUrl', () => {
    const expectedUrl = `${mockServerUrl}${apiPrefix}${mockBasePath}/${mockKey}`
    expect(endpoint.requestUrl).toBe(expectedUrl)
  })
})
