/**
 * Fetch with timeout that aborts after specified duration
 * @throws Error if request times out or fails
 */
export async function fetchWithTimeout(url: string, options?: RequestInit & { timeout?: number }): Promise<Response> {
  const controller = new AbortController()
  const { timeout = 3000, signal, ...init } = options || {}

  // Combine incoming signal with timeout signal
  if (signal) {
    signal.addEventListener('abort', () => controller.abort())
  }

  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  }
  catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Request timed out after ${timeout} ms`)
    }
    throw error
  }
  finally {
    clearTimeout(timeoutId)
  }
}
