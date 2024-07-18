/**
 * @vitest-environment happy-dom
 */

import { describe, expect, it } from 'vitest'
import { shortId } from '@fiction/core'
import { Site } from '../site'
import { createSiteTestUtils } from './testUtils'

describe('siteMode', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()

  const common = {
    siteRouter: testUtils?.fictionRouterSites,
    fictionSites: testUtils?.fictionSites,
    themeId: 'test',
  } as const

  it('should activable isEditing if set to editable', async () => {
    const site = await Site.create({ ...common, siteMode: 'editable', siteId: `test-${shortId()}` })
    expect(site.isEditable.value).toBe(true)
  })
})

describe('siteInit', async () => {
  const testUtils = await createSiteTestUtils()
  await testUtils.init()

  const common = {
    siteRouter: testUtils?.fictionRouterSites,
    fictionSites: testUtils?.fictionSites,
    themeId: 'test',
    siteId: `test-${shortId()}`,
  } as const

  it('should initialize the siteRouter', async () => {
    const site = await Site.create({ ...common, siteMode: 'editable' })
    expect(site.siteRouter).toBeDefined()
    expect(site.siteRouter.router.value).toBeDefined()
  })

  it('should initialize the siteRouter with the correct history', async () => {
    const site = await Site.create({ ...common, siteMode: 'designer' })
    expect(site.siteRouter.noBrowserNav).toBeTruthy()
  })
})

describe('siteConfig', async () => {
  const testUtils = await createSiteTestUtils()

  const common = {
    siteRouter: testUtils?.fictionRouterSites,
    fictionSites: testUtils?.fictionSites,
    themeId: 'test',
  } as const

  it('should have correct config', async () => {
    const site = await Site.create({ ...common, siteMode: 'editable', siteId: `test-${shortId()}` })
    expect(Object.keys(site.toConfig())).to.include.members(['siteId', 'siteMode', 'subDomain', 'customDomains', 'themeId', 'status', 'title', 'userConfig', 'pages', 'sections'])

    const onlyKeys = ['title', 'themeId', 'userConfig'] as const
    expect(Object.keys(site.toConfig({ onlyKeys }))).to.include.members([...onlyKeys, 'siteId'])
  })
})
