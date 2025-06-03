import { isCi, shortId } from '@fiction/core'
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

  const currentVerificationCode = async () => {
    const response = await testUtils.fictionUser.queries.ManageUser.serve({
      _action: 'getCreate',
      where: { userId: user.userId || '' },
    }, { server: true, returnAuthority: ['verify'] })

    const userVerificationCode = response.data?.verify?.code

    return userVerificationCode
  }

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

    const userVerificationCode = await currentVerificationCode()

    expect(userVerificationCode, 'Verification code should match email vars').toBe(emailVars.code)
    expect(emailVars.emailResponse?.html.length).toBeGreaterThan(100)
  })

  it('completes full registration and verification flow', async () => {
    const testEmail = `test-${shortId()}@example.com`
    const testPassword = 'SecurePass123'

    await kit.performActions({
      caller: 'registration-flow',
      path: '/auth',
      actions: [
        // Fill the registration form
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: testEmail },

        // Submit registration
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        { type: 'click', selector: '[data-test-id="input-one-time-code"] [data-test-id="digit-1"]' },
        // Enter verification code (using keyboard for one-time-code input)
        {
          type: 'keyboard',
          selector: '[data-test-id="input-one-time-code"] [data-test-id="digit-1"]',
          key: ['1', '2', '3', '4', '5', '6'],
        },

        // Submit verification code
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        // // Set new password
        // { type: 'fill', selector: '[data-test-id="input-new-password"] input', text: testPassword },
        // { type: 'fill', selector: '[data-test-id="input-new-password-confirm"] input', text: testPassword },
        // { type: 'click', selector: '[data-test-id="submit-button"]' },

        // Complete flow
        { type: 'click', selector: '[data-test-id="continue-button"]' },
        { type: 'visible', selector: '[data-pathname="/onboard"]' },
      ],
    })
  })

  it('handles password login flow', async () => {
    await kit.performActions({
      caller: 'password-login-flow',
      path: '/auth',
      actions: [
        // Navigate to password login
        { type: 'click', selector: '[data-test-id="to-login-password"]' },

        // Fill credentials
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: user.email },
        { type: 'fill', selector: '[data-test-id="input-password"] input', text: initialized.password },
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        // Should redirect or show success
        { type: 'visible', selector: '[data-test-id="continue-button"], [data-pathname="/dashboard"]' },
      ],
    })
  })

  it('handles password reset flow', async () => {
    await kit.performActions({
      caller: 'password-reset-flow',
      path: '/auth/welcome',
      actions: [
        // Navigate to password reset
        { type: 'click', selector: '[data-test-id="to-login-password"]' },
        { type: 'click', selector: '[data-test-id="to-reset-password"]' },

        // Request password reset
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: user.email },
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        // Verify we're at the code entry screen
        { type: 'visible', selector: '[data-test-id="input-one-time-code"]' },
      ],
    })

    // Update user to get latest verification code
    const r = await testUtils.fictionUser.queries.ManageUser.serve(
      { _action: 'retrieve', where: { userId: user.userId || '' } },
      { server: true, returnAuthority: ['verify'] },
    )

    user = r.data || user

    const resetResponse = await testUtils.fictionUser.requests.ManageUserEmail.request({
      _action: 'passwordReset',
      email: user.email || '',
      caller: 'password-reset-flow',
    })

    const resetCode = resetResponse.data?.code
    const currentCode = await currentVerificationCode()
    expect(resetCode).toBe(currentCode)

    // Complete password reset
    await kit.performActions({
      caller: 'password-reset-completion',
      path: `/auth/set-new-password?code=${resetCode}&email=${encodeURIComponent(user.email || '')}`,
      actions: [
        // Fill new password
        { type: 'fill', selector: '[data-test-id="input-new-password"] input', text: 'NewSecurePass456' },
        { type: 'fill', selector: '[data-test-id="input-new-password-confirm"] input', text: 'NewSecurePass456' },
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        // Verify success
        { type: 'visible', selector: '[data-test-id="continue-button"]' },
      ],
    })
  })

  it('handles navigation between auth states', async () => {
    await kit.performActions({
      caller: 'auth-navigation',
      path: '/auth',
      actions: [
        // Test navigation links
        { type: 'click', selector: '[data-test-id="to-login-password"]' },
        { type: 'visible', selector: '[data-test-id="input-password"]' },

        { type: 'click', selector: '[data-test-id="to-reset-password"]' },
        { type: 'visible', selector: '[data-test-id="submit-button"]' },

        { type: 'click', selector: '[data-test-id="to-welcome"]' },
        { type: 'visible', selector: '[data-test-id="input-email"]' },
      ],
    })
  })

  it('logs out and redirects to auth page', async () => {
    await kit.performActions({
      caller: 'logout-flow',
      path: '/?_logout=1',
      actions: [
        { type: 'visible', selector: '[data-pathname="/auth"]' },
      ],
    })
  })
})
