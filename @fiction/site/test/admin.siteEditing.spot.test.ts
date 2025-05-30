import { isCi, shortId } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, it } from 'vitest'

describe('site editor content management', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: isCi(), slowMo: 0 })
  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('adds overlay slider, edits content, saves, and deletes', { timeout: 80_000, retry: isCi() ? 3 : 0 }, async () => {
    const testTitle = `Custom Title ${shortId()}`
    const testSubtitle = `Custom Subtitle ${shortId()}`

    await kit.performActions({
      caller: 'overlaySliderEditing',
      path: '/app/sites',
      actions: [
        // Create site and wait for editor to load
        { type: 'click', selector: '[data-test-id="createSite"]' },
        { type: 'click', selector: '[data-test-id="step-button-name"]' },
        { type: 'visible', selector: '[data-view-id="edit-site"]' },

        // Navigate to first page for editing
        { type: 'visible', selector: '[data-test-id="draggable-page-container"]' },
        { type: 'click', selector: '[data-test-id^="page-frame-"]:first-child' },
        { type: 'visible', selector: '#site-builder-iframe' },

        // Add overlay slider element
        { type: 'click', selector: '[data-test-id="tool-button-sectionsLayout"]' },
        { type: 'visible', selector: '[data-test-id="add-element-cardOverlaySliderV1"]' },
        { type: 'click', selector: '[data-test-id="add-element-cardOverlaySliderV1"]' },

        // Verify overlay slider appears in iframe
        {
          type: 'frameInteraction',
          frameSelector: '#site-builder-iframe',
          frameActions: [
            { type: 'visible', selector: '[data-card-template-id="cardOverlaySliderV1"]' },
            { type: 'click', selector: '[data-card-template-id="cardOverlaySliderV1"]' },
          ],
        },

        // Edit overlay slider settings
        { type: 'visible', selector: '[data-test-id="context-tool-cardEdit"]' },

        // Test auto-slide toggle
        { type: 'click', selector: '[data-test-id="group.settings"]' },
        { type: 'click', selector: '[data-option-path="autoSlide"] button', waitAfter: 1000 },

        // Edit slide content
        { type: 'click', selector: '[data-test-id="group.slides"]' },
        { type: 'click', selector: '[data-option-path="items"] [data-handle-index="0"] [data-test-id="handle"]' },

        // Update first slide text
        { type: 'click', selector: '[data-handle-index="0"] [data-drag-handle]' },
        { type: 'fill', selector: '[data-handle-index="0"] [data-option-path="title"] input', text: testTitle },
        { type: 'fill', selector: '[data-handle-index="0"] [data-option-path="subTitle"] input', text: testSubtitle },

        // Verify content updates in iframe
        {
          type: 'frameInteraction',
          frameSelector: '#site-builder-iframe',
          frameActions: [
            { type: 'hasText', selector: '[data-card-template-id="cardOverlaySliderV1"] [data-option-path="items.0.title"]', text: testTitle },
            { type: 'hasText', selector: '[data-card-template-id="cardOverlaySliderV1"] [data-option-path="items.0.subTitle"]', text: testSubtitle },
          ],
        },

        // Test slide navigation
        {
          type: 'frameInteraction',
          frameSelector: '#site-builder-iframe',
          frameActions: [
            { type: 'click', selector: '[data-test-id="nav-dot-1"]' },
            { type: 'visible', selector: '[data-slide-index="1"]' },
            { type: 'click', selector: '[data-test-id="nav-dot-0"]' },
          ],
        },

        // Publish changes
        { type: 'click', selector: '[data-test-id="publishChangesButton"]' },
        { type: 'visible', selector: '[data-test-id="changesPublishedButton"]' },

        // Test element deletion
        {
          type: 'frameInteraction',
          frameSelector: '#site-builder-iframe',
          frameActions: [
            { type: 'click', selector: '[data-card-template-id="cardOverlaySliderV1"]' },
            { type: 'click', selector: '[data-card-template-id="cardOverlaySliderV1"] [data-test-id="card-engine-tool-dropdown"]' },
            { type: 'click', selector: '[data-card-template-id="cardOverlaySliderV1"] [data-test-id="card-engine-tool-dropdown"] [data-test-id="delete"]' },
          ],
        },

      ],
    })
  })
})
