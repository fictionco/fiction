import { isCi } from '@fiction/core'
import { createSiteUiTestingKit } from '@fiction/site/test/testUtils'
import { afterAll, describe } from 'vitest'

describe('contact transaction UI flow', { retry: isCi() ? 3 : 0 }, async () => {
  const kit = await createSiteUiTestingKit({ initUser: true, headless: isCi(), slowMo: 0 })

  const testUtils = kit.testUtils
  const initialized = kit.initialized

  if (!initialized) {
    throw new Error('Failed to initialize test user')
  }

  afterAll(async () => kit?.close())

  // Helper to create transaction URLs
  function createTransactionUrl(args: {
    action: string
    targetOrgId?: string
    userId?: string
    email?: string
    token?: string
    code?: string
    redirect?: string
  }) {
    const { action, targetOrgId, userId, email, token, code, redirect } = args
    const params = new URLSearchParams({
      action,
      ...(targetOrgId && { targetOrgId }),
      ...(userId && { userId }),
      ...(email && { email }),
      ...(token && { token }),
      ...(code && { code }),
      ...(redirect && { redirect }),
    })

    return `/m?${params.toString()}`
  }
})
