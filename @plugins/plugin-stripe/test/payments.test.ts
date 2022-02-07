/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect, it, describe } from "vitest"
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
let setupIntent: Stripe.SetupIntent | undefined
// const key = Math.random().toString().slice(2, 8)

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

  it("adds a payment method", async () => {
    if (!customer?.id) throw new Error("customer required")

    const paymentMethod = await stripeEngine.getStripe().paymentMethods.create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 2,
        exp_year: 2023,
        cvc: "314",
      },
    })

    const result = await stripeEngine.Queries.ManagePaymentMethod.serve(
      {
        customerId: customer?.id,
        paymentMethodId: paymentMethod.id,
        _action: "create",
      },
      { server: true },
    )

    expect(result.status).toBe("success")
    expect(result.data?.data.length).toBeGreaterThan(0)
    expect(result.setupIntent).toBeTruthy()
    setupIntent = result.setupIntent
  })

  it("gets payment methods", async () => {
    if (!customer?.id) throw new Error("customer required")

    const result = await stripeEngine.Queries.ManagePaymentMethod.serve(
      {
        customerId: customer?.id,
        _action: "retrieve",
      },
      { server: true },
    )

    expect(result.status).toBe("success")
    expect(result.data?.data.length).toBeGreaterThan(0)
  })

  it("set the default payment method", async () => {
    if (!customer?.id) throw new Error("customer required")

    const customerData = (await stripeEngine
      .getStripe()
      .customers.retrieve(customer.id)) as Stripe.Customer

    expect(customerData).toBeTruthy()
    expect(customerData.invoice_settings.default_payment_method).toBe(
      setupIntent?.payment_method,
    )
  })
})
