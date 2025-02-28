/* eslint-disable no-irregular-whitespace */
import { isCi, shortId } from '@fiction/core'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { emailActionSnapshot } from '@fiction/plugin-transactions/test/utils'
import { afterAll, describe, expect, it } from 'vitest'
import { setup } from './email.main.js'

describe('authentication flow UI', { retry: isCi() ? 3 : 0 }, async () => {
  const kit = await createUiTestingKit({ headless: false, setup, slowMo: 0 })
  const testUtils = kit.testUtils

  const initialized = await testUtils.initUser()
  let user = initialized.user

  afterAll(async () => kit?.close())

  const magicLinkAction = kit.testUtils?.fictionAdmin.emailActions.magicLoginEmailAction
  const resetPasswordAction = kit.testUtils?.fictionAdmin.emailActions.passwordReset

  if(!user.email)
    throw new Error('missing user')

  const to = user.email


  it('sends magic link email successfully', async () => {
    const browserRequest = await magicLinkAction.requestSend({
      to,
      createUserFields: {},
      queryVars: {},
    })

    const recipient = browserRequest?.data?.recipient
    expect(recipient?.userId, "User ID in magic link recipient should match").toBe(user.userId)

    const r = await magicLinkAction.serveSend({ recipient: user, queryVars: {} }, { server: true })
    const v = JSON.parse(emailActionSnapshot(JSON.stringify(r.emailVars), r.emailVars))

    expect(user.verify?.code, "Verification code should match email vars").toBe(r.emailVars.code)
    expect(v).toMatchSnapshot("Magic link email variables")

    const replaced = r.data?.html || ''
    expect(emailActionSnapshot(replaced, r.emailVars)).toMatchSnapshot("Magic link email HTML content")
  })

  it('navigates to magic link and redirects to dashboard', async () => {
    const magicLinkResponse = await magicLinkAction.serveSend({ recipient: user, queryVars: {} }, { server: true })
    const callbackUrl = magicLinkResponse.emailVars?.callbackUrl

    expect(callbackUrl, "Magic link callback URL should be defined").toBeTruthy()

    await kit.performActions({
      caller: 'magic-link-login',
      path: callbackUrl || '',
      actions: [
        { type: 'visible', selector: '[data-pathname="/"]', wait: 10000 },
      ],
    })
  })

  it('completes full registration and verification flow', async () => {
    const testEmail = `test-${shortId()}@example.com`
    const testPassword = 'SecurePass123'
    const testName = 'Test User'

    await kit.performActions({
      caller: 'registration-flow',
      path: '/auth/welcome',
      actions: [
        // Start by checking the welcome screen
        { type: 'visible', selector: '[data-test-id="google-login-button"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-login"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]' },

        // Navigate to registration
        { type: 'click', selector: '[data-test-id="to-register"]', waitAfter: 1000 },
        { type: 'visible', selector: '[data-test-id="input-email"]' },
        { type: 'visible', selector: '[data-test-id="input-full-name"]' },
        { type: 'visible', selector: '[data-test-id="input-new-password"]' },

        // Fill the registration form
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: testEmail },
        { type: 'fill', selector: '[data-test-id="input-full-name"] input', text: testName },
        { type: 'fill', selector: '[data-test-id="input-new-password"] input', text: testPassword },

        // Verify form values
        {
          type: 'value',
          selector: '[data-test-id="form"]',
          onValue: (v) => {
            expect(v?.email, "Email input should match filled value").toBe(testEmail)
            expect(v?.fullName, "Name input should match filled value").toBe(testName)
            expect(v?.password, "Password input should match filled value").toBe(testPassword)
          }
        },

        // Submit registration
        { type: 'click', selector: '[data-test-id="submit-button-register"]' },

        // Verify we're taken to verification screen
        { type: 'click', selector: '[data-test-id="input-one-time-code"] [data-test-id="digit-1"]'  },

        // Enter verification code
        {
          type: 'keyboard',
          selector: '[data-test-id="input-one-time-code"] [data-test-id="digit-1"]',
          key: ['1', '2', '3', '4', '5', '6'],
        },

        // Submit verification code
        { type: 'click', selector: '[data-test-id="submit-button-verify"]' },

        // Verify success and redirect countdown
        { type: 'visible', selector: '[data-test-id="continue-button"]' },

        // Manually continue to dashboard
        { type: 'click', selector: '[data-test-id="continue-button"]' },
        { type: 'visible', selector: '[data-pathname="/onboard"]'  },
      ],
    })
  })

  it('handles password reset flow correctly', async () => {
    await kit.performActions({
      caller: 'password-reset-flow',
      path: '/auth/welcome',
      actions: [
        // Navigate to password reset
        { type: 'click', selector: '[data-test-id="to-reset-password"]'},
        { type: 'visible', selector: '[data-test-id="input-email"]', wait: 1000 },

        // Fill email for password reset
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: user.email },

        // Submit request
        { type: 'click', selector: '[data-test-id="submit-button-reset"]' },

        // Verify confirmation screen appears
        { type: 'visible', selector: '[data-test-id="back-to-login"]', wait: 1000 },

        // Go back to login
        { type: 'click', selector: '[data-test-id="back-to-login"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-login"]', wait: 1000 },
      ],
    })

    // update user to latest (verify was updated)
    const r = await testUtils.fictionUser.queries.ManageUser.serve({_action: 'retrieve', where: {userId: user.userId || ''}}, { server: true, returnAuthority: ['verify'] })

    user = r.data || user

    // Test the reset password link functionality
    const resetResponse = await resetPasswordAction.serveSend({ recipient: user, queryVars: {} }, { server: true })
    const resetCode = resetResponse.emailVars?.code


    expect(resetCode).toBe(user?.verify?.code)

    expect(resetCode, "Reset password code should be defined").toBeTruthy()


    // Simulate clicking the reset link in email
    await kit.performActions({
      caller: 'password-reset-completion',
      path: `/auth/set-new-password?code=${resetCode}&email=${encodeURIComponent(to)}`,
      actions: [
        { type: 'visible', selector: '[data-test-id="input-new-password"]' },
        { type: 'visible', selector: '[data-test-id="input-new-password-confirm"]' },

        // Fill new password fields
        { type: 'fill', selector: '[data-test-id="input-new-password"] input', text: 'NewSecurePass456' },
        { type: 'fill', selector: '[data-test-id="input-new-password-confirm"] input', text: 'NewSecurePass456' },

        // Submit new password
        { type: 'click', selector: '[data-test-id="submit-button-password-reset"]' },

        // Verify success and redirect countdown
        { type: 'visible', selector: '[data-test-id="continue-button"]', wait: 1000 },
      ],
    })
  })

  it('handles magic link email sign-in flow', async () => {
    await kit.performActions({
      caller: 'magic-link-flow',
      path: '/auth/welcome',
      actions: [
        // Navigate to magic link signin
        { type: 'click', selector: '[data-test-id="to-magic-link"]' },
        { type: 'visible', selector: '[data-test-id="input-email"]', wait: 1000 },

        // Fill email for magic link
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: user.email },

        // Submit request
        { type: 'click', selector: '[data-test-id="submit-button-magic-link"]' },

        // Verify confirmation screen appears
        { type: 'visible', selector: '[data-test-id="back-to-login"]', wait: 5000 },
      ],
    })
  })

  it('verifies navigation between authentication screens', async () => {
    await kit.performActions({
      caller: 'auth-navigation',
      path: '/auth/welcome',
      actions: [
        // Test welcome to register navigation
        { type: 'click', selector: '[data-test-id="to-register"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-register"]' },

        // Test register to welcome navigation
        { type: 'click', selector: '[data-test-id="to-welcome"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-login"]' },

        // Test welcome to magic link navigation
        { type: 'click', selector: '[data-test-id="to-magic-link"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-magic-link"]' },

        // Test magic link to welcome navigation
        { type: 'click', selector: '[data-test-id="to-welcome"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-login"]' },

        // Test welcome to password reset navigation
        { type: 'click', selector: '[data-test-id="to-reset-password"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-reset"]' },

        // Test password reset to welcome navigation
        { type: 'click', selector: '[data-test-id="to-welcome"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-login"]' },
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
