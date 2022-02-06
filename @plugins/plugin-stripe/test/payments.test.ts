/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect, it, describe, vi } from "vitest"
import { FullUser } from "@factor/types"
import * as userEngine from "@factor/engine/user"
import * as stripeEngine from "../endpoints"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import Stripe from "stripe"
// vi.mock("../serverEmail", async () => {
//   const actual = (await vi.importActual("../serverEmail")) as Record<
//     string,
//     any
//   >
//   return {
//     ...actual,
//     getEmailSMTPService: vi.fn(() => {
//       return { sendEmail: vi.fn() }
//     }),
//   }
// })

let customer: Stripe.Customer | Stripe.DeletedCustomer | undefined
const key = Math.random().toString().slice(2, 8)

describe("stripe tests", () => {
  it("has .env file", () => {
    const dirname = new URL(".", import.meta.url).pathname
    const p = path.resolve(dirname, "../.env")
    dotenv.config({ path: path.resolve(dirname, "../.env") })

    const exists = fs.existsSync(p)

    expect(exists).toBeTruthy()
  })

  // it("create new user", async () => {
  //   const response = await userEngine.Queries.ManageUser.serve(
  //     {
  //       _action: "create",
  //       fields: { email: `arpowers+${key}@gmail.com`, fullName: "test" },
  //     },
  //     undefined,
  //   )

  //   if (!response.data) throw new Error("problem creating user")

  //   user = response.data

  //   expect(user?.userId).toBeTruthy()
  //   expect(user?.fullName).toBe("test")
  //   expect(user?.verificationCode).toBeTruthy()
  // })

  it("creates a customer for new user", async () => {
    const { status, data } = await stripeEngine.Queries.ManageCustomer.serve(
      {
        customerId: "",
        _action: "retrieve",
      },
      { server: true },
    )

    expect(status).toBe("success")
    expect(data?.id).toBeTruthy()
    customer = data
  })

  it("gets the customer", async () => {
    const { status, data } = await stripeEngine.Queries.ManageCustomer.serve(
      {
        customerId: customer?.id,
        _action: "retrieve",
      },
      { server: true },
    )

    expect(status).toBe("success")
    expect(data?.id).toBeTruthy()
  })

  it("gets the refined customer in requests", async () => {
    const { status, data, customerData, customerId } =
      await stripeEngine.Queries.ManageCustomer.serveRequest(
        {
          customerId: customer?.id,
          _action: "retrieve",
        },
        { server: true },
      )

    expect(status).toBe("success")
    expect(data?.id).toBeTruthy()
    expect(customerId).toBe(data?.id)
    expect(customerData).toBeTruthy()
    expect(Object.keys(customerData ?? {}).length).toMatchSnapshot()
  })
})
