import type { CookieAttributes } from 'js-cookie'
import Cookies from 'js-cookie'

/**
 * Simple set browser cookie
 * https://stackoverflow.com/a/23086139/1858322
 */
export function setCookie(name: string, value: string, attributes: CookieAttributes): string | undefined {
  return Cookies.set(name, value, attributes)
}
/**
 * Get a browser cookie by name
 */
export function getCookie(name: string): string | undefined {
  return Cookies.get(name)
}
export function removeCookie(name: string, attributes: CookieAttributes): void {
  return Cookies.remove(name, attributes)
}
