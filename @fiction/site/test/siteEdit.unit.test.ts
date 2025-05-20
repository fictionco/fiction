/**
 * @vitest-environment happy-dom
 */
import { shortId, waitFor } from '@fiction/core'
import { snap } from '@fiction/core/test-utils'
import { afterAll, describe, expect, it } from 'vitest'
import { requestManageSite } from '../load'
import { Site } from '../site'
import { requestManagePage, updatePage } from '../utils/region'
import { saveSite } from '../utils/site'
import { theme as testTheme } from './test-theme'
import { createSiteTestUtils } from './testUtils'

describe('site plugin tests', async () => {
  const testUtils = await createSiteTestUtils()
  let site = await testUtils.createSite()

  const r = await testUtils.init()
  afterAll(() => testUtils.close())
  const userId = r?.user?.userId ?? ''
  const orgId = r?.user?.orgs?.[0]?.orgId ?? ''

  const common = {
    siteRouter: testUtils.fictionRouterSites,
    fictionSites: testUtils.fictionSites,
    siteMode: 'standard',
  } as const
  const config = await testTheme.getThemeConfig({ site })
  const defaultNumPages = config.pages?.filter(_ => _.regionId === 'main').length ?? 0

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
        fields: [{ siteId: site.siteId, title, slug }],
        userId,
        orgId,
        caller: 'testRegionCreation',
        scope: 'publish',
      },
      { server: true, caller: 'testRegionCreationNo1' },
    )

    if (!r?.data?.[0])
      throw new Error('problem creating region')

    const region = r.data[0]
    expect(region).toBeTruthy()

    expect(region.title).toBe(title)
    expect(region.slug).toBe(slug)
    expect(region.siteId).toBe(site.siteId)

    expect(snap(region, { maskedKeys: [] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:TRUTHY]",
        "cards": [],
        "createdAt": "[datetime:TRUTHY]",
        "description": "",
        "draft": {},
        "editor": {},
        "effects": [],
        "generation": {},
        "is404": "false",
        "isHome": "false",
        "layoutId": "[id:TRUTHY]",
        "orgId": "[id:TRUTHY]",
        "regionId": "[id:TRUTHY]",
        "siteId": "[id:TRUTHY]",
        "slug": "test",
        "templateId": "[id:TRUTHY]",
        "title": "test",
        "updatedAt": "[datetime:TRUTHY]",
        "userConfig": {},
        "userId": "null",
        "wordCount": "0",
      }
    `)

    const r2 = await testUtils?.fictionSites?.queries.ManagePage.serve(
      {
        siteId: site.siteId,
        _action: 'delete',
        where: [{ cardId: region.cardId || '' }],
        userId,
        orgId,
        caller: 'testRegionCreationNo2',
        scope: 'publish',
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
        "cardPageWrapV1",
        "cardPageWrapV1",
        "cardPageWrapV1",
        "testWrap",
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
    expect(site.currentPage.value?.settings.isHome).toMatchInlineSnapshot(`undefined`)
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
        "cardId": "[id:TRUTHY]",
        "cards": [],
        "createdAt": "[datetime:TRUTHY]",
        "description": "",
        "draft": {},
        "editor": {},
        "effects": [],
        "generation": {},
        "is404": "false",
        "isHome": "false",
        "layoutId": "[id:TRUTHY]",
        "orgId": "[id:TRUTHY]",
        "regionId": "[id:TRUTHY]",
        "scope": "undefined",
        "siteId": "[id:TRUTHY]",
        "slug": "testalpha",
        "templateId": "[id:TRUTHY]",
        "title": "testAlpha",
        "updatedAt": "[datetime:TRUTHY]",
        "userConfig": {},
        "userId": "null",
        "wordCount": "0",
      }
    `)

    await site.addCard({ templateId: 'cardPageAreaV1', cardId: testId })
    await site.addCard({ templateId: 'cardHeroV1', cardId: testId2 })

    await waitFor(200)

    expect(snap(site.currentPage.value?.toConfig())).toMatchInlineSnapshot(`
      {
        "cardId": "[id:TRUTHY]",
        "cards": [
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "standard": {
                "spaceSize": "none",
              },
            },
          },
        ],
        "createdAt": "[datetime:TRUTHY]",
        "description": "",
        "draft": {},
        "editor": {},
        "effects": [],
        "generation": {},
        "is404": "false",
        "isHome": "false",
        "layoutId": "[id:TRUTHY]",
        "orgId": "[id:TRUTHY]",
        "regionId": "[id:TRUTHY]",
        "scope": "undefined",
        "siteId": "[id:TRUTHY]",
        "slug": "testalpha",
        "templateId": "[id:TRUTHY]",
        "title": "testAlpha",
        "updatedAt": "[datetime:TRUTHY]",
        "userConfig": {},
        "userId": "null",
        "wordCount": "0",
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

    await site.addCard({ templateId: 'cardPageAreaV1', addToCardId: testId })
    await site.addCard({ templateId: 'cardHeroV1' })

    expect(site.currentPage.value?.cards?.value.find(_ => _.cardId === testId)?.cards.value[0]?.templateId.value).toBe('cardPageAreaV1')

    expect(snap(site.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:TRUTHY]",
        "cards": [
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [
              {
                "cardId": "[id:TRUTHY]",
                "cards": [],
                "depth": "2",
                "description": "undefined",
                "effects": [],
                "is404": "false",
                "isHome": "false",
                "layoutId": "undefined",
                "parentId": "[id:TRUTHY]",
                "regionId": "[id:TRUTHY]",
                "scope": "undefined",
                "slug": "undefined",
                "templateId": "[id:TRUTHY]",
                "templates": "undefined",
                "title": "undefined",
                "userConfig": {
                  "standard": {
                    "spaceSize": "none",
                  },
                },
              },
            ],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "standard": {
                "spaceSize": "none",
              },
            },
          },
        ],
        "createdAt": "[datetime:TRUTHY]",
        "description": "",
        "draft": {},
        "editor": {},
        "effects": [],
        "generation": {},
        "is404": "false",
        "isHome": "false",
        "layoutId": "[id:TRUTHY]",
        "orgId": "[id:TRUTHY]",
        "regionId": "[id:TRUTHY]",
        "scope": "undefined",
        "siteId": "[id:TRUTHY]",
        "slug": "testalpha",
        "templateId": "[id:TRUTHY]",
        "title": "testAlpha",
        "updatedAt": "[datetime:TRUTHY]",
        "userConfig": {},
        "userId": "null",
        "wordCount": "0",
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
        "cardId": "[id:TRUTHY]",
        "cards": [
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [
              {
                "cardId": "[id:TRUTHY]",
                "cards": [],
                "depth": "2",
                "description": "undefined",
                "effects": [],
                "is404": "false",
                "isHome": "false",
                "layoutId": "undefined",
                "parentId": "[id:TRUTHY]",
                "regionId": "[id:TRUTHY]",
                "scope": "undefined",
                "slug": "undefined",
                "templateId": "[id:TRUTHY]",
                "templates": "undefined",
                "title": "undefined",
                "userConfig": {
                  "standard": {
                    "spaceSize": "none",
                  },
                },
              },
            ],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "standard": {
                "spaceSize": "none",
              },
            },
          },
        ],
        "createdAt": "[datetime:TRUTHY]",
        "description": "",
        "draft": {},
        "editor": {},
        "effects": [],
        "generation": {},
        "is404": "false",
        "isHome": "false",
        "layoutId": "[id:TRUTHY]",
        "orgId": "[id:TRUTHY]",
        "regionId": "[id:TRUTHY]",
        "scope": "undefined",
        "siteId": "[id:TRUTHY]",
        "slug": "testalpha",
        "templateId": "[id:TRUTHY]",
        "title": "testAlpha",
        "updatedAt": "[datetime:TRUTHY]",
        "userConfig": {},
        "userId": "null",
        "wordCount": "0",
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
        "cardId": "[id:TRUTHY]",
        "cards": [
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [
              {
                "cardId": "[id:TRUTHY]",
                "cards": [],
                "depth": "2",
                "description": "undefined",
                "effects": [],
                "is404": "false",
                "isHome": "false",
                "layoutId": "undefined",
                "parentId": "[id:TRUTHY]",
                "regionId": "[id:TRUTHY]",
                "scope": "undefined",
                "slug": "undefined",
                "templateId": "[id:TRUTHY]",
                "templates": "undefined",
                "title": "undefined",
                "userConfig": {
                  "standard": {
                    "spaceSize": "none",
                  },
                },
              },
            ],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "standard": {
                "spaceSize": "none",
              },
            },
          },
        ],
        "createdAt": "[datetime:TRUTHY]",
        "description": "",
        "draft": {},
        "editor": {},
        "effects": [],
        "generation": {},
        "is404": "false",
        "isHome": "false",
        "layoutId": "[id:TRUTHY]",
        "orgId": "[id:TRUTHY]",
        "regionId": "[id:TRUTHY]",
        "scope": "undefined",
        "siteId": "[id:TRUTHY]",
        "slug": "testalpha",
        "templateId": "[id:TRUTHY]",
        "title": "testAlpha",
        "updatedAt": "[datetime:TRUTHY]",
        "userConfig": {},
        "userId": "null",
        "wordCount": "0",
      }
    `)

    await site.addCard({ templateId: 'cardMarqueeV1', cardId: 'testId_1' })
    await site.addCard({ templateId: 'cardHeroV1', cardId: 'testId_2' })

    expect(site.editor.value.selectedCardId, 'selectedCardId should be set').toBe('testId_2')
    expect(site.activeCard.value?.cardId, 'activeCard should be set to latest').toBe('testId_2')

    site.activeCard.value?.update({ userConfig: { hello: 'world' } }, { caller: 'test' })

    expect(site.activeCard.value?.userConfig.value).toMatchInlineSnapshot(`
      {
        "hello": "world",
      }
    `)

    expect(site.activeCard.value?.userConfig.value.hello).toBe('world')

    // make sure region changes don't affect the settings
    updatePage({ site, cardConfig: { title: 'test', regionId: 'main' } })
    await site.addCard({ templateId: 'cardHeroV1', cardId: 'testId_3' })
    site.activeCard.value?.update({ userConfig: { hello: 'world' } }, { caller: 'test' })

    await site.addCard({ templateId: 'cardHeroV1', addToCardId: 'testId_2', cardId: 'nestedTestId1' })
    site.activeCard.value?.update({ userConfig: { foo: 'bar' } }, { caller: 'test' })
    expect(site.activeCard.value?.userConfig.value.foo).toBe('bar')

    expect(snap(site.currentPage.value?.toConfig(), { maskedKeys: [''] })).toMatchInlineSnapshot(`
      {
        "cardId": "[id:TRUTHY]",
        "cards": [
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "hello": "world",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [
              {
                "cardId": "[id:TRUTHY]",
                "cards": [],
                "depth": "2",
                "description": "undefined",
                "effects": [],
                "is404": "false",
                "isHome": "false",
                "layoutId": "undefined",
                "parentId": "[id:TRUTHY]",
                "regionId": "[id:TRUTHY]",
                "scope": "undefined",
                "slug": "undefined",
                "templateId": "[id:TRUTHY]",
                "templates": "undefined",
                "title": "undefined",
                "userConfig": {
                  "foo": "bar",
                },
              },
            ],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "hello": "world",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "direction": "left",
              "items": [
                {
                  "href": "#",
                  "media": {
                    "format": "image",
                    "slug": "arpowers_minimal_stock_background_for_profile_photo_professiona_62a15087-100b-4880-8932-1bf4f2375052_sio7al",
                    "tags": [
                      "annotated",
                      "aspect:portrait",
                      "color:warm",
                      "man",
                      "midshot",
                      "person",
                      "image",
                    ],
                    "url": "https://res.cloudinary.com/fiction-com-inc/image/upload/f_auto,q_auto/v1724440966/arpowers_minimal_stock_background_for_profile_photo_professiona_62a15087-100b-4880-8932-1bf4f2375052_sio7al.png",
                  },
                  "subTitle": "Shape your narrative",
                  "title": "Visual Storytelling",
                },
                {
                  "href": "#",
                  "media": {
                    "format": "image",
                    "slug": "arpowers_minimal_stock_background_for_profile_photo_professiona_3dfbcab8-fc4a-4079-b5a8-2b81a26e24df_qoijpt",
                    "tags": [
                      "annotated",
                      "aspect:portrait",
                      "color:cool",
                      "person",
                      "silhouette",
                      "woman",
                      "image",
                    ],
                    "url": "https://res.cloudinary.com/fiction-com-inc/image/upload/f_auto,q_auto/v1724441013/arpowers_minimal_stock_background_for_profile_photo_professiona_3dfbcab8-fc4a-4079-b5a8-2b81a26e24df_qoijpt.png",
                  },
                  "subTitle": "Craft with purpose",
                  "title": "Dynamic Design",
                },
                {
                  "href": "#",
                  "media": {
                    "format": "image",
                    "slug": "arpowers_minimal_midshot_photo_of_object_1990s_style_futuristic_b50e9db3-34e6-4089-be9a-5fd1584c9ebd_z61gqa",
                    "tags": [
                      "annotated",
                      "aspect:portrait",
                      "aspect:square",
                      "color:warm",
                      "object",
                      "image",
                    ],
                    "url": "https://res.cloudinary.com/fiction-com-inc/image/upload/f_auto,q_auto/v1724556298/arpowers_minimal_midshot_photo_of_object_1990s_style_futuristic_b50e9db3-34e6-4089-be9a-5fd1584c9ebd_z61gqa.png",
                  },
                  "subTitle": "Inspire movement",
                  "title": "Creative Flow",
                },
                {
                  "href": "#",
                  "media": {
                    "format": "image",
                    "slug": "arpowers_minimal_midshot_photo_of_object_futuristic_ancient_gre_c5bee5e5-78dd-4613-ae89-0df0c483f02a_coxsq3",
                    "tags": [
                      "annotated",
                      "aspect:portrait",
                      "color:cool",
                      "object",
                      "image",
                    ],
                    "url": "https://res.cloudinary.com/fiction-com-inc/image/upload/f_auto,q_auto/v1724556266/arpowers_minimal_midshot_photo_of_object_futuristic_ancient_gre_c5bee5e5-78dd-4613-ae89-0df0c483f02a_coxsq3.png",
                  },
                  "subTitle": "Lead with clarity",
                  "title": "Bold Vision",
                },
                {
                  "href": "#",
                  "media": {
                    "format": "image",
                    "slug": "arpowers_minimal_midshot_photo_of_object_ancient_greek_ideal_be_851b3067-f015-416c-bcbd-6744165c6848_e2b4be",
                    "tags": [
                      "annotated",
                      "aspect:portrait",
                      "aspect:square",
                      "color:cool",
                      "object",
                      "image",
                    ],
                    "url": "https://res.cloudinary.com/fiction-com-inc/image/upload/f_auto,q_auto/v1724556234/arpowers_minimal_midshot_photo_of_object_ancient_greek_ideal_be_851b3067-f015-416c-bcbd-6744165c6848_e2b4be.png",
                  },
                  "subTitle": "Guide with style",
                  "title": "Artistic Direction",
                },
              ],
              "showAllText": "false",
              "speed": "7",
              "stagger": "false",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "action": {
                "buttons": [],
              },
              "subTitle": "Write a sentence or two that adds context to your headline",
              "title": "Enter Your Title",
            },
          },
          {
            "cardId": "[id:TRUTHY]",
            "cards": [
              {
                "cardId": "[id:TRUTHY]",
                "cards": [],
                "depth": "2",
                "description": "undefined",
                "effects": [],
                "is404": "false",
                "isHome": "false",
                "layoutId": "undefined",
                "parentId": "[id:TRUTHY]",
                "regionId": "[id:TRUTHY]",
                "scope": "undefined",
                "slug": "undefined",
                "templateId": "[id:TRUTHY]",
                "templates": "undefined",
                "title": "undefined",
                "userConfig": {
                  "standard": {
                    "spaceSize": "none",
                  },
                },
              },
            ],
            "depth": "1",
            "description": "undefined",
            "effects": [],
            "is404": "false",
            "isHome": "false",
            "layoutId": "undefined",
            "parentId": "[id:TRUTHY]",
            "regionId": "[id:TRUTHY]",
            "scope": "undefined",
            "slug": "undefined",
            "templateId": "[id:TRUTHY]",
            "templates": "undefined",
            "title": "undefined",
            "userConfig": {
              "standard": {
                "spaceSize": "none",
              },
            },
          },
        ],
        "createdAt": "[datetime:TRUTHY]",
        "description": "",
        "draft": {},
        "editor": {},
        "effects": [],
        "generation": {},
        "is404": "false",
        "isHome": "false",
        "layoutId": "[id:TRUTHY]",
        "orgId": "[id:TRUTHY]",
        "regionId": "[id:TRUTHY]",
        "scope": "undefined",
        "siteId": "[id:TRUTHY]",
        "slug": "testalpha",
        "templateId": "[id:TRUTHY]",
        "title": "testAlpha",
        "updatedAt": "[datetime:TRUTHY]",
        "userConfig": {},
        "userId": "null",
        "wordCount": "0",
      }
    `)
  })

  it('saves the site', async () => {
    if (!site || !testUtils?.fictionSites)
      throw new Error('missing site or testUtils')

    const responseSiteConfig = await saveSite({ site, successMessage: 'Test Success' })

    if (!responseSiteConfig?.themeId)
      throw new Error('no themeId')

    const siteId = responseSiteConfig?.siteId

    if (!siteId)
      throw new Error('no siteId')

    expect(siteId).toBeTruthy()

    const responseSite = await Site.create({ ...responseSiteConfig, siteId, fictionSites: testUtils?.fictionSites, siteRouter: testUtils?.fictionRouterSites })

    expect(responseSite.pages.value.length).toBe(site.pages.value.length)
  })

  it('deletes the site', async () => {})
})
