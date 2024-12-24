import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchWithTimeout } from '../fetch'

describe('fetchWithTimeout', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.useFakeTimers()
    // Create fetch mock that handles abort signal
    mockFetch = vi.fn((url: string, init?: RequestInit) => {
      return new Promise((resolve, reject) => {
        // Handle abort signal
        const signal = init?.signal
        if (signal) {
          if (signal.aborted) {
            reject(new DOMException('Aborted', 'AbortError'))
          }
          signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }
      })
    })
    globalThis.fetch = mockFetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    globalThis.fetch = originalFetch
  })

  it('successfully fetches before timeout', async () => {
    const responseData = { success: true }
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve(new Response(JSON.stringify(responseData))),
    )

    const response = await fetchWithTimeout('https://api.test')
    const data = await response.json()

    expect(data).toEqual(responseData)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('times out after specified duration', async () => {
    const promise = fetchWithTimeout('https://api.test', { timeout: 1000 })

    // Advance timers to trigger timeout
    vi.advanceTimersByTime(1000)

    await expect(promise).rejects.toThrow('Request timed out after 1000 ms')
  })

  it('respects external abort signal', async () => {
    const controller = new AbortController()

    const promise = fetchWithTimeout('https://api.test', {
      signal: controller.signal,
    })

    controller.abort()

    await expect(promise).rejects.toThrow()
  })

  it('passes through fetch options', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve(new Response()),
    )

    await fetchWithTimeout('https://api.test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  })

  it('cleans up timeout on early response', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve(new Response()),
    )

    await fetchWithTimeout('https://api.test', { timeout: 5000 })

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('handles network errors', async () => {
    const networkError = new Error('Network failure')
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(networkError),
    )

    await expect(
      fetchWithTimeout('https://api.test'),
    ).rejects.toThrow('Network failure')
  })

  it('uses default 3000ms timeout', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve(new Response()),
    )

    await fetchWithTimeout('https://api.test')

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000)
  })
})
