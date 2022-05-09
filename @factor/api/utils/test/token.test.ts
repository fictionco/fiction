/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import { expect, describe, it, beforeAll } from "vitest"
import { createTestUtils, TestUtils } from "../../testUtils"
import { getCookie, getTopDomain } from "../cookie"

let testUtils: TestUtils | undefined = undefined
describe("user token", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
    testUtils.initialized = await testUtils.init()
  })
  it("saves the token in a parent domain cookie", () => {
    testUtils?.factorUser.clientToken({ action: "set", token: "test" })
    const cookieToken = getCookie(testUtils?.factorUser.clientTokenKey ?? "")

    expect(cookieToken).toEqual("test")
    expect(getTopDomain()).toEqual("localhost")
  })

  it("gets token", () => {
    const token = testUtils?.factorUser.clientToken({ action: "get" })
    expect(token).toEqual("test")
  })

  it("removes the token", () => {
    testUtils?.factorUser.clientToken({ action: "destroy" })
    const cookieToken = getCookie(testUtils?.factorUser.clientTokenKey ?? "")

    expect(cookieToken).toBeFalsy()
  })
})
