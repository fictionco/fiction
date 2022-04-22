import { expect, it, describe, vi, beforeAll } from "vitest"
import { handleCrossEnv } from "@factor/api/config"
import { createServer } from "@factor/api/entry/serverEntry"
import { decodeClientToken } from "@factor/api/utils/jwt"
import { getServerUserConfig } from "@factor/api/config/entry"
import { createTestUtils, TestUtils } from "@factor/api/test-utils"

import { FactorEmail } from "@factor/api/plugin-email"
import { FullUser } from "../types"
let user: Partial<FullUser> | undefined
let token: string | undefined
const key = Math.random().toString().slice(2, 8)

let testUtils: TestUtils | undefined = undefined
let factorEmail: FactorEmail | undefined = undefined
describe("user tests", () => {
  beforeAll(async () => {
    handleCrossEnv()
    const mainFile = await import("@factor/site")
    let userConfig = mainFile.setup()
    factorEmail = mainFile.factorEmail
    userConfig = await getServerUserConfig({ userConfig })

    await createServer({ userConfig })
    testUtils = await createTestUtils()
  })
  it("creates user", async () => {
    if (!factorEmail) throw new Error("no email plugin")

    const spy = vi.spyOn(factorEmail, "sendEmail")

    const { factorUser } = testUtils ?? {}
    const response = await factorUser?.requests.StartNewUser.request({
      email: `arpowers+${key}@gmail.com`,
      fullName: "test",
    })

    expect(response?.data).toBeTruthy()

    user = response?.user
    token = response?.token

    expect(spy).toHaveBeenCalled()

    expect(user?.userId).toBeTruthy()
    expect(user?.fullName).toBe("test")
    expect(token).toBeTruthy()
    expect(user?.verificationCode).toBeFalsy()
    expect(user?.emailVerified).toBeFalsy()
    const fields = decodeClientToken(token as string)

    expect(fields).toBeTruthy()
  })

  it("verifies with code", async () => {
    const { factorUser } = testUtils ?? {}
    const response = await factorUser?.requests.VerifyAccountEmail.request({
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
