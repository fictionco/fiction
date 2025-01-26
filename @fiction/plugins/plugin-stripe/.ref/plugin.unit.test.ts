/**
 * @vitest-environment happy-dom
 */

import type Stripe from 'stripe'
import type { CustomerDetails } from '../__types'

import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FictionStripe } from '..'

describe('fictionStripe Customer Initialization', async () => {
  // Create test utils first
  const testUtils = await createSiteTestUtils()

  // Initialize FictionStripe before testUtils initialization
  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: '#',
    products: [{
      productId: 'prod_test',
      alias: 'standard',
      tier: 10,
      pricing: [{
        priceId: 'price_test',
        duration: 'month',
        cost: 10,
        costPerUnit: 10,
        credits: 1000,
        quantity: 1,
        group: 'standard',
      }],
    }],
  })

  // Initialize test utils after FictionStripe creation
  const initialized = await testUtils.init()
  const { orgId } = initialized

  beforeEach(() => {
    // Reset state and mocks before each test
    fictionStripe.activeCustomer.value = undefined
    // @ts-expect-error: Accessing private property for testing
    fictionStripe.initPromise = undefined
    // @ts-expect-error: Accessing private property for testing
    fictionStripe.initializationError = undefined
    // Clear any existing watchers
    if (fictionStripe.closeWatcher) {
      fictionStripe.closeWatcher()
      fictionStripe.closeWatcher = undefined
    }
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  describe('constructor validation', () => {
    it('throws error when customerPortalUrl is missing', () => {
      expect(() => new FictionStripe({
        ...testUtils,
        customerPortalUrl: '',
        products: [],
      })).toThrow('Customer portal URL is required')
    })

    it('throws error when products array is empty', () => {
      expect(() => new FictionStripe({
        ...testUtils,
        customerPortalUrl: '#',
        products: [],
      })).toThrow('At least one product configuration is required')
    })
  })

  describe('customerInitialized', () => {
    it('returns undefined when no window object exists', async () => {
      // Mock absence of window object
      const originalWindow = globalThis.window
      // @ts-expect-error: Intentionally removing window
      delete globalThis.window

      const result = await fictionStripe.customerInitialized({ caller: 'test' })

      expect(result).toBeUndefined()

      // Restore window object
      globalThis.window = originalWindow
    })

    it('initializes customer data successfully', async () => {
      const mockCustomerDetails: CustomerDetails = {
        customerId: 'cus_test',
        plan: 'free',
        planName: 'Free',
        tier: 0,
        isTrial: false,
        quantity: 0,
        credits: 0,
        cycleStartAtIso: '2024-01-01T00:00:00Z',
        cycleEndAtIso: '2024-02-01T00:00:00Z',
      } as CustomerDetails

      // Mock getCurrentCustomerDetails
      vi.spyOn(fictionStripe.queries.ManageCustomer, 'serve').mockResolvedValue({
        status: 'success',
        data: {
          customer: { id: mockCustomerDetails.customerId as string } as Stripe.Customer & { deleted?: boolean },
          org: { orgId },
        },
      })

      const result = await fictionStripe.customerInitialized({ caller: 'test' })

      expect(result).toBeDefined()
      expect(fictionStripe.activeCustomer.value).toBeDefined()
      expect(fictionStripe.activeCustomer.value?.plan).toBe(mockCustomerDetails.plan)
      expect(fictionStripe.activeCustomer.value?.customerId).toBe(mockCustomerDetails.customerId)
    })

    it('reuses existing initialization promise for concurrent calls', async () => {
      const initSpy = vi.spyOn(fictionStripe, 'requestSetCustomerData')

      // Make concurrent calls to customerInitialized
      const [result1, result2] = await Promise.all([
        fictionStripe.customerInitialized({ caller: 'test1' }),
        fictionStripe.customerInitialized({ caller: 'test2' }),
      ])

      // Verify requestSetCustomerData was only called once
      expect(initSpy).toHaveBeenCalledTimes(1)
      expect(result1).toBe(result2)
    })

    it('allows retry after initialization failure', async () => {
      const mockDetails: CustomerDetails = {
        customerId: 'cus_retry',
        plan: 'free',
        planName: 'Free',
        tier: 0,
        isTrial: false,
        quantity: 0,
        credits: 0,
        cycleStartAtIso: '2024-01-01T00:00:00Z',
        cycleEndAtIso: '2024-02-01T00:00:00Z',
      } as CustomerDetails

      // Mock the ManageCustomer query to fail once then succeed
      vi.spyOn(fictionStripe.queries.ManageCustomer, 'serve')
        .mockResolvedValueOnce({ status: 'error', message: 'First attempt fails' })
        .mockResolvedValueOnce({
          status: 'success',
          data: {
            customer: { id: mockDetails.customerId } as Stripe.Customer & { deleted?: boolean },
            org: { orgId },
          },
        })

      await fictionStripe.customerInitialized({ caller: 'test' })

      expect(fictionStripe.activeCustomer.value?.plan).toBe('free')

      // Second attempt succeeds
      const result = await fictionStripe.customerInitialized({ caller: 'test' })

      expect(result?.customerId).toBe('cus_retry')
    })

    it('waits for user initialization before requesting customer data', async () => {
      const userInitSpy = vi.spyOn(fictionStripe.settings.fictionUser, 'userInitialized')
      const requestDataSpy = vi.spyOn(fictionStripe, 'requestSetCustomerData')

      await fictionStripe.customerInitialized({ caller: 'test' })

      expect(userInitSpy).toHaveBeenCalledWith({ caller: 'stripe.customer' })
      expect(requestDataSpy).toHaveBeenCalled()
    })
  })
})
