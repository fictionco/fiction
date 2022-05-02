import { EnvVar } from "@factor/api/plugin-env"

export const envVars = () => [
  new EnvVar({
    name: "smtpHost",
    val: process.env.SMTP_HOST,
    mode: "production",
  }),
  new EnvVar({
    name: "smtpUser",
    val: process.env.SMTP_USER,
    mode: "production",
  }),
  new EnvVar({
    name: "smtpPassword",
    val: process.env.SMTP_PASSWORD,
    mode: "production",
  }),
  new EnvVar({ name: "postgresUrl", val: process.env.POSTGRES_URL }),
  new EnvVar({
    name: "googleClientSecret",
    val: process.env.GOOGLE_CLIENT_SECRET,
  }),
  new EnvVar({
    name: "stripeSecretKeyTest",
    val: process.env.STRIPE_SECRET_KEY_TEST,
  }),
  new EnvVar({ name: "tokenSecret", val: process.env.FACTOR_TOKEN_SECRET }),
]
