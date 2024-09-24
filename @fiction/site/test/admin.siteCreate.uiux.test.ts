import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'

import { afterAll, describe, it } from 'vitest'

describe('settings e2e', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: false, slowMo: 0 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('creates site', { timeout: 80000, retry: 3 }, async () => {
    await kit.performActions({
      caller: 'adminSiteCreating',
      path: '/app/sites',
      actions: [
        { type: 'visible', selector: `[data-view-id="sites"]` },
        { type: 'click', selector: `[data-test-id="createSite"]` },
        { type: 'fill', selector: `[data-test-id="siteName"] input`, text: 'Test Site' },
        { type: 'click', selector: `[data-test-id="createSiteModal"] .xbutton` },
        { type: 'click', selector: `[data-test-id="createSiteModal"] [data-test-index="0"]` },
        { type: 'click', selector: `[data-test-id="createSiteModal"] .xbutton` },
        { type: 'visible', selector: `[data-view-id="edit-site"]` },
      ],
    })
  })
})
