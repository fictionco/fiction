import axios from "axios"
import { isNode } from "@factor/api/utils"
import { stored, storeItem } from "@factor/api"
import { UserGeolocation } from "./types"

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
export const getUserGeolocationName = (locationData: UserGeolocation): string => {
  const { city, regionName, countryCode } = locationData
  return `${city}, ${regionName} ${countryCode}`
}

export const getUserGeolocationSync = (): UserGeolocation | void => {
  return stored("geo")
}

/**
 * Gets user location data based on their IP
 * @reference
 * https://freegeoip.app/
 */
export const setUserGeolocation = async (): Promise<UserGeolocation | void> => {
  /**
   * Cache the value in case run multiple times
   * Don't get information on server as it will return server information not user
   */
  if (stored("geo")) {
    return stored("geo")
  } else if (isNode) {
    return
  }

  const options = {
    timeout: 3000,
    headers: {},
  }

  let result: { data: FreeGeoIp }

  try {
    result = await axios.get("https://freegeoip.app/json/", options)
  } catch {
    // eslint-disable-next-line no-console
    console.warn("Unable to get geo data.")
    return
  }

  const { data } = result

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
    ip: ip,
    countryCode: country_code,
    countryName: country_name,
    regionCode: region_code,
    regionName: region_name,
    city: city,
    zip: zip_code,
    timeZone: time_zone,
    latitude,
    longitude,
    metroCode: metro_code,
  }

  geo.name = getUserGeolocationName(geo)

  storeItem("geo", geo)

  return geo
}
