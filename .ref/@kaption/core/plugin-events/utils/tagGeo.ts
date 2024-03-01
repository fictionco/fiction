import { fetchAdvanced, getLocal, setLocal } from '@factor/api'

const GEO_INFO = '__kGeo'

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
  cityName: string
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
    cityName: freeGeo.city,
  }

  setLocal({
    key: GEO_INFO,
    value: standardGeo,
    persist: 'session',
  })

  return standardGeo
}

export async function getGeo(): Promise<StandardGeo | undefined> {
  const existing = getLocal<StandardGeo>({ key: GEO_INFO })
  return existing || (await setGeo())
}
