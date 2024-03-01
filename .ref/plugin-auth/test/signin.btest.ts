import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestUtils } from '@factor/api/test-utils/init'
import type {
  TestServerConfig,
} from '@factor/api/test-utils/buildTest'
import {
  createTestServer,
} from '@factor/api/test-utils/buildTest'
import { FactorRouter, randomBetween, waitFor } from '@factor/api'
import type { Page, Response } from 'playwright'
import { getTestEmail } from '../../utils'
import routes from '../routes'

let _s: TestServerConfig | undefined
let factorRouter: FactorRouter | undefined

function url(routeName: string): string {
  if (!_s?.appUrl)
    throw new Error('no app url')
  return `${_s.appUrl}${factorRouter?.link(routeName).value}`
}

function page(): Page {
  if (!_s?.page)
    throw new Error('no app page')
  return _s?.page ?? ''
}

async function loadPage(routeName: string): Promise<Response | null> {
  const r = await page().goto(url(routeName), { waitUntil: 'networkidle' })

  await waitFor(200)
  return r
}

const headless = true

describe('signin UX', () => {
  beforeAll(async () => {
    const testUtils = await createTestUtils()
    factorRouter = new FactorRouter({
      factorEnv: testUtils.factorEnv,
      routes,
      baseUrl: 'https://www.test.com',
    })

    _s = await createTestServer({
      moduleName: '@kaption/app',
      headless,
      args: {
        widgetPort: randomBetween(400, 1000),
        proxyPort: randomBetween(400, 1000),
      },
    })
  }, 15_000)

  afterAll(async () => {
    await _s?.destroy()
  })
  // it("allows user to register with google account or email", async () => {
  //   await loadPage("authRegister")

  //   const emailSigninButton = page().locator("#email-signin-button")
  //   // const c = await page().content()

  //   const emailExists = await emailSigninButton.isVisible()

  //   expect(emailExists).toBe(true)
  // })

  it('allows user to register with google account or email', async () => {
    if (!_s)
      throw new Error('no test server')

    await loadPage('authRegister')

    const emailSigninButton = page().locator('#email-signin-button')
    const toLoginPage = page().locator('#to-login')

    const emailExists = await emailSigninButton.isVisible()
    const toLoginPageExists = await toLoginPage.isVisible()

    expect(emailExists).toBe(true)
    expect(toLoginPageExists).toBe(true)

    /**
     * Google Signin won't work in headless mode.
     * To fix, would need to figure this out
     */
    const googleSigninButton = page().locator('[data-test=google-button]')
    const googleExists = await googleSigninButton.isVisible()
    expect(googleExists).toBe(true)
  }, 15_000)
  it('allows toggle between sign up and login', async () => {
    const toLoginLink = page().locator('#to-login')

    await toLoginLink.click()

    await page().waitForSelector('#to-register')

    expect(page().url()).toBe(url('authLogin'))

    const googleSigninButton = page().locator('#google-signin-button')
    const emailSigninButton = page().locator('#email-signin-button')
    const toRegisterPage = page().locator('#to-register')

    const googleExists = await googleSigninButton.isVisible()
    const emailExists = await emailSigninButton.isVisible()
    const toRegisterPageExists = await toRegisterPage.isVisible()
    expect(googleExists).toBe(true)
    expect(emailExists).toBe(true)
    expect(toRegisterPageExists).toBe(true)

    await toRegisterPage.click()

    await page().waitForSelector('#to-login')

    expect(page().url()).toBe(url('authRegister'))
  }, 15_000)

  it('registers with name, email, password', async () => {
    await page().waitForSelector('#input-email')
    await page().fill('#input-email', getTestEmail())

    const emailSigninButton = page().locator('#email-signin-button')

    const emailSigninButtonExists = await emailSigninButton.isVisible()

    expect(emailSigninButtonExists).toBe(true)

    await emailSigninButton.click()

    await page().waitForSelector('#input-verify')

    expect(page().url()).toContain(url('authVerify'))
  }, 15_000)
  it('has email verification for email sign ups', async () => {
    await page().waitForSelector('#input-verify')
    await page().fill('#input-verify', 'test')
    const verifyButton = page().locator('#verify-button')

    const verifyButtonExists = await verifyButton.isVisible()

    expect(verifyButtonExists).toBe(true)
  }, 15_000)
  it('has reset password page', () => {})
  it('requests a password from new google sign ups', () => {})
  it('allows for password reset', () => {})
  it('redirects users from login/register if they are already logged in', () => {})
})
