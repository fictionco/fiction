/**
 * @vitest-environment happy-dom
 */
import { shortId } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { Site } from '../../site'
import { createSiteTestUtils } from '../../test/testUtils'
import { siteToJsonSchema } from '../schema'

describe('site and page schema', async () => {
  const testUtils = await createSiteTestUtils()
  const common = {
    fictionSites: testUtils.fictionSites,
    siteRouter: testUtils.fictionRouterSites,
    themeId: 'minimal',
    siteId: `test-${shortId()}`,
    siteMode: 'designer' as const,
  }
  const site = await Site.create(common, { loadThemePages: true })

  it('should return a JSON schema for the site', async () => {
    const schema = await siteToJsonSchema({ site, aiOptionsOnly: true })

    expect(schema).toMatchSnapshot()
  })
})
