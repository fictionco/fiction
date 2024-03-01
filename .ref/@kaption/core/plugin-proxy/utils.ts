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

export function ensureValidUrl(partialUrl: string): string {
  const url = partialUrl.includes('//') ? partialUrl : `https://${partialUrl}`

  return url
}

export function createProxyUrl(args: {
  clientUrl?: string
  proxyUrl: string
}): string {
  const { clientUrl, proxyUrl } = args
  if (!clientUrl || !proxyUrl)
    return ''

  const cli = new URL(ensureValidUrl(clientUrl))

  const specialHostname = cli.origin
    .replace('https://', '_https_')
    .replace('http://', '_http_')
    .replace(/:/g, '__')
    .replace(/\./g, '--')

  const proxyClientUrl = proxyUrl.replace('special', specialHostname)

  const pt = cli.pathname === '/' ? '' : cli.pathname

  return `${proxyClientUrl}${pt}`
}

export function reverseProxyUrl(args: {
  proxyHost: string
  pathname: string
}): string {
  const { proxyHost, pathname } = args

  const proxyUrl = new URL(ensureValidUrl(proxyHost))

  const search = new URLSearchParams(proxyUrl.search || '')

  const encodedClientDomain
    = proxyUrl.hostname.includes('localhost') && search.get('url')
      ? search.get('url')
      : proxyUrl.hostname.split('.')[0]

  if (!encodedClientDomain)
    throw new Error('no encodedClientDomain')

  const clientDomain = encodedClientDomain
    .replace('_https_', 'https://')
    .replace('_http_', 'http://')
    .replace(/--/g, '.')
    .replace(/__/g, ':')

  const out = `${clientDomain}${pathname === '/' ? '' : pathname}`

  return out
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
    'referer',
  ]
  headersToRemove.forEach((header) => {
    delete newHeaders[header]
  })

  newHeaders['sec-fetch-site'] = 'none'
  newHeaders['sec-fetch-mode'] = 'navigate'
  newHeaders['sec-fetch-user'] = '?1'
  newHeaders['sec-fetch-dest'] = 'document'
  // allowing default accept causes 404 errors
  // on localhost and potentially other places
  // not sure if there is a problem setting it to default */*
  newHeaders.accept = '*/*'

  newHeaders.host = location.host
  newHeaders.authority = location.hostname
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

export function getNewLocation(host: string, redirectUrl: string): string {
  const newUrl = new URL(redirectUrl)
  const initialUrl = proxyBaseUrl(host)
  const parts = initialUrl.host.split('.')
  parts[0] = getModHost(newUrl)
  initialUrl.host = parts.join('.')
  initialUrl.pathname = newUrl.pathname

  return initialUrl.toString()
}
