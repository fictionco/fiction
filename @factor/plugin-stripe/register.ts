import { vars, EnvVar } from "@factor/api/plugin-env"

vars.register(() => [
  new EnvVar({
    name: "STRIPE_SECRET_KEY_PROD",
    val: process.env.STRIPE_SECRET_KEY_PROD,
    verify: ({ factorEnv, value }) => {
      return factorEnv.isProd() && !value ? false : true
    },
  }),
  new EnvVar({
    name: "STRIPE_SECRET_KEY_TEST",
    val: process.env.STRIPE_SECRET_KEY_TEST,
  }),
])
