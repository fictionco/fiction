import type { Organization } from '@fiction/core'
import { isCi } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, expect, it } from 'vitest'

describe('admin audience-subscribe', async () => {
  const kit = await createSiteUiTestingKit({ headless: false, slowMo: 3000, initUser: true })

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
        // { type: 'click', selector: `[data-test-id="orgEmail-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="orgAvatar-edit-button"]` },
        // { type: 'click', selector: `[data-test-id="media-select-button"]` },
        // { type: 'click', selector: `[data-test-id="nav-upload"]` },
        // { type: 'fill', selector: `[data-test-id="library-modal"] input[type="text"]`, text: 'https://picsum.photos/id/237/200/300' },
        // { type: 'click', selector: `[data-test-id="library-apply-changes"]` },
        // { type: 'click', selector: `[data-test-id="orgAvatar-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="pubTagline-edit-button"]` },
        // { type: 'fill', selector: `[data-option-path="publication.tagline"] input`, text: 'Test Description' },
        // { type: 'click', selector: `[data-test-id="pubTagline-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="pubEmail-edit-button"]` },
        // { type: 'fill', selector: `[data-option-path="publication.email"] input`, text: 'test@example.com' },
        // { type: 'click', selector: `[data-test-id="pubEmail-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="legal-edit-button"]` },
        // { type: 'fill', selector: `[data-option-path="legal.termsUrl"] input`, text: 'https://www.test.com/url' },
        // { type: 'click', selector: `[data-test-id="legal-modal-apply"]` },
        // { type: 'click', selector: `[data-test-id="saveButton"]`, waitAfter: 3000 },
        // { type: 'value', selector: `[data-form-engine-depth="0"]`, onValue: (value) => {
        //   const v = value as Organization

        //   expect(v.orgName).toBe('Org Name Test')
        //   expect(v.orgEmail).toBe('billing@example.com')
        //   expect(v.publication?.email).toBe('test@example.com')
        //   expect(v.publication?.sender).toBe('Alvin the Chipmunk')
        // } },
      ],
    })
  })
})
