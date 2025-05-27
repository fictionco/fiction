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

    const response = await testUtils.fictionUser.queries.ManageUser.serve({
      _action: 'getCreate',
      where: { userId: user.userId || '' },
    }, { server: true, returnAuthority: ['verify'] })

    const userVerificationCode = response.data?.verify?.code

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
        // Start at welcome screen and fill email
        { type: 'fill', selector: '[data-test-id="input-email"]', text: testEmail },
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        // Enter verification code
        { type: 'fill', selector: '[data-test-id="input-one-time-code"]', text: '123456' },
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        // Set new password
        { type: 'fill', selector: '[data-test-id="input-new-password"]', text: testPassword },
        { type: 'fill', selector: '[data-test-id="input-new-password-confirm"]', text: testPassword },
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        // Complete flow
        { type: 'click', selector: '[data-test-id="continue-button"]' },
        { type: 'visible', selector: '[data-pathname="/onboard"]' },
      ],
    })
  })

  it('handles password login flow', async () => {
    await kit.performActions({
      caller: 'password-login-flow',
      path: '/auth/welcome',
      actions: [
        // Navigate to password login
        { type: 'click', selector: '[data-test-id="to-login-password"]' },

        // Fill credentials
        { type: 'fill', selector: '[data-test-id="input-email"]', text: user.email },
        { type: 'fill', selector: '[data-test-id="input-password"]', text: 'testpassword' },
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
        { type: 'fill', selector: '[data-test-id="input-email"]', text: user.email },
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
      email: user.email,
      caller: 'password-reset-flow',
    })

    const resetCode = resetResponse.data?.code
    expect(resetCode).toBe(user?.verify?.code)
    expect(resetCode, 'Reset password code should be defined').toBeTruthy()

    // Complete password reset
    await kit.performActions({
      caller: 'password-reset-completion',
      path: `/auth/set-new-password?code=${resetCode}&email=${encodeURIComponent(user.email)}`,
      actions: [
        // Fill new password
        { type: 'fill', selector: '[data-test-id="input-new-password"]', text: 'NewSecurePass456' },
        { type: 'fill', selector: '[data-test-id="input-new-password-confirm"]', text: 'NewSecurePass456' },
        { type: 'click', selector: '[data-test-id="submit-button"]' },

        // Verify success
        { type: 'visible', selector: '[data-test-id="continue-button"]' },
      ],
    })
  })

  it('handles navigation between auth states', async () => {
    await kit.performActions({
      caller: 'auth-navigation',
      path: '/auth/welcome',
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

  it('validates form inputs correctly', async () => {
    await kit.performActions({
      caller: 'form-validation',
      path: '/auth/welcome',
      actions: [
        // Test empty email submission
        { type: 'click', selector: '[data-test-id="submit-button"]' },
        { type: 'visible', selector: '[data-test-id="form-error"]' },

        // Test invalid email
        { type: 'fill', selector: '[data-test-id="input-email"]', text: 'invalid-email' },
        { type: 'click', selector: '[data-test-id="submit-button"]' },
        { type: 'visible', selector: '[data-test-id="form-error"]' },
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
