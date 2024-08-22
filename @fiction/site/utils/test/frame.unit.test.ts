import { describe, expect, it } from 'vitest'
import { shortId } from '@fiction/core'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { activeSiteDisplayUrl } from '../site'

describe('previewUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` }
  it('should return the preview URL for the site', async () => {
    const site = await Site.create({ ...common, isProd: true, subDomain: 'sub' })

    expect(site.fictionSites.adminBaseRoute).toMatchInlineSnapshot(`"/admin"`)
    expect(site.frame.currentSiteFrameUrl.value).toBe(`${site.fictionSites.adminBaseRoute}/preview/site/${site.siteId}`)
  })
})

describe('activeSiteDisplayUrl', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` }

  it('should return HTTPS URL for production site', async () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const site = await Site.create({ ...common, isProd: true, subDomain: 'sub' })

    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe('https://sub.example.com')
  })

  it('should return HTTP URL with port for non-production site', async () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const port = testUtils.fictionAppSites.port.value
    const site = await Site.create({ ...common, isProd: false, subDomain: 'sub' })

    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe(`http://sub.lan.com:${port}`)

    expect(activeSiteDisplayUrl(site, { mode: 'staging' }).value).toBe(`http://sub.lan.com:${port}`)
  })

  it('should return primary custom domain if available', async () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'
    const site = await Site.create({ ...common, isProd: true, subDomain: 'sub', customDomains: [{ hostname: 'www.custom.com' }] })
    expect(activeSiteDisplayUrl(site, { mode: 'display' }).value).toBe('https://www.custom.com')

    expect(activeSiteDisplayUrl(site, { mode: 'staging' }).value).toBe('https://sub.example.com')
  })
})
