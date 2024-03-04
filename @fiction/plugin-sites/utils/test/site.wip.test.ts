import { describe, expect, it } from 'vitest'
import { shortId } from '@fiction/core'
import { requestManageSite } from '../../load'
import type { EditorState } from '../../site'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/siteTestUtils'
import { activeSiteHostname, saveSite, updateSite } from '../site'
import { setPages, updatePages } from '../page'

describe('saveSite', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteMode: 'standard' } as const

  const result = await requestManageSite(
    {
      _action: 'create',
      fields: { title: 'test', themeId: 'test' },
      caller: 'saveSiteInit',
      ...common,
    },
  )
  if (!result.site || !result.response?.data)
    throw new Error('problem creating site')

  const site = result.site

  it('updates site with valid keys', async (ctx) => {
    site.title.value = 'new title'
    await saveSite({ site, successMessage: 'Test Success' })

    const r1 = await requestManageSite(
      {
        _action: 'retrieve',
        where: { siteId: site.siteId },
        caller: ctx.task.name,
        ...common,
      },
    )

    expect(r1.site?.title.value).toBe('new title')

    site.title.value = 'another title'

    const subDomain = shortId()
    site.subDomain.value = subDomain

    const r2 = await saveSite({ site, onlyKeys: ['subDomain'], successMessage: 'Test Success' })

    expect(r2?.title).toBe('new title')
    expect(r2?.subDomain).toBe(subDomain)
  })
})

describe('updateSite / updatePages', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('updates site with valid keys', async () => {
    const site = new Site({ ...common, themeId: 'test' })

    updateSite({ site, newConfig: { title: 'New Title', userConfig: { locale: 'es' }, subDomain: 'newSub', customDomains: [{ hostname: 'new.com' }] } })

    expect(site.title.value).toBe('New Title')
    expect(site.userConfig.value.locale).toBe('es')
    expect(site.subDomain.value).toBe('newSub')
    expect(site.customDomains.value[0].hostname).toBe('new.com')
  })

  it('updates and initializes new partial regions', async () => {
    const site = new Site({ ...common, themeId: 'test' })

    updateSite({ site, newConfig: { pages: [{ templateId: 'area', cardId: 'card1' }] } })

    expect(site.pages.value[0].cardId).toBe('card1')
  })

  it('merge updates editor', async () => {
    const site = new Site({ ...common, themeId: 'test', editor: { selectedCardId: 'test123' } as EditorState })

    updateSite({ site, newConfig: { editor: { selectedRegionId: 'header' } as EditorState } })

    expect(site.editor.value).toMatchObject({ selectedCardId: 'test123', selectedRegionId: 'header' })
  })

  it('updates pages', async () => {
    const site = new Site({ ...common, themeId: 'test' })
    // Setup initial state
    const pgs = setPages({ site, pages: [{ cardId: 'card1', title: 'Original Title', userConfig: { otherProp: 'initial' } }] })
    site.pages.value.push(...pgs)

    const pages = [{ cardId: 'card1', title: 'Updated Title', userConfig: { otherProp: 'Updated' } }]

    // Perform the update
    updatePages({ site, pages })

    expect(site.pages.value.map(p => p.cardId)).toMatchInlineSnapshot(`
      [
        "card1",
      ]
    `)
    // Assertions
    expect(site.pages.value.length).toBe(1) // Ensure no new pages were added

    expect(site.pages.value[0].title.value).toBe('Updated Title')
    expect(site.pages.value[0].userConfig.value.otherProp).toBe('Updated')
  })
})

describe('activeSiteHostname', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('should return the hostname from a full URL', () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'

    const site = new Site({ ...common, subDomain: 'subdomain', isProd: false })

    expect(activeSiteHostname(site).value).toBe('subdomain.lan.com')

    site.isProd.value = true

    expect(activeSiteHostname(site).value).toBe('subdomain.example.com')
  })

  it('should return empty string for invalid URL', () => {
    testUtils.fictionAppSites.liveUrl.value = 'invalid-url'
    const site = new Site({ ...common, subDomain: 'subdomain', isProd: true })
    expect(activeSiteHostname(site).value).toBe('')
  })
})
