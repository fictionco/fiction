import { afterAll, describe, expect, it } from 'vitest'

import { createSiteUiTestingKit } from '@fiction/site/test/testUtils.js'
import { getTools } from '../settings'

describe('settings e2e', async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: false, slowMo: 2000 })

  const testUtils = kit.testUtils

  if (!testUtils)
    throw new Error('missing test utils')

  afterAll(() => kit.close())

  const tools = getTools({ service: testUtils })

  // testUtils.fictionTransactions.settings.fictionEmail.isTest = true

  // const action = testUtils.fictionAdmin.emailActions.verifyEmailAction
  // const actionId = action.settings.actionId

  it('loads up ui associated with action', { timeout: 80000 }, async () => {
    const first = tools[0].slug
    await kit.performActions({
      path: '/app/settings',
      actions: [{ type: 'visible', selector: `[data-settings-tool="${first}"]` }],
    })
  })
})
