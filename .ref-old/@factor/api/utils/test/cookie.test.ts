/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import Cookies  from "js-cookie"
import {
  expect,
  describe,
  it,
  beforeAll,
} from "../../testUtils"
import {
  setCookie,
  getCookie,
  setCookieWithDomain,
  removeCookieWithDomain,
  getCookieDomain,
} from "../cookie"
describe("cookie", () => {
  beforeAll(async () => {
    // testUtils = await createTestUtils()
    // testUtils.initialized = await testUtils.init()
  })
  it("basic cookie handling", () => {
    const cookieDomain = getCookieDomain()

    expect(location.hostname).toMatchInlineSnapshot('"localhost"')
    expect(cookieDomain).toEqual("localhost")

    setCookie("test", "test", { expires: 14 })

    const cooks = Cookies.get()
    expect(cooks).toMatchInlineSnapshot(`
      {
        "test": "test",
      }
    `)

    const v = getCookie("test")

    expect(v).toMatchInlineSnapshot('"test"')

    setCookieWithDomain("test2", "test2", { expires: 14 })

    expect(getCookie("test2")).toBe("test2")

    removeCookieWithDomain("test2")

    expect(getCookie("test2")).toBe(undefined)

    setCookie("test3", "test3", { expires: 14, domain: "test.com" })

    expect(getCookie("test3")).toBe(undefined)
  })
})
