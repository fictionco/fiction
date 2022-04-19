import { UserConfig, FactorPlugin } from "@factor/api"
import { EndpointMethodOptions, Endpoint, Query } from "@factor/api/engine"
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
import { StripeProductConfig, StripeHookCallbacks } from "./types"

type StripePluginSettings = {
  factorUser: FactorUser
  stripeMode: "test" | "live"
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  hooks: StripeHookCallbacks
  products: StripeProductConfig[]
  serverUrl: string
}

type EndpointMap<T extends Record<string, Query>> = {
  [P in keyof T]: Endpoint<T[P]>
}

export class EndpointMethodPayments<T extends Query> extends Endpoint<T> {
  constructor(options: EndpointMethodOptions<T>) {
    super({ basePath: "/payments", ...options })
  }
}

export class FactorStripe extends FactorPlugin<StripePluginSettings> {
  private factorUser: FactorUser
  public queries: ReturnType<typeof this.createQueries>
  public requests: EndpointMap<typeof this.queries>
  private endpointHandler = EndpointMethodPayments
  public client?: StripeJS.Stripe
  private stripeMode: "test" | "live" = "test"
  private hooks: StripeHookCallbacks
  products: StripeProductConfig[]
  serverUrl: string
  constructor(settings: StripePluginSettings) {
    super(settings)
    this.serverUrl = settings.serverUrl
    this.factorUser = settings.factorUser
    this.queries = this.createQueries()
    this.requests = this.createRequests(settings.serverUrl)
    this.stripeMode = settings.stripeMode
    this.hooks = settings.hooks
    this.products = settings.products
  }

  async setup(): Promise<UserConfig> {
    return {
      name: this.constructor.name,
      endpoints: [
        ...Object.values(this.requests),
        new EndpointMethodStripeHooks({
          stripePlugin: this,
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private createQueries() {
    const deps = { factorUser: this.factorUser, stripePlugin: this }
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

  private createRequests(serverUrl: string): EndpointMap<typeof this.queries> {
    const requests = Object.fromEntries(
      Object.entries(this.queries).map(([key, query]) => {
        return [
          key,
          new this.endpointHandler({
            key,
            queryHandler: query,
            serverUrl,
          }),
        ]
      }),
    ) as EndpointMap<typeof this.queries>

    return requests
  }

  getServerClient(): Stripe {
    if (!this.utils.isNode) throw new Error("Stripe is server only")

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
