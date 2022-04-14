import { expect, it, vi, describe, beforeAll } from "vitest"
import bcrypt from "bcrypt"
import { getTestEmail } from "../../test-utils"
import { FullUser } from "../../types"
import { decodeClientToken } from "../../jwt"
import { setup } from "../../server"
import { Queries } from "../../plugin-user/user"

import * as ep from "../../plugin-user/user"
vi.mock("../serverEmail", async () => {
  const actual = (await vi.importActual("../serverEmail")) as Record<
    string,
    any
  >
  return {
    ...actual,
    getEmailSMTPService: vi.fn(() => {
      return { sendEmail: vi.fn() }
    }),
  }
})

let user: FullUser

describe("user tests", () => {
  beforeAll(async () => {
    await setup({ moduleName: "@factor/site" })
  })
  it("creates user", async () => {
    const response = await Queries.ManageUser.serve(
      {
        _action: "create",
        fields: { email: getTestEmail(), fullName: "test" },
      },
      undefined,
    )

    if (!response.data) throw new Error("problem creating user")

    user = response.data

    expect(user?.userId).toBeTruthy()
    expect(user?.fullName).toBe("test")
    expect(user?.verificationCode).toBeFalsy()
  })

  it("verifies account email", async () => {
    const response = await ep.Queries.VerifyAccountEmail.serve(
      {
        email: user.email,
        verificationCode: "test",
      },
      undefined,
    )

    expect(response.data).toBeTruthy()
    expect(response.status).toBe("success")
    expect(response.message).toBe("verification successful")

    user = response.data as FullUser

    expect(user?.emailVerified).toBeTruthy()
    expect(user?.verificationCode).toBeFalsy()
  })

  it("sets password", async () => {
    const response = await ep.Queries.SetPassword.serve(
      {
        email: user.email,
        verificationCode: "test",
        password: "test",
      },
      { bearer: user },
    )
    expect(response.message).toContain("password created")
    user = response.data as FullUser

    expect(bcrypt.compare("test", user?.hashedPassword ?? "")).toBeTruthy()
    expect(response?.token).toBeTruthy()

    const result = decodeClientToken(response?.token)
    expect(result?.email).toBe(user.email)
  })

  it("logs in with password", async () => {
    const response = await ep.Queries.Login.serve(
      {
        email: user.email,
        password: "test",
      },
      {},
    )
    expect(response.message).toMatchInlineSnapshot('"successfully logged in"')
    user = response.data as FullUser

    expect(user).toBeTruthy()
  })

  it("resets password", async () => {
    if (!user.email) throw new Error("email required")
    const response = await ep.Queries.ResetPassword.serve(
      {
        email: user.email,
      },
      undefined,
    )

    expect(response.status).toBe("success")

    if (!response.internal) throw new Error("code required")

    const response2 = await ep.Queries.SetPassword.serve(
      {
        email: user.email,
        verificationCode: response.internal,
        password: "test",
      },
      { bearer: user },
    )

    expect(response2.status).toBe("success")
  })

  it("updates the user", async () => {
    const response = await ep.Queries.ManageUser.serve(
      {
        _action: "update",
        email: user.email,
        fields: {
          fullName: "testUpdate",
          facebook: "https://www.facebook.com/apowers",
        },
      },
      { bearer: user },
    )

    expect(response.status).toBe("success")
    expect(response.data?.fullName).toBe("testUpdate")
    expect(response.data?.facebook).toBe("https://www.facebook.com/apowers")
  })
})
