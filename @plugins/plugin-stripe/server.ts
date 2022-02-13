import { FactorPluginConfigServer, UserConfigServer } from "@factor/types"
import { getPaymentEndpointsMap } from "./endpoints"
import { EndpointMethodStripeHooks } from "./endpointHooks"
import { StripeOptions, createSettings, stripeEnv } from "."

export default async (
  options: Partial<StripeOptions>,
): Promise<FactorPluginConfigServer> => {
  createSettings(options)

  return {
    name: "StripePluginServer",
    setup: async (): Promise<UserConfigServer> => {
      const stripePublicKey =
        stripeEnv() == "production"
          ? process.env.STRIPE_PUBLIC_KEY_LIVE
          : process.env.STRIPE_PUBLIC_KEY_TEST
      const stripeSecretKey =
        stripeEnv() == "production"
          ? process.env.STRIPE_SECRET_KEY_LIVE
          : process.env.STRIPE_SECRET_KEY_TEST

      if (!stripePublicKey) {
        throw new Error(`Stripe public key is missing: '${stripeEnv()}'`)
      }

      if (!stripeSecretKey) {
        throw new Error(`Stripe secret key is missing: '${stripeEnv()}'`)
      }

      return {
        endpoints: [
          ...Object.values(getPaymentEndpointsMap()),
          new EndpointMethodStripeHooks(),
        ],
        serverOnlyImports: [{ id: "stripe" }],
      }
    },
  }
}
