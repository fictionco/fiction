import { getEnvVars, isTest, isApp } from "@factor/api"

const vars = [
  { v: "NODE_ENV" },
  { v: "FACTOR_SERVER_URL", app: true },
  { v: "FACTOR_APP_URL", app: true },
  { v: "SMTP_HOST", live: true },
  { v: "SMTP_USER", live: true },
  { v: "SMTP_PASSWORD", live: true },
  { v: "POSTGRES_URL" },
  { v: "GOOGLE_CLIENT_SECRET" },
  { v: "STRIPE_SECRET_KEY_TEST" },
] as const

export const env = getEnvVars({
  vars,
  isLive: !isTest(),
  isApp: isApp(),
})

export type EnvVars = typeof env
