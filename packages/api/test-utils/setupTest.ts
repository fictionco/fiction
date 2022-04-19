import path from "path"
import { createRequire } from "module"
import fs from "fs-extra"
import { beforeAll } from "vitest"

import dotenv from "dotenv"
import { randomBetween } from "../utils"

const require = createRequire(import.meta.url)

const p = require.resolve("@factor/site/.env.test")

dotenv.config({ path: p })
/**
 * IN SETUP just do global test variables, don't do imports
 */
beforeAll(async () => {
  process.env.POSTGRES_URL = "http://test:test@localhost:5432/test"
  process.env.POSTGRES_PASSWORD = "test"
  process.env.NODE_ENV = "development"
  process.env.TEST_ENV = "unit"
  process.env.FACTOR_TOKEN_SECRET = "test"
  process.env.PORT = process.env.FACTOR_SERVER_PORT = String(
    randomBetween(1000, 10_000),
  )
  process.env.FACTOR_APP_NAME = "FactorJS"
  process.env.FACTOR_APP_EMAIL = "hi@factorjs.org"
})
