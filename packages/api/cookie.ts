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

/**
 * Gets the domain name without any sub domains.
 * Needed for cookies, this is not made available any easier way.
 * It works by setting cookies until they can't be set
 * https://developers.livechat.com/updates/setting-cookies-to-subdomains-in-javascript
 * http://jsfiddle.net/zEwsP/4/
 */
export const getTopDomain = (): string => {
  let i = 0
  let domain = window.location.hostname
  const p = domain.split(".")
  const s = `_gd${Date.now()}`
  while (i < p.length - 1 && !document.cookie.includes(s + "=" + s)) {
    domain = p.slice(-1 - ++i).join(".")
    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = s + "=" + s + ";domain=" + domain + ";"
  }
  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie =
    s + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + domain + ";"
  return domain
}
