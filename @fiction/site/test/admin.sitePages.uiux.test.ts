import { isCi, shortId } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, it } from 'vitest'

describe('site page management', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: isCi(), slowMo: 0 })
  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('creates, edits, and manages pages', { timeout: 80_000, retry: isCi() ? 3 : 0 }, async () => {
    const pageSlug = `test-page-${shortId()}`
    const pageTitle = `Test Page ${shortId()}`

    await kit.performActions({
      caller: 'sitePageManagement',
      path: '/app/sites',
      actions: [
        { type: 'click', selector: '[data-test-id="createSite"]' },
        { type: 'click', selector: '[data-test-id="step-button-name"]' },
        // Wait for site editor to load
        { type: 'visible', selector: '[data-view-id="edit-site"]' },

        // Test page grid view (all pages visible by default)
        { type: 'visible', selector: '[data-test-id="draggable-page-container"]' },

        // Wait for tools sidebar to load and add a new section
        { type: 'visible', selector: '[data-test-id="tool-button-sectionsLayout"]', wait: 2000 },
        { type: 'click', selector: '[data-test-id="tool-button-sectionsLayout"]' },
        { type: 'visible', selector: '[data-test-id="add-element-cardHeroV1"]' },
        { type: 'click', selector: '[data-test-id="add-element-cardHeroV1"]' },
        {
          type: 'frameInteraction',
          frameSelector: '#site-builder-iframe',
          frameActions: [
            { type: 'visible', selector: '[data-card-template-id="cardHeroV1"]' },
          ],
        },

        // Open page add modal
        { type: 'click', selector: '[data-test-id="tool-button-allPages"]' },
        { type: 'click', selector: '[data-test-id="add-new-page-button"]' },

        // Create new page
        { type: 'fill', selector: '[data-test-id="add-page-title"] input', text: pageTitle },
        { type: 'fill', selector: '[data-test-id="add-page-slug"] input', text: pageSlug },
        { type: 'click', selector: '[data-test-id="options-apply"]', wait: 1000, waitAfter: 1000 },

        // Verify page created and navigate to it
        { type: 'visible', selector: `[data-drag-id]:has-text("${pageTitle}")` },
        { type: 'click', selector: `[data-drag-id]:has-text("${pageTitle}")` },

        // Edit page - verify we're in single page edit mode
        { type: 'click', selector: '[data-test-id="page-settings-button"]' },

        // Update page SEO settings
        { type: 'click', selector: '[data-test-id="group.pageSeo"]' },
        { type: 'fill', selector: '[data-test-id="page-seo-title"] textarea', text: 'Custom SEO Title' },
        { type: 'fill', selector: '[data-test-id="page-seo-description"] textarea', text: 'Custom SEO description for testing' },

        // Set as home page
        { type: 'click', selector: '[data-test-id="group.pageSetup"]' },
        { type: 'click', selector: '[data-test-id="isHome"] button' },

        // Go back to page grid view
        { type: 'click', selector: '[data-test-id="tool-button-allPages"]', waitAfter: 1000 },

        // Verify home page badge on our new page
        { type: 'visible', selector: `[data-test-id="page-home-button-${pageSlug}"]` },

      ],
    })
  })
})
