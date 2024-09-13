/* server-only-file */
import type express from 'express'
import ipUtil from 'ipaddr.js'
import requestIp from 'request-ip'

/**
 * Get IP address on network
 */
export async function getNetworkIp(): Promise<string> {
  const stream = await fetch('https://www.cloudflare.com/cdn-cgi/trace')

  const data = await stream.text()

  const rawText = data.split(`\n`).find((_: string) => _.includes('ip='))

  const ip = rawText?.split('=').pop() ?? ''

  return ip
}

/**
 * Is an IP localhost?
 */
export function isLocalhostIp(ip: string): boolean {
  // https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/ipv6-comparefunction
  // 192.168 or c0a8 are local network
  return !!(ip === '127.0.0.1'
    || ip === '::1'
    || ip.includes('192.168')
    || ip.includes('c0a8'))
}

/**
 * Normalize IP address to v6
 */
export function normalizeIpv6(rawIp: string): string {
  let ipInstance = ipUtil.parse(rawIp)

  if (ipInstance.kind() === 'ipv4')
    ipInstance = (ipInstance as ipUtil.IPv4).toIPv4MappedAddress()

  return ipInstance.toString()
}
/**
 * All IPs should be stored and handled in ipv6 format
 * https://github.com/ClickHouse/ClickHouse/issues/5462
 */
export async function getRequestIpAddress(request?: express.Request, opts: { isFake?: boolean } = {}): Promise<{ ip: string, rawIp: string }> {
  if (!request)
    return { ip: '', rawIp: '' }

  const isFake = opts?.isFake || request.query?.isFake === '1'

  let rawIp: string | undefined
  if (isFake) {
    const { faker } = await import('@faker-js/faker')
    rawIp = faker.internet.ip()
  }
  else {
    rawIp = requestIp.getClientIp(request) || undefined
  }

  if (!rawIp)
    return { rawIp: '', ip: '' }
  else if (!isFake && isLocalhostIp(rawIp))
    rawIp = await getNetworkIp()

  const ip = normalizeIpv6(rawIp)

  return { rawIp, ip }
}
