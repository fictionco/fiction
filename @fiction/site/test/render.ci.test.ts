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
  const testUtils = createSiteTestUtils()

  await testUtils.init()

  subDomain = shortId()
  const hostname = `${subDomain}.fiction.com`

  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
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
    const entry = await testUtils.fictionAppSites.mountApp({ mountEl, service, runVars: { HOSTNAME: hostname } })

    await waitFor(300)

    const html = await snapshotHtml(mountEl.innerHTML, { hideTags: ['svg'], maskIds: false })

    expect(html.toLowerCase()).not.toContain('not found')

    expect(siteObj.currentPage.value?.cards.value.length).toMatchInlineSnapshot(`4`)

    expect(testUtils.fictionRouter.current.value?.fullPath).toMatchInlineSnapshot(`"/"`)
    expect(testUtils.fictionRouterSites.current.value?.fullPath).toMatchInlineSnapshot(`"/"`)

    const el = mountEl.querySelector('.x-engine') as HTMLElement
    expect(el.dataset.subDomain, 'correct sub domain').toBe(subDomain)

    // expect(subDomain).toMatchInlineSnapshot(`"twtzx"`)
    // expect(siteObj.siteId).toMatchInlineSnapshot(`"site65f712f10a729d45d1899b3b"`)
    // expect(html.slice(0, 1000)).toMatchInlineSnapshot(`
    //   "<div class="x-site overflow-y-scroll h-full w-full relative">
    //     <div class="x-font-body bg-theme-0 dark:bg-theme-950 text-theme-1000 dark:text-theme-0">
    //       <div
    //         class="x-engine"
    //         data-site-id="site65f712f10a729d45d1899b3b"
    //         data-pathname="/"
    //         data-view-id="_home"
    //         data-page-id="crd65f712efa2c933f890951c6d"
    //         data-theme-id="test"
    //         data-sub-domain="twtzx"
    //         data-site-mode="standard"
    //       >
    //         <div class="wrap">
    //           <!--v-if-->
    //           <main class="card-engine">
    //             <div class="marquee relative z-10 mx-auto overflow-hidden py-[calc(1.5rem+4vw)]" id="crd65f712ef1c37cf1fc9784afa" data-card-type="marquee">
    //               <div class="marquee-track">
    //                 <div class="marquee-grid grid">
    //                   <div class="marquee-item relative overflow-hidden">
    //                     <div class="item-media absolute inset-0">
    //                       <img
    //                         src="https://factor-tests.s3.amazonaws.com/test/md_65f712efa5a4cb9ec60f6a71-scr"
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
