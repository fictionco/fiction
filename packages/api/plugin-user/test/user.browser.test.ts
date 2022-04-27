/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import { expect, it, describe, vi, beforeAll } from "vitest"
import { createTestUtils, TestUtils } from "@factor/api/test-utils"

import { FullUser } from "../types"
let user: Partial<FullUser> | undefined
let token: string | undefined
const key = Math.random().toString().slice(2, 8)

let testUtils: TestUtils | undefined = undefined

describe("user tests", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
  })
  it("creates user", async () => {
    if (!testUtils?.factorEmail) throw new Error("no email plugin")

    const spy = vi.spyOn(testUtils?.factorEmail, "sendEmail")

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
    const fields = testUtils?.factorUser.decodeClientToken(token as string)

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
