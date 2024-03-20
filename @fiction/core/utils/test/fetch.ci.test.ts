import type { MockInstance } from 'vitest'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchWithTimeout } from '@fiction/core/utils/fetch'

describe('fetchWithTimeout', () => {
  let fetchMock: MockInstance
  beforeEach(() => {
    fetchMock = vi.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should complete the fetch operation successfully before the timeout', async () => {
    const mockResponse = new Response(JSON.stringify({ key: 'value' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

    fetchMock.mockResolvedValueOnce(mockResponse)

    const response = await fetchWithTimeout('https://jsonplaceholder.typicode.com/posts/1', { timeout: 3000 })
    const data = await response.json()

    expect(data).toEqual({ key: 'value' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should abort the fetch operation after the timeout', async () => {
    // Mock a fetch implementation that will not resolve or reject within the test timeout,
    // simulating a long-running request that will be aborted.
    fetchMock.mockImplementationOnce(() => new Promise(() => {}))

    const fetchPromise = fetchWithTimeout('https://jsonplaceholder.typicode.com/posts/1', { timeout: 1000 })

    await expect(fetchPromise).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Request timed out after 1000 ms]`)

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should handle network or other fetch related errors gracefully', async () => {
    const errorMessage = 'Network error'
    fetchMock.mockRejectedValueOnce(new Error(errorMessage))

    await expect(fetchWithTimeout('https://jsonplaceholder.typicode.com/posts/1')).rejects.toThrow(errorMessage)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
