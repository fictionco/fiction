/**
 * Advanced fetch function that adds a timeout and format option to native fetch
 */
export async function fetchWithTimeout(url: string, options?: RequestInit & { timeout?: number }) {
  const { timeout = 3000, ...fetchOptions } = options || {}

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  }
  catch (error) {
    clearTimeout(id)
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout}ms`)
      }
    }
    throw error
  }
}
