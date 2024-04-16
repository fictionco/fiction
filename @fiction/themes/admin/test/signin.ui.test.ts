import { afterAll, describe, it } from 'vitest'
import { createTestBrowser, performActions } from '@fiction/core/test-utils/buildTest'
import { setup } from './clientMainFile'

const headless = true

describe('signin UX', async () => {
  const serviceConfig = await setup({ context: 'node' })

  await serviceConfig.fictionEnv.crossRunCommand({ context: 'node', serviceConfig })

  const port = serviceConfig.testUtils.fictionServer.port.value
  const browser = await createTestBrowser({ headless })

  afterAll(async () => {
    await browser?.close()
    await serviceConfig.testUtils.close()
  })

  it('allows user to register with google account or email', async () => {
    await performActions({
      port,
      browser,
      path: '/app/auth/login',
      actions: [
        { type: 'visible', selector: '[data-test-id="email-login-button"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]' },
        { type: 'exists', selector: '[id="google-signin-button"]' },
      ],
    })
  }, 15_000)

  it('defaults to login page', async () => {
    await performActions({
      port,
      browser,
      path: '/app/auth/does-not-exist',
      actions: [
        { type: 'visible', selector: '[data-test-id="email-login-button"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]' },
        { type: 'exists', selector: '[id="google-signin-button"]' },
      ],
    })
  }, 15_000)

  it('allows toggle between sign up and login', async () => {
    await performActions({
      port,
      browser,
      path: '/app/auth/register',
      actions: [
        { type: 'click', selector: '[data-test-id="to-login"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]', wait: 1000 },
        { type: 'exists', selector: '[id="google-signin-button"]' },
        { type: 'visible', selector: '[data-test-id="email-login-button"]' },
        { type: 'click', selector: '[data-test-id="to-register"]', wait: 1000 },
        { type: 'visible', selector: '[data-test-id="to-login"]' },
      ],
    })
  }, 25_000)

  // it('registers with name, email, password', async () => {
  //   await performActions({
  //     port,
  //     browser,
  //     path: '/app/auth/register',
  //     actions: [
  //       { type: 'type', selector: '[data-test-id="input-email"]', text: 'test@example.com' },
  //       { type: 'click', selector: '[data-test-id="email-signin-button"]', wait: 1000 },
  //       { type: 'visible', selector: '[data-test-id="input-verify"]' },
  //     ],
  //   })
  // }, 15_000)

  // it('has reset password page', async () => {
  //   await performActions({
  //     port,
  //     browser,
  //     path: '/app/auth/reset-password',
  //     actions: [
  //       { type: 'visible', selector: '[data-test-id="reset-password-form"]' },
  //     ],
  //   })
  // })

  // it('allows for password reset', async () => {
  //   await performActions({
  //     port,
  //     browser,
  //     path: '/app/auth/password-reset',
  //     actions: [
  //       { type: 'visible', selector: '[data-test-id="password-reset-form"]' },
  //     ],
  //   })
  // })
})
