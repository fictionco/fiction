import { isCi } from '@fiction/core'
import { describe, it } from 'vitest'
import { createPostsUiTestingKit } from './postTestUtils'

describe('postEditing', async () => {
  it('creates post and allows basic editing', { retry: isCi() ? 3 : 2 }, async () => {
    const kit = await createPostsUiTestingKit({ headless: false, slowMo: 500, initUser: true })

    await kit.performActions({
      caller: 'postEditing',
      path: '/app',
      actions: [
        { type: 'click', selector: '[data-test-id="dashboard-nav-posts"]' },
        { type: 'click', selector: '[data-test-id="createPostButton"]' },
        { type: 'fill', selector: '[data-test-id="postTitleInput"] input', text: 'Test Post' },
        { type: 'click', selector: '[data-test-id="step-button-postTitle"]' },
        { type: 'hasText', selector: '[data-test-id="post-editor-title"]', text: 'Test Post' },
        { type: 'hasValue', selector: '[data-option-path="title"] input', text: 'Test Post' },
        { type: 'fill', selector: '[data-test-id="post-editor-sub-title"]', text: 'hello world' },
        { type: 'hasValue', selector: '[data-option-path="subTitle"] input', text: 'hello world' },
        { type: 'fill', selector: '[data-test-id="prose-editor-content"] .tiptap', text: 'testing' },
      ],
    })

    kit?.close()
  })
})
