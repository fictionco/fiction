/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect, test, vi } from "vitest"
import { createUser } from "../user"
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
  user = await createUser({
    email: `arpowers+${key}@gmail.com`,
    fullName: "test",
  })

  expect(user?.userId).toBeTruthy()
  expect(user?.fullName).toBe("test")
  expect(user?.verificationCode).toBeTruthy()
})

test("verifyAccountEmail", async () => {
  const response = await ep.Queries.VerifyAccountEmail.run({
    email: user.email,
    verificationCode: user.verificationCode ?? "",
  })

  expect(response.data).toBeTruthy()
  expect(response.status).toBe("success")
  expect(response.message).toBe("verification successful")

  user = response.data as FullUser

  expect(user?.emailVerified).toBeTruthy()
  expect(user?.verificationCode).toBeTruthy()
})

test("setPassword", async () => {
  const response = await ep.Queries.SetPassword.run(
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
  const response = await ep.Queries.ResetPassword.run({
    email: user.email,
  })

  expect(response.status).toBe("success")
})
