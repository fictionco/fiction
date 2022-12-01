import "./register"
import express from "express"
import {
  FactorPlugin,
  HookType,
  Endpoint,
  EndpointResponse,
  FactorApp,
  FactorServer,
  FactorUser,
  FactorPluginSettings,
  vue,
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

type CheckoutQueryParams = {
  priceId?: string
}

export type StripePluginSettings = {
  factorApp: FactorApp
  factorServer: FactorServer
  factorUser: FactorUser
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  webhookSecret?: string
  isLive?: vue.Ref<boolean>
  hooks?: HookType<types.HookDictionary>[]
  products: types.StripeProductConfig[]
  checkoutSuccessPathname?: string
  checkoutCancelPathname?: string
} & FactorPluginSettings

export class FactorStripe extends FactorPlugin<StripePluginSettings> {
  apiVersion = "2022-11-15" as const
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorApp = this.settings.factorApp
  public queries = this.createQueries()
  public requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })
  public browserClient?: StripeJS.Stripe
  public serverClient?: Stripe
  private stripeMode = this.utils.vue.computed(() => {
    return this.settings.isLive?.value ? "live" : "test"
  })
  public hooks = this.settings.hooks ?? []
  public products = this.utils.vue.computed(() => {
    return this.settings.products.map((p) => {
      return {
        ...p,
        productId: this.stripeMode.value == "live" ? p.live : p.test,
        pricing: p.pricing.map((price) => {
          return {
            ...price,
            priceId: this.stripeMode.value == "live" ? price.live : price.test,
          }
        }),
      }
    })
  })
  publicKeyLive = this.settings.publicKeyLive
  publicKeyTest = this.settings.publicKeyTest
  secretKeyLive = this.settings.secretKeyLive
  secretKeyTest = this.settings.secretKeyTest
  secretKey = this.utils.vue.computed(() => {
    return this.settings.isLive?.value
      ? this.settings.secretKeyLive
      : this.settings.secretKeyTest
  })
  publicKey = this.utils.vue.computed(() => {
    return this.settings.isLive?.value
      ? this.settings.publicKeyLive
      : this.settings.publicKeyTest
  })
  webhookSecret = this.settings.webhookSecret

  checkoutConfig = this.utils.vue.computed(() => {
    const base = this.factorApp.appUrl.value
    const successPath =
      this.settings.checkoutSuccessPathname ?? "/checkout-success"
    const cancelPath =
      this.settings.checkoutCancelPathname ?? "/checkout-cancel"
    return {
      successUrl: `${base}${successPath}`,
      cancelUrl: `${base}${cancelPath}`,
    }
  })

  constructor(settings: StripePluginSettings) {
    super("stripe", settings)

    const stripeWebhookEndpoint = new Endpoint({
      requestHandler: (..._) => this.stripeHookHandler(..._),
      key: "stripeWebhooks",
      basePath: "/stripe-webhook",
      serverUrl: this.factorServer.serverUrl.value,
      factorUser: this.factorUser,
      useNaked: true,
    })

    const checkoutEndpoint = new Endpoint({
      requestHandler: (...r) => this.checkoutEndpointHandler(...r),
      key: "oAuthEndpoint",
      basePath: "/stripe-checkout/:action",
      serverUrl: this.factorServer.serverUrl.value,
      factorUser: this.factorUser,
      useNaked: true,
    })

    this.factorServer.addEndpoints([stripeWebhookEndpoint, checkoutEndpoint])

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
    if (this.utils.isApp()) throw new Error("Stripe is server only")

    if (!this.serverClient) {
      const key = this.secretKey.value

      console.warn("STRIPE KEY", key)
      if (!key) throw new Error("Stripe secret key not found")

      this.serverClient = new Stripe(key, {
        apiVersion: this.apiVersion,
      })
    }

    return this.serverClient as Stripe
  }

  getBrowserClient = async (): Promise<StripeJS.Stripe> => {
    if (!this.browserClient) {
      const publicKey = this.publicKey.value
      if (!publicKey) throw new Error("Stripe secret key not found")

      const createdClient = await StripeJS.loadStripe(publicKey)
      this.browserClient = createdClient ?? undefined
    }

    if (!this.browserClient) throw new Error("no stripe client created")

    return this.browserClient as StripeJS.Stripe
  }

  getStripeProduct = (params: {
    productKey?: string
    productId?: string
  }): types.StripeProductConfig | void => {
    if (!params.productKey && !params.productId) return

    const p = this.products.value

    let product: types.StripeProductConfig | undefined = undefined

    if (params.productKey) {
      product = p.find((_) => _.productKey == params.productKey)
    } else {
      product = p.find((_) => _.productId == params.productId)
    }

    if (!product || !product?.productKey) {
      this.log.error("No product found", { data: { params, product: p } })
      throw new Error(`FactorStripe Error`)
    }

    return product
  }

  getStripePrice = (params: { priceId: string }): types.StripePriceConfig => {
    // write a nested find function that finds subarray items in nested array
    const p = this.products.value
    const price = p
      .flatMap((_) => _.pricing)
      .find((_) => _.priceId == params.priceId)

    if (!price) {
      this.log.error("No price found", { data: { params, product: p } })
      throw new Error(`FactorStripe Error`)
    }

    return price
  }

  stripeHookHandler = async (
    request: express.Request,
    _response: express.Response,
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
    } else if (event.type == "checkout.session.completed") {
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      await this.utils.runHooks({
        list: this.hooks,
        hook: "onCheckoutSuccess",
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

  getCheckoutUrl(args: { priceId?: string }): string {
    if (!args.priceId) throw new Error("No priceId provided")
    const baseUrl = this.factorServer.serverUrl.value
    const url = new URL(`${baseUrl}/stripe-checkout/init`)

    if (args) {
      url.search = new URLSearchParams(args).toString()
    }

    return url.toString()
  }

  async checkoutEndpointHandler(
    request: express.Request,
    response: express.Response,
  ): Promise<void> {
    const query = request.query as Record<string, string>
    const params = request.params as {
      action?: "init"
    }

    const { action } = params

    if (!action) {
      this.log.error("Invalid request", { action })
      response.status(400).send("Invalid request")
      return
    }

    try {
      if (action == "init") {
        const { priceId } = query as CheckoutQueryParams

        if (!priceId) throw this.stop({ message: "no priceId" })

        const stripe = this.getServerClient()

        const { successUrl, cancelUrl } = this.checkoutConfig.value

        const priceDetails = this.getStripePrice({ priceId })

        const trialPeriod = 5

        const details: Stripe.Checkout.SessionCreateParams = {
          line_items: [
            {
              price: priceDetails.priceId,
              quantity: priceDetails.quantity,
            },
          ],
          subscription_data: {
            description: `${trialPeriod} Days Free`,
            trial_period_days: trialPeriod,
          },
          mode: "subscription",
          success_url: successUrl,
          cancel_url: cancelUrl,
        }

        this.log.info("creating checkout session", {
          data: {
            ...details,
            mode: this.stripeMode.value,
          },
        })

        const session = await stripe.checkout.sessions.create(details)

        if (session.url) {
          response?.redirect(303, session.url)
        }
      } else {
        throw this.stop("invalid action")
      }
    } catch (error) {
      const e = error as Error
      this.log.error("endpoint threw an error", { error })
      response.status(400).send({ status: "error", message: e.message }).end()
    }
  }
}
