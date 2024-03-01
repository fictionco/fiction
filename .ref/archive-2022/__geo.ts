import { fetchAdvanced } from '@factor/api/fetch'
import { getLocal, setLocal } from '@kaption/browser-utils/local'

const GEO_INFO = '__kGeo'

// interface IpApiGeo {
//   query: string
//   status: string
//   country: string
//   countryCode: string
//   region: string
//   regionName: string
//   city: string
//   zip: string
//   lat: number
//   lon: number
//   timezone: string
//   isp: string
//   org: string
//   as: string
// }

interface FreeGeoIP {
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

interface StandardGeo {
  countryCode: string
  city: string
  zip?: string
  country?: string
}

export async function setGeo(): Promise<StandardGeo | undefined> {
  if (!fetch)
    return

  const freeGeo = await fetchAdvanced<FreeGeoIP>(
    'https://freegeoip.app/json/',
    {
      timeout: 750,
    },
  )

  if (!freeGeo)
    return

  const standardGeo: StandardGeo = {
    countryCode: freeGeo.country_code,
    city: freeGeo.city,
  }

  setLocal({
    key: GEO_INFO,
    value: standardGeo,
    scope: 'tracking',
    type: 'session',
  })

  return standardGeo
}

export async function getGeo(): Promise<StandardGeo | undefined> {
  const existing = getLocal<StandardGeo>({ key: GEO_INFO })
  return existing || await setGeo()
}
