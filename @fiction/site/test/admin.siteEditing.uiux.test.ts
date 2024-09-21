import { shortId } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, it } from 'vitest'

describe('admin site editing', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: false, slowMo: 2000 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('site editing', { timeout: 80000, retry: 3 }, async () => {
    const _initialViewId = 'edit-site'
    const _slugId = shortId()
    await kit.performActions({
      path: `/app`,
      actions: [
        { type: 'visible', selector: `[data-test-id="dashboard-nav-sites"]` },
        // { type: 'click', selector: `[data-test-id="tool-button-editPage"]` },
        // { type: 'click', selector: `[data-test-id="add-new-elements"]` },
        // { type: 'click', selector: `[data-test-id="add-element-hero"]` },
        // { type: 'visible', selector: `[data-test-id="layout-card-hero"]` },
        // { type: 'click', selector: `[data-test-id="tool-button-managePages"]` },
        // { type: 'click', selector: `[data-test-id="addPage"]` },
        // { type: 'fill', selector: `[data-key="title"] input`, text: `New Page ${slugId}` },
        // { type: 'click', selector: `[data-test-id="requestCreateNewPage"]` },
        // { type: 'visible', selector: `[data-test-id="page-new-page-${slugId}"]` },
        // { type: 'click', selector: `[data-test-id="createSite"]` },
        // { type: 'fill', selector: `[data-test-id="siteName"] input`, text: 'Test Site' },
        // { type: 'click', selector: `[data-test-id="createSiteModal"] .xbutton` },
        // { type: 'click', selector: `[data-test-id="createSiteModal"] [data-test-index="0"]` },
        // { type: 'click', selector: `[data-test-id="createSiteModal"] .xbutton` },
        // { type: 'visible', selector: `[data-view-id="edit-site"]` },
      ],
    })
  })
})
