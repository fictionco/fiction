import { isCi, pathCheck } from '@fiction/core'
import { afterAll, describe, it } from 'vitest'
import { TablePostSchema as schema } from '../schema'
import { createPostsUiTestingKit } from './postTestUtils'

describe('postEditing', async () => {
  const kit = await createPostsUiTestingKit({ headless: false, slowMo: 500, initUser: true })

  afterAll(() => kit?.close())

  it('creates post and allows basic editing', { retry: isCi() ? 3 : 0, timeout: 100000 }, async () => {
    await kit.performActions({
      caller: 'postEditing',
      path: '/app',
      actions: [
        { type: 'click', selector: `[data-test-id="dashboard-nav-posts"]` },
        { type: 'click', selector: `[data-test-id="createPostButtonTop"]` },
        { type: 'fill', selector: `[data-test-id="start-post-${pathCheck('title', schema)}"] input`, text: 'Test Post' },
        { type: 'click', selector: `[data-test-id="step-button-${pathCheck('title', schema)}"]` },

        // Test inline title/subtitle editing
        { type: 'click', selector: `[data-test-id="post-editor-title"]` },
        { type: 'fill', selector: `[data-test-id="post-editor-title"]`, text: 'Updated Test Post' },
        { type: 'click', selector: `[data-test-id="post-editor-subTitle"]` },
        { type: 'fill', selector: `[data-test-id="post-editor-subTitle"]`, text: 'Updated subtitle' },

        // Test prose editor content
        { type: 'fill', selector: `[data-test-id="prose-editor-content"] .tiptap`, text: 'Updated post content' },

        // Test media upload with new UI
        { type: 'click', selector: `[data-test-id="featured-post-media"]` },
        { type: 'fill', selector: `[data-test-id="media-upload-input"] input[type="text"]`, text: 'https://picsum.photos/id/237/200/300' },
        { type: 'click', selector: `[data-test-id="options-apply"]` },

        // Test review flow
        { type: 'click', selector: '[data-test-id="tool-button-settings"]' },
        { type: 'click', selector: '[data-test-id="group.email"]' },

        // Test email settings
        { type: 'fill', selector: `[data-option-path="${pathCheck('subject', schema)}"] input`, text: 'Custom Email Subject' },
        { type: 'fill', selector: `[data-option-path="${pathCheck('preview', schema)}"] input`, text: 'Custom Email Preview' },

        // Test web settings
        { type: 'click', selector: '[data-test-id="group.web"]' },
        { type: 'fill', selector: `[data-option-path="${pathCheck('userConfig.standard.title', schema)}"] input`, text: 'Custom SEO Title' },
        { type: 'fill', selector: `[data-option-path="${pathCheck('userConfig.standard.description', schema)}"] input`, text: 'Custom SEO Description' },

        // Test scheduling
        { type: 'click', selector: '[data-test-id="next-button-top"]' },
        { type: 'click', selector: '[data-test-id="schedule-publish-button"]' },
        { type: 'click', selector: '[data-test-id="close-modal"]', waitAfter: 2000 },
      ],
    })
  })
})
