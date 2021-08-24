import Cookies, { CookieAttributes } from "js-cookie"

/**
 * Simple set browser cookie
 * https://stackoverflow.com/a/23086139/1858322
 */
export const setCookie = (
  name: string,
  value: string,
  attributes: CookieAttributes,
): string | undefined => {
  return Cookies.set(name, value, attributes)
}
/**
 * Get a browser cookie by name
 */
export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name)
}
export const removeCookie = (
  name: string,
  attributes: CookieAttributes,
): void => {
  return Cookies.remove(name, attributes)
}
