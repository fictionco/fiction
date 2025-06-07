import type { EndpointMeta } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionStripe } from '..'

const testPriceLookupKey = 'pro_month'

async function simulateElementsAttachment(args: {
  fictionStripe: FictionStripe
  customerId: string
  paymentIntentId: string
}) {
  const { fictionStripe, customerId, paymentIntentId } = args
  const stripe = fictionStripe.getServerClient()

  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: { token: 'tok_visa' },
  })

  await stripe.paymentMethods.attach(paymentMethod.id, {
    customer: customerId,
  })

  await stripe.paymentIntents.update(paymentIntentId, {
    payment_method: paymentMethod.id,
  })

  await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethod.id,
  })
}

describe('queryStripeTrial', async () => {
  // Set up test utilities and initial state
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const { user, orgId } = initialized

  const userId = user.userId

  if (!userId) {
    throw new Error('No user ID provided')
  }

  // Initialize FictionStripe with test configuration
  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: '#',
    products: [{ key: 'pro', tier: 20 }],
  })

  afterAll(async () => {
    await testUtils.close()
    await fictionStripe.close()
  })

  describe('setupTrial action', () => {
    it('creates setup intent successfully for new customer', async () => {
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId,
        priceLookupKey: testPriceLookupKey,
        trialType: 'free',
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.paymentIntentClientSecret).toBeDefined()
      expect(result.data?.setupIntentClientSecret).toBeDefined()
      expect(result.data?.customerId).toBeDefined()
      expect(result.data?.setupIntentId).toBeDefined()
    })

    it('handles missing orgId gracefully', async () => {
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId: '',
        priceLookupKey: testPriceLookupKey,
        trialType: 'free',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toBeDefined()
    })
  })

  describe('completeSetup action', () => {
    it('completes trial setup successfully', async () => {
      const stripe = fictionStripe.getServerClient()
      // First create a setup intent
      const setupResponse = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId,
        priceLookupKey: testPriceLookupKey,
        trialType: 'free',
      }, { server: true } as EndpointMeta)

      const trialSetupData = setupResponse.data

      const { setupIntentId, paymentIntentId, customerId } = trialSetupData || {}

      if (!setupIntentId || !paymentIntentId || !customerId) {
        throw new Error('No ids provided')
      }

      await simulateElementsAttachment({ fictionStripe, customerId, paymentIntentId })

      const trialPeriodDays = 30
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'completeSetup',
        ...trialSetupData,
        orgId,
        priceLookupKey: testPriceLookupKey,
        trialPeriodDays,
      }, { server: true } as EndpointMeta)

      expect(result.message).toMatchInlineSnapshot(`undefined`)
      expect(Object.keys(result.data || {}).sort()).toMatchInlineSnapshot(`
        [
          "contactId",
          "customerId",
          "paymentIntentId",
          "priceId",
          "setupIntentId",
          "trialType",
        ]
      `)

      expect(result.status).toBe('success')
      expect(result.data?.contactId).toBeDefined()
      expect(result.data?.customerId).toBeDefined()

      if (!result.data?.customerId)
        throw new Error('No customerId provided')

      const subs = await stripe.subscriptions.list({
        customer: result.data.customerId,
      })

      expect(subs.data[0].status).toBe('trialing')
      expect(subs.data[0].trial_end).toBeDefined()
      expect(subs.data[0].metadata.orgId).toBe(orgId)

      // Test subscription items
      expect(subs.data[0].items.data[0].price.lookup_key).toBe(testPriceLookupKey)
      expect(subs.data[0].items.data[0].quantity).toBe(1)

      // Test trial settings
      const trialDuration = subs.data[0].trial_end! - subs.data[0].trial_start!
      expect(Math.floor(trialDuration / (24 * 60 * 60))).toBe(trialPeriodDays)

      // Test payment settings
      expect(subs.data[0].collection_method).toBe('charge_automatically')
      expect(subs.data[0].default_payment_method).toBeTruthy()
    })

    it('handles invalid setup intent ID', async () => {
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'completeSetup',
        setupIntentId: 'invalid_setup_intent',
        orgId,
        priceLookupKey: testPriceLookupKey,
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toBeDefined()
    })

    it('verifies trial period and metadata', async () => {
      const stripe = fictionStripe.getServerClient()
      // First create a setup intent
      const setupResponse = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId,
        priceLookupKey: testPriceLookupKey,
        trialType: 'free',
      }, { server: true } as EndpointMeta)

      expect(setupResponse.status).toBe('success')
      expect(setupResponse.data?.customerId).toBeTruthy()

      const { setupIntentId, paymentIntentId, customerId } = setupResponse.data || {}

      if (!setupIntentId || !paymentIntentId || !customerId) {
        console.warn('No ids provided', setupResponse.data)
        throw new Error('wrong data provided')
      }

      await simulateElementsAttachment({ fictionStripe, customerId, paymentIntentId })

      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'completeSetup',
        ...setupResponse.data,
        orgId,
        priceLookupKey: testPriceLookupKey,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.contactId).toBeTruthy()

      const contactId = result.data?.contactId

      if (!contactId) {
        throw new Error('No contactId provided')
      }

      const subscription = await stripe.subscriptions.retrieve(contactId)

      expect(subscription.metadata.orgId).toBe(orgId)
    })
  })

  describe('error handling', () => {
    it('handles invalid action type', async () => {
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'invalid' as any,
        setupIntentId: 'any',
        orgId,
        priceLookupKey: testPriceLookupKey,
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toContain('Invalid action')
    })
  })
})
