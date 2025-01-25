import type { FictionApp, FictionDb, FictionEnv, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'

import type * as StripeJS from '@stripe/stripe-js'
import type Stripe from 'stripe'

import type * as types from './types'

import { Endpoint, FictionPlugin, vue } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { QueryCheckoutSession, QueryManageCustomer, QueryPortalSession, QueryStripeTrial } from './endpoints'
import { checkoutEndpointHandler, getCurrentCustomerDetails, getStripeBrowserClient, getStripeServerClient } from './utils'
import '@stripe/stripe-js'

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

export * from './types'
export * from './utils'

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
  products: types.StripeProductConfig[]
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

class CustomerInitializationError extends Error {
  constructor(message: string, public override cause?: unknown) {
    super(message)
    this.name = 'CustomerInitializationError'
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
    this.settings.fictionEnv?.addHook({
      hook: 'updateOrganization',
      caller: 'FictionStripe',
      context: 'server',
      callback: async (o) => {
        try {
          if (!o.orgId) {
            throw new Error('updateOrganization hook missing orgId')
          }

          const { orgId, orgEmail, orgName } = o
          await this.queries.ManageCustomer.serve(
            { _action: 'update', orgId, fields: { email: orgEmail, name: orgName } },
            { server: true },
          )
        }
        catch (error) {
          this.log.error('Failed to update customer details in hook', { error })
          throw error
        }
      },
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

  activeCustomer = vue.shallowRef<types.CustomerDetails>()
  private initPromise?: Promise<boolean>
  private _resolveCustomer?: (value: boolean | PromiseLike<boolean>) => void
  private initializationError?: Error

  async requestSetCustomerData() {
    try {
      await this.settings.fictionUser.userInitialized({ caller: 'stripe.customer' })
      this.activeCustomer.value = await getCurrentCustomerDetails({ fictionStripe: this })
      return this.activeCustomer.value
    }
    catch (error) {
      this.initializationError = new CustomerInitializationError(
        'Failed to initialize customer data',
        error,
      )
      throw this.initializationError
    }
  }

  async customerInitialized(args: { caller: string }) {
    const { caller = 'unknown' } = args || {}

    if (typeof window === 'undefined') {
      this.log.warn('customer initialization: no window', { data: { caller } })
      return
    }

    // If there was a previous initialization error, clear it and retry
    if (this.initializationError) {
      this.initPromise = undefined
      this.initializationError = undefined
    }

    if (!this.initPromise) {
      this.log.info('initializing customer', { data: { caller } })
      this.initPromise = new Promise(async (resolve, reject) => {
        this._resolveCustomer = resolve
        try {
          const result = await this.requestSetCustomerData()
          resolve(true)
        }
        catch (error) {
          this.log.error('Failed to initialize customer', {
            error,
            data: { caller },
          })
          reject(error)
        }
      })

      this.customerDataRefreshWatchers()
    }

    try {
      await this.initPromise

      if (this.activeCustomer.value?.status === 'error') {
        this.initPromise = undefined
      }

      return this.activeCustomer.value
    }
    catch (error) {
      // Clear the promise so subsequent calls can retry
      this.initPromise = undefined
      throw error
    }
  }

  closeWatcher?: vue.WatchHandle

  customerDataRefreshWatchers() {
    if (this.closeWatcher) {
      this.closeWatcher()
    }

    // Debounce the update to prevent rapid consecutive calls
    let updateTimeout: NodeJS.Timeout

    this.closeWatcher = vue.watch(
      () => this.settings.fictionUser.activeOrgId.value,
      async () => {
        clearTimeout(updateTimeout)
        updateTimeout = setTimeout(async () => {
          try {
            await this.requestSetCustomerData()
          }
          catch (error) {
            this.log.error('Failed to refresh customer data', { error })
          }
        }, 100) // 100ms debounce
      },
    )
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
}
