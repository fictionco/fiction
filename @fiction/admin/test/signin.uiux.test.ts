import { afterAll, describe, expect, it } from 'vitest'
import fs from 'fs-extra'
import { testEnvFile } from '@fiction/core/test-utils'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { emailActionSnapshot } from '@fiction/plugin-email-actions/test/utils'
import { setup } from './email.main.js'

describe('signin UX', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const kit = await createUiTestingKit({ headless: false, envFiles: [testEnvFile], setup, slowMo: 0 })
  const testUtils = kit.testUtils

  const initialized = await testUtils.initUser()

  const user = initialized.user

  afterAll(() => kit?.close())

  const action = kit.testUtils?.fictionAdmin.emailActions.magicLoginEmailAction
  const actionId = action.settings.actionId

  it('sends email', async () => {
    if (!user.email)
      throw new Error('missing email')

    const r = await action.requestSend({ to: user.email, fields: {} })

    const isSent = r?.data?.isSent

    expect(isSent).toBe(true)
    // expect(emailActionSnapshot(replaced, action.emailVars)).toMatchInlineSnapshot()
  })

  it('allows user to register with google account or email', async () => {
    await kit.performActions({
      path: '/auth/login',
      actions: [
        { type: 'visible', selector: '[data-test-id="email-login-button"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]' },
        // { type: 'exists', selector: '[id="google-signin-button"]' },
      ],
    })
  })

  it('defaults to login page', async () => {
    await kit.performActions({
      path: '/auth/does-not-exist',
      actions: [
        { type: 'visible', selector: '[data-test-id="email-login-button"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]' },
        // { type: 'exists', selector: '[id="google-signin-button"]' },
      ],
    })
  })

  it('allows toggle between sign up and login', async () => {
    await kit.performActions({
      path: '/auth/register',
      actions: [
        { type: 'click', selector: '[data-test-id="to-login"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]', wait: 1000 },
        //   { type: 'exists', selector: '[id="google-signin-button"]' },
        { type: 'visible', selector: '[data-test-id="email-login-button"]' },
        { type: 'click', selector: '[data-test-id="to-register"]', wait: 1000 },
        { type: 'visible', selector: '[data-test-id="to-login"]' },
      ],
    })
  })
})
