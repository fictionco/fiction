/**
 * @vitest-environment happy-dom
 */

import { afterAll, describe, expect, it } from 'vitest'
import { shortId, waitFor } from '@fiction/core'
import { snapshotHtml } from '@fiction/core/utils/snapshot'
import type { Site } from '../site'
import { loadSiteFromTheme, requestManageSite } from '../load'
import { createSiteTestUtils } from './siteTestUtils'

let siteObj: Site

let subDomain: string
describe('siteRendering Tests', async () => {
  const testUtils = await createSiteTestUtils()

  await testUtils.init()

  subDomain = shortId()

  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    parentRouter: testUtils.fictionRouter,
    siteMode: 'standard',
  } as const

  const result = await requestManageSite(
    {
      _action: 'create',
      fields: { title: 'test', themeId: 'test', subDomain },
      caller: 'iframeEditingTest',
      ...common,
    },
  )

  if (!result?.site)
    throw new Error('no site')

  siteObj = result?.site

  testUtils.fictionSites.activeSite.value = siteObj

  afterAll(async () => {
    await testUtils?.fictionApp.close()
    await testUtils?.fictionAppSites.close()
  })

  it('loads site correctly', async () => {
    if (!testUtils?.fictionAppSites)
      return

    const mountEl = document.createElement('div')
    const { init: _, initialized: __, close: ___, ...service } = testUtils
    const entry = await testUtils.fictionAppSites.mountApp({ mountEl, service, runVars: { SUBDOMAIN: subDomain } })

    await waitFor(300)

    const html = await snapshotHtml(mountEl.innerHTML, { hideTags: ['svg'], maskIds: false })

    expect(html.toLowerCase()).not.toContain('not found')

    expect(siteObj.currentPage.value?.cards.value.length).toMatchInlineSnapshot(`4`)

    expect(testUtils.fictionRouter.current.value?.fullPath).toMatchInlineSnapshot(`"/"`)
    expect(testUtils.fictionRouterSites.current.value?.fullPath).toMatchInlineSnapshot(`"/"`)

    const el = mountEl.querySelector('.x-engine') as HTMLElement
    expect(el.dataset.subDomain, 'correct sub domain').toBe(subDomain)

    // expect(subDomain).toMatchInlineSnapshot(`"kxexk"`)
    // expect(siteObj.siteId).toMatchInlineSnapshot(`"site65baa59877aa780e3151edd9"`)
    // expect(html.slice(0, 1000)).toMatchInlineSnapshot(`
    //   "<div class="antialiased x-site ui-font-body">
    //     <div
    //       class="x-engine"
    //       data-site-id="site65baa59877aa780e3151edd9"
    //       data-pathname="/"
    //       data-view-id="_home"
    //       data-page-id="crd65baa598a856290ff75c2002"
    //       data-theme-id="test"
    //       data-sub-domain="kxexk"
    //     >
    //       <header id="crd65baa5989695dbae708076c2" data-card-type="engine" class="engine-full-width" data-cards-total="0" data-cards-keys=""><!--v-if--></header>
    //       <main id="crd65baa598a856290ff75c2002" data-card-type="engine" class="engine-full-width" data-cards-total="4" data-cards-keys="mediaGrid, hero, area, hero">
    //         <div class="card-engine">
    //           <div class="media-grid relative z-10 mx-auto overflow-hidden py-[calc(2rem+6vw)]" id="crd65baa5983deb8951fbb26f5e" data-card-type="mediaGrid">
    //             <div class="media-grid-track">
    //               <div class="media-grid-grid grid">
    //                 <div class="media-grid-item group relative overflow-hidden">
    //                   <div class="item-media absolute inset-0">
    //      "
    // `)
    expect(html).toContain(`data-site-id="${siteObj.siteId}"`)

    expect(html).toContain(`data-pathname="${siteObj.currentPath.value}"`)
    expect(html).toContain(`data-view-id="${siteObj.currentViewId.value}"`)
    expect(html).toContain(`data-page-id="${siteObj.activePageId.value}"`)
    expect(html).toContain(`data-theme-id="${siteObj.themeId.value}"`)
    expect(html.length).toBeGreaterThan(10000)

    entry.app.unmount()
    await waitFor(300)
  })

  it('gets site from theme', async () => {
    if (!testUtils?.fictionSites)
      return

    const s = await loadSiteFromTheme({ themeId: 'test', ...common, caller: 'renderTests' })

    expect(s.pages.value.map(r => r.regionId).length).toBe(2)

    expect(s?.pages.value.map((r) => {
      return [
        r.templateId.value,
        r.regionId,
        r.tpl.value?.settings.isRegion,
        r.cards.value.length,
      ]
    })).toMatchInlineSnapshot(`
      [
        [
          "wrap",
          "main",
          undefined,
          4,
        ],
        [
          "testWrap",
          "main",
          undefined,
          1,
        ],
      ]
    `)
  })
})
