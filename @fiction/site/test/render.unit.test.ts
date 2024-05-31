/**
 * @vitest-environment happy-dom
 */

import { afterAll, describe, expect, it } from 'vitest'
import { shortId, waitFor } from '@fiction/core'
import { snapshotHtml } from '@fiction/core/utils/snapshot'
import type { Site } from '../site'
import { loadSiteFromTheme, requestManageSite } from '../load'
import { createSiteTestUtils } from './testUtils'

let siteObj: Site

let subDomain: string
describe('siteRendering Tests', async () => {
  const testUtils = await createSiteTestUtils()

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

  afterAll(async () => {
    await testUtils?.fictionApp.close()
    await testUtils?.fictionAppSites.close()
  })

  it('loads site correctly', async () => {
    if (!testUtils?.fictionAppSites)
      return

    const mountEl = document.createElement('div')
    const { init: _, initialized: __, close: ___, ...service } = testUtils
    const serviceConfig = { fictionEnv: service.fictionEnv, service, runVars: { HOSTNAME: hostname } }
    const entry = await testUtils.fictionAppSites.mountApp({ mountEl, serviceConfig })

    await waitFor(300)

    const html = await snapshotHtml(mountEl.innerHTML, { hideTags: ['svg'], maskIds: false })

    expect(html.toLowerCase()).not.toContain('not found')

    expect(siteObj.currentPage.value?.cards.value.length).toMatchInlineSnapshot(`4`)

    expect(testUtils.fictionRouter.current.value?.fullPath).toMatchInlineSnapshot(`"/"`)
    expect(testUtils.fictionRouterSites.current.value?.fullPath).toMatchInlineSnapshot(`"/"`)

    const el = mountEl.querySelector('.x-site') as HTMLElement
    expect(el.dataset.subDomain, 'correct sub domain').toBe(subDomain)
    expect(el.dataset.siteId, 'correct site id').toBe(siteObj.siteId)
    expect(el.dataset.pathname, 'correct pathname').toBe(siteObj.currentPath.value)
    expect(el.dataset.viewId, 'correct view id').toBe(siteObj.currentViewId.value)
    expect(el.dataset.pageId, 'correct page id').toBe(siteObj.activePageId.value)
    expect(el.dataset.pageTemplateId, 'correct page template id').toBe(siteObj.currentPage.value.templateId.value)

    expect(html).toContain(`data-site-id="${siteObj.siteId}"`)

    expect(html).toContain(`data-pathname="${siteObj.currentPath.value}"`)
    expect(html).toContain(`data-view-id="${siteObj.currentViewId.value}"`)
    expect(html).toContain(`data-page-id="${siteObj.activePageId.value}"`)
    expect(html).toContain(`data-theme-id="${siteObj.themeId.value}"`)

    // expect(subDomain).toMatchInlineSnapshot(`"twtzx"`)
    // expect(siteObj.siteId).toMatchInlineSnapshot(`"site65f712f10a729d45d1899b3b"`)
    // expect(html.slice(0, 1000)).toMatchInlineSnapshot(`
    //   "<div class="x-site overflow-y-scroll h-full w-full relative">
    //     <div class="x-font-body bg-theme-0 dark:bg-theme-950 text-theme-1000 dark:text-theme-0">
    //       <div
    //         class="x-engine"
    //         data-site-id="site6615d3da7b7b35031bae1a54"
    //         data-pathname="/"
    //         data-view-id="_home"
    //         data-page-id="crd6615d3d9854a3af6d321b75f"
    //         data-theme-id="test"
    //         data-sub-domain="rziez"
    //         data-site-mode="standard"
    //       ></div>
    //     </div>
    //     <div class="notifications"><div class="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-start px-4 py-6"></div></div>
    //   </div>
    //   "
    // `)

    const l = html.length

    if (l < 3000)
      console.error('SHORT RENDER', html)

    expect(l).toBeGreaterThan(10000)

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
