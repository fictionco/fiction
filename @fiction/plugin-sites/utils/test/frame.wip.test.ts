import { describe, expect, it } from 'vitest'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/siteTestUtils'

describe('previewUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }
  it('should return the preview URL for the site', async () => {
    const site = new Site({ ...common, isProd: true, subDomain: 'sub' })

    expect(site.frame.previewFrameUrl.value).toBe(`${site.fictionAdmin.adminBaseRoute}/preview/site/${site.siteId}`)
  })
})

describe('activeSiteDisplayUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('should return HTTPS URL for production site', () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const site = new Site({ ...common, isProd: true, subDomain: 'sub' })

    expect(site.frame.activeSiteDisplayUrl().value).toBe('https://sub.example.com')
  })

  it('should return HTTP URL with port for non-production site', () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const port = testUtils.fictionAppSites.port
    const site = new Site({ ...common, isProd: false, subDomain: 'sub' })

    expect(site.frame.activeSiteDisplayUrl().value).toBe(`http://sub.lan.com:${port}`)
  })

  it('should return primary custom domain if available', () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const site = new Site({ ...common, isProd: true, subDomain: 'sub', customDomains: [{ hostname: 'www.custom.com' }] })
    expect(site.frame.activeSiteDisplayUrl().value).toBe('https://www.custom.com')
  })
})
