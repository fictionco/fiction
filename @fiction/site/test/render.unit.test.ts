/**
 * @vitest-environment happy-dom
 */

import { shortId, waitFor } from '@fiction/core'
import { snapshotHtml } from '@fiction/core/utils/snapshot'
import { afterAll, describe, expect, it } from 'vitest'
import { loadSiteFromTheme, requestManageSite } from '../load'
import { createSiteTestUtils } from './testUtils'

describe('siteRendering Tests', async () => {
  const testUtils = await createSiteTestUtils()

  const { org } = await testUtils.init()

  afterAll(async () => {
    await waitFor(300)
    await testUtils?.fictionApp.close()
    await testUtils?.fictionAppSites.close()
    await testUtils.close()
  })

  const handle = shortId()
  const hostname = `${org.handle}.fiction.com`

  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    siteMode: 'standard',
  } as const

  const result = await requestManageSite(
    {
      _action: 'create',
      fields: { title: 'test', handle },
      caller: 'siteRenderingTests',
      ...common,
    },
  )

  if (!result?.site)
    throw new Error('no site')

  const siteObj = result?.site

  it('loads site correctly', async () => {
    expect(siteObj.pages.value.map(p => p.slug.value)).toMatchInlineSnapshot(`
      [
        "home",
        "__transaction",
        "_p",
        "_archive",
      ]
    `)

    if (!testUtils?.fictionAppSites)
      return

    const mountEl = document.createElement('div')
    window.document.body.appendChild(mountEl)
    const { init: _, initialized: __, close: ___, ...service } = testUtils
    const serviceConfig = { fictionEnv: service.fictionEnv, service, runVars: { HOSTNAME: hostname } }
    const entry = await testUtils.fictionAppSites.mountApp({ mountEl, serviceConfig })

    await waitFor(1000)

    const html = await snapshotHtml(mountEl.innerHTML, { hideTags: ['svg'], maskIds: false })

    expect(html.toLowerCase()).not.toContain('not found')

    expect(siteObj.currentPage.value?.cards.value.length).toMatchInlineSnapshot(`1`)

    expect(testUtils.fictionRouter.current.value?.fullPath).toMatchInlineSnapshot(`"/"`)
    expect(testUtils.fictionRouterSites.current.value?.fullPath).toMatchInlineSnapshot(`"/"`)

    const el = mountEl.querySelector('.x-site') as HTMLElement

    expect(el.dataset.subDomain, 'correct sub domain').toBe(org.handle)
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

    const l = html.length

    if (l < 10000)
      console.error('SHORT RENDER WILL ERROR', html)

    expect(l).toBeGreaterThan(10000)

    entry.app.unmount()
  }, { retry: 2 })

  it('gets site from theme', async () => {
    if (!testUtils?.fictionSites)
      return

    const s = await loadSiteFromTheme({ themeId: 'test', ...common, caller: 'renderTests' })

    const userPages = s.pages.value.filter(p => !p.isSystem.value)
    expect(userPages.map(r => r.regionId).length).toBe(2)

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
          "cardPageWrapV1",
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
        [
          "cardPageWrapV1",
          "main",
          undefined,
          1,
        ],
        [
          "cardPageWrapV1",
          "main",
          undefined,
          1,
        ],
        [
          "cardPageWrapV1",
          "main",
          undefined,
          1,
        ],
      ]
    `)
  })
})
