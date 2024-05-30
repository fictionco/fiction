import { describe, expect, it } from 'vitest'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { activeSiteDisplayUrl } from '../site'

describe('previewUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }
  it('should return the preview URL for the site', async () => {
    const site = new Site({ ...common, isProd: true, subDomain: 'sub' })

    expect(site.fictionSites.adminBaseRoute).toMatchInlineSnapshot(`"/admin"`)
    expect(site.frame.previewFrameUrl.value).toBe(`${site.fictionSites.adminBaseRoute}/preview/site/${site.siteId}`)
  })
})

describe('activeSiteDisplayUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('should return HTTPS URL for production site', () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const site = new Site({ ...common, isProd: true, subDomain: 'sub' })

    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe('https://sub.example.com')
  })

  it('should return HTTP URL with port for non-production site', () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const port = testUtils.fictionAppSites.port.value
    const site = new Site({ ...common, isProd: false, subDomain: 'sub' })

    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe(`http://sub.lan.com:${port}`)

    expect(activeSiteDisplayUrl(site, { mode: 'staging' }).value).toBe(`http://sub.lan.com:${port}`)
  })

  it('should return primary custom domain if available', () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const site = new Site({ ...common, isProd: true, subDomain: 'sub', customDomains: [{ hostname: 'www.custom.com' }] })
    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe('https://www.custom.com')

    expect(activeSiteDisplayUrl(site, { mode: 'staging' }).value).toBe('https://sub.example.com')
  })
})
