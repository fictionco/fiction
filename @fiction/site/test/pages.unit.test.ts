/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { getSitemapPathsFromSite, loadSiteFromTheme } from '../load'
import { createSiteTestUtils } from './testUtils'

describe('site plugin tests', async () => {
  const testUtils = await createSiteTestUtils()

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
        "__transaction",
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

  it('generates correct paths for site pages and cards', async () => {
    await site.update({ pages: [
      { slug: '_home', cards: [{ templateId: 'hero' }] },
      { slug: 'blog', cards: [{ templateId: 'testBlog', userConfig: {
        posts: [{ slug: 'first-post' }, {  slug: 'second-post' }],
      } }] },
    ] })

    const paths = await getSitemapPathsFromSite(site)

    expect(paths).toMatchInlineSnapshot(`
      [
        "/",
        "/blog",
        "/blog/first-post",
        "/blog/second-post",
      ]
    `)
    const expectedPaths = [
      '/',
      '/blog',
      '/blog/first-post',
      '/blog/second-post',
    ]

    expect(paths).toEqual(expectedPaths)

    const paths2 = await getSitemapPathsFromSite(site, '/test')

    expect(paths2.some(_ => !_.startsWith('/test'))).toBe(false)

    expect(paths2).toMatchInlineSnapshot(`
      [
        "/test",
        "/test/blog",
        "/test/blog/first-post",
        "/test/blog/second-post",
      ]
    `)
  })
})
