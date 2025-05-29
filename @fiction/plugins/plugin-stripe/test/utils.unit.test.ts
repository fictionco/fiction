/**
 * @vitest-environment happy-dom
 */

import type { Stripe } from 'stripe'

import type { CustomerData, RawCustomerData } from '../utils'
import { dayjs, vue } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FictionStripe } from '..'
import { checkoutEndpointHandler, getCheckoutConfig, getCheckoutUrl, getPortalUrl, processCustomerData } from '../utils'
import { mockStripeSubscription } from './stripeMocks'

describe('processCustomerData', () => {
  const mockDate = '2023-03-24T00:00:00.000Z'

  const randomDate = '2023-03-23T22:42:47Z'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(dayjs(mockDate).toDate())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mockProducts = [
    { key: 'standard', tier: 1 },
    { key: 'pro', tier: 2 },
  ]

  it('processes an active subscription correctly', () => {
    const raw: RawCustomerData = {
      org: { orgId: 'org_123' },
      subscriptions: [mockStripeSubscription as any],
    }

    const result = processCustomerData({ raw, products: mockProducts })

    expect(result.status).toBe('active')
    expect(result.isActive).toBe(true)
    expect(result.isTrialing).toBe(false)
    expect(result.hasPastDue).toBe(false)
    expect(result.isCanceled).toBe(false)
  })

  it('calculates billing cycle info correctly', () => {
    const raw: RawCustomerData = {
      org: { orgId: 'org_123' },
      subscriptions: [mockStripeSubscription as any],
    }

    const result = processCustomerData({ raw, products: mockProducts })

    expect(result.cycleStartAtIso).toBe(dayjs.unix(mockStripeSubscription.items.data[0].current_period_start).toISOString())
    expect(result.cycleEndAtIso).toBe(dayjs.unix(mockStripeSubscription.items.data[0].current_period_end).toISOString())
  })

  it('handles missing subscription', () => {
    const raw: RawCustomerData = {
      org: { orgId: 'org_123' },
      subscriptions: [],
    }

    const result = processCustomerData({ raw, products: mockProducts })

    expect(result.status).toBe('incomplete')
    expect(result.isActive).toBe(false)
    expect(result.plan).toBeUndefined()
    expect(result.cycleStartAtIso).toBeUndefined()
    expect(result.cycleEndAtIso).toBeUndefined()
  })

  it('handles trialing subscription', () => {
    const trialingSub = {
      ...mockStripeSubscription,
      status: 'trialing',
      trial_end: 1682288167,
    }

    const raw: RawCustomerData = {
      org: { orgId: 'org_123' },
      subscriptions: [trialingSub as any],
    }

    const result = processCustomerData({ raw, products: mockProducts })

    expect(result.status).toBe('trialing')
    expect(result.isActive).toBe(true)
    expect(result.isTrialing).toBe(true)
  })

  it('processes plan details correctly', () => {
    const raw: RawCustomerData = {
      org: { orgId: 'org_123' },
      subscriptions: [mockStripeSubscription as any],
    }

    const result = processCustomerData({ raw, products: mockProducts })

    expect(result.tier).toBe(1)

    expect(result.plan).toMatchObject({
      id: 'price_123',
      name: 'Free',
      amount: 1000,
      interval: 'month',
    })
  })

  it('handles past due subscription', () => {
    const pastDueSub = {
      ...mockStripeSubscription,
      status: 'past_due',
    }

    const raw: RawCustomerData = {
      org: { orgId: 'org_123' },
      subscriptions: [pastDueSub as any],
    }

    const result = processCustomerData({ raw, products: mockProducts })

    expect(result.status).toBe('past_due')
    expect(result.isActive).toBe(false)
    expect(result.hasPastDue).toBe(true)
  })
})

describe('stripe Utils', async () => {
  // Create FictionStripe before test utils initialization
  const testUtils = await createSiteTestUtils()

  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: 'https://test.portal.url',
    products: [{ key: 'pro', tier: 10 }],
  })

  // Initialize test utils after FictionStripe creation
  const initialized = await testUtils.init()
  const { orgId } = initialized

  afterAll(async () => {
    await testUtils.close()
    await fictionStripe.close()
  })

  // Reset functionality
  const resetStripeState = () => {
    // Clear any mocks
    vi.clearAllMocks()
    // Reset instance properties that might be modified during tests
    fictionStripe.browserClient = undefined
    fictionStripe.serverClient = undefined
  }

  beforeEach(() => {
    resetStripeState()
  })

  describe('getPortalUrl', () => {
    it('returns portal session URL when session creation succeeds', async () => {
      const mockSuccessUrl = 'https://portal.session.url'
      const returnUrl = 'https://return.url'

      vi.spyOn(fictionStripe.requests.PortalSession, 'projectRequest').mockResolvedValueOnce({
        status: 'success',
        data: { url: mockSuccessUrl } as Stripe.BillingPortal.Session,
      })

      const result = await getPortalUrl({
        fictionStripe,
        returnUrl,
      })

      expect(result).toBe(mockSuccessUrl)
    })

    it('returns default portal URL with prefilled email when session creation fails', async () => {
      const mockCustomerEmail = 'test@example.com'
      vi.spyOn(fictionStripe.requests.PortalSession, 'projectRequest').mockResolvedValueOnce({
        status: 'error',
      })

      vi.spyOn(fictionStripe.queries.ManageCustomer, 'serve').mockResolvedValueOnce({
        status: 'success',
        data: {
          customer: { email: mockCustomerEmail } as any,
        } as CustomerData,
      })

      const result = await getPortalUrl({ fictionStripe })

      expect(result).toBe(`https://test.portal.url?prefilled_email=${encodeURIComponent(mockCustomerEmail)}`)
    })
  })

  describe('getCheckoutUrl', () => {
    it('returns checkout initialization URL for authenticated user', async () => {
      const query = {
        priceLookupKey: 'pro_month',
        trialPeriod: '14',
      }

      const result = await getCheckoutUrl({
        fictionStripe,
        query,
      })

      expect(result).toContain('/api/stripe-checkout/init')
      expect(result).toContain('priceLookupKey=pro_month')
      expect(result).toContain('trialPeriod=14')
    })

    it('returns login redirect URL for unauthenticated user', async () => {
      // Mock user as not authenticated
      vi.spyOn(fictionStripe.settings.fictionUser, 'activeUser', 'get').mockReturnValue(vue.ref(undefined))

      const query = {
        priceLookupKey: 'pro_month',
        loginPath: '/login',
      }

      // Mock window.location
      const mockLocation = new URL('https://test.com/checkout')
      vi.stubGlobal('location', mockLocation)

      const result = await getCheckoutUrl({
        fictionStripe,
        query,
      })

      expect(result).toBe(`/login?redirect=${encodeURIComponent(mockLocation.href)}`)

      // Clean up global stub
      vi.unstubAllGlobals()
    })
  })

  describe('checkoutEndpointHandler', () => {
    // Helper to create properly chained mock response
    const createMockResponse = () => {
      const res = {
        status: vi.fn(),
        send: vi.fn(),
        redirect: vi.fn(),
        end: vi.fn(),
      }
      res.status.mockReturnValue(res)
      res.send.mockReturnValue(res)
      return res
    }

    it('creates checkout session and redirects on successful initialization', async () => {
      const mockRequest = {
        params: { action: 'init' },
        query: {
          priceLookupKey: 'pro_month',
          orgId,
        },
      }

      const mockResponse = createMockResponse()

      // Mock customer retrieval
      vi.spyOn(fictionStripe.queries.ManageCustomer, 'serve').mockResolvedValueOnce({
        status: 'success',
        data: {
          customer: { id: 'cus_test' },
        } as CustomerData,
      })

      // Mock stripe checkout session creation
      const mockSessionUrl = 'https://checkout.stripe.com/test'
      vi.spyOn(fictionStripe, 'getServerClient').mockReturnValue({
        checkout: {
          sessions: {
            create: vi.fn().mockResolvedValue({ url: mockSessionUrl }),
          },
        },
        prices: {
          list: vi.fn().mockResolvedValue({ data: [{ id: 'price_test' }] }),
        },
      } as any)

      await checkoutEndpointHandler({
        fictionStripe,
        request: mockRequest as any,
        response: mockResponse as any,
      })

      expect(mockResponse.redirect).toHaveBeenCalledWith(303, mockSessionUrl)
    })

    it('handles missing priceId error', async () => {
      const mockRequest = {
        params: { action: 'init' },
        query: { orgId },
      }

      const mockResponse = createMockResponse()

      await checkoutEndpointHandler({
        fictionStripe,
        request: mockRequest as any,
        response: mockResponse as any,
      })

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'no priceLookupKey',
      })
      expect(mockResponse.end).toHaveBeenCalled()
    })

    it('handles invalid action parameter', async () => {
      const mockRequest = {
        params: { action: 'invalid' },
        query: {
          priceLookupKey: 'pro_month',
          orgId,
        },
      }

      const mockResponse = createMockResponse()

      await checkoutEndpointHandler({
        fictionStripe,
        request: mockRequest as any,
        response: mockResponse as any,
      })

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'invalid action',
      })
      expect(mockResponse.end).toHaveBeenCalled()
    })

    it('handles missing orgId error', async () => {
      const mockRequest = {
        params: { action: 'init' },
        query: {
          priceLookupKey: 'pro_month',
        },
      }

      const mockResponse = createMockResponse()

      await checkoutEndpointHandler({
        fictionStripe,
        request: mockRequest as any,
        response: mockResponse as any,
      })

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'error',
        message: 'no orgId',
      })
      expect(mockResponse.end).toHaveBeenCalled()
    })
  })

  describe('getCheckoutConfig', () => {
    it('returns default success and cancel URLs when no callbacks provided', () => {
      const result = getCheckoutConfig({
        orgId,
        fictionStripe,
      })

      const baseUrl = fictionStripe.settings.fictionApp.appUrl.value

      expect(result).toEqual({
        successUrl: `${baseUrl}/checkout-success`,
        cancelUrl: `${baseUrl}/checkout-cancel`,
      })
    })

    it('uses custom success and cancel paths when callbacks provided', () => {
      // Create temporary instance with custom callbacks
      const tempFictionStripe = new FictionStripe({
        ...fictionStripe.settings,
        checkoutSuccessPathname: () => '/custom-success',
        checkoutCancelPathname: () => '/custom-cancel',
      })

      const result = getCheckoutConfig({
        orgId,
        fictionStripe: tempFictionStripe,
      })

      const baseUrl = tempFictionStripe.settings.fictionApp.appUrl.value

      expect(result).toEqual({
        successUrl: `${baseUrl}/custom-success`,
        cancelUrl: `${baseUrl}/custom-cancel`,
      })
    })
  })
})
