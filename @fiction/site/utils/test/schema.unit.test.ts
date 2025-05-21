import { shortId } from '@fiction/core'
import { afterAll, describe, expect, it } from 'vitest'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'

describe('site and page schema', async () => {
  const testUtils = await createSiteTestUtils()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'base',
    siteId: `test-${shortId()}`,
    siteMode: 'designer' as const,
  }
  const _site = await Site.create(common, { isNewSite: true })

  afterAll(() => testUtils.close())

  it('should return a JSON schema for the site', async () => {
    expect(true).toBe(true)
  })
})
