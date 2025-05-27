/**
 * @vitest-environment happy-dom
 */
import { afterAll, describe, expect, it } from 'vitest'
import { getSitemapPathsFromSite, loadSiteFromTheme } from '../load'
import { createSiteTestUtils } from './testUtils'

describe('site plugin tests', async () => {
  const testUtils = await createSiteTestUtils()

  await testUtils.init()

  afterAll(() => testUtils.close())

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
        "welcome",
        "example",
        "_p",
        "_archive",
        "_manage",
      ]
    `)

    expect(site?.siteRouter.params.value.viewId).toMatchInlineSnapshot(`"foo"`)
    expect(site?.activePageId.value).toBe('_special404')
    expect(site?.currentPage.value?.title.value).toBe('Not Found')

    await site.siteRouter.push('/example', { caller: ctx.task.name })

    expect(site?.currentPage.value?.slug.value).toBe('example')

    await site.siteRouter.push('/', { caller: ctx.task.name })

    expect(site?.currentPage.value?.slug.value).toBe('welcome')
  })

  it('generates correct paths for site pages and cards', async () => {
    await site.update({ pages: [
      { slug: 'foo', isHome: true, cards: [{ templateId: 'hero' }] },
      { slug: 'blog', cards: [{ templateId: 'testBlog', userConfig: {
        posts: [{ slug: 'first-post' }, { slug: 'second-post' }],
      } }] },
    ] }, { caller: 'pagesTests' })

    const paths = await getSitemapPathsFromSite(site)

    expect(paths).toMatchInlineSnapshot(`
      [
        "/",
        "/blog",
        "/blog/first-post",
        "/blog/second-post",
        "/_p",
        "/_archive",
        "/_manage",
      ]
    `)
    const expectedPaths = [
      '/',
      '/blog',
      '/blog/first-post',
      '/blog/second-post',
      '/_p',
      '/_archive',
      '/_manage',
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
        "/test/_p",
        "/test/_archive",
        "/test/_manage",
      ]
    `)
  })
})
