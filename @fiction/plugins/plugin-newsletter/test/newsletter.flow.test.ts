import { dayjs, isCi } from '@fiction/core'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { afterAll, describe, expect, it } from 'vitest'
import { setup } from './kit.main.js'

describe('admin:newsletter', async () => {
  const kit = await createUiTestingKit({ headless: false, setup, slowMo: 500, initUser: true })
  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('newsletter workflow', { timeout: 80000, retry: isCi() ? 3 : 0 }, async () => {
    await kit.performActions({
      caller: 'kitNewsletter',
      path: '/app',
      actions: [
        { type: 'click', selector: '[data-test-id="dashboard-nav-newsletter"]' },
        { type: 'hasText', selector: `[data-test-id="newsletter-zero-title"]`, text: 'Your Newsletter' },
        { type: 'click', selector: `[data-test-id="new-email-button-zero"]` },
        { type: 'fill', selector: `[data-test-id="email-title-input"] input`, text: 'Test Email' },
        { type: 'click', selector: `[data-test-id="step-button-emailTitle"]` },
        { type: 'click', selector: `[data-test-id="email-schedule-edit-button"]` },
        { type: 'click', selector: `[data-option-path="scheduleMode"] [data-input-type="select"]` },
        { type: 'click', selector: `[data-option-path="scheduleMode"] [data-value="schedule"]` },
        { type: 'fill', selector: `[data-option-path="scheduledAt"] input`, text: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm') },
        { type: 'click', selector: `[data-test-id="email-schedule-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="email-subject-line-edit-button"]` },
        { type: 'fill', selector: `[data-option-path="subject"] input`, text: 'Test Subject' },
        { type: 'click', selector: `[data-test-id="email-subject-line-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="email-preview-text-edit-button"]` },
        { type: 'fill', selector: `[data-option-path="preview"] input`, text: 'Test Preview Text' },
        { type: 'click', selector: `[data-test-id="email-preview-text-modal-apply"]` },
        { type: 'click', selector: '[data-test-id="email-composer-link"]' },
        { type: 'hasValue', selector: '[data-option-path="subject"] input', text: 'Test Subject' },
        { type: 'hasValue', selector: '[data-option-path="preview"] input', text: 'Test Preview Text' },
        { type: 'fill', selector: '[data-test-id="post-editor-title"]', text: 'Test Content Title' },
        { type: 'fill', selector: '[data-test-id="post-editor-sub-title"]', text: 'Test Content Subtitle' },
        { type: 'hasValue', selector: '[data-option-path="post.title"] input', text: 'Test Content Title' },
        { type: 'hasValue', selector: '[data-option-path="post.subTitle"] input', text: 'Test Content Subtitle' },
        { type: 'fill', selector: '[data-test-id="prose-editor-content"] .tiptap', text: 'welcome to the jungle' },
        { type: 'click', selector: '[data-option-path="userConfig.actions"] button' },
        { type: 'click', selector: '[data-option-path="userConfig.actions"] [data-option-path="theme"] [data-input-type="select"]' },
        { type: 'click', selector: '[data-option-path="userConfig.actions"] [data-index="0"]' },
        { type: 'exists', selector: '[data-test-id="editor-actions"] button' },
        { type: 'click', selector: '[data-test-id="review-send-button"]' },
        { type: 'hasText', selector: '[data-test-id="email-subject-line-display-value"]', text: 'Test Subject' },
        { type: 'hasText', selector: '[data-test-id="email-preview-text-display-value"]', text: 'Test Preview Text' },
        // { type: 'click', selector: '[data-test-id="add-subscribers-button"]' },
        // { type: 'fill', selector: `[data-test-id="text-email-list"] textarea`, text: 'test@example.com, example@test.com' },
        // { type: 'click', selector: `[data-test-id="save"]` },
        // { type: 'click', selector: `[data-test-id="submit"]` },
        // { type: 'exists', selector: `[data-list-count="2"]` },
        // { type: 'click', selector: `[data-test-id="index-item-0"] a` },
        // { type: 'click', selector: `[data-test-id="subscriber-email-edit-button"]` },
        // { type: 'fill', selector: `[data-option-path="email"] input`, text: 'testing@testing.com' },
        // { type: 'click', selector: `[data-test-id="subscriber-email-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="subscriber-name-edit-button"]` },
        // { type: 'fill', selector: `[data-option-path="inlineUser.fullName"] input`, text: 'Test Name' },
        // { type: 'click', selector: `[data-test-id="subscriber-name-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="subscriber-status-edit-button"]` },
        // { type: 'click', selector: `[data-option-path="status"]` },
        // { type: 'click', selector: `[data-option-path="status"] [data-value="pending"]` },
        // { type: 'click', selector: `[data-test-id="subscriber-status-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="subscriber-tags-edit-button"]` },
        // { type: 'fill', selector: `[data-option-path="tags"] input`, text: 'test 1, test 2' },
        // { type: 'click', selector: `[data-option-path="tags"] button` },
        // { type: 'click', selector: `[data-test-id="subscriber-tags-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="subscriber-save-button"]`, waitAfter: 3000 },
        // { type: 'value', selector: `[data-form-engine-depth="0"]`, onValue: (value) => {
        //   const v = value as EmailCampaignConfig
        // } },

      ],
    })
  })
})
