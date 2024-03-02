/**
 * @vitest-environment happy-dom
 */

import { describe, expect, it } from 'vitest'
import { Site } from '../site'
import { createSiteTestUtils } from './siteTestUtils'

describe('siteMode', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()

  const common = {
    siteRouter: testUtils?.factorRouterSites,
    factorSites: testUtils?.factorSites,
    themeId: 'test',
  } as const

  it('should activable isEditing if set to editable', () => {
    const site = new Site({ ...common, siteMode: 'editable' })
    expect(site.isEditable.value).toBe(true)
  })
})

describe('siteInit', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()

  const common = {
    siteRouter: testUtils?.factorRouterSites,
    factorSites: testUtils?.factorSites,
    themeId: 'test',
  } as const

  it('should initialize the siteRouter', () => {
    const site = new Site({ ...common, siteMode: 'editable' })
    expect(site.siteRouter).toBeDefined()
    expect(site.siteRouter.router.value).toBeDefined()
  })

  it('should initialize the siteRouter with the correct history', () => {
    const site = new Site({ ...common, siteMode: 'editor' })
    expect(site.siteRouter.noBrowserNav).toBeTruthy()
  })
})

describe('siteConfig', async () => {
  const testUtils = await createSiteTestUtils()

  const common = {
    siteRouter: testUtils?.factorRouterSites,
    factorSites: testUtils?.factorSites,
    themeId: 'test',
  } as const

  it('should have correct config', () => {
    const site = new Site({ ...common, siteMode: 'editable' })
    expect(Object.keys(site.toConfig())).to.include.members(['siteId', 'siteMode', 'subDomain', 'customDomains', 'themeId', 'status', 'title', 'userConfig', 'pages'])

    const onlyKeys = ['title', 'themeId', 'userConfig'] as const
    expect(Object.keys(site.toConfig({ onlyKeys }))).to.include.members([...onlyKeys, 'siteId'])
  })
})
