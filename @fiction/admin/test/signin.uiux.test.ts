import { isCi, shortId } from '@fiction/core'
import { emailActionSnapshot } from '@fiction/core/test-utils/email'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { afterAll, describe, expect, it } from 'vitest'
import { setup } from './email.main.js'

describe('authentication flow UI', { retry: isCi() ? 3 : 0 }, async () => {
  const kit = await createUiTestingKit({ headless: false, setup, slowMo: 0 })
  const testUtils = kit.testUtils

  const initialized = await testUtils.initUser()
  let user = initialized.user

  afterAll(async () => kit?.close())

  const email = user.email

  if (!email)
    throw new Error('missing user')

  it('sends one time code email successfully', async () => {
    const browserRequest = await testUtils.fictionUser.requests.ManageUserEmail.request({
      _action: 'oneTimeCode',
      email,
      createUserFields: {},
      queryVars: {},
      caller: 'test-one-time-code-email',
    })
    const emailVars = browserRequest?.data

    if (!emailVars)
      throw new Error('Failed to send otc email')

    const recipient = emailVars?.recipient
    expect(recipient?.userId, 'User ID in magic link recipient should match').toBe(user.userId)

    const v = JSON.parse(emailActionSnapshot(JSON.stringify(emailVars), emailVars))

    expect(user.verify?.code, 'Verification code should match email vars').toBe(emailVars.code)
    expect(emailVars.emailResponse?.html.length).toBeGreaterThan(100)
  })

  it('completes full registration and verification flow', async () => {
    const testEmail = `test-${shortId()}@example.com`
    const testPassword = 'SecurePass123'
    const testName = 'Test User'

    await kit.performActions({
      caller: 'registration-flow',
      path: '/auth/welcome',
      actions: [
        { type: 'visible', selector: '[data-test-id="submit-button-welcome"]' },
        { type: 'visible', selector: '[data-test-id="to-login-password"]' },

        // Navigate to registration
        { type: 'click', selector: '[data-test-id="to-login-password"]', waitAfter: 1000 },
        { type: 'visible', selector: '[data-test-id="input-email"]' },
        { type: 'visible', selector: '[data-test-id="input-password"]' },
        { type: 'click', selector: '[data-test-id="to-welcome"]', waitAfter: 1000 },

        // Fill the registration form
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: testEmail },

        // Verify form values
        {
          type: 'dataValue',
          selector: '[data-test-id="form"]',
          onValue: (v) => {
            expect(v?.email, 'Email input should match filled value').toBe(testEmail)
          },
        },

        // Submit registration
        { type: 'click', selector: '[data-test-id="submit-button-welcome"]' },

        // Verify we're taken to verification screen
        { type: 'click', selector: '[data-test-id="input-one-time-code"] [data-test-id="digit-1"]' },

        // Enter verification code
        {
          type: 'keyboard',
          selector: '[data-test-id="input-one-time-code"] [data-test-id="digit-1"]',
          key: ['1', '2', '3', '4', '5', '6'],
        },

        // Submit verification code
        { type: 'click', selector: '[data-test-id="submit-button-verify"]' },

        { type: 'fill', selector: '[data-test-id="input-new-password"] input', text: 'NewSecurePass456' },
        { type: 'fill', selector: '[data-test-id="input-new-password-confirm"] input', text: 'NewSecurePass456' },

        { type: 'click', selector: '[data-test-id="submit-button-set-new-password"]' },

        // Verify success and redirect countdown
        { type: 'visible', selector: '[data-test-id="continue-button"]' },

        // Manually continue to dashboard
        { type: 'click', selector: '[data-test-id="continue-button"]' },
        { type: 'visible', selector: '[data-pathname="/onboard"]' },
      ],
    })
  })

  it('handles password reset flow correctly', async () => {
    await kit.performActions({
      caller: 'password-reset-flow',
      path: '/auth/welcome',
      actions: [
        // Navigate to password reset
        { type: 'click', selector: '[data-test-id="to-login-password"]' },
        { type: 'click', selector: '[data-test-id="to-reset-password"]' },
        { type: 'visible', selector: '[data-test-id="input-email"]', wait: 1000 },

        // Fill email for password reset
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: user.email },

        // Submit request
        { type: 'click', selector: '[data-test-id="submit-button-reset-password"]' },

        // Go back to login
        { type: 'click', selector: '[data-test-id="to-welcome-try-again"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-welcome"]', wait: 1000 },
      ],
    })

    // update user to latest (verify was updated)
    const r = await testUtils.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId: user.userId || '' } }, { server: true, returnAuthority: ['verify'] })

    user = r.data || user

    const resetResponse = await testUtils.fictionUser.requests.ManageUserEmail.request({
      _action: 'passwordReset',
      email,
      caller: 'password-reset-flow',
    })

    const resetCode = resetResponse.data?.code

    expect(resetCode).toBe(user?.verify?.code)

    expect(resetCode, 'Reset password code should be defined').toBeTruthy()

    // Simulate clicking the reset link in email
    await kit.performActions({
      caller: 'password-reset-completion',
      path: `/auth/set-new-password?code=${resetCode}&email=${encodeURIComponent(email)}`,
      actions: [
        { type: 'visible', selector: '[data-test-id="input-new-password"]' },
        { type: 'visible', selector: '[data-test-id="input-new-password-confirm"]' },

        // Fill new password fields
        { type: 'fill', selector: '[data-test-id="input-new-password"] input', text: 'NewSecurePass456' },
        { type: 'fill', selector: '[data-test-id="input-new-password-confirm"] input', text: 'NewSecurePass456' },

        // Submit new password
        { type: 'click', selector: '[data-test-id="submit-button-set-new-password"]' },

        // Verify success and redirect countdown
        { type: 'visible', selector: '[data-test-id="continue-button"]', wait: 1000 },
      ],
    })
  })

  it('logs out and redirects to auth page', async () => {
    await kit.performActions({
      caller: 'logout-flow',
      path: '/?_logout=1',
      actions: [
        { type: 'visible', selector: '[data-pathname="/auth"]', wait: 5000 },
      ],
    })
  })
})
