import type { Subscriber } from '../schema'
import { isCi } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, expect, it } from 'vitest'

describe('admin audience-subscribe', async () => {
  const kit = await createSiteUiTestingKit({ headless: false, slowMo: 0, initUser: true })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('audience workflow', { timeout: 80000, retry: isCi() ? 3 : 0 }, async () => {
    await kit.performActions({
      caller: 'audience',
      path: '/app',
      actions: [
        { type: 'click', selector: '[data-test-id="dashboard-nav-audience"]' },
        { type: 'hasText', selector: `[data-test-id="subscriber-list-empty-title"]`, text: 'No Subscribers Yet' },
        { type: 'click', selector: '[data-test-id="add-subscribers-button"]' },
        { type: 'fill', selector: `[data-test-id="text-email-list"] textarea`, text: 'test@example.com, example@test.com' },
        { type: 'click', selector: `[data-test-id="save"]` },
        { type: 'click', selector: `[data-test-id="submit"]` },
        { type: 'exists', selector: `[data-list-count="2"]` },
        { type: 'click', selector: `[data-test-id="index-item-0"] a` },
        { type: 'click', selector: `[data-test-id="subscriber-email-edit-button"]` },
        { type: 'fill', selector: `[data-option-path="email"] input`, text: 'testing@testing.com' },
        { type: 'click', selector: `[data-test-id="subscriber-email-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="subscriber-name-edit-button"]` },
        { type: 'fill', selector: `[data-option-path="inlineUser.fullName"] input`, text: 'Test Name' },
        { type: 'click', selector: `[data-test-id="subscriber-name-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="subscriber-status-edit-button"]` },
        { type: 'click', selector: `[data-option-path="status"]` },
        { type: 'click', selector: `[data-option-path="status"] [data-value="pending"]` },
        { type: 'click', selector: `[data-test-id="subscriber-status-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="subscriber-tags-edit-button"]` },
        { type: 'fill', selector: `[data-option-path="tags"] input`, text: 'test 1, test 2' },
        { type: 'click', selector: `[data-option-path="tags"] button` },
        { type: 'click', selector: `[data-test-id="subscriber-tags-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="subscriber-save-button"]`, waitAfter: 3000 },
        { type: 'value', selector: `[data-form-engine-depth="0"]`, onValue: (value) => {
          const v = value as Subscriber

          expect(v.email).toBe('testing@testing.com')
          expect(v.inlineUser?.fullName).toBe('Test Name')
          expect(v.status).toBe('pending')
          expect(v.tags).toContain(['test-1', 'test-2'])
        } },

      ],
    })
  })
})
