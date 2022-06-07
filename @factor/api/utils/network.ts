/* server-only-file */
import http from "http"
import requestIp from "request-ip"
import ipUtil from "ipaddr.js"
import { getNetworkIp } from "../utils-analytics"

/**
 * Is an IP localhost?
 */
export const isLocalhostIp = (ip: string): boolean => {
  // https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/ipv6-comparefunction
  // 192.168 or c0a8 are local network
  return ip == "127.0.0.1" ||
    ip == "::1" ||
    ip.includes("192.168") ||
    ip.includes("c0a8")
    ? true
    : false
}

/**
 * Normalize IP address to v6
 */
export const normalizeIpv6 = (rawIp: string): string => {
  let ipInstance = ipUtil.parse(rawIp)

  if (ipInstance.kind() == "ipv4") {
    ipInstance = (ipInstance as ipUtil.IPv4).toIPv4MappedAddress()
  }

  return ipInstance.toString()
}
/**
 * All IPs should be stored and handled in ipv6 format
 * https://github.com/ClickHouse/ClickHouse/issues/5462
 */
export const getRequestIpAddress = async (
  request: http.IncomingMessage,
): Promise<{ ip: string; rawIp: string }> => {
  let rawIp = requestIp.getClientIp(request) ?? undefined

  if (!rawIp) {
    return { rawIp: "", ip: "" }
  }

  if (isLocalhostIp(rawIp)) {
    rawIp = await getNetworkIp()
  }

  const ip = normalizeIpv6(rawIp)

  return { rawIp, ip }
}