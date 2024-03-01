import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import type Stripe from 'stripe'
import { log, vue } from '@factor/api'
import type { TestUtils } from '@factor/api/test-utils/init'
import { createTestUtils } from '@factor/api/test-utils/init'
import { beforeAll, describe, expect, it } from 'vitest'
import { FactorStripe } from '../plugin'

let customer: Stripe.Customer | Stripe.DeletedCustomer | undefined
let orgId: string | undefined
let setupIntent: Stripe.SetupIntent | undefined
let subscription: Stripe.Subscription | undefined
const key = (): string => Math.random().toString().slice(2, 8)

// const testUtils: TestUtils | undefined = undefined
let testUtils: TestUtils & { factorStripe: FactorStripe }
describe('stripe tests', () => {
  beforeAll(async () => {
    const utils = await createTestUtils()

    const factorStripe = new FactorStripe({
      factorEnv: utils.factorEnv,
      factorApp: utils.factorApp,
      factorServer: utils.factorServer,
      factorRouter: utils.factorRouter,
      factorUser: utils.factorUser,
      factorDb: utils.factorDb,
      publicKeyTest:
        'pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl',
      secretKeyTest: utils.factorEnv.var('STRIPE_SECRET_KEY_TEST'),
      isLive: vue.ref(false),
      hooks: [],
      products: [],
      customerPortalUrl: '#',
    })

    testUtils = { ...utils, factorStripe } as TestUtils & {
      factorStripe: FactorStripe
    }

    orgId = testUtils.factorUser.activeOrgId.value
  })

  it('has stripe test .env file', () => {
    const dirname = new URL('.', import.meta.url).pathname
    const p = path.resolve(dirname, '.env')
    const exists = fs.existsSync(p)

    expect(exists).toBeTruthy()

    if (exists)
      dotenv.config({ path: p })
    else
      log.warn('stripeTests', 'skipping stripe tests config missing')
  })

  it('creates a customer for new user', async () => {
    if (!orgId)
      throw new Error('orgId required')
    const { status, data }
      = await testUtils.factorStripe.queries.ManageCustomer.serve(
        {
          orgId,
          _action: 'retrieve',
        },
        { server: true },
      )

    expect(status).toBe('success')
    expect(data?.id).toBeTruthy()
    customer = data
  })

  it('gets the customer', async () => {
    if (!orgId)
      throw new Error('orgId required')
    const { status, data }
      = await testUtils.factorStripe.queries.ManageCustomer.serve(
        {
          orgId,
          _action: 'retrieve',
        },
        { server: true },
      )

    expect(status).toBe('success')
    expect(data?.id).toBeTruthy()
  })

  it('gets the refined customer in requests', async () => {
    if (!orgId)
      throw new Error('orgId required')
    const { status, data, customerData, customerId }
      = await testUtils.factorStripe.queries.ManageCustomer.serveRequest(
        {
          orgId,
          _action: 'retrieve',
        },
        { server: true },
      )

    expect(status).toBe('success')
    expect(data?.id).toBeTruthy()
    expect(customerId).toBe(data?.id)
    expect(customerData).toBeTruthy()
    expect(Object.keys(customerData ?? {}).length).toMatchInlineSnapshot('2')
  }, 12_000)

  it('adds a payment method', async () => {
    if (!customer?.id)
      throw new Error('customer required')

    const paymentMethod = await testUtils.factorStripe
      .getServerClient()
      .paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 2,
          exp_year: 2023,
          cvc: '314',
        },
      })

    const result
      = await testUtils.factorStripe.queries.ManagePaymentMethod.serve(
        {
          customerId: customer?.id,
          paymentMethodId: paymentMethod.id,
          _action: 'create',
        },
        { server: true },
      )

    expect(result.status).toBe('success')
    expect(result.data?.data.length).toBeGreaterThan(0)
    expect(result.setupIntent).toBeTruthy()
    setupIntent = result.setupIntent
  })

  it('gets payment methods', async () => {
    if (!customer?.id)
      throw new Error('customer required')

    const result
      = await testUtils.factorStripe.queries.ManagePaymentMethod.serve(
        {
          customerId: customer?.id,
          _action: 'retrieve',
        },
        { server: true },
      )

    expect(result.status).toBe('success')
    expect(result.data?.data.length).toBeGreaterThan(0)
  })

  it('set the default payment method', async () => {
    if (!customer?.id)
      throw new Error('customer required')

    const customerData = (await testUtils.factorStripe
      .getServerClient()
      .customers.retrieve(customer.id)) as Stripe.Customer

    expect(customerData).toBeTruthy()
    expect(customerData.invoice_settings.default_payment_method).toBe(
      setupIntent?.payment_method,
    )
  })

  it('gets the coupon', async () => {
    if (!customer?.id)
      throw new Error('customer required')
    if (!subscription?.id)
      throw new Error('subscription required')

    const couponId = `TEST_COUPON_${key()}`

    const coupon = await testUtils.factorStripe
      .getServerClient()
      .coupons.create({
        percent_off: 50,
        id: couponId,
      })

    const result = await testUtils.factorStripe.queries.GetCoupon.serve(
      {
        couponCode: coupon.id,
      },
      { server: true },
    )

    expect(result.status).toBe('success')
    expect(result.data?.id).toContain('TEST_COUPON')
  })

  it('get invoices', async () => {
    if (!customer?.id)
      throw new Error('customer required')
    if (!subscription?.id)
      throw new Error('subscription required')

    const result = await testUtils.factorStripe.queries.GetInvoices.serve(
      {
        customerId: customer.id,
      },
      { server: true },
    )

    expect(result.status).toBe('success')
    expect(result.data?.data.length).toBeGreaterThan(0)
  })
})
