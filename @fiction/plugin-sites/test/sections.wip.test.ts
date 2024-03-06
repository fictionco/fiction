/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { loadSiteFromTheme } from '../load'
import { setSections } from '../utils/site'
import { Card } from '../card'
import type { CardConfigPortable } from '../tables'
import { createSiteTestUtils } from './siteTestUtils'

describe('setSections', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()

  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    parentRouter: testUtils.fictionRouter,
    siteMode: 'standard',
  } as const

  const site = await loadSiteFromTheme({ themeId: 'test', ...common })

  it('prioritizes site settings over template and theme settings', async () => {
    // Mock specific configurations for theme, template, and site settings
    // Ensure that site settings should override template and theme for the same sectionId

    const sections: Record<string, CardConfigPortable> = { header: { templateId: 'header', regionId: 'header', parentId: 'header', userConfig: { foo: 'bar' } } }
    const mergedSections = setSections({ site, sections })

    expect(mergedSections.header.userConfig.value.foo).toBe('bar')
  })
})

describe('section handling defaults', async () => {
  const testUtils = await createSiteTestUtils()

  await testUtils.init()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    parentRouter: testUtils.fictionRouter,
    siteMode: 'standard',
  } as const

  const site = await loadSiteFromTheme({ themeId: 'test', ...common })

  it('creates default sections header, footer', async () => {
    expect(site.currentPage.value.templateId.value).toMatchInlineSnapshot(`"wrap"`)
    expect(Object.keys(site.sections.value)).toMatchInlineSnapshot(`
      [
        "header",
        "footer",
        "test",
      ]
    `)

    await site.siteRouter.push('/example')

    expect(Object.keys(site.sections.value)).toEqual(expect.arrayContaining(['header', 'footer', 'test']))
  })
})
