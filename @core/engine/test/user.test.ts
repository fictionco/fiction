/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect, test, vi } from "vitest"
import { Queries } from "../user"
import { FullUser } from "@factor/types"
import * as ep from "../user"
import bcrypt from "bcrypt"

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
const key = Math.random().toString().slice(2, 8)

test("createUser", async () => {
  const response = await Queries.ManageUser.serve(
    {
      _action: "create",
      fields: { email: `arpowers+${key}@gmail.com`, fullName: "test" },
    },
    undefined,
  )

  if (!response.data) throw new Error("problem creating user")

  user = response.data

  expect(user?.userId).toBeTruthy()
  expect(user?.fullName).toBe("test")
  expect(user?.verificationCode).toBeTruthy()
})

test("verifyAccountEmail", async () => {
  const response = await ep.Queries.VerifyAccountEmail.serve(
    {
      email: user.email,
      verificationCode: user.verificationCode ?? "",
    },
    undefined,
  )

  expect(response.data).toBeTruthy()
  expect(response.status).toBe("success")
  expect(response.message).toBe("verification successful")

  user = response.data as FullUser

  expect(user?.emailVerified).toBeTruthy()
  expect(user?.verificationCode).toBeTruthy()
})

test("setPassword", async () => {
  const response = await ep.Queries.SetPassword.serve(
    {
      email: user.email,
      verificationCode: user.verificationCode ?? "",
      password: "test",
    },
    { bearer: user },
  )
  expect(response.message).toContain("password created")
  user = response.data as FullUser

  expect(bcrypt.compare("test", user?.hashedPassword ?? "")).toBeTruthy()
  expect(user?.token).toMatchSnapshot()
})

test("resetPassword", async () => {
  const response = await ep.Queries.ResetPassword.serve(
    {
      email: user.email,
    },
    undefined,
  )

  expect(response.status).toBe("success")
})
