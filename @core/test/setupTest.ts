import { beforeAll } from "vitest"

import { randomBetween } from "@factor/api/utils"

/**
 * IN SETUP just do global test variables, don't do imports
 */
beforeAll(async () => {
  process.env.POSTGRES_URL = "http://test:test@localhost:5432/test"
  process.env.POSTGRES_PASSWORD = "test"
  process.env.NODE_ENV = "development"
  process.env.TEST_ENV = "unit"
  process.env.FACTOR_TOKEN_SECRET = "test"
  process.env.PORT = String(randomBetween(1000, 10_000))
  process.env.FACTOR_APP_NAME = "FactorJS"
  process.env.FACTOR_APP_EMAIL = "hi@factorjs.org"
})
