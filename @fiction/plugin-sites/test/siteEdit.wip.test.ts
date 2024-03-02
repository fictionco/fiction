/**
 * @vitest-environment happy-dom
 */
import { shortId, waitFor } from '@fiction/core'
import { snap } from '@fiction/core/test-utils'
import { describe, expect, it } from 'vitest'
import type { TableSiteConfig } from '../tables'
import { Site } from '../site'
import { requestManageSite } from '../load'
import { requestManagePage, updateRegion } from '../utils/region'
import { saveSite } from '../utils/site'
import { setup } from './test-theme'
import { createSiteTestUtils } from './siteTestUtils'

let site: TableSiteConfig
let siteObj: Site
describe('site plugin tests', async () => {
  const testUtils = await createSiteTestUtils()
  const testTheme = setup(testUtils)
  const r = await testUtils.init()
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''

  const common = {
    siteRouter: testUtils.factorRouterSites,
    parentRouter: testUtils.factorRouter,
    factorSites: testUtils.factorSites,
    siteMode: 'standard',
  } as const

  const defaultNumPages = testTheme.pages.value.filter(_ => _.regionId === 'main').length

  it('creates site', async (ctx) => {
    if (!testUtils?.factorSites)
      throw new Error('missing testUtils')

    const subDomain = shortId()
    const title = 'test'
    const themeId = testTheme.themeId
    const result = await requestManageSite({ _action: 'create', fields: { title, themeId, subDomain }, caller: ctx.task.name, ...common })

    const r = result.response

    if (!result.site || !r?.data)
      throw new Error('problem creating site')

    site = r.data
    siteObj = result.site
    expect(r.status).toMatchInlineSnapshot(`"success"`)
    expect(r.message).toMatchInlineSnapshot(`"site created"`)
    expect(site).toBeTruthy()
    expect(site.subDomain).toBe(subDomain)
    expect(site.title).toBe(title)
    expect(site.themeId).toBe(themeId)

    expect(site.pages.length).toBe(defaultNumPages)
    expect(site.pages.length).toMatchInlineSnapshot(`2`)
  })

  it('updates site', async () => {
    const title = 'testUpdate'

    if (!site?.siteId)
      throw new Error('siteId missing')

    const r = await testUtils?.factorSites?.queries.ManageSite.serve(
      {
        _action: 'update',
        fields: { title, siteId: site?.siteId },
        where: { siteId: site?.siteId },
        userId,
        orgId,
      },
      { server: true },
    )

    if (!r?.data)
      throw new Error('problem updating site')

    expect(r?.status).toMatchInlineSnapshot(`"success"`)
    expect(r?.message).toMatchInlineSnapshot(`"site saved"`)

    site = r?.data

    expect(site).toBeTruthy()
    expect(site?.title).toBe(title)
    expect(site.pages.filter(_ => _.regionId === 'main').length).toBe(defaultNumPages)
    expect(site.pages.filter(_ => _.regionId === 'main').length).toMatchInlineSnapshot(`2`)
  })

  it('sets routes, paths, pages', async () => {
    if (!siteObj || !testUtils?.factorSites)
      throw new Error('missing siteObj or testUtils')

    expect(Object.entries(siteObj.viewMap.value).sort().map(([k, v]) => `${k}:${v.length}`)).toMatchInlineSnapshot(`
      [
        "_default:27",
        "example:27",
      ]
    `)

    expect(siteObj.currentPath.value).toMatchInlineSnapshot(`"/"`)
    expect(siteObj.currentViewId.value).toMatchInlineSnapshot(`"_default"`)
    expect(siteObj.activePageId.value, 'sets page id').toBeTruthy()
    expect(siteObj.pages.value.some(p => p.cardId === siteObj.activePageId.value)).toBeTruthy()
  })

  it('creates region', async () => {
    if (!site?.siteId)
      throw new Error('siteId missing')

    const title = 'test'
    const slug = 'test'
    const r = await testUtils?.factorSites?.queries.ManagePage.serve(
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
        "is404": false,
        "isDefault": false,
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

    const r2 = await testUtils?.factorSites?.queries.ManagePage.serve(
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
    if (!siteObj || !testUtils?.factorSites)
      throw new Error('missing siteObj or testUtils')

    expect(site.pages.length).toMatchInlineSnapshot(`2`)
    expect(siteObj.pages.value.length).toMatchInlineSnapshot(`2`)

    const rSite1 = await testUtils.factorSites.requests.ManageSite.projectRequest({
      _action: 'retrieve',
      where: { siteId: siteObj.siteId },
    })

    expect(rSite1?.data?.pages.length).toMatchInlineSnapshot(`2`)

    const nm = 'test'
    const regionCard = { title: nm, slug: nm }

    const { cardConfig: r } = await requestManagePage({ site: siteObj, _action: 'upsert', regionCard, delay: 0 })

    expect(r?.title).toBe(nm)
    expect(r?.cardId).toBeTruthy()

    expect(siteObj.pages.value.map(_ => _.regionId).sort()).toMatchInlineSnapshot(`
      [
        "main",
        "main",
        "main",
      ]
    `)

    await waitFor(200)

    expect(siteObj.pages.value.map(m => m.templateId.value).sort()).toMatchInlineSnapshot(`
      [
        "testWrap",
        "wrap",
        "wrap",
      ]
    `)

    expect(siteObj.pages.value.map(_ => _.regionId).sort()).toMatchInlineSnapshot(`
      [
        "main",
        "main",
        "main",
      ]
    `)

    expect(siteObj.pages.value.some(_ => !_.regionId), 'region key always set').toBeFalsy()

    await waitFor(200)

    expect(siteObj.pages.value.length).toMatchInlineSnapshot(`3`)

    expect(siteObj.pages.value[0].title.value).toBe(nm)

    expect(siteObj.pages.value[0].cardId).toBe(r?.cardId)

    const rSite2 = await testUtils.factorSites.requests.ManageSite.projectRequest({
      _action: 'retrieve',
      where: { siteId: siteObj.siteId },

    })

    expect(rSite2?.data?.pages.filter(_ => _.regionId === 'main').length, 'default pages + 1 added page').toBe(defaultNumPages + 1)

    await requestManagePage({ site: siteObj, _action: 'delete', regionCard: { cardId: r?.cardId }, delay: 0 })

    await waitFor(200)

    expect(siteObj.pages.value.filter(_ => _.regionId === 'main').length, 'default pages after adding and deleting page').toBe(defaultNumPages)

    const rSite3 = await testUtils.factorSites.requests.ManageSite.projectRequest({
      _action: 'retrieve',
      where: { siteId: siteObj.siteId },
    })

    expect(rSite3?.data?.pages.filter(_ => _.regionId === 'main').length).toBe(defaultNumPages)
  })

  it('handles active page', async () => {
    if (!siteObj || !testUtils?.factorSites)
      throw new Error('missing siteObj or testUtils')

    const m = siteObj.viewMap.value
    expect(Object.keys(m).sort()).toMatchInlineSnapshot(`
      [
        "_default",
        "example",
        "test",
      ]
    `)

    expect(m['']).toBe(m.home)

    expect(siteObj.currentViewId.value).toMatchInlineSnapshot(`"test"`)
    expect(siteObj.currentPage.value?.settings.isDefault).toMatchInlineSnapshot(`undefined`)
    expect(siteObj.activePageId.value).toBeTruthy()

    const nm = 'testAlpha'
    const regionCard = { title: nm, slug: nm }

    const { cardConfig: created } = await requestManagePage({ site: siteObj, _action: 'upsert', regionCard, delay: 0 })

    await waitFor(200)

    expect(siteObj.activePageId.value).toBeTruthy()
    expect(created?.cardId).toBeTruthy()

    expect(siteObj.activePageId.value, 'created page to be active').toBe(created?.cardId)

    const cards = siteObj.currentPage.value?.cards

    const testId = 'testId_77'
    const testId2 = 'testId_88'

    const cardNumInitial = cards?.value?.length ?? 0

    expect(snap(siteObj.currentPage.value?.toConfig())).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "",
        "createdAt": "[dateTime:]",
        "is404": false,
        "isDefault": false,
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

    siteObj.addCard({ templateId: 'area', cardId: testId })
    siteObj.addCard({ templateId: 'hero', cardId: testId2 })

    await waitFor(200)

    expect(snap(siteObj.currentPage.value?.toConfig())).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "is404": false,
        "isDefault": false,
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

    expect(siteObj.allLayoutCards.value.map(c => c?.cardId.length)).toMatchInlineSnapshot(`
      [
        27,
        27,
        27,
        9,
        9,
      ]
    `)

    siteObj.addCard({ templateId: 'area', addToCardId: testId })
    siteObj.addCard({ templateId: 'hero' })

    expect(siteObj.currentPage.value?.cards?.value.find(_ => _.cardId === testId)?.cards.value[0]?.templateId.value).toBe('area')

    expect(snap(siteObj.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "is404": false,
        "isDefault": false,
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

    const firstCardCards = siteObj.currentPage.value?.cards.value.find(c => c.cardId === testId)?.cards.value ?? []

    expect(firstCardCards.length).toBe(1)
  })

  it('sets correct layout', async () => {
    if (!siteObj || !testUtils?.factorSites)
      throw new Error('missing siteObj or testUtils')

    expect(snap(siteObj.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "is404": false,
        "isDefault": false,
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

    expect(Object.entries(siteObj.layout).map(([key, comp]) => `${key}-${comp.value?.cards.value.length}`).sort()).toMatchInlineSnapshot(`
      [
        "__v_isReadonly-undefined",
        "__v_isRef-undefined",
        "_cacheable-undefined",
        "_setter-undefined",
        "_value-undefined",
        "dep-undefined",
        "effect-undefined",
        "getter-undefined",
      ]
    `)
  })

  it('handles cards correctly', async () => {
    if (!siteObj || !testUtils?.factorSites)
      throw new Error('missing siteObj or testUtils')

    expect(snap(siteObj.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "is404": false,
        "isDefault": false,
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

    siteObj.addCard({ templateId: 'marquee', cardId: 'testId_1' })
    siteObj.addCard({ templateId: 'hero', cardId: 'testId_2' })

    expect(siteObj.editor.value.selectedCardId, 'selectedCardId should be set').toBe('testId_2')
    expect(siteObj.activeCard.value?.cardId, 'activeCard should be set to latest').toBe('testId_2')

    siteObj.activeCard.value?.update({ userConfig: { hello: 'world' } })

    expect(siteObj.activeCard.value?.userConfig.value).toMatchInlineSnapshot(`
      {
        "hello": "world",
      }
    `)

    expect(siteObj.activeCard.value?.userConfig.value.hello).toBe('world')

    // make sure region changes don't affect the settings
    updateRegion({ site: siteObj, cardConfig: { title: 'test', regionId: 'main' } })
    siteObj.addCard({ templateId: 'hero', cardId: 'testId_3' })
    siteObj.activeCard.value?.update({ userConfig: { hello: 'world' } })

    siteObj.addCard({ templateId: 'hero', addToCardId: 'testId_2', cardId: 'nestedTestId1' })
    siteObj.activeCard.value?.update({ userConfig: { foo: 'bar' } })
    expect(siteObj.activeCard.value?.userConfig.value.foo).toBe('bar')

    expect(snap(siteObj.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:***************************]",
        "cards": "[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]",
        "createdAt": "[dateTime:]",
        "is404": false,
        "isDefault": false,
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
    if (!siteObj || !testUtils?.factorSites)
      throw new Error('missing siteObj or testUtils')

    const responseSiteConfig = await saveSite({ site: siteObj })

    if (!responseSiteConfig?.themeId)
      throw new Error('no themeId')

    expect(responseSiteConfig?.siteId).toBeTruthy()

    const responseSite = new Site({ ...responseSiteConfig, factorSites: testUtils?.factorSites, siteRouter: testUtils?.factorRouterSites })

    expect(responseSite.pages.value.length).toBe(siteObj.pages.value.length)
  })

  it('deletes the site', async () => {})
})
