import { getNetworkIp, isLocalhostIp, log } from '@factor/api'

interface GeoData {
  ip?: string
  countryCode?: string
  cityName?: string
  latitude?: number
  longitude?: number
  timezone?: string
  regionName?: string
  ipOrganization?: string
  ipIsCrawler?: boolean
  ipIsProxy?: boolean
  ipThreatLevel?: string
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
  organization: string
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
    const fetched = await fetch(
      `https://api.db-ip.com/v2/c41c91295b5abead5e3db1dd9d237e282629f4c8/${ip}`,
      {
        method: 'GET',
        headers: { 'access-control-allow-origin': '*' },
      },
    )

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
      organization,
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
      ipOrganization: organization,
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
