import { vars, EnvVar } from "@factor/api/plugin-env"

vars.register(() => [
  new EnvVar({
    name: "stripeSecretKeyTest",
    val: process.env.STRIPE_SECRET_KEY_TEST,
  }),
])

export * from "./subscription"
export * from "./plugin"
export * from "./types"
