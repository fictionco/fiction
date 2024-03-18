/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { loadSiteFromTheme } from '../load'
import { createSiteTestUtils } from './siteTestUtils'

describe('site plugin tests', async () => {
  const testUtils = createSiteTestUtils()

  await testUtils.init()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    parentRouter: testUtils.fictionRouter,
    siteMode: 'standard',
  } as const

  const site = await loadSiteFromTheme({ themeId: 'test', ...common, caller: 'pluginTests' })

  it('loads site from theme', async (ctx) => {
    await site.siteRouter.push('/foo', { caller: ctx.task.name })

    expect(Object.keys(site?.siteRouter.params.value)).toMatchInlineSnapshot(`
      [
        "viewId",
        "itemId",
      ]
    `)

    expect(site?.pages.value.map(_ => _.slug.value)).toMatchInlineSnapshot(`
      [
        "_home",
        "example",
      ]
    `)

    expect(site?.currentViewId.value).toMatchInlineSnapshot(`"foo"`)
    expect(site?.activePageId.value).toBe('_special404')
    expect(site?.currentPage.value?.title.value).toBe('404')

    await site.siteRouter.push('/example', { caller: ctx.task.name })

    expect(site?.currentPage.value?.slug.value).toBe('example')

    await site.siteRouter.push('/', { caller: ctx.task.name })

    expect(site?.currentPage.value?.slug.value).toBe('_home')
  })
})
