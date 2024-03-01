/**
 * @vitest-environment happy-dom
 */
import { shortId } from '@factor/api'
import { describe, expect, it } from 'vitest'
import type { TableSiteConfig } from '../tables'
import type { Site } from '../site'
import { loadSite, requestManageSite } from '../load'
import { createSiteTestUtils } from './siteTestUtils'

let siteConfig: TableSiteConfig
let site: Site
describe('siteLoading', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()

  const common = {
    siteRouter: testUtils?.factorRouterSites,
    factorSites: testUtils?.factorSites,
    siteMode: 'standard',
  } as const

  it('creates site', async (ctx) => {
    if (!testUtils?.factorSites)
      throw new Error('missing testUtils')

    const subDomain = shortId()
    const title = 'test'
    const themeId = 'fiction'

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

    await testUtils.factorUser.logout()

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
