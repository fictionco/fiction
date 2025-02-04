import type { EndpointMeta, EndpointResponse } from '@fiction/core'

import { abort } from '@fiction/core'
import { StripeEndpoint } from './endpoints'

type SetupTrialParams = {
  _action: 'setupTrial'
  orgId: string
  priceLookupKey?: string
  trialType: 'free' | 'paid'
} | {
  _action: 'completeSetup'
  setupIntentId?: string | null
  paymentIntentId?: string | null
  orgId: string
  priceLookupKey?: string
  trialPeriodDays?: number
}

export type TrialSetupResponse = {
  customerId?: string
  priceId?: string
  trialType?: 'free' | 'paid'

  setupIntentId?: string | null
  setupIntentClientSecret?: string | null
  paymentIntentId?: string | null
  paymentIntentClientSecret?: string | null

  subscriptionId?: string
}

export class QueryStripeTrial extends StripeEndpoint {
  async run(
    params: SetupTrialParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TrialSetupResponse>> {
    try {
      switch (params._action) {
        case 'setupTrial':
          return await this.setupTrial(params, meta)
        case 'completeSetup':
          return await this.completeSetup(params, meta)
        default:
          throw abort('Invalid action', meta)
      }
    }
    catch (error) {
      this.log.error('Trial setup failed', { error })
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to setup trial',
      }
    }
  }

  private async setupTrial(
    params: Extract<SetupTrialParams, { _action: 'setupTrial' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TrialSetupResponse>> {
    const { orgId, priceLookupKey, trialType } = params

    if (!orgId) {
      throw abort('Missing orgId', meta)
    }

    if (!priceLookupKey) {
      throw abort('Missing price identifier', meta)
    }

    const { fictionStripe } = this.settings
    const stripe = fictionStripe.getServerClient()

    const sessionPriceId = await fictionStripe.getPriceByLookupKey(priceLookupKey)

    if (!sessionPriceId) {
      return { status: 'error', message: `priceId not found (${priceLookupKey})` }
    }

    // First ensure/create customer
    const customerResponse = await this.settings.fictionStripe.queries.ManageCustomer.serve({
      _action: 'create',
      orgId,
    }, meta)

    if (customerResponse.status === 'error' || !customerResponse.data?.customer) {
      this.log.error('Failed to create customer', { data: customerResponse })
      throw new Error(`Failed to create customer`)
    }

    const customerId = customerResponse.data.customer.id

    // Create setup intent for collecting payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      metadata: { orgId },
      usage: 'off_session',
    })

    const { client_secret: setupIntentClientSecret, id: setupIntentId } = setupIntent

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1
      currency: 'usd',
      customer: customerId,
      payment_method_types: ['card'],
      metadata: { orgId, priceId: sessionPriceId },
      setup_future_usage: 'off_session',
      confirm: false,
      capture_method: 'manual', // Important: This allows us to authorize without capturing
      confirmation_method: 'automatic',
      description: 'Card verification for trial - Authorization only',
    })

    const { client_secret: paymentIntentClientSecret, id: paymentIntentId } = paymentIntent

    const data = {
      setupIntentClientSecret,
      paymentIntentClientSecret,
      customerId,
      setupIntentId,
      paymentIntentId,
      priceId: sessionPriceId,
      trialType,
    }

    return { status: 'success', data }
  }

  private async completeSetup(
    params: Extract<SetupTrialParams, { _action: 'completeSetup' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TrialSetupResponse>> {
    const { setupIntentId, paymentIntentId, orgId, priceLookupKey, trialPeriodDays = 10 } = params
    const { fictionStripe } = this.settings
    const stripe = fictionStripe.getServerClient()

    const sessionPriceId = await fictionStripe.getPriceByLookupKey(priceLookupKey)

    if (!sessionPriceId) {
      throw abort('missing required product info', meta)
    }

    if (!setupIntentId || !paymentIntentId) {
      throw abort('missing required IDs', meta)
    }

    // Get setup intent to get customer ID and payment method
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent.payment_method) {
      throw abort('No payment method attached to payment intent', meta)
    }

    const paymentMethod = paymentIntent.payment_method as string

    await stripe.paymentIntents.cancel(paymentIntentId, {
      cancellation_reason: 'requested_by_customer',
    })

    // Set as default payment method for the customer
    await stripe.customers.update(paymentIntent.customer as string, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    })

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: paymentIntent.customer as string,
      items: [{ price: sessionPriceId }],
      trial_period_days: trialPeriodDays,
      payment_behavior: 'default_incomplete',
      default_payment_method: paymentMethod, // Also set it on the subscription
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'],
      },
      metadata: {
        orgId,
        verification_payment_intent: paymentIntentId,
      },
    })

    return {
      status: 'success',
      data: {
        customerId: paymentIntent.customer as string,
        setupIntentId,
        paymentIntentId,
        subscriptionId: subscription.id,
        priceId: sessionPriceId,
        trialType: 'paid',
      },
    }
  }
}
