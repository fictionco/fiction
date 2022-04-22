import { UserConfig, FactorPlugin, EndpointMap, HookType } from "@factor/api"

import { FactorUser } from "@factor/api/plugin-user"
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
import { EndpointMethodStripeHooks } from "./endpointHooks"
import * as types from "./types"

export class FactorStripe extends FactorPlugin<types.StripePluginSettings> {
  private factorUser: FactorUser
  public queries: ReturnType<typeof this.createQueries>
  public requests: EndpointMap<typeof this.queries>
  public client?: StripeJS.Stripe
  private stripeMode: "test" | "live" = "test"
  public hooks: HookType<types.HookDictionary>[]
  public products: types.StripeProductConfig[]
  readonly types = types
  readonly serverUrl: string

  constructor(settings: types.StripePluginSettings) {
    super(settings)
    this.serverUrl = settings.serverUrl
    this.factorUser = settings.factorUser
    this.queries = this.createQueries()

    this.requests = this.createRequests({
      queries: this.queries,
      serverUrl: settings.serverUrl,
    })
    this.stripeMode = settings.stripeMode
    this.hooks = settings.hooks ?? []
    this.products = settings.products
  }

  async setup(): Promise<UserConfig> {
    const endpoints = [
      ...Object.values(this.requests),
      new EndpointMethodStripeHooks({
        factorStripe: this,
        serverUrl: this.serverUrl,
      }),
    ]

    return {
      name: this.constructor.name,
      endpoints,
      vite: {
        optimizeDeps: {
          exclude: ["@stripe/stripe-js"],
        },
      },
      paths: [this.utils.safeDirname(import.meta.url)],
      serverOnlyImports: [{ id: "stripe" }],
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
}
