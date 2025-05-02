import { dayjs, isCi, pathCheck } from '@fiction/core'
import { describe, it } from 'vitest'
import { TablePostSchema as schema } from '../schema'
import { createPostsUiTestingKit } from './postTestUtils'

describe('postEditing', async () => {
  it('creates post and allows basic editing', { retry: isCi() ? 3 : 0, timeout: 100000 }, async () => {
    const kit = await createPostsUiTestingKit({ headless: false, slowMo: 500, initUser: true })

    await kit.performActions({
      caller: 'postEditing',
      path: '/app',
      actions: [
        { type: 'click', selector: `[data-test-id="dashboard-nav-posts"]` },
        { type: 'click', selector: `[data-test-id="createPostButtonTop"]` },
        { type: 'fill', selector: `[data-test-id="start-post-${pathCheck('title', schema)}"] input`, text: 'Test Post' },
        { type: 'click', selector: `[data-test-id="step-button-${pathCheck('title', schema)}"]` },
        { type: 'hasText', selector: `[data-test-id="post-editor-${pathCheck('title', schema)}"]`, text: 'Test Post' },
        { type: 'fill', selector: `[data-test-id="post-editor-${pathCheck('subTitle', schema)}"]`, text: 'hello world' },
        { type: 'fill', selector: `[data-test-id="prose-editor-content"] .tiptap`, text: 'jack and jill' },
        { type: 'click', selector: `[data-test-id="featured-post-media"]` },
        { type: 'click', selector: `[data-test-id="media-modal-media"] [data-test-id="media-upload-input"] input`, text: 'https://picsum.photos/id/237/200/300' },
        { type: 'click', selector: `[data-test-id="media-apply"]` },
        // Test navigating to the audience panel
        { type: 'click', selector: '[data-test-id="next-button-top"]' },
        { type: 'visible', selector: `[data-test-id="audience-panel"]`, wait: 1000 },

        // Test selecting an audience option
        { type: 'click', selector: `[data-test-id="radio-button-nobody"]` },
        { type: 'click', selector: '[data-test-id="next-button-top"]' },

        // test email
        { type: 'hasValue', selector: `[data-option-path="${pathCheck('emailConfig.subject', schema)}"] input`, text: 'Test Post' },
        { type: 'fill', selector: `[data-option-path="${pathCheck('emailConfig.subject', schema)}"] input`, text: 'Custom Email Subject' },
        { type: 'hasValue', selector: `[data-option-path="${pathCheck('emailConfig.preview', schema)}"] input`, text: 'hello world' },
        { type: 'fill', selector: `[data-option-path="${pathCheck('emailConfig.preview', schema)}"] input`, text: 'Custom Email Preview' },

        // test web
        { type: 'click', selector: '[data-test-id="next-button-top"]' },
        { type: 'hasValue', selector: `[data-test-id="web-panel"] [data-option-path="${pathCheck('slug', schema)}"] input`, text: 'test-post' },

        { type: 'fill', selector: `[data-option-path="${pathCheck('userConfig.standard.title', schema)}"] input`, text: 'Custom SEO Title' },
        { type: 'fill', selector: `[data-option-path="${pathCheck('userConfig.standard.description', schema)}"] input`, text: 'Custom SEO Description' },

        { type: 'click', selector: '[data-test-id="next-button-bottom"]' },
        { type: 'click', selector: '[data-test-id="schedule-button-bottom"]' },
        { type: 'click', selector: '[data-test-id="radio-button-schedule"]' },
        { type: 'fill', selector: '[data-test-id="publish-panel"] [data-option-path="publishAt"] input', text: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm') },
        { type: 'click', selector: '[data-test-id="schedule-publish-button"]' },
        { type: 'click', selector: '[data-test-id="close-modal"]', waitAfter: 4000 },
      ],
    })

    kit?.close()
  })
})
