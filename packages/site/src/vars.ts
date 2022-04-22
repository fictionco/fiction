import { getEnvVars, isTest, isApp } from "@factor/api"

const vars = [
  { v: "mode", val: process.env.NODE_ENV },
  { v: "serverUrl", val: process.env.FACTOR_SERVER_URL, app: true },
  { v: "appUrl", val: process.env.FACTOR_APP_URL, app: true },
  { v: "smtpHost", val: process.env.SMTP_HOST, live: true },
  { v: "smtpUser", val: process.env.SMTP_USER, live: true },
  { v: "smtpPassword", val: process.env.SMTP_PASSWORD, live: true },
  { v: "postgresUrl", val: process.env.POSTGRES_URL },
  { v: "googleClientSecret", val: process.env.GOOGLE_CLIENT_SECRET },
  { v: "stripeSecretKeyTest", val: process.env.STRIPE_SECRET_KEY_TEST },
] as const

export const env = getEnvVars({
  vars,
  isLive: !isTest(),
  isApp: isApp(),
})

export type EnvVars = typeof env
