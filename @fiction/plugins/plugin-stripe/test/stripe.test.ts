import type { TestUtils } from '@fiction/core/test-utils/init'
import type Stripe from 'stripe'
import fs from 'node:fs'
import path from 'node:path'
import { log, vue } from '@fiction/core'
import { createTestUtils } from '@fiction/core/test-utils/init'
import dotenv from 'dotenv'
import { beforeAll, describe, expect, it } from 'vitest'
import { FictionStripe } from '../plugin'

let orgId: string | undefined

// const testUtils: TestUtils | undefined = undefined
let testUtils: TestUtils & { fictionStripe: FictionStripe }
describe('stripe tests', () => {
  let _customer: Stripe.Customer | Stripe.DeletedCustomer | undefined
  beforeAll(async () => {
    const utils = createTestUtils()

    const fictionStripe = new FictionStripe({
      fictionEnv: utils.fictionEnv,
      fictionApp: utils.fictionApp,
      fictionServer: utils.fictionServer,
      fictionRouter: utils.fictionRouter,
      fictionUser: utils.fictionUser,
      fictionDb: utils.fictionDb,
      publicKeyTest:
        'pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl',
      secretKeyTest: utils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
      isLive: vue.ref(false),
      products: [],
      customerPortalUrl: '#',
    })

    testUtils = { ...utils, fictionStripe } as TestUtils & {
      fictionStripe: FictionStripe
    }

    orgId = testUtils.fictionUser.activeOrgId.value
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
      = await testUtils.fictionStripe.queries.ManageCustomer.serve(
        {
          orgId,
          _action: 'retrieve',
        },
        { server: true },
      )

    expect(status).toBe('success')
    expect(data?.id).toBeTruthy()
    _customer = data
  })

  it('gets the customer', async () => {
    if (!orgId)
      throw new Error('orgId required')
    const { status, data }
      = await testUtils.fictionStripe.queries.ManageCustomer.serve(
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
      = await testUtils.fictionStripe.queries.ManageCustomer.serveRequest(
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
})
