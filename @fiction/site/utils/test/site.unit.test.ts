/**
 * @vitest-environment happy-dom
 */

import { describe, expect, it } from 'vitest'
import { AppRoute, shortId } from '@fiction/core'
import FSite from '@fiction/cards/CardSite.vue'
import { requestManageSite } from '../../load.js'
import type { EditorState } from '../../site.js'
import { Site } from '../../site.js'
import { createSiteTestUtils } from '../../test/testUtils.js'
import { activeSiteHostname, saveSite, updateSite } from '../site.js'
import { setPages, updatePages } from '../page.js'
import { siteGoto, siteLink } from '../manage.js'

describe('siteLink / siteGoto', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  testUtils.fictionRouterSites.update([new AppRoute({ name: 'tester', path: '/test/:viewId?/:itemId?', component: FSite })])

  it('returns correct link when site and router are provided', async () => {
    await testUtils.fictionRouterSites.push({ path: '/test/whatever' }, { caller: 'test' })
    const site = await Site.create({ ...common, themeId: 'test', siteId: `test-${shortId()}` })
    const location = { path: '/somepath' }
    const result = siteLink({ site, location })
    expect(result).toBe('/test/somepath')
  })

  it('calls push with merged query variables when retainQueryVars is changed', async () => {
    await testUtils.fictionRouterSites.push({ path: '/test/whatever', query: { init: 1 } }, { caller: 'test' })
    const site = await Site.create({ ...common, themeId: 'test', siteId: `test-${shortId()}` })
    const location = { path: '/some-path', query: { additional: 'info' } }

    await siteGoto({ site, location, options: { retainQueryVars: true } })

    const cur = () => testUtils.fictionRouterSites.current.value

    expect(cur().path).toBe('/test/some-path')

    expect(cur().query).toMatchObject({ init: '1', additional: 'info' })

    await siteGoto({ site, location: { path: '/another', query: { solo: 1 } }, options: { retainQueryVars: false } })

    expect(cur().path).toBe('/test/another')

    expect(cur().query).toMatchObject({ solo: '1' })

    await siteGoto({ site, location: '/yet-another?test=42', options: { retainQueryVars: true } })

    expect(cur().path).toBe('/test/yet-another')

    expect(cur().query).toMatchObject({ solo: '1', test: '42' })
  })
})

describe('query var', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test' }

  it('changes scheme', async () => {
    const site = await Site.create({ ...common, themeId: 'test', siteId: `test-${shortId()}` })

    await site.siteRouter.push({ query: { _scheme: 'dark' } }, { caller: 'test' })

    expect(site.isLightMode.value).toBe(false)

    await site.siteRouter.push({ query: { _scheme: 'light' } }, { caller: 'test' })

    expect(site.isLightMode.value).toBe(true)
  })

  it('defaults to correct mode based on config', async () => {
    const site = await Site.create({ ...common, themeId: 'test', siteId: `test-${shortId()}`, userConfig: { styling: { isLightMode: true } } })

    expect(site.isLightMode.value).toBe(true)

    site.isLightMode.value = false

    expect(site.isLightMode.value).toBe(false)
  })
})

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
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` }

  it('updates site with valid keys', async () => {
    const site = await Site.create({ ...common, themeId: 'test' })

    updateSite({ site, newConfig: { title: 'New Title', userConfig: { seo: { locale: 'es' } }, subDomain: 'newSub', customDomains: [{ hostname: 'new.com' }] } })

    expect(site.title.value).toBe('New Title')
    expect(site.userConfig.value.seo?.locale).toBe('es')
    expect(site.subDomain.value).toBe('newSub')
    expect(site.customDomains.value[0].hostname).toBe('new.com')
  })

  it('updates and initializes new partial regions', async () => {
    const site = await Site.create({ ...common, themeId: 'test' })

    updateSite({ site, newConfig: { pages: [{ templateId: 'area', cardId: 'card1' }] } })

    expect(site.pages.value[0].cardId).toBe('card1')
  })

  it('merge updates editor', async () => {
    const site = await Site.create({ ...common, themeId: 'test', editor: { selectedCardId: 'test123' } as EditorState })

    updateSite({ site, newConfig: { editor: { selectedRegionId: 'header' } as EditorState } })

    expect(site.editor.value).toMatchObject({ selectedCardId: 'test123', selectedRegionId: 'header' })
  })

  it('updates pages', async () => {
    const site = await Site.create({ ...common, themeId: 'test', siteId: `test-${shortId()}` })
    // Setup initial state
    const pgs = setPages({ site, pages: [{ cardId: 'card1', title: 'Original Title', userConfig: { otherProp: 'initial' } }] })

    site.pages.value = pgs

    const pages = [{ cardId: 'card1', title: 'Updated Title', userConfig: { otherProp: 'Updated' } }]

    // Perform the update
    updatePages({ site, pages })

    const userSitePages = site.pages.value.filter(_ => !_.isSystem.value)

    expect(userSitePages.map(p => [p.cardId, p.slug.value, p.templateId.value])).toMatchInlineSnapshot(`
      [
        [
          "card1",
          undefined,
          "wrap",
        ],
      ]
    `)
    expect(userSitePages.length, 'set pages should be 1').toBe(1)
    expect(userSitePages.length).toBe(1) // Ensure no new pages were added
    expect(userSitePages[0].cardId).toBe('card1')
    expect(userSitePages[0].slug.value).toBe(undefined)
    expect(userSitePages[0].title.value).toBe('Updated Title')
    expect(userSitePages[0].userConfig.value.otherProp).toBe('Updated')
  })
})

describe('activeSiteHostname', async () => {
  const testUtils = await createSiteTestUtils()
  const common = { fictionSites: testUtils.fictionSites, siteRouter: testUtils.fictionRouterSites, themeId: 'test', siteId: `test-${shortId()}` }

  it('should return the hostname from a full URL', async () => {
    testUtils.fictionAppSites.liveUrl.value = 'https://*.example.com'

    const site = await Site.create({ ...common, subDomain: 'subdomain', isProd: false })

    expect(activeSiteHostname(site).value).toBe('subdomain.lan.com')

    site.isProd.value = true

    expect(activeSiteHostname(site).value).toBe('subdomain.example.com')
  })

  it('should return empty string for invalid URL', async () => {
    testUtils.fictionAppSites.liveUrl.value = 'invalid-url'
    const site = await Site.create({ ...common, subDomain: 'subdomain', isProd: true })
    expect(activeSiteHostname(site).value).toBe('')
  })
})
