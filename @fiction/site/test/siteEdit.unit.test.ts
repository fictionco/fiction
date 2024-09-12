/**
 * @vitest-environment happy-dom
 */
import { shortId, waitFor } from '@fiction/core'
import { snap } from '@fiction/core/test-utils'
import { describe, expect, it } from 'vitest'
import { requestManageSite } from '../load'
import { Site } from '../site'
import { requestManagePage, updatePage } from '../utils/region'
import { saveSite } from '../utils/site'
import { setup } from './test-theme'
import { createSiteTestUtils } from './testUtils'

describe('site plugin tests', async () => {
  const testUtils = await createSiteTestUtils()
  let site = await testUtils.createSite()

  const testTheme = await setup(testUtils)
  const r = await testUtils.init()
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''

  const common = {
    siteRouter: testUtils.fictionRouterSites,
    fictionSites: testUtils.fictionSites,
    siteMode: 'standard',
  } as const
  const config = await testTheme.getConfig({ site })
  const defaultNumPages = config.pages.filter(_ => _.regionId === 'main').length

  it('creates site', async (ctx) => {
    if (!testUtils?.fictionSites)
      throw new Error('missing testUtils')

    const subDomain = shortId()
    const title = 'test'
    const themeId = testTheme.themeId
    const result = await requestManageSite({ _action: 'create', fields: { title, themeId, subDomain }, caller: ctx.task.name, ...common })

    const r = result.response

    if (!result.site || !r?.data)
      throw new Error('problem creating site')

    const siteConfig = r.data
    site = result.site
    expect(r.status).toMatchInlineSnapshot(`"success"`)
    expect(r.message).toMatchInlineSnapshot(`undefined`)
    expect(siteConfig).toBeTruthy()
    expect(siteConfig.subDomain).toBe(subDomain)
    expect(siteConfig.title).toBe(title)
    expect(siteConfig.themeId).toBe(themeId)

    expect(siteConfig.pages.length, 'should have 2 pages in created site').toBe(defaultNumPages)
    expect(siteConfig.pages.length).toMatchInlineSnapshot(`2`)
  })

  it('updates site', async () => {
    const title = 'testUpdate'

    if (!site?.siteId)
      throw new Error('siteId missing')

    const r = await testUtils?.fictionSites?.queries.ManageSite.serve(
      {
        _action: 'update',
        fields: { title, siteId: site?.siteId },
        where: { siteId: site?.siteId },
        userId,
        orgId,
        caller: 'siteUpdateTest',
      },
      { server: true },
    )

    if (!r?.data)
      throw new Error('problem updating site')

    expect(r?.status).toMatchInlineSnapshot(`"success"`)
    expect(r?.message).toMatchInlineSnapshot(`undefined`)

    const siteConfig = r?.data

    expect(siteConfig).toBeTruthy()
    expect(siteConfig?.title).toBe(title)
    expect(siteConfig.pages.filter(_ => _.regionId === 'main').length).toBe(defaultNumPages)
    expect(siteConfig.pages.filter(_ => _.regionId === 'main').length).toMatchInlineSnapshot(`2`)
  })

  it('sets routes, paths, pages', async () => {
    if (!site || !testUtils?.fictionSites)
      throw new Error('missing site or testUtils')

    expect(Object.entries(site.viewMap.value).sort().map(([k, v]) => `${k}:${v.length}`)).toMatchInlineSnapshot(`
      [
        "_:27",
        "__transaction:13",
        "_home:27",
        "example:27",
      ]
    `)

    expect(site.currentPath.value).toMatchInlineSnapshot(`"/"`)
    expect(site.currentViewId.value).toMatchInlineSnapshot(`"_home"`)
    expect(site.activePageId.value, 'sets page id').toBeTruthy()
    expect(site.pages.value.some(p => p.cardId === site.activePageId.value)).toBeTruthy()
  })

  it('creates region', async () => {
    if (!site?.siteId)
      throw new Error('siteId missing')

    const title = 'test'
    const slug = 'test'
    const r = await testUtils?.fictionSites?.queries.ManagePage.serve(
      {
        siteId: site.siteId,
        _action: 'upsert',
        fields: { siteId: site.siteId, title, slug },
        userId,
        orgId,
        caller: 'testRegionCreation',
      },
      { server: true, caller: 'testRegionCreationNo1' },
    )

    if (!r?.data)
      throw new Error('problem creating region')

    const region = r.data
    expect(region).toBeTruthy()

    expect(region.title).toBe(title)
    expect(region.slug).toBe(slug)
    expect(region.siteId).toBe(site.siteId)

    expect(snap(region, { maskedKeys: [] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "",
        "createdAt": "[dateTime:]",
        "description": "",
        "editor": {},
        "effects": "",
        "generation": {
          "prompt": "create content for the "test" card ",
          "totalEstimatedTime": 0,
          "userPropConfig": {},
        },
        "is404": false,
        "isHome": false,
        "layoutId": "[id:*******]",
        "orgId": "[id:***************************]",
        "regionId": "[id:****]",
        "siteId": "[id:****************************]",
        "slug": "test",
        "templateId": "[id:****]",
        "title": "test",
        "updatedAt": "[dateTime:]",
        "userConfig": {},
        "userId": "[id:***************************]",
      }
    `)

    const r2 = await testUtils?.fictionSites?.queries.ManagePage.serve(
      {
        siteId: site.siteId,
        _action: 'delete',
        fields: { siteId: site?.siteId, cardId: region.cardId },
        userId,
        orgId,
        caller: 'testRegionCreationNo2',
      },
      { server: true },
    )

    expect(r2?.status).toBe('success')
  })

  it('updates pages from form', async () => {
    if (!site || !testUtils?.fictionSites)
      throw new Error('missing site or testUtils')

    expect(site.toConfig().pages?.length).toMatchInlineSnapshot(`2`)
    expect(site.pages.value.length).toMatchInlineSnapshot(`3`)

    const rSite1 = await testUtils.fictionSites.requests.ManageSite.projectRequest({
      _action: 'retrieve',
      where: { siteId: site.siteId },
      caller: 'updates pages from form',
    })

    expect(rSite1?.data?.pages.length).toMatchInlineSnapshot(`2`)

    const nm = 'test'
    const regionCard = { title: nm, slug: nm }

    const { cardConfig: r } = await requestManagePage({ site, _action: 'upsert', regionCard, delay: 0 })

    expect(r?.title).toBe(nm)
    expect(r?.cardId).toBeTruthy()

    expect(site.pages.value.map(_ => _.regionId).sort()).toMatchInlineSnapshot(`
      [
        "main",
        "main",
        "main",
        "main",
      ]
    `)

    await waitFor(200)

    expect(site.pages.value.map(m => m.templateId.value).sort()).toMatchInlineSnapshot(`
      [
        "testWrap",
        "wrap",
        "wrap",
        "wrap",
      ]
    `)

    expect(site.pages.value.map(_ => _.regionId).sort()).toMatchInlineSnapshot(`
      [
        "main",
        "main",
        "main",
        "main",
      ]
    `)

    expect(site.pages.value.some(_ => !_.regionId), 'region key always set').toBeFalsy()

    await waitFor(200)

    expect(site.pages.value.length).toMatchInlineSnapshot(`4`)

    expect(site.pages.value[0].title.value).toBe(nm)

    expect(site.pages.value[0].cardId).toBe(r?.cardId)

    const rSite2 = await testUtils.fictionSites.requests.ManageSite.projectRequest({ _action: 'retrieve', where: { siteId: site.siteId }, caller: 'update page test' })

    expect(rSite2?.data?.pages.filter(_ => _.regionId === 'main').length, 'default pages + 1 added page').toBe(defaultNumPages + 1)

    await requestManagePage({ site, _action: 'delete', regionCard: { cardId: r?.cardId }, delay: 0 })

    await waitFor(200)

    expect(site.pages.value.filter(_ => _.regionId === 'main' && !_.isSystem.value).length, 'default pages after adding and deleting page').toBe(defaultNumPages)

    const rSite3 = await testUtils.fictionSites.requests.ManageSite.projectRequest({
      _action: 'retrieve',
      where: { siteId: site.siteId },
      caller: 'testRegionCreationNo3',
    })

    expect(rSite3?.data?.pages.filter(_ => _.regionId === 'main').length).toBe(defaultNumPages)
  })

  it('handles active page', async () => {
    if (!site || !testUtils?.fictionSites)
      throw new Error('missing site or testUtils')

    const m = site.viewMap.value
    expect(Object.keys(m).sort()).toMatchInlineSnapshot(`
      [
        "_",
        "__transaction",
        "_home",
        "example",
        "test",
      ]
    `)

    expect(m['']).toBe(m.home)

    expect(site.currentViewId.value).toMatchInlineSnapshot(`"test"`)
    expect(site.currentPage.value?.settings.isHome).toMatchInlineSnapshot(`false`)
    expect(site.activePageId.value).toBeTruthy()

    const nm = 'testAlpha'
    const regionCard = { title: nm, slug: nm }

    const { cardConfig: created } = await requestManagePage({ site, _action: 'upsert', regionCard, delay: 0 })

    await waitFor(200)

    expect(site.activePageId.value).toBeTruthy()
    expect(created?.cardId).toBeTruthy()

    expect(site.activePageId.value, 'created page to be active').toBe(created?.cardId)

    const cards = site.currentPage.value?.cards

    const testId = 'testId_77'
    const testId2 = 'testId_88'

    const cardNumInitial = cards?.value?.length ?? 0

    expect(snap(site.currentPage.value?.toConfig())).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "",
        "createdAt": "[dateTime:]",
        "description": "",
        "editor": {},
        "effects": "",
        "generation": {
          "prompt": "create content for the "testAlpha" card on the "test" page",
          "totalEstimatedTime": 0,
          "userPropConfig": {},
        },
        "is404": false,
        "isHome": false,
        "layoutId": "[id:*******]",
        "orgId": "[id:***************************]",
        "regionId": "[id:****]",
        "siteId": "[id:****************************]",
        "slug": "testalpha",
        "templateId": "[id:****]",
        "title": "testAlpha",
        "updatedAt": "[dateTime:]",
        "userConfig": {},
        "userId": "[id:***************************]",
      }
    `)

    await site.addCard({ templateId: 'area', cardId: testId })
    await site.addCard({ templateId: 'hero', cardId: testId2 })

    await waitFor(200)

    expect(snap(site.currentPage.value?.toConfig())).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "description": "",
        "editor": {},
        "effects": "",
        "generation": {
          "prompt": "create content for the "testAlpha" card on the "test" page",
          "totalEstimatedTime": 0,
          "userPropConfig": {},
        },
        "is404": false,
        "isHome": false,
        "layoutId": "[id:*******]",
        "orgId": "[id:***************************]",
        "regionId": "[id:****]",
        "siteId": "[id:****************************]",
        "slug": "testalpha",
        "templateId": "[id:****]",
        "title": "testAlpha",
        "updatedAt": "[dateTime:]",
        "userConfig": {},
        "userId": "[id:***************************]",
      }
    `)

    expect(cards?.value?.length).toBe(cardNumInitial + 2)
    expect(cards?.value?.map(c => c.cardId).filter(_ => _).length).toBe(cardNumInitial + 2)

    expect(site.availableCards.value.map(c => c?.cardId.length)).toMatchInlineSnapshot(`
      [
        27,
        9,
        9,
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        27,
        13,
        27,
        27,
        27,
        27,
      ]
    `)

    await site.addCard({ templateId: 'area', addToCardId: testId })
    await site.addCard({ templateId: 'hero' })

    expect(site.currentPage.value?.cards?.value.find(_ => _.cardId === testId)?.cards.value[0]?.templateId.value).toBe('area')

    expect(snap(site.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "description": "",
        "editor": {},
        "effects": "",
        "generation": {
          "prompt": "create content for the "testAlpha" card on the "test" page",
          "totalEstimatedTime": 0,
          "userPropConfig": {},
        },
        "is404": false,
        "isHome": false,
        "layoutId": "[id:*******]",
        "orgId": "[id:***************************]",
        "regionId": "[id:****]",
        "siteId": "[id:****************************]",
        "slug": "testalpha",
        "templateId": "[id:****]",
        "title": "testAlpha",
        "updatedAt": "[dateTime:]",
        "userConfig": {},
        "userId": "[id:***************************]",
      }
    `)

    const firstCardCards = site.currentPage.value?.cards.value.find(c => c.cardId === testId)?.cards.value ?? []

    expect(firstCardCards.length).toBe(1)
  })

  it('sets correct layout', async () => {
    if (!site || !testUtils?.fictionSites)
      throw new Error('missing site or testUtils')

    expect(snap(site.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "description": "",
        "editor": {},
        "effects": "",
        "generation": {
          "prompt": "create content for the "testAlpha" card on the "test" page",
          "totalEstimatedTime": 0,
          "userPropConfig": {},
        },
        "is404": false,
        "isHome": false,
        "layoutId": "[id:*******]",
        "orgId": "[id:***************************]",
        "regionId": "[id:****]",
        "siteId": "[id:****************************]",
        "slug": "testalpha",
        "templateId": "[id:****]",
        "title": "testAlpha",
        "updatedAt": "[dateTime:]",
        "userConfig": {},
        "userId": "[id:***************************]",
      }
    `)

    expect(Object.entries(site.layout.value).map(([key, comp]) => `${key}-${comp?.cards.value.length}`).sort()).toMatchInlineSnapshot(`
      [
        "footer-0",
        "header-0",
        "main-3",
        "test-0",
      ]
    `)
  })

  it('handles cards correctly', async () => {
    if (!site || !testUtils?.fictionSites)
      throw new Error('missing site or testUtils')

    expect(snap(site.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "description": "",
        "editor": {},
        "effects": "",
        "generation": {
          "prompt": "create content for the "testAlpha" card on the "test" page",
          "totalEstimatedTime": 0,
          "userPropConfig": {},
        },
        "is404": false,
        "isHome": false,
        "layoutId": "[id:*******]",
        "orgId": "[id:***************************]",
        "regionId": "[id:****]",
        "siteId": "[id:****************************]",
        "slug": "testalpha",
        "templateId": "[id:****]",
        "title": "testAlpha",
        "updatedAt": "[dateTime:]",
        "userConfig": {},
        "userId": "[id:***************************]",
      }
    `)

    await site.addCard({ templateId: 'marquee', cardId: 'testId_1' })
    await site.addCard({ templateId: 'hero', cardId: 'testId_2' })

    expect(site.editor.value.selectedCardId, 'selectedCardId should be set').toBe('testId_2')
    expect(site.activeCard.value?.cardId, 'activeCard should be set to latest').toBe('testId_2')

    site.activeCard.value?.update({ userConfig: { hello: 'world' } })

    expect(site.activeCard.value?.userConfig.value).toMatchInlineSnapshot(`
      {
        "hello": "world",
      }
    `)

    expect(site.activeCard.value?.userConfig.value.hello).toBe('world')

    // make sure region changes don't affect the settings
    updatePage({ site, cardConfig: { title: 'test', regionId: 'main' } })
    await site.addCard({ templateId: 'hero', cardId: 'testId_3' })
    site.activeCard.value?.update({ userConfig: { hello: 'world' } })

    await site.addCard({ templateId: 'hero', addToCardId: 'testId_2', cardId: 'nestedTestId1' })
    site.activeCard.value?.update({ userConfig: { foo: 'bar' } })
    expect(site.activeCard.value?.userConfig.value.foo).toBe('bar')

    expect(snap(site.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "description": "",
        "editor": {},
        "effects": "",
        "generation": {
          "prompt": "create content for the "testAlpha" card on the "test" page",
          "totalEstimatedTime": 0,
          "userPropConfig": {},
        },
        "is404": false,
        "isHome": false,
        "layoutId": "[id:*******]",
        "orgId": "[id:***************************]",
        "regionId": "[id:****]",
        "siteId": "[id:****************************]",
        "slug": "testalpha",
        "templateId": "[id:****]",
        "title": "testAlpha",
        "updatedAt": "[dateTime:]",
        "userConfig": {},
        "userId": "[id:***************************]",
      }
    `)
  })

  it('saves the site', async () => {
    if (!site || !testUtils?.fictionSites)
      throw new Error('missing site or testUtils')

    const responseSiteConfig = await saveSite({ site, successMessage: 'Test Success' })

    if (!responseSiteConfig?.themeId)
      throw new Error('no themeId')

    expect(responseSiteConfig?.siteId).toBeTruthy()

    const responseSite = await Site.create({ ...responseSiteConfig, fictionSites: testUtils?.fictionSites, siteRouter: testUtils?.fictionRouterSites })

    expect(responseSite.pages.value.length).toBe(site.pages.value.length)
  })

  it('deletes the site', async () => {})
})
