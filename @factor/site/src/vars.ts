import { EnvVar } from "@factor/api/plugin-env"

export const envVars = () => [
  new EnvVar({
    name: "googleClientSecret",
    val: process.env.GOOGLE_CLIENT_SECRET,
  }),
  new EnvVar({
    name: "stripeSecretKeyTest",
    val: process.env.STRIPE_SECRET_KEY_TEST,
  }),

  new EnvVar({ name: "awsAccessKey", val: process.env.AWS_ACCESS_KEY }),
  new EnvVar({
    name: "awsAccessKeySecret",
    val: process.env.AWS_ACCESS_KEY_SECRET,
  }),
]
