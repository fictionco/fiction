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
      path: '/app/edit-site',
      actions: [
        { type: 'click', selector: '[data-test-id="createSite"]' },
        { type: 'click', selector: '[data-test-id="step-button-name"]' },
        // Wait for site editor to load
        { type: 'visible', selector: '[data-view-id="edit-site"]' },

        // Test page grid view (all pages visible by default)
        { type: 'visible', selector: '[class*="draggable-page-container"]' },

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
        { type: 'click', selector: '[data-test-id="edit-site-pages-button"]' },
        { type: 'click', selector: '[data-test-id="add-new-page-button"]' },

        // Create new page
        { type: 'fill', selector: '[data-test-id="add-page-title"] input', text: pageTitle },
        { type: 'fill', selector: '[data-test-id="add-page-slug"] input', text: pageSlug, waitAfter: 6000 },
        { type: 'click', selector: '[data-test-id="options-apply"]', wait: 1000, waitAfter: 1000 },

        // Verify page created and navigate to it
        { type: 'visible', selector: `[data-drag-id]:has-text("${pageTitle}")` },
        { type: 'click', selector: `[data-drag-id]:has-text("${pageTitle}")` },

        // Edit page - verify we're in single page edit mode
        { type: 'visible', selector: 'button:has-text("Edit Page:")' },
        { type: 'click', selector: 'button:has-text("Edit Page:")' },

        // Update page SEO settings
        { type: 'fill', selector: '[data-test-id="page-seo-title"] textarea', text: 'Custom SEO Title' },
        { type: 'fill', selector: '[data-test-id="page-seo-description"] textarea', text: 'Custom SEO description for testing' },

        // Set as home page
        { type: 'click', selector: '[data-test-id="set-to-home"] input[type="checkbox"]' },
        { type: 'hasText', selector: 'body', text: 'Set as Home Page' },

        // Go back to page grid view
        { type: 'click', selector: 'button:has-text("Edit / Add Pages")' },
        { type: 'visible', selector: '[class*="draggable-page-container"]' },

        // Verify home page badge on our new page
        { type: 'hasText', selector: `[data-drag-id]:has-text("${pageTitle}")`, text: 'Home' },

        // Test page reordering by checking drag handles
        { type: 'visible', selector: '.i-tabler-grip-vertical' },

        // Add a section to the new page
        { type: 'click', selector: `[data-drag-id]:has-text("${pageTitle}")` },
        { type: 'visible', selector: '[data-test-id="tool-button-sectionsLayout"]', wait: 1000 },
        { type: 'click', selector: '[data-test-id="tool-button-sectionsLayout"]' },
        { type: 'visible', selector: '[data-test-id="add-element-cardFeaturesV1"]' },
        { type: 'click', selector: '[data-test-id="add-element-cardFeaturesV1"]' },
        { type: 'visible', selector: '[data-test-id="layout-card-cardFeaturesV1"]' },

        // Test card editing
        { type: 'click', selector: '[data-test-id="layout-card-cardFeaturesV1"]' },
        { type: 'visible', selector: 'button:has-text("Section Settings")' },

        // Verify device mode switching
        { type: 'click', selector: 'button:has-text("Desktop")' },
        { type: 'click', selector: 'button:has-text("Mobile")' },
        { type: 'visible', selector: 'button:has-text("Mobile")' },

        // Test undo/redo functionality (buttons may be disabled initially)
        { type: 'exists', selector: 'button:has-text("Undo")' },
        { type: 'exists', selector: 'button:has-text("Redo")' },
      ],
    })
  })

  it('manages page navigation and publishing', { timeout: 60_000, retry: isCi() ? 3 : 0 }, async () => {
    await kit.performActions({
      caller: 'sitePageNavigation',
      path: '/app/edit-site?theme=base',
      actions: [
        // Wait for editor
        { type: 'visible', selector: '[data-view-id="edit-site"]' },

        // Test publish button states
        { type: 'visible', selector: '[data-test-id="publishChangesButton"], [data-test-id="changesPublishedButton"]' },

        // Test view site link
        { type: 'visible', selector: '[data-test-id="viewSiteButton"]' },
        { type: 'hasAttribute', selector: '[data-test-id="viewSiteButton"]', attribute: 'target', expectedValue: '_blank' },

        // Verify draft control indicator
        { type: 'visible', selector: '[data-test-id="draft-control-dropdown"]' },

        // Test site settings access
        { type: 'visible', selector: '[data-test-id="tool-button-siteSettings"]', wait: 1000 },
        { type: 'click', selector: '[data-test-id="tool-button-siteSettings"]' },
        { type: 'visible', selector: 'h2:has-text("Settings"), h3:has-text("Settings"), [title*="Settings"]' },
      ],
    })
  })
})
