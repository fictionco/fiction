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
import { StripeProductConfig, HookDictionary } from "./types"

type StripePluginSettings = {
  factorUser: FactorUser
  stripeMode: "test" | "live"
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  hooks?: HookType<HookDictionary>[]
  products: StripeProductConfig[]
  serverUrl: string
}

export class FactorStripe extends FactorPlugin<StripePluginSettings> {
  private factorUser: FactorUser
  public queries: ReturnType<typeof this.createQueries>
  public requests: EndpointMap<typeof this.queries>
  public client?: StripeJS.Stripe
  private stripeMode: "test" | "live" = "test"
  public hooks: HookType<HookDictionary>[]
  public products: StripeProductConfig[]
  readonly serverUrl: string

  constructor(settings: StripePluginSettings) {
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
    return {
      name: this.constructor.name,
      endpoints: [
        ...Object.values(this.requests),
        new EndpointMethodStripeHooks({
          factorStripe: this,
          serverUrl: this.serverUrl,
        }),
      ],
      vite: {
        optimizeDeps: {
          exclude: ["@stripe/stripe-js"],
        },
      },
      paths: [this.utils.safeDirname(import.meta.url)],
      serverOnlyImports: [{ id: "stripe" }],
    }
  }

  public addHook(hook: HookType<HookDictionary>): void {
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

  getProducts = (): StripeProductConfig[] => {
    const config = process.env.STRIPE_PRODUCTS

    if (!config) throw new Error("no stripe products configured")

    return JSON.parse(config) as StripeProductConfig[]
  }

  getStripeProduct = (params: {
    key?: string
    productId?: string
  }): StripeProductConfig | void => {
    if (!params.key && !params.productId) return

    const p = this.getProducts()

    let product: StripeProductConfig | undefined = undefined

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
