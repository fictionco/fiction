/**
 * @vitest-environment happy-dom
 */
import type { Site } from '../site'
import type { TableSiteConfig } from '../tables'
import { shortId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { loadSite, requestManageSite } from '../load'
import { createSiteTestUtils } from './testUtils'

let siteConfig: TableSiteConfig
let site: Site
describe('siteLoading', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()

  const common = {
    siteRouter: testUtils?.fictionRouterSites,
    fictionSites: testUtils?.fictionSites,
    siteMode: 'standard',
  } as const

  it('creates site', async (ctx) => {
    if (!testUtils?.fictionSites)
      throw new Error('missing testUtils')

    const subDomain = shortId()
    const title = 'test'
    const themeId = 'test'

    const result = await requestManageSite(
      {
        _action: 'create',
        fields: { title, themeId, subDomain },
        caller: ctx.task.name,
        ...common,
      },
    )

    const r = result.response

    if (!result.site || !r?.data)
      throw new Error('problem creating site')

    siteConfig = r.data
    site = result.site
    expect(r.status).toMatchInlineSnapshot(`"success"`)
  }, 10000)

  it('gets site with siteId and subDomain, not logged in', async (ctx) => {
    if (!testUtils || !siteConfig)
      throw new Error('missing testUtils or site')

    await testUtils.fictionUser.logout()

    const { siteId, subDomain } = siteConfig

    const result = await requestManageSite({ _action: 'retrieve', where: { siteId }, caller: ctx.task.name, ...common })

    expect(result?.site?.siteId).toBeTruthy()

    const result2 = await requestManageSite({ _action: 'retrieve', where: { subDomain }, caller: ctx.task.name + 2, ...common })

    expect(result2?.site?.siteId).toBeTruthy()
  })

  it('gets the correct site with load param', async () => {
    const r = await loadSite({ ...common, caller: 'loadParams', mountContext: { siteId: site.siteId } })

    expect(r?.siteId).toBe(site.siteId)
  })
})
