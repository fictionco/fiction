import { expect, it, describe, vi, beforeAll } from "vitest"
import * as mainFile from "@factor/site"
import { createServer } from "../../entry/serverEntry"
import { decodeClientToken } from "../../utils/jwt"
import { FullUser } from "../types"

import { getServerUserConfig } from "../../config/entry"
import { createTestUtils, TestUtils } from "../../test-utils"
let user: Partial<FullUser>
let token: string
const key = Math.random().toString().slice(2, 8)

let testUtils: TestUtils | undefined = undefined
describe("user tests", () => {
  beforeAll(async () => {
    let userConfig = mainFile.setup()
    userConfig = await getServerUserConfig({ userConfig })

    await createServer({ userConfig })
    testUtils = await createTestUtils()
  })
  it("creates user", async () => {
    if (!testUtils?.factorEmail) throw new Error("no email plugin")

    const spy = vi.spyOn(mainFile.factorEmail, "sendEmail")

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
  })

  it("returned token decodes", () => {
    const fields = decodeClientToken(token)

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
