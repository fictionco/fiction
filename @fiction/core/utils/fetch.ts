/**
 * Advanced fetch function that adds a timeout and format option to native fetch
 */
export async function fetchWithTimeout(url: string, options?: RequestInit & { timeout?: number }): Promise<Response> {
  const { timeout = 5000, ...fetchOptions } = options || {}

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${timeout} ms`))
    }, timeout)
  })

  return Promise.race([
    fetch(url, fetchOptions),
    timeoutPromise,
  ])
}
