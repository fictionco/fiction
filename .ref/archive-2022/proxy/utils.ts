import net from 'node:net'
import type express from 'express'
import regexTld from './regexTLD'

/**
 * Check whether the specified hostname is valid.
 */
export function isValidHostName(hostname: string): boolean {
  return !!(
    regexTld.test(hostname)
    || net.isIPv4(hostname)
    || net.isIPv6(hostname)
  )
}
export function getRequestProtocol(host: string): string {
  return `${host.includes('localhost') ? 'http' : 'https'}://`
}
export function getModHost(url: URL): string {
  return url.host.replace(/\./g, '--')
}
export function reverseModUrl(req: express.Request, host: string): string {
  const parts = host.split('.')
  const subs: string[] = []

  let modUrl = ''

  parts.forEach((part) => {
    if (part.includes('--'))
      modUrl = part
    else if (!modUrl)
      subs.push(part)
  })

  if (!modUrl)
    return ''

  const subString = subs.length > 0 ? `${subs.join('.')}.` : ''

  return `https://${subString}${modUrl.replace(/--/g, '.')}${req.originalUrl}`
}

/**
 * Get the base URL for the proxy
 */
export function proxyBaseUrl(host: string): URL {
  return new URL(`${getRequestProtocol(host)}${host}`)
}

/**
 * Remove headers from the request to our server
 */
export function getLocalRequestHeaders(req: express.Request, location: URL): Record<string, any> {
  const newHeaders = { ...req.headers }
  const headersToRemove = [
    'cookie',
    'cookie2',
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time',
    'x-frame-options',
    'x-forwarded-for',
    'x-forwarded-proto',
    'x-forwarded-port',
    'accept-encoding',
    'upgrade-insecure-requests',
  ]
  headersToRemove.forEach((header) => {
    delete newHeaders[header]
  })

  newHeaders['sec-fetch-site'] = 'none'
  newHeaders['sec-fetch-mode'] = 'navigate'
  newHeaders['sec-fetch-user'] = '?1'
  newHeaders['sec-fetch-dest'] = 'document'

  newHeaders.host = location.host
  newHeaders.authority = location.hostname
  // newHeaders.referer = location.host
  return newHeaders
}

export function modifyProxyResponseHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string | string[] | undefined> {
  delete headers['set-cookie']
  delete headers['set-cookie2']
  delete headers['x-frame-options']

  headers['Cache-Control'] = `max-age=7200`
  return headers
}

export function modifyProxyResponseHtml<T = unknown>(req: express.Request, location: URL, data: T): T | string {
  if (typeof data !== 'string' || !data.includes('<html'))
    return data

  const proxyBase = proxyBaseUrl(req.headers.host as string)

  const html = data.replace(
    /<head([^>]*)>/i,
    `<head$1><base href="${proxyBase.toString()}">`,
  )

  // .replace(new RegExp(`${location.href}`, "g"), proxyBase.href)

  return html
}

export function escapeRegExp(s: string): string {
  return s.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&') // $& means the whole matched string
}
export function replaceAll(str: string, match: string, replacement: string): string {
  return str.replace(new RegExp(escapeRegExp(match), 'g'), () => replacement)
}

export function getNewLocation(host: string, redirectUrl: string): string {
  const newUrl = new URL(redirectUrl)
  const initialUrl = proxyBaseUrl(host)
  const parts = initialUrl.host.split('.')
  parts[0] = getModHost(newUrl)
  initialUrl.host = parts.join('.')
  initialUrl.pathname = newUrl.pathname

  return initialUrl.toString()
}

export const logCategory = {
  event: { color: '#6800FF' },
  info: { color: '#00ABFF' },
  record: { color: '#FF9500' },
  data: { color: '#FF9500' },
  command: { color: '#FF9500' },
  send: { color: '#00BD0C' },
  error: { color: '#FF0076' },
  warn: { color: '#FF0076' },
  notify: { color: '#FF9500' },
  success: { color: '#00BD0C' },
}
