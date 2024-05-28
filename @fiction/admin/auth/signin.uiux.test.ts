import { afterAll, describe, it } from 'vitest'
import { createSiteUiTestingKit } from '@fiction/site/test/siteTestUtils'

const headless = true

describe('signin UX', async () => {
  const kit = await createSiteUiTestingKit({ headless })

  afterAll(() => kit?.close())

  it('allows user to register with google account or email', async () => {
    await kit.performActions({
      path: '/app/auth/login',
      actions: [
        { type: 'visible', selector: '[data-test-id="email-login-button"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]' },
        { type: 'exists', selector: '[id="google-signin-button"]' },
      ],
    })
  })

  it('defaults to login page', async () => {
    await kit.performActions({
      path: '/app/auth/does-not-exist',
      actions: [
        { type: 'visible', selector: '[data-test-id="email-login-button"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]' },
        { type: 'exists', selector: '[id="google-signin-button"]' },
      ],
    })
  })

  it('allows toggle between sign up and login', async () => {
    await kit.performActions({
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
  })
})
