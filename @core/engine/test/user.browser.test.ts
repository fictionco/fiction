import { expect, it, describe, vi } from "vitest"
import { FullUser } from "@factor/types"
import { decodeClientToken } from "@factor/api/jwt"
import { getEndpointsMap } from "../user"
import * as em from "../email"
let user: Partial<FullUser>
let token: string
const key = Math.random().toString().slice(2, 8)

describe("user tests", () => {
  it("creates user", async () => {
    const spy = vi.spyOn(em, "sendEmail")
    const response = await getEndpointsMap().StartNewUser.request({
      email: `arpowers+${key}@gmail.com`,
      fullName: "test",
    })

    if (!response.data) throw new Error("problem creating user")

    user = response.user
    token = response.token

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
    const response = await getEndpointsMap().VerifyAccountEmail.request({
      email: `arpowers+${key}@gmail.com`,
      verificationCode: "test",
    })

    if (!response.data) {
      console.warn(response)
      throw new Error("problem verifying user")
    }

    user = response.data

    expect(user?.emailVerified).toBeTruthy()
  })
})
