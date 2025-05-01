import type { Organization } from '@fiction/core'
import { isCi, pathCheck } from '@fiction/core'
import { OrgSchema as schema } from '@fiction/core/plugin-user/schema'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, expect, it } from 'vitest'

describe('settings e2e', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: false, slowMo: 0 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  it('loads up ui associated with action', { timeout: 80000, retry: isCi() ? 3 : 0 }, async () => {
    await kit.performActions({
      caller: 'settings',
      path: '/app/settings',
      actions: [
        { type: 'click', selector: `[data-test-id="orgName-edit-button"]` },
        { type: 'fill', selector: `[data-option-path="${pathCheck('orgName', schema)}"] input`, text: 'Org Name Test' },
        { type: 'click', selector: `[data-test-id="orgName-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="orgEmail-edit-button"]` },
        { type: 'fill', selector: `[data-option-path="${pathCheck('orgEmail', schema)}"] input`, text: 'billing@example.com' },
        { type: 'click', selector: `[data-test-id="orgEmail-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="orgAvatar-edit-button"]` },
        { type: 'click', selector: `[data-test-id="media-select-button"]` },
        { type: 'click', selector: `[data-test-id="media-tool-media"]` },
        { type: 'fill', selector: `[data-test-id="media-upload-input"] input[type="text"]`, text: 'https://picsum.photos/id/237/200/300' },
        { type: 'click', selector: `[data-test-id="media-apply"]` },
        { type: 'click', selector: `[data-test-id="orgAvatar-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="description-edit-button"]` },
        { type: 'fill', selector: `[data-option-path="${pathCheck('description', schema)}"] input`, text: 'Test Description' },
        { type: 'click', selector: `[data-test-id="description-modal-apply"]` },
        { type: 'click', selector: `[data-test-id="saveButton"]`, waitAfter: 3000 },
        { type: 'dataValue', selector: `[data-form-engine-depth="0"]`, onValue: (value) => {
          const v = value as Organization

          expect(v.orgName).toBe('Org Name Test')
          expect(v.orgEmail).toBe('billing@example.com')
        } },
      ],
    })
  })
})
