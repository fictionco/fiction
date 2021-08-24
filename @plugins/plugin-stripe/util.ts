import { StripeOptions } from "./types"
import { loadStripe, Stripe } from "@stripe/stripe-js"

export const stripeEnv = (): "production" | "development" => {
  const env = process.env.STRIPE_ENV || process.env.NODE_ENV || "development"

  return env as "production" | "development"
}

/**
 * Doc engine settings utility
 */
let __settings: Partial<StripeOptions> = { products: [] }
export const paymentsSetting = <T extends keyof StripeOptions>(
  key: T,
): StripeOptions[T] => {
  return __settings[key]
}

export const createSettings = (options: Partial<StripeOptions>): void => {
  const defaultSettings: Partial<StripeOptions> = {}

  __settings = { ...defaultSettings, ...options }
}

/**
 * Get the stripe client using public key
 * @singleton
 */
let __stripeClient: Stripe | undefined = undefined
export const getStripeClient = async (): Promise<Stripe> => {
  if (!__stripeClient) {
    const publicKey =
      stripeEnv() == "production"
        ? process.env.STRIPE_PUBLIC_KEY
        : process.env.STRIPE_PUBLIC_KEY_TEST

    if (!publicKey) throw new Error("no stripe public key")

    __stripeClient = (await loadStripe(publicKey)) ?? undefined
  }

  if (!__stripeClient) throw new Error("no stripe client created")

  return __stripeClient
}
