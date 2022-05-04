import http from "http"
import {
  FactorPlugin,
  HookType,
  Endpoint,
  EndpointResponse,
  FactorApp,
  FactorServer,
  FactorUser,
} from "@factor/api"

import * as StripeJS from "@stripe/stripe-js"
import Stripe from "stripe"
import {
  QueryAllProducts,
  QueryGetCoupon,
  QueryGetCustomerData,
  QueryGetInvoices,
  QueryGetProduct,
  QueryListSubscriptions,
  QueryManageCustomer,
  QueryManageSubscription,
  QueryPaymentMethod,
} from "./endpoints"
import * as types from "./types"

export type StripePluginSettings = {
  factorApp: FactorApp
  factorServer: FactorServer
  factorUser: FactorUser
  stripeMode: "test" | "live"
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  webhookSecret?: string
  hooks?: HookType<types.HookDictionary>[]
  products: types.StripeProductConfig[]
}

export class FactorStripe extends FactorPlugin<StripePluginSettings> {
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorApp = this.settings.factorApp
  public queries = this.createQueries()
  public requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })
  public client?: StripeJS.Stripe
  private stripeMode = this.settings.stripeMode
  public hooks = this.settings.hooks ?? []
  public products = this.settings.products
  readonly types = types
  publicKeyLive = this.settings.publicKeyLive
  publicKeyTest = this.settings.publicKeyTest
  secretKeyLive = this.settings.secretKeyLive
  secretKeyTest = this.settings.secretKeyTest
  webhookSecret = this.settings.webhookSecret
  constructor(settings: StripePluginSettings) {
    super(settings)

    const stripeWebhookEndpoint = new Endpoint({
      requestHandler: (_) => this.stripeHookHandler(_),
      key: "stripeWebhooks",
      basePath: "/stripe-webhook",
      serverUrl: this.factorServer.serverUrl,
      factorUser: this.factorUser,
    })

    this.factorServer.addEndpoints([stripeWebhookEndpoint])

    this.factorApp.addHook({
      hook: "viteConfig",
      callback: (config) => {
        return [
          ...config,
          {
            optimizeDeps: {
              exclude: ["@stripe/stripe-js"],
            },
          },
        ]
      },
    })
  }

  async setup() {
    return {
      name: this.constructor.name,
    }
  }

  public addHook(hook: HookType<types.HookDictionary>): void {
    this.hooks.push(hook)
  }

  protected createQueries() {
    const deps = { factorUser: this.factorUser, factorStripe: this }
    return {
      ManageCustomer: new QueryManageCustomer(deps),
      ListSubscriptions: new QueryListSubscriptions(deps),
      GetInvoices: new QueryGetInvoices(deps),
      ManageSubscription: new QueryManageSubscription(deps),
      ManagePaymentMethod: new QueryPaymentMethod(deps),
      GetCustomerData: new QueryGetCustomerData(deps),
      AllProducts: new QueryAllProducts(deps),
      GetProduct: new QueryGetProduct(deps),
      GetCoupon: new QueryGetCoupon(deps),
    } as const
  }

  getServerClient(): Stripe {
    if (!this.utils.isNode()) throw new Error("Stripe is server only")

    const key =
      this.stripeMode == "live"
        ? this.settings.secretKeyLive
        : this.settings.secretKeyTest

    if (!key) throw new Error("Stripe secret key not found")

    return new Stripe(key, { apiVersion: "2020-08-27" })
  }

  getBrowserClient = async (): Promise<StripeJS.Stripe> => {
    if (!this.client) {
      const publicKey =
        this.stripeMode == "live"
          ? this.settings.publicKeyLive
          : this.settings.publicKeyTest

      if (!publicKey) throw new Error("no stripe public key")

      this.client = (await StripeJS.loadStripe(publicKey)) ?? undefined
    }

    if (!this.client) throw new Error("no stripe client created")

    return this.client
  }

  getProducts = (): types.StripeProductConfig[] => {
    const config = process.env.STRIPE_PRODUCTS

    if (!config) throw new Error("no stripe products configured")

    return JSON.parse(config) as types.StripeProductConfig[]
  }

  getStripeProduct = (params: {
    key?: string
    productId?: string
  }): types.StripeProductConfig | void => {
    if (!params.key && !params.productId) return

    const p = this.getProducts()

    let product: types.StripeProductConfig | undefined = undefined

    if (params.key) {
      product = p.find((_) => _.key == params.key)
    } else {
      product = p.find((_) => _.productId == params.productId)
    }

    if (!product || !product?.key) {
      throw new Error(`not found: getStripeProduct`)
    }

    return product
  }

  stripeHookHandler = async (
    request: http.IncomingMessage,
  ): Promise<EndpointResponse> => {
    let event: Stripe.Event
    const stripe = this.getServerClient()
    try {
      const secret = this.webhookSecret
      if (!secret) {
        throw new Error("no webhookSecret")
      }

      event = stripe.webhooks.constructEvent(
        request.rawBody,
        request.headers["stripe-signature"] as string,
        secret,
      )
    } catch (error) {
      this.log.error(`stripe error`, { error })

      this.log.error(
        `stripe error: Webhook signature verification failed. Check the env file and enter the correct webhook secret`,
      )

      return { status: "error" }
    }

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    if (event.type == "invoice.paid") {
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      await this.utils.runHooks({
        list: this.hooks,
        hook: "onInvoicePayment",
        args: [event, { factorStripe: this }],
      })
    } else if (event.type == "invoice.payment_failed") {
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      await this.utils.runHooks({
        list: this.hooks,
        hook: "onInvoicePaymentFailed",
        args: [event, { factorStripe: this }],
      })
    } else if (event.type == "customer.subscription.deleted") {
      /**
       * if event.request is null, then it was cancelled from settings vs request
       */
      await this.utils.runHooks({
        list: this.hooks,
        hook: "onCustomerSubscriptionDeleted",
        args: [event, { factorStripe: this }],
      })
    } else if (event.type == "customer.subscription.trial_will_end") {
      /**
       * Three days before the trial period is up, a customer.subscription.trial_will_end event is sent to your webhook endpoint.
       * You can use that notification as a trigger to take any necessary actions, such as informing the customer that billing is about to begin.
       * https://stripe.com/docs/billing/subscriptions/trials
       */
      await this.utils.runHooks({
        list: this.hooks,
        hook: "onSubscriptionTrialWillEnd",
        args: [event, { factorStripe: this }],
      })
    } else {
      this.log.error(`unexpected event type`, {
        data: event.data.object,
      })
    }

    return { status: "success" }
  }
}
