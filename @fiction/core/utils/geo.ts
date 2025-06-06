import type { UserGeolocation } from '../types/index.js'
import { z } from 'zod/v4'
import { log } from '../plugin-log/index.js'

import { fetchWithTimeout, getNetworkIp, isLocalhostIp } from '../utils/index.js'

export const GeoDataSchema = z.object({
  ip: z.string().optional(),
  countryCode: z.string().optional(),
  cityName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  regionName: z.string().optional(),
  ipOrganization: z.string().optional(),
  ipIsCrawler: z.boolean().optional(),
  ipIsProxy: z.boolean().optional(),
  ipThreatLevel: z.string().optional(),
})

export type GeoData = z.infer<typeof GeoDataSchema>

interface ipApiResponse {
  query: string
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
}

export async function getGeoFree(ip?: string): Promise<GeoData | undefined> {
  if (!ip)
    return undefined

  try {
    const fetched = await fetchWithTimeout(`http://ip-api.com/json/${ip}`, {
      method: 'GET',
      headers: { 'access-control-allow-origin': '*' },
    })

    if (!fetched?.ok) {
      return undefined
    }

    const data = (await fetched.json()) as ipApiResponse

    const { countryCode, regionName, city, lat, lon, timezone, org } = data

    const out: GeoData = {
      ip,
      countryCode,
      regionName,
      cityName: city,
      latitude: lat,
      longitude: lon,
      timezone,
      ipOrganization: org,
    }

    return out
  }
  catch (error) {
    log.warn('geoIp', `geo request error`, { error })
    return undefined
  }
}

interface IPBaseResponse {
  timezone: {
    id: string
  }
  ip: string
  type: string
  location: {
    latitude: number
    longitude: number
    zip: string
    continent: { code: string, name: string }
    country: { alpha2: string, name: string }
    city: { name: string }
    region: { name: string }
  }
}

interface dbIpResponse {
  ipAddress: string
  continentCode: string
  contintentName: string
  countryCode: string
  isEuMember: boolean
  currencyCode: string
  stateProv: string
  city: string
  zipCode: string
  latitude: number
  longitude: number
  timeZone: string
  isp: string
  usageType: string
  org: string
  isCrawler: boolean
  isProxy: boolean
  threatLevel: string
}

/**
 * Get users geo information for session
 */
export async function getGeo(ip?: string): Promise<GeoData | undefined> {
  const data: IPBaseResponse | undefined = undefined
  if (!ip)
    return undefined

  if (isLocalhostIp(ip))
    ip = await getNetworkIp()

  try {
    const fetched = await fetchWithTimeout(
      `https://api.db-ip.com/v2/c41c91295b5abead5e3db1dd9d237e282629f4c8/${ip}`,
      {
        method: 'GET',
        headers: { 'access-control-allow-origin': '*' },
      },
    )

    if (!fetched.ok) {
      return undefined
    }

    const data = (await fetched.json()) as dbIpResponse

    const {
      countryCode,
      stateProv,
      city,
      latitude,
      longitude,
      timeZone,
      isCrawler,
      isProxy,
      threatLevel,
      org,
    } = data

    const out: GeoData = {
      ip,
      countryCode,
      regionName: stateProv,
      cityName: city,
      latitude,
      longitude,
      timezone: timeZone,
      ipIsCrawler: isCrawler,
      ipIsProxy: isProxy,
      ipThreatLevel: threatLevel,
      ipOrganization: org,
    }

    log.debug(`geoGeo`, `geo IP data for ${ip} ${out.cityName}`, {
      data: { out },
    })
    return out
  }
  catch (error) {
    log.warn('geoIp', `geo request error`, { error, data })
    return undefined
  }
}

interface FreeGeoIp {
  ip: string
  country_code: string
  country_name: string
  region_code: string
  region_name: string
  city: string
  zip_code: string
  time_zone: string
  latitude: number
  longitude: number
  metro_code: number
}

/**
 * Returns a display location string
 * @param locationData - user location info
 */
export function getUserGeolocationName(locationData: UserGeolocation): string {
  const { city, countryName } = locationData
  const out = [countryName]

  if (city)
    out.unshift(city)

  return out.filter(Boolean).join(', ')
}

/**
 * Gets user location data based on their IP
 * @reference
 * https://freegeoip.app/
 */
export async function setUserGeolocation(): Promise<UserGeolocation | void> {
  /**
   * Cache the value in case run multiple times
   * Don't get information on server as it will return server information not user
   */

  if (typeof sessionStorage !== 'undefined') {
    const r = sessionStorage.getItem('KGeo')
    if (r)
      return JSON.parse(r) as UserGeolocation
  }
  else if (typeof window === 'undefined') {
    return
  }

  let data: FreeGeoIp

  try {
    const r = await fetch('https://freegeoip.app/json/')

    data = (await r.json()) as FreeGeoIp
  }
  catch {
    console.warn('Unable to get geo data.')
    return
  }

  const {
    ip,
    country_code,
    country_name,
    region_code,
    region_name,
    city,
    zip_code,
    time_zone,
    latitude,
    longitude,
    metro_code,
  } = data

  const geo: UserGeolocation = {
    ip,
    countryCode: country_code,
    countryName: country_name,
    regionCode: region_code,
    regionName: region_name,
    city,
    zip: zip_code,
    timeZone: time_zone,
    latitude,
    longitude,
    metroCode: metro_code,
  }

  if (!geo.ip) {
    return
  }

  geo.name = getUserGeolocationName(geo)

  if (typeof sessionStorage !== 'undefined')
    sessionStorage.setItem('geo', JSON.stringify(geo))

  return geo
}
