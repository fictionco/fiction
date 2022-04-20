import { getEnvVars, isTest } from "@factor/api"

const serverVars = [
  "POSTGRES_URL",
  "GOOGLE_CLIENT_SECRET",
  "STRIPE_SECRET_KEY_TEST",
] as const

const serverVarsProduction = [
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASSWORD",
] as const
const appVars = ["FACTOR_SERVER_URL", "FACTOR_APP_URL"] as const
export const env = getEnvVars({
  serverVars,
  serverVarsProduction,
  appVars,
  isTest: isTest(),
})
