import bcrypt from "bcrypt"
import {
  getTestEmail,
  createTestUtils,
  TestUtils,
  expect,
  it,
  describe,
  beforeAll,
} from "@factor/api/testUtils"
import { vi } from "vitest"
import { FullUser } from "../types"

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

let testUtils: undefined | TestUtils = undefined
describe("user tests", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
    await testUtils.factorDb.init()
  })
  it("creates user", async () => {
    const response = await testUtils?.factorUser?.queries.ManageUser.serve(
      {
        _action: "create",
        fields: { email: getTestEmail(), fullName: "test" },
      },
      undefined,
    )

    if (!response?.data) throw new Error("problem creating user")

    user = response?.data

    expect(user?.userId).toBeTruthy()
    expect(user?.fullName).toBe("test")
    expect(user?.verificationCode).toBeFalsy()
  })

  it("verifies account email", async () => {
    const response =
      await testUtils?.factorUser?.queries.VerifyAccountEmail.serve(
        {
          email: user.email,
          verificationCode: "test",
        },
        undefined,
      )

    expect(response?.data).toBeTruthy()
    expect(response?.status).toBe("success")
    expect(response?.message).toBe("verification successful")

    user = response?.data as FullUser

    expect(user?.emailVerified).toBeTruthy()
    expect(user?.verificationCode).toBeFalsy()
  })

  it("sets password", async () => {
    const response = await testUtils?.factorUser?.queries.SetPassword.serve(
      {
        email: user.email,
        verificationCode: "test",
        password: "test",
      },
      { bearer: user },
    )
    expect(response?.message).toContain("password created")
    user = response?.data as FullUser

    expect(bcrypt.compare("test", user?.hashedPassword ?? "")).toBeTruthy()
    expect(response?.token).toBeTruthy()

    const result = testUtils?.factorUser.decodeClientToken(
      response?.token as string,
    )

    expect(result?.email).toBe(user.email)
  })

  it("logs in with password", async () => {
    const response = await testUtils?.factorUser?.queries.Login.serve(
      {
        email: user.email,
        password: "test",
      },
      {},
    )

    expect(response?.token).toBeTruthy()
    expect(response?.message).toContain("success")

    expect(response?.message).toMatchInlineSnapshot('"successfully logged in"')
    user = response?.data as FullUser

    expect(user).toBeTruthy()
  })

  it("resets password", async () => {
    if (!user.email) throw new Error("email required")
    const response = await testUtils?.factorUser?.queries.ResetPassword.serve(
      {
        email: user.email,
      },
      undefined,
    )

    expect(response?.status).toBe("success")

    if (!response?.internal) throw new Error("code required")

    const response2 = await testUtils?.factorUser?.queries.SetPassword.serve(
      {
        email: user.email,
        verificationCode: response?.internal,
        password: "test",
      },
      { bearer: user },
    )

    expect(response2?.status).toBe("success")
  })

  it("updates the user", async () => {
    const response = await testUtils?.factorUser?.queries.ManageUser.serve(
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

    expect(response?.status).toBe("success")
    expect(response?.data?.fullName).toBe("testUpdate")
    expect(response?.data?.facebook).toBe("https://www.facebook.com/apowers")
  })
})
