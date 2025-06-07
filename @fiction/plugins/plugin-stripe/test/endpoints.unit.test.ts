import type { EndpointMeta } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionStripe } from '..'
import { mockStripeMethods } from './stripeMocks'

const testLookupKey = 'pro_month'
const testPriceId = 'price_1QkaX2GPawBUuSSLEgurp2RW'
const testProductId = 'prod_RdsHJLIxC4dFZH'

describe('queryPortalSession', async () => {
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
    products: [{ key: 'pro', tier: 10 }],
  })

  afterAll(async () => {
    await testUtils.close()
    await fictionStripe.close()
  })

  describe('portal session creation', () => {
    it('creates portal session successfully with valid customer', async () => {
      // First create a test customer
      const customer = await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      // Attempt to create portal session
      const result = await fictionStripe.queries.PortalSession.serve({
        orgId,
        returnUrl: 'http://localhost:3000/return',
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data).toBeDefined()
      expect(result.data?.url).toBeDefined()
      expect(result.data?.customer).toBe(customer.data?.customer?.id)
    })

    it('handles missing orgId gracefully', async () => {
      const result = await fictionStripe.queries.PortalSession.serve({
        orgId: '',
        returnUrl: 'http://localhost:3000/return',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toMatchInlineSnapshot(`"customerId not found"`)
    })

    it('handles non-existent customer gracefully', async () => {
      // Create a fresh organization without a customer
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          name: 'Test No Customer Org',
          email: 'no-customer@test.com',
        },
      }, { server: true })

      const result = await fictionStripe.queries.PortalSession.serve({
        orgId: newOrg.data?.orgId || '',
        returnUrl: 'http://localhost:3000/return',
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result?.customer?.id).toBeTruthy()
    })

    it('creates session with custom return URL', async () => {
      // First create a test customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      const customUrl = 'https://custom-domain.com/return'
      const result = await fictionStripe.queries.PortalSession.serve({
        orgId,
        returnUrl: customUrl,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.return_url).toBe(customUrl)
    })

    it('handles deleted customers appropriately', async () => {
      // Create and then delete a customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'delete',
        orgId,
      }, { server: true } as EndpointMeta)

      const result = await fictionStripe.queries.PortalSession.serve({
        orgId,
        returnUrl: 'http://localhost:3000/return',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('success')
    })

    it('handles stripe API errors gracefully', async () => {
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      // Mock a stripe API error
      const originalClient = fictionStripe.getServerClient
      fictionStripe.getServerClient = () => ({
        ...mockStripeMethods,
        billingPortal: {
          sessions: {
            create: () => {
              throw new Error('Stripe API Error')
            },
          },
        },
      }) as any

      const result = await fictionStripe.queries.PortalSession.serve({
        orgId,
        returnUrl: 'http://localhost:3000/return',
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toContain('Payment API Error')

      // Restore original client
      fictionStripe.getServerClient = originalClient
    })
  })
})

describe('queryCheckoutSession', async () => {
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
    isLive: false,
    products: [{
      tier: 40,
      key: 'pro',
    }],
  })

  afterAll(async () => {
    await testUtils.close()
    await fictionStripe.close()
  })

  describe('checkout session creation', () => {
    it('creates checkout session successfully with valid customer', async () => {
      // First create a test customer
      const customer = await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      // Attempt to create checkout session
      const result = await fictionStripe.queries.CheckoutSession.serve({
        orgId,
        priceLookupKey: testLookupKey,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data).toBeDefined()
      expect(result.data?.client_secret).toBeDefined()
      expect(result.data?.customer).toBe(customer.data?.customer?.id)
      expect(result.data?.mode).toBe('subscription')
      expect(result.data?.ui_mode).toBe('embedded')
    })

    it('handles missing orgId gracefully', async () => {
      const result = await fictionStripe.queries.CheckoutSession.serve({
        orgId: '',
        priceLookupKey: testLookupKey,
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toMatchInlineSnapshot(`"customerId not found"`)
    })

    it('handles non-existent customer gracefully', async () => {
      // Create a fresh organization without a customer
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          name: 'Test No Customer Org',
          email: 'no-customer-checkout@test.com',
        },
      }, { server: true })

      const result = await fictionStripe.queries.CheckoutSession.serve({
        orgId: newOrg.data?.orgId || '',
        priceLookupKey: testLookupKey,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result?.customer?.id).toBeTruthy()
    })

    it('handles stripe API errors gracefully', async () => {
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      // Mock a stripe API error
      const originalClient = fictionStripe.getServerClient
      fictionStripe.getServerClient = () => ({
        ...mockStripeMethods,
        checkout: {
          sessions: {
            create: () => {
              throw new Error('Stripe API Error')
            },
          },
        },
      }) as any

      const result = await fictionStripe.queries.CheckoutSession.serve({
        orgId,
        priceLookupKey: testLookupKey,
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('error')
      expect(result.message).toContain('Payment API Error')

      // Restore original client
      fictionStripe.getServerClient = originalClient
    })

    it('handles deleted customers appropriately', async () => {
      // Create and then delete a customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'delete',
        orgId,
      }, { server: true } as EndpointMeta)

      const result = await fictionStripe.queries.CheckoutSession.serve({
        orgId,
        priceLookupKey: testLookupKey,
      }, { server: true, expectError: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data).toBeDefined()
    })
  })
})

describe('queryManageCustomer', async () => {
  // Set up test utilities and initial state
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const { user, orgId } = initialized

  const userId = user.userId

  if (!userId) {
    throw new Error('No user ID provided')
  }

  // Initialize FictionStripe with mocked Stripe client
  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: '#',
    products: [{
      tier: 40,
      key: 'pro',
    }],
  })

  afterAll(async () => {
    await testUtils.close()
    await fictionStripe.close()
  })

  describe('create action', () => {
    it('creates a new customer successfully', async () => {
      // Create a fresh organization for this test
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          name: 'Test Create Org',
          email: 'test@create.com',
        },
      }, { server: true })

      const orgId = newOrg.data?.orgId

      if (!orgId) {
        throw new Error('No orgId provided')
      }

      const params = {
        _action: 'create' as const,
        orgId,
      }

      const result = await fictionStripe.queries.ManageCustomer.serve(params, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.customer?.email).toBe('test@create.com')
      expect(result.data?.subscriptions).toEqual([])
    })

    it('throws error when orgId is missing', async () => {
      const params = {
        _action: 'create' as const,
        fields: {
          email: 'test@example.com',
          name: 'Test Customer',
        } as any,
        orgId: '',
      }

      const r = await fictionStripe.queries.ManageCustomer.serve(params, { server: true, expectError: true } as EndpointMeta)

      expect(r.status).toBe('error')
      expect(r.message).toMatchInlineSnapshot(`"Payment API Error"`)
    })
  })

  describe('update action', () => {
    it('updates customer details successfully', async () => {
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          name: 'Test Update Org',
          email: 'test@update.com',
        },
      }, { server: true })

      const orgId = newOrg.data?.orgId

      if (!orgId) {
        throw new Error('No orgId provided')
      }

      // First create a customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      // Then update it
      const params = {
        _action: 'update' as const,
        orgId,
        fields: {
          email: 'updated@example.com',
          name: 'Updated Name',
        },
      }

      const result = await fictionStripe.queries.ManageCustomer.serve(params, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.customer).toMatchObject({
        email: 'updated@example.com',
        name: 'Updated Name',
      })

      expect(result.data?.customer?.metadata.orgId).toEqual(orgId)
    })
  })

  describe('retrieve action', () => {
    it('retrieves customer by orgId successfully', async () => {
      const newOrg = await testUtils.fictionUser.queries.ManageOrganization.serve({
        _action: 'create',
        userId,
        fields: {
          name: 'Test Retrieve Org',
          email: 'test@retrieve.com',
        },
      }, { server: true })

      const orgId = newOrg.data?.orgId

      if (!orgId) {
        throw new Error('No orgId provided')
      }

      // First create a customer
      await fictionStripe.queries.ManageCustomer.serve({
        _action: 'create',
        orgId,
      }, { server: true } as EndpointMeta)

      const result = await fictionStripe.queries.ManageCustomer.serve({
        _action: 'retrieve',
        orgId,
      }, { server: true } as EndpointMeta)

      expect(result.status).toBe('success')
      expect(result.data?.customer?.email).toEqual('test@retrieve.com')
      expect(result.data?.customer?.metadata?.orgId).toEqual(orgId)
      expect(result.data?.subscriptions).toEqual([])
    })

    it('handles missing org gracefully', async () => {
      mockStripeMethods.customers.retrieve.mockResolvedValueOnce(undefined)

      const params = {
        _action: 'retrieve' as const,
        orgId: '',
      }

      const r = await fictionStripe.queries.ManageCustomer.serve(params, { server: true, expectError: true } as EndpointMeta)

      expect(r.status).toBe('error')
      expect(r.message).toMatchInlineSnapshot(`"Payment API Error"`)
    })
  })
})
