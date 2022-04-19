import { expect, it, describe, vi, beforeAll } from "vitest"
import { createServer } from "../../entry/serverEntry"
import { decodeClientToken } from "../../jwt"
import { FullUser } from "../types"
import * as em from "../../plugin-email/email"
import { getServerUserConfig } from "../../config/entry"
import { createTestUtils, TestUtils } from "../../test-utils"
let user: Partial<FullUser>
let token: string
const key = Math.random().toString().slice(2, 8)

let testUtils: TestUtils | undefined = undefined
describe("user tests", () => {
  beforeAll(async () => {
    const userConfig = await getServerUserConfig({ moduleName: "@factor/site" })
    await createServer({ userConfig })
    testUtils = await createTestUtils()
  })
  it("creates user", async () => {
    const spy = vi.spyOn(em, "sendEmail")
    const { userPlugin } = testUtils ?? {}
    const response = await userPlugin?.requests.StartNewUser.request({
      email: `arpowers+${key}@gmail.com`,
      fullName: "test",
    })

    if (!response?.data) throw new Error("problem creating user")

    user = response?.user
    token = response?.token

    expect(spy).toHaveBeenCalled()

    expect(user?.userId).toBeTruthy()
    expect(user?.fullName).toBe("test")
    expect(token).toBeTruthy()
    expect(user?.verificationCode).toBeFalsy()
    expect(user?.emailVerified).toBeFalsy()
  })

  it("returned token decodes", () => {
    const fields = decodeClientToken(token)

    expect(fields).toBeTruthy()
  })

  it("verifies with code", async () => {
    const { userPlugin } = testUtils ?? {}
    const response = await userPlugin?.requests.VerifyAccountEmail.request({
      email: `arpowers+${key}@gmail.com`,
      verificationCode: "test",
    })

    if (!response?.data) {
      console.warn(response)
      throw new Error("problem verifying user")
    }

    user = response.data

    expect(user?.emailVerified).toBeTruthy()
  })
})
