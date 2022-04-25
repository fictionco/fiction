import { getEnvVars, isTest, isApp } from "@factor/api"

const vars = [
  { v: "mode", val: process.env.NODE_ENV as "development" | "production" },
  { v: "port", val: process.env.FACTOR_SERVER_PORT || process.env.PORT },
  { v: "portApp", val: process.env.FACTOR_APP_PORT },
  { v: "serverUrl", val: process.env.FACTOR_SERVER_URL, app: true },
  { v: "appUrl", val: process.env.FACTOR_APP_URL, app: true },
  { v: "smtpHost", val: process.env.SMTP_HOST, live: true },
  { v: "smtpUser", val: process.env.SMTP_USER, live: true },
  { v: "smtpPassword", val: process.env.SMTP_PASSWORD, live: true },
  { v: "postgresUrl", val: process.env.POSTGRES_URL },
  { v: "googleClientSecret", val: process.env.GOOGLE_CLIENT_SECRET },
  { v: "stripeSecretKeyTest", val: process.env.STRIPE_SECRET_KEY_TEST },
  { v: "tokenSecret", val: process.env.FACTOR_TOKEN_SECRET },
] as const

export const env = getEnvVars({
  vars,
  isLive: !isTest(),
  isApp: isApp(),
})

export type EnvVars = typeof env
