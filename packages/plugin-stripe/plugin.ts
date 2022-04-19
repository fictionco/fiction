import { UserConfig, FactorPlugin } from "@factor/api"
import {
  EndpointMethodOptions,
  FactorEndpoint,
  Query,
} from "@factor/api/engine"
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
  userPlugin: FactorUser
  stripeMode: "test" | "live"
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  hooks: StripeHookCallbacks
  products: StripeProductConfig[]
}

type EndpointMap<T extends Record<string, Query>> = {
  [P in keyof T]: FactorEndpoint<T[P]>
}

export class EndpointMethodPayments<T extends Query> extends FactorEndpoint<T> {
  constructor(options: EndpointMethodOptions<T>) {
    super({ basePath: "/payments", ...options })
  }
}

export class FactorStripe extends FactorPlugin<StripePluginSettings> {
  private userPlugin: FactorUser
  public queries: ReturnType<typeof this.createQueries>
  public requests: EndpointMap<typeof this.queries>
  private endpointHandler = EndpointMethodPayments
  public client?: StripeJS.Stripe
  private stripeMode: "test" | "live" = "test"
  private hooks: StripeHookCallbacks
  products: StripeProductConfig[]
  constructor(settings: StripePluginSettings) {
    super(settings)
    this.userPlugin = settings.userPlugin
    this.queries = this.createQueries()
    this.requests = this.createRequests()
    this.stripeMode = settings.stripeMode
    this.hooks = settings.hooks
    this.products = settings.products
  }

  async setup(): Promise<UserConfig> {
    return {
      name: this.constructor.name,
      endpoints: [
        ...Object.values(this.requests),
        new EndpointMethodStripeHooks({ stripePlugin: this }),
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

  private createQueries() {
    const deps = { userPlugin: this.userPlugin, stripePlugin: this }
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

  private createRequests(): EndpointMap<typeof this.queries> {
    const requests = Object.fromEntries(
      Object.entries(this.queries).map(([key, query]) => {
        return [key, new this.endpointHandler({ key, queryHandler: query })]
      }),
    ) as EndpointMap<typeof this.queries>

    return requests
  }

  getServerClient(): Stripe {
    if (!this.utils.isNode) throw new Error("Stripe is server only")

    const key =
      this.stripeMode == "live"
        ? this.settings.publicKeyLive
        : this.settings.publicKeyTest

    if (!key) throw new Error("Stripe secret key not found")

    return new Stripe(key, { apiVersion: "2020-08-27" })
  }

  getBrowserClient = async (): Promise<StripeJS.Stripe> => {
    if (!this.client) {
      const publicKey =
        this.stripeMode == "live"
          ? process.env.STRIPE_PUBLIC_KEY
          : process.env.STRIPE_PUBLIC_KEY_TEST

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

// export const setup = async (
//   options?: Partial<StripeOptions>,
// ): Promise<UserConfig> => {
//   createSettings(options)

//   return {
//     name: "StripePluginServer",
//     server: async (): Promise<UserConfig> => {
//       const endpoints: Endpoint[] = [
//         ...Object.values(getPaymentEndpointsMap()),
//         new EndpointMethodStripeHooks(),
//       ]
//       const stripePublicKey =
//         stripeEnv() == "production"
//           ? process.env.STRIPE_PUBLIC_KEY_LIVE
//           : process.env.STRIPE_PUBLIC_KEY_TEST
//       const stripeSecretKey =
//         stripeEnv() == "production"
//           ? process.env.STRIPE_SECRET_KEY_LIVE
//           : process.env.STRIPE_SECRET_KEY_TEST

//       if (!stripePublicKey) {
//         logger.log({
//           level: "warn",
//           context: "StripePlugin",
//           description: `Stripe public key is missing: '${stripeEnv()}'`,
//         })
//       } else if (!stripeSecretKey) {
//         logger.log({
//           level: "warn",
//           context: "StripePlugin",
//           description: `Stripe secret key is missing: '${stripeEnv()}'`,
//         })
//       }

//       return {
//         endpoints,
//         serverOnlyImports: [{ id: "stripe" }],
//       }
//     },
//     vite: {
//       optimizeDeps: {
//         exclude: ["@stripe/stripe-js"],
//       },
//     },
//     paths: [safeDirname(import.meta.url)],
//   }
// }
