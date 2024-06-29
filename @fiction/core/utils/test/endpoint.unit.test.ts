import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FictionEnv } from '@fiction/core/plugin-env'
import { Endpoint } from '../endpoint'

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
