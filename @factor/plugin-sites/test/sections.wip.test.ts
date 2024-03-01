/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { loadSiteFromTheme } from '../load'
import { activeMergedGlobalSections } from '../utils/site'
import { Card } from '../card'
import { createSiteTestUtils } from './siteTestUtils'

describe('activeMergedGlobalSections', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()

  const common = {
    factorSites: testUtils.factorSites,
    siteRouter: testUtils.factorRouterSites,
    parentRouter: testUtils.factorRouter,
    siteMode: 'standard',
  } as const

  const site = await loadSiteFromTheme({ themeId: 'test', ...common })

  it('prioritizes site settings over template and theme settings', async () => {
    // Mock specific configurations for theme, template, and site settings
    // Ensure that site settings should override template and theme for the same sectionId

    const mergedSections = activeMergedGlobalSections({ site })

    site.sections.value = { header: new Card({ templateId: 'header', site, regionId: 'header', parentId: 'header', userConfig: { foo: 'bar' } }) }

    expect(mergedSections.value.header.userConfig.value.foo).toBe('bar')
  })
})

describe('section handling defaults', async () => {
  const testUtils = await createSiteTestUtils()

  await testUtils.init()
  const common = {
    factorSites: testUtils.factorSites,
    siteRouter: testUtils.factorRouterSites,
    parentRouter: testUtils.factorRouter,
    siteMode: 'standard',
  } as const

  const site = await loadSiteFromTheme({ themeId: 'test', ...common })

  it('creates default sections header, footer', async () => {
    expect(site.currentPage.value.templateId.value).toMatchInlineSnapshot(`"wrap"`)
    expect(Object.keys(site.sections.value)).toMatchInlineSnapshot(`
      [
        "header",
        "footer",
      ]
    `)

    await site.siteRouter.push('/example')

    expect(Object.keys(site.sections.value)).toEqual(expect.arrayContaining(['header', 'footer', 'test']))
  })
})
