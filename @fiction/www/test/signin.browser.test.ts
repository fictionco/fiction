import { afterAll, describe, it } from 'vitest'
import { createTestServer, performActions } from '@fiction/core/test-utils/buildTest'
import { commands } from '../src/commands'

const headless = false

describe('signin UX', async () => {
  const browser = await createTestServer({
    moduleName: '@fiction/www',
    headless,
    commands,
    args: {},
  })

  afterAll(async () => {
    await browser?.destroy()
  })

  it('allows user to register with google account or email', async () => {
    await performActions({
      browser,
      path: '/app/auth/login',
      actions: [
        { type: 'visible', selector: '[data-test-id="email-signin-button"]' },
        { type: 'visible', selector: '[data-test-id="to-login-link"]' },
        { type: 'visible', selector: '[data-test-id="google-signin-button"]' },
      ],
    })
  }, 15_000)

  it('allows toggle between sign up and login', async () => {
    await performActions({
      browser,
      path: '/app/auth',
      actions: [
        { type: 'click', selector: '[data-test-id="to-login-link"]' },
        { type: 'visible', selector: '[data-test-id="to-register-link"]', wait: 1000 },
        { type: 'visible', selector: '[data-test-id="google-signin-button"]' },
        { type: 'visible', selector: '[data-test-id="email-signin-button"]' },
        { type: 'click', selector: '[data-test-id="to-register-link"]', wait: 1000 },
        { type: 'visible', selector: '[data-test-id="to-login-link"]' },
      ],
    })
  }, 15_000)

  it('registers with name, email, password', async () => {
    await performActions({
      browser,
      path: '/app/auth/register',
      actions: [
        { type: 'type', selector: '[data-test-id="input-email"]', text: 'test@example.com' },
        { type: 'click', selector: '[data-test-id="email-signin-button"]', wait: 1000 },
        { type: 'visible', selector: '[data-test-id="input-verify"]' },
      ],
    })
  }, 15_000)

  it('has reset password page', async () => {
    await performActions({
      browser,
      path: '/app/auth/reset-password',
      actions: [
        { type: 'visible', selector: '[data-test-id="reset-password-form"]' },
      ],
    })
  })

  it('allows for password reset', async () => {
    await performActions({
      browser,
      path: '/app/auth/password-reset',
      actions: [
        { type: 'visible', selector: '[data-test-id="password-reset-form"]' },
      ],
    })
  })
})
