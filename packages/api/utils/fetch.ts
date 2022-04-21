import { $fetch as ohmyfetch } from "ohmyfetch"

/**
 * Advanced fetch function that adds a timeout and format option to native fetch
 */
export const fetchAdvanced = async <T = unknown>(
  resource: string,
  options?: { timeout?: number; format?: "json" | "text" },
): Promise<T> => {
  const { timeout = 8000, format = "json" } = options ?? {}

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  })

  const out = (await response[format]()) as T

  clearTimeout(id)

  return out
}

export const $fetch = ohmyfetch
