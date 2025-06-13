import type { FictionApp, FictionDb, FictionEnv, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'

import type * as StripeJS from '@stripe/stripe-js'
import type Stripe from 'stripe'

import type { StripeProductConfig } from './utils'
import { Endpoint, FictionPlugin, vue } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { CustomerState } from './customer'
import { QueryCheckoutSession, QueryManageCustomer, QueryPortalSession } from './endpoints'
import { QueryStripeTrial } from './endpointTrial'
import { checkoutEndpointHandler, getStripeBrowserClient, getStripeServerClient } from './utils'

vars.register(() => [
  new EnvVar({ name: 'STRIPE_PUBLIC_KEY_TEST', isPublic: true, isOptional: true }),
  new EnvVar({ name: 'STRIPE_SECRET_KEY_TEST', isPublic: false, isOptional: true }),
  new EnvVar({ name: 'STRIPE_PUBLIC_KEY_PROD', isPublic: true, verify: ({ fictionEnv, value }) => {
    return !(fictionEnv.isProd.value && !value && fictionEnv.isApp.value)
  } }),
  new EnvVar({ name: 'STRIPE_SECRET_KEY_PROD', verify: ({ fictionEnv, value }) => {
    return !(fictionEnv.isProd.value && !value && !fictionEnv.isApp.value && !fictionEnv.isCi)
  }, isPublic: false }),
])

export type StripePluginSettings = {
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionServer: FictionServer
  fictionUser: FictionUser
  fictionRouter: FictionRouter
  fictionDb: FictionDb
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  webhookSecret?: string
  isLive?: vue.Ref<boolean> | boolean
  products: StripeProductConfig[]
  checkoutSuccessPathname?: (args: { orgId: string }) => string
  checkoutCancelPathname?: (args: { orgId: string }) => string
  customerPortalUrl: string
  useCustomerManager?: boolean
} & FictionPluginSettings

// Custom error classes for better error handling
class StripeInitializationError extends Error {
  constructor(message: string, public override cause?: unknown) {
    super(message)
    this.name = 'StripeInitializationError'
  }
}

export class FictionStripe extends FictionPlugin<StripePluginSettings> {
  queries = {
    ManageCustomer: new QueryManageCustomer({ fictionStripe: this, ...this.settings }),
    PortalSession: new QueryPortalSession({ fictionStripe: this, ...this.settings }),
    CheckoutSession: new QueryCheckoutSession({ fictionStripe: this, ...this.settings }),
    StripeTrial: new QueryStripeTrial({ fictionStripe: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  browserClient?: StripeJS.Stripe
  serverClient?: Stripe
  isLive = this.settings.isLive ?? this.settings.fictionEnv.isProd.value
  stripeMode = vue.computed(() => {
    const isLive = this.settings.isLive
    const v = vue.isRef(isLive) ? isLive?.value : isLive
    return v ? 'live' : 'test'
  })

  secretKey = vue.computed(() => this.stripeMode.value === 'live' ? this.settings.secretKeyLive : this.settings.secretKeyTest)
  publicKey = vue.computed(() => this.stripeMode.value === 'live' ? this.settings.publicKeyLive : this.settings.publicKeyTest)

  // CustomerState instance for managing customer data
  customerState = new CustomerState({
    fictionStripe: this,
  })

  constructor(settings: StripePluginSettings) {
    super('FictionStripe', settings)

    this.validateSettings()
    this.setupEndpoint()
    this.setupHooks()
    this.logInitialization()
  }

  private validateSettings() {
    if (!this.settings.customerPortalUrl) {
      throw new StripeInitializationError('Customer portal URL is required')
    }

    if (!Array.isArray(this.settings.products) || this.settings.products.length === 0) {
      throw new StripeInitializationError('At least one product configuration is required')
    }
  }

  private setupEndpoint() {
    try {
      const checkoutEndpoint = new Endpoint({
        requestHandler: async (...r) => checkoutEndpointHandler({ request: r[0], response: r[1], fictionStripe: this }),
        key: 'oAuthEndpoint',
        basePath: '/stripe-checkout/:action',
        serverUrl: this.settings.fictionServer.serverUrl.value,
        fictionUser: this.settings.fictionUser,
        fictionEnv: this.settings.fictionEnv,
        useNaked: true,
      })

      this.settings.fictionServer.addEndpoints([checkoutEndpoint])
    }
    catch (error) {
      throw new StripeInitializationError('Failed to setup checkout endpoint', error)
    }
  }

  private setupHooks() {
    /**
     * When an organization is updated, update the customer details in Stripe
     */
    this.settings.fictionUser.hooks.on('updateOrg', 'stripe:updateOrg', async (args) => {
      const { org } = args
      try {
        if (!org.orgId) {
          throw new Error('updateOrganization hook missing orgId')
        }

        const { orgId, email, name } = org
        await this.queries.ManageCustomer.serve(
          { _action: 'update', orgId, fields: { email, name } },
          { server: true },
        )
      }
      catch (error) {
        this.log.error('Failed to update customer details in hook', { error })
        throw error
      }
    })
  }

  private logInitialization() {
    if (!this.settings.fictionEnv.isApp.value) {
      const hasSecretKey = !!this.secretKey.value
      const hasPublicKey = !!this.publicKey.value

      this.log.info('initializing stripe', {
        data: {
          secretKeyExists: hasSecretKey,
          publicKeyExists: hasPublicKey,
          stripeMode: this.stripeMode.value,
        },
      })

      if (!hasSecretKey) {
        this.log.warn(`stripe secretKey key not set: ${this.stripeMode.value}`)
      }

      if (!hasPublicKey) {
        this.log.warn(`stripe publicKey key not set: ${this.stripeMode.value}`)
      }
    }
  }

  // Public API for customer data
  readonly activeCustomer = vue.computed(() => this.customerState.data.value)

  async customerInitialized(args: { caller: string }) {
    try {
      await this.customerState.initialize(args)
      return this.customerState.data.value
    }
    catch (error) {
      this.log.error('Failed to initialize customer', { error })
      throw error
    }
  }

  getServerClient(): Stripe {
    if (!this.serverClient) {
      if (!this.secretKey.value) {
        throw new StripeInitializationError(
          `Stripe secret key not available for ${this.stripeMode.value} mode`,
        )
      }
      this.serverClient = getStripeServerClient({ fictionStripe: this })
    }
    return this.serverClient
  }

  getBrowserClient = async (): Promise<StripeJS.Stripe> => {
    if (!this.browserClient) {
      if (!this.publicKey.value) {
        throw new StripeInitializationError(
          `Stripe public key not available for ${this.stripeMode.value} mode`,
        )
      }
      this.browserClient = await getStripeBrowserClient({ fictionStripe: this })
    }
    return this.browserClient
  }

  // Cleanup method to handle plugin disposal
  close() {
    this.customerState.cleanup()
  }

  async getPriceByLookupKey(priceKey?: string) {
    if (!priceKey)
      return undefined

    const price = await this.getServerClient().prices.list({ lookup_keys: [priceKey] })

    if (!price.data[0])
      return undefined

    return price.data[0]?.id
  }
}
