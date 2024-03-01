import type { Browser } from 'playwright'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { TestUtils } from '@factor/api/test-utils/init'
import { createTestUtils } from '@factor/api/test-utils/init'
import { FactorAuth } from '..'
let testUtils: TestUtils
// const url = (routeName: CompiledServiceConfig["routes"]): string => {
//   if (!_s?.appUrl) throw new Error("no app url")
//   return `${_s.appUrl}${factorRouter?.link(routeName).value}`
// }

// const page = (): Page => {
//   if (!_s?.page) throw new Error("no app page")
//   return _s?.page ?? ""
// }

// const loadPage = async (
//   routeName: CompiledServiceConfig["routes"],
// ): Promise<Response | null> => {
//   const r = await page().goto(url(routeName), { waitUntil: "networkidle" })
//   await waitFor(200)
//   return r
// }

let _browser: Browser | undefined
// let page: Page | undefined = undefined
describe.skip('auth redirects', () => {
  beforeAll(async () => {
    _browser = await chromium.launch({
      headless: true,
    })
    //  page = await browser?.newPage()

    testUtils = await createTestUtils()

    const factorAuth = new FactorAuth({
      factorEnv: testUtils.factorEnv,
      factorUser: testUtils.factorUser,
      factorRouter: testUtils.factorRouter,
      factorApp: testUtils.factorApp,
      termsUrl: '#',
      privacyUrl: '#',
    })

    testUtils.factorAuth

    testUtils.initialized = await testUtils.init({ factorAuth })

    await testUtils.factorApp.ssrServerCreate()
  })

  afterAll(async () => {
    //   testUtils.close()
    //  await browser?.close()
  })

  it.skip('redirects to login if user is not logged in', async () => {
    //
    // console.log("going to", testUtils.factorApp.appUrl)
    // await page?.goto(testUtils.factorApp.appUrl, { waitUntil: "networkidle" })
    // await page?.goto("https://www.apple.com")

    // console.log("DONE", done)
    // await waitFor(20_000)

    // const html = await page?.innerHTML("body")
    // console.log("page", html)

    expect(1).toBe(1)
  })

  // it("allows user to register with google account or email", async () => {
  //   await loadPage("authRegister")

  //   const emailSigninButton = page().locator("#email-signin-button")
  //   // const c = await page().content()

  //   const emailExists = await emailSigninButton.isVisible()

  //   expect(emailExists).toBe(true)
  // })

  // it("allows user to register with google account or email", async () => {
  //   if (!_s) throw new Error("no test server")

  //   await loadPage("authRegister")
  //   const googleSigninButton = page().locator("[data-test=google-button]")
  //   const emailSigninButton = page().locator("#email-signin-button")
  //   const toLoginPage = page().locator("#to-login")

  //   const emailExists = await emailSigninButton.isVisible()
  //   const toLoginPageExists = await toLoginPage.isVisible()
  //   const googleExists = await googleSigninButton.isVisible()

  //   expect(googleExists).toBe(true)
  //   expect(emailExists).toBe(true)
  //   expect(toLoginPageExists).toBe(true)
  // })
})
