import { initializeEndpoint } from "./serverEndpoint"
import { StripeOptions } from "./types"
import { createSettings } from "./util"
import { stripeEnv } from "./serverMethods"
import { FactorPluginConfigServer } from "@factor/types"

export default async (
  options: Partial<StripeOptions>,
): Promise<FactorPluginConfigServer> => {
  createSettings(options)

  return {
    name: "StripePluginServer",
    setup: async (): Promise<void> => {
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

      await initializeEndpoint()
    },
  }
}
