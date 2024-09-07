/**
 * @vitest-environment happy-dom
 */
import { fetchWithTimeout } from '@fiction/core/utils'
import { getGeo, getGeoFree, setUserGeolocation } from '@fiction/core/utils/geo'
import { describe, expect, it, vi } from 'vitest'

// Mock the utilities used in the geo functions
vi.mock('@fiction/core/utils', () => ({
  fetchWithTimeout: vi.fn(),
  isLocalhostIp: vi.fn(),
}))

describe('geo functions', () => {
  describe('getGeoFree', () => {
    it('should fetch free geo data successfully', async () => {
      const mockIp = '123.123.123.123'
      const mockApiResponse = {
        query: mockIp,
        country: 'United States',
        countryCode: 'US',
        city: 'San Francisco',
        lat: 37.7749,
        lon: -122.4194,
        timezone: 'America/Los_Angeles',
        regionName: 'California',
        isp: 'ISP Name',
        org: 'Organization Name',
      }

      vi.mocked(fetchWithTimeout).mockResolvedValueOnce({
        json: async () => Promise.resolve(mockApiResponse),
        ok: true,
      } as Response)

      const expectedGeoData = {
        ip: mockIp,
        countryCode: 'US',
        cityName: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: 'America/Los_Angeles',
        regionName: 'California',
        ipOrganization: 'Organization Name',
      }

      const result = await getGeoFree(mockIp)

      expect(result).toEqual(expectedGeoData)
      expect(fetchWithTimeout).toHaveBeenCalledWith(`http://ip-api.com/json/${mockIp}`, expect.any(Object))
    })
  })

  describe('getGeo', () => {
    it('should fetch detailed geo data successfully', async () => {
      const mockIp = '123.123.123.123'
      const mockApiResponse = {
        ipAddress: mockIp,
        countryCode: 'US',
        stateProv: 'California',
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        timeZone: 'America/Los_Angeles',
        isCrawler: false,
        isProxy: false,
        threatLevel: 'low',
        org: 'ISP Name',
      }

      vi.mocked(fetchWithTimeout).mockResolvedValueOnce({
        ok: true,
        json: async () => Promise.resolve(mockApiResponse),
      } as Response)

      const expectedGeoData = {
        ip: mockIp,
        countryCode: 'US',
        cityName: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: 'America/Los_Angeles',
        regionName: 'California',
        ipIsCrawler: false,
        ipIsProxy: false,
        ipThreatLevel: 'low',
        ipOrganization: 'ISP Name',
      }

      const result = await getGeo(mockIp)

      expect(result).toEqual(expectedGeoData)
      expect(fetchWithTimeout).toHaveBeenCalled()
    })
  })

  describe('setUserGeolocation', () => {
    it('should fetch user geolocation data successfully', async () => {
      const mockApiResponse = {
        ip: '123.123.123.123',
        country_code: 'US',
        country_name: 'United States',
        region_code: 'CA',
        region_name: 'California',
        city: 'San Francisco',
        zip_code: '94016',
        time_zone: 'America/Los_Angeles',
        latitude: 37.7749,
        longitude: -122.4194,
      }

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        json: async () => Promise.resolve(mockApiResponse),
        ok: true,
      })

      const expectedGeoData = {
        ip: '123.123.123.123',
        countryCode: 'US',
        countryName: 'United States',
        regionCode: 'CA',
        regionName: 'California',
        city: 'San Francisco',
        zip: '94016',
        timeZone: 'America/Los_Angeles',
        latitude: 37.7749,
        longitude: -122.4194,
        metroCode: undefined,
        name: 'San Francisco, United States',
      }

      const result = await setUserGeolocation()

      expect(result).toEqual(expectedGeoData)
      expect(globalThis.fetch).toHaveBeenCalledWith('https://freegeoip.app/json/')
    })
  })
})
