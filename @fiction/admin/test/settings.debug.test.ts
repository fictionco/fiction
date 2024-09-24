import type { Organization } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { afterAll, describe, expect, it } from 'vitest'
import { getTools } from '../settings'

describe('settings e2e', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: false, slowMo: 0 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(async () => kit.close())

  const tools = getTools({ service: testUtils })

  it('loads up ui associated with action', { timeout: 80000 }, async () => {
    const first = tools[0].slug
    await kit.performActions({
      caller: 'settings',
      path: '/app/settings',
      actions: [
        { type: 'visible', selector: `[data-settings-tool="${first}"]` },
        { type: 'fill', selector: `[data-option-path="orgName"] input`, text: 'Org Name Test' },
        { type: 'fill', selector: `[data-option-path="orgEmail"] input`, text: 'billing@example.com' },
        { type: 'fill', selector: `[data-option-path="avatar"] input[type="text"]`, text: 'https://example.com/image.jpg' },
        { type: 'fill', selector: `[data-option-path="publication.tagline"] input`, text: 'Test Description' },
        { type: 'fill', selector: `[data-option-path="publication.email"] input`, text: 'test@example.com' },
        { type: 'fill', selector: `[data-option-path="publication.sender"] input`, text: 'Alvin the Chipmunk' },
        { type: 'click', selector: `[data-test-id="save"]` },
        { type: 'visible', selector: `[data-settings-tool="${first}"]` },
        { type: 'value', selector: `[data-settings-tool]`, callback: (value) => {
          const v = value as Organization

          expect(v.orgName).toBe('Org Name Test')
          expect(v.orgEmail).toBe('billing@example.com')
          expect(v.publication?.email).toBe('test@example.com')
          expect(v.publication?.sender).toBe('Alvin the Chipmunk')
        } },
      ],
    })
  })
})
