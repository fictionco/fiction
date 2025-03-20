import Cookies from 'js-cookie'

type CookieAttributes = typeof Cookies.attributes

/**
 * Gets the domain name without any sub domains.
 * Needed for cookies, this is not made available any easier way.
 * It works by setting cookies until they can't be set
 * https://developers.livechat.com/updates/setting-cookies-to-subdomains-in-javascript
 * http://jsfiddle.net/zEwsP/4/
 */
export function getNakedDomain(): string | undefined {
  if (typeof window === 'undefined')
    return undefined

  const hostname = window.location.hostname

  // Directly return for localhost or IP addresses
  if (hostname === 'localhost' || hostname.match(/^\d{1,3}(\.\d{1,3}){3}$/))
    return hostname

  const parts = hostname.split('.')

  // Basic heuristic to handle second-level domains like '.co.uk'
  if (parts.length > 2) {
    // Get the second-last part of the hostname
    const secondLastPart = parts[parts.length - 2]

    // Check if the second-last part is 2 or less characters long
    return parts.slice(secondLastPart.length <= 2 ? -3 : -2).join('.')
  }

  return hostname // Top-level domain or single-part hostname
}

/**
 * Simple set browser cookie
 * https://stackoverflow.com/a/23086139/1858322
 */

// Sets a cookie with attributes. If a domain is specified, the cookie will be available on that domain and all its subdomains.
export function setCookie({ name, value, attributes }: { name: string, value: string, attributes: CookieAttributes }): string | undefined {
  return Cookies.set(name, value, attributes)
}

// Retrieves a cookie by its name.
export function getCookie(name: string): string | undefined {
  return Cookies.get(name)
}

// Removes a cookie with specified attributes.
export function removeCookie({ name, attributes }: { name: string, attributes?: CookieAttributes }): void {
  Cookies.remove(name, attributes)
}

// Sets a cookie for the naked domain, making it accessible across all subdomains of the current domain.
export function setCookieNakedDomain({ name, value, attributes = {} }: { name: string, value: string, attributes?: CookieAttributes }): string | undefined {
  const domain = getNakedDomain()
  return setCookie({ name, value, attributes: { domain, ...attributes } })
}

// Removes a cookie that is accessible across all subdomains of the current domain.
export function removeCookieNakedDomain({ name, attributes = {} }: { name: string, attributes?: CookieAttributes }): void {
  const domain = getNakedDomain()
  removeCookie({ name, attributes: { domain, ...attributes } })
}
