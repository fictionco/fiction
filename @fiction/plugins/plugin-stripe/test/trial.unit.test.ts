import { type EndpointMeta, waitFor } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import { FictionStripe } from '..'
import { mockStripeMethods } from './stripeMocks'

const testPriceId = 'price_1QkaX2GPawBUuSSLEgurp2RW'
const testProductId = 'prod_RdsHJLIxC4dFZH'

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
    products: [{
      productId: testProductId,
      alias: 'standard',
      tier: 10,
      pricing: [{
        priceId: testPriceId,
        duration: 'month',
        cost: 79,
        costPerUnit: 1,
        credits: 1000,
        quantity: 1,
        group: 'standard',
      }],
    }],
  })

  describe('setupTrial action', () => {
    it('creates setup intent successfully for new customer', async () => {
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId,
        email: 'trial-setup@example.com',
        priceId: testPriceId,
        trialType: 'free',
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.clientSecret).toBeDefined()
      expect(result.data?.customerId).toBeDefined()
      expect(result.data?.setupIntentId).toBeDefined()
    })

    it('handles missing orgId gracefully', async () => {
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId: '',
        email: 'trial@example.com',
        priceId: testPriceId,
        trialType: 'free',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toBeDefined()
    })

    it('handles stripe API errors during setup', async () => {
      // Mock a stripe API error
      const originalClient = fictionStripe.getServerClient
      fictionStripe.getServerClient = () => ({
        ...mockStripeMethods,
        setupIntents: {
          create: () => {
            throw new Error('Stripe API Error')
          },
        },
      }) as any

      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId,
        email: 'error@example.com',
        priceId: testPriceId,
        trialType: 'free',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toMatchInlineSnapshot(`"Failed to create customer"`)

      // Restore original client
      fictionStripe.getServerClient = originalClient
    })
  })

  describe('completeSetup action', () => {
    it('completes trial setup successfully', async () => {
      // First create a setup intent
      const setupResponse = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId,
        email: 'complete@example.com',
        priceId: testPriceId,
        trialType: 'free',
      }, { server: true } as EndpointMeta)

      const trialSetupData = setupResponse.data

      const setupIntentId = trialSetupData?.setupIntentId

      if (!setupIntentId) {
        throw new Error('No setupIntentId provided')
      }

      const customerId = trialSetupData.customerId

      if (!customerId) {
        throw new Error('No customerId provided')
      }

      // Create test payment method and attach it
      const stripe = fictionStripe.getServerClient()

      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: { token: 'tok_visa' },
      })

      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      })

      await stripe.setupIntents.update(setupIntentId, {
        payment_method: paymentMethod.id,
      })

      const trialPeriodDays = 30
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'completeSetup',
        ...trialSetupData,
        orgId,
        priceId: testPriceId,
        trialPeriodDays,
      }, { server: true } as EndpointMeta)

      expect(result.message).toMatchInlineSnapshot(`undefined`)
      expect(Object.keys(result.data || {}).sort()).toMatchInlineSnapshot(`
        [
          "customerId",
          "paymentIntentId",
          "priceId",
          "setupIntentId",
          "subscriptionId",
          "trialType",
        ]
      `)

      expect(result.status).toBe('success')
      expect(result.data?.subscriptionId).toBeDefined()
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
      expect(subs.data[0].items.data[0].price.id).toBe(testPriceId)
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
        priceId: testPriceId,
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toBeDefined()
    })

    it('handles subscription creation errors', async () => {
      // First create a setup intent
      const setupResponse = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId,
        email: 'sub-error@example.com',
        priceId: testPriceId,
        trialType: 'free',
      }, { server: true } as EndpointMeta)

      // Mock subscription creation error
      const originalClient = fictionStripe.getServerClient
      fictionStripe.getServerClient = () => ({
        ...mockStripeMethods,
        setupIntents: {
          retrieve: async () => ({
            customer: 'cus_test',
            payment_method: 'pm_test',
          }),
        } as any,
        paymentIntents: {
          confirm: () => ({
            status: 'succeeded',
          }),
        },
        subscriptions: {
          create: () => {
            throw new Error('Subscription Creation Error')
          },
        },
        paymentMethods: {
          attach: async () => ({
            status: 'succeeded',
          }),
        },
      }) as any

      const { setupIntentId, paymentIntentId } = setupResponse.data || {}

      if (!setupIntentId || !paymentIntentId) {
        throw new Error('No ids provided')
      }

      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'completeSetup',
        setupIntentId,
        paymentIntentId,
        orgId,
        priceId: testPriceId,
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toContain('Subscription Creation Error')

      // Restore original client
      fictionStripe.getServerClient = originalClient
    })

    it('verifies trial period and metadata', async () => {
      // First create a setup intent
      const setupResponse = await fictionStripe.queries.StripeTrial.serve({
        _action: 'setupTrial',
        orgId,
        email: 'verify@example.com',
        priceId: testPriceId,
        trialType: 'free',
      }, { server: true } as EndpointMeta)

      const { setupIntentId, paymentIntentId, customerId } = setupResponse.data || {}

      if (!setupIntentId || !paymentIntentId || !customerId) {
        throw new Error('wrong data provided')
      }

      const stripe = fictionStripe.getServerClient()

      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: { token: 'tok_visa' },
      })

      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      })

      await stripe.setupIntents.update(setupIntentId, {
        payment_method: paymentMethod.id,
      })

      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'completeSetup',
        ...setupResponse.data,
        orgId,
        priceId: testPriceId,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.subscriptionId).toBeTruthy()

      const subscriptionId = result.data?.subscriptionId

      if (!subscriptionId) {
        throw new Error('No subscriptionId provided')
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      expect(subscription.metadata.orgId).toBe(orgId)
    })
  })

  describe('error handling', () => {
    it('handles invalid action type', async () => {
      const result = await fictionStripe.queries.StripeTrial.serve({
        _action: 'invalid' as any,
        setupIntentId: 'any',
        orgId,
        priceId: testPriceId,
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toContain('Invalid action')
    })
  })
})
