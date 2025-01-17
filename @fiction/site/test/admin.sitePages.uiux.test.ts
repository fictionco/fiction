import { isCi, shortId } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, it } from 'vitest'

describe('admin site pages', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: false, slowMo: 0 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('page and card ui', { timeout: 80000, retry: isCi() ? 3 : 0 }, async () => {
    const initialViewId = 'edit-site'
    const slugId = shortId()
    await kit.performActions({
      caller: 'adminSitePages',
      path: `/app/${initialViewId}?theme=minimal`,
      actions: [
        { type: 'visible', selector: `[data-view-id="${initialViewId}"]` },
        { type: 'click', selector: `[data-test-id="tool-button-editLayout"]` },
        { type: 'click', selector: `[data-test-id="add-element-cardHeroV1"]:first-of-type` },
        { type: 'visible', selector: `[data-test-id="layout-card-cardHeroV1"]` },
        { type: 'click', selector: `[data-test-id="tool-button-managePages"]` },
        { type: 'click', selector: `[data-test-id="addPage"]`, waitAfter: 1000 },
        { type: 'fill', selector: `[data-test-id="add-page-title"] input`, text: `New Page ${slugId}` },
        { type: 'click', selector: `[data-test-id="requestCreateNewPage"] button` },
        { type: 'visible', selector: `[data-test-id="page-new-page-${slugId}"]` },
        { type: 'click', selector: `[data-test-id="tool-button-managePages"]` },
        { type: 'click', selector: `[data-test-id="tool-button-managePages"]` },
        { type: 'click', selector: `[data-test-id="page-new-page-${slugId}"]` },
        { type: 'fill', selector: `[data-test-id="page-seo-title"] input`, text: `test seo title` },
        { type: 'fill', selector: `[data-test-id="page-seo-description"] textarea`, text: `test seo description` },
        { type: 'click', selector: `[data-test-id="set-to-home"]` },
        { type: 'click', selector: `[data-test-id="confirm-modal-confirm"]` },
        { type: 'click', selector: `[data-test-id="current-home"]` },
      ],
    })
  })
})
