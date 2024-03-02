import { createRequire } from "module"
import { beforeAll } from "vitest"
import dotenv from "dotenv"

process.env.IS_TEST = "1"
process.env.TEST_ENV = "unit"

const require = createRequire(import.meta.url)

const p = require.resolve("../.env.test")

dotenv.config({ path: p })
/**
 * IN SETUP just do global test variables, don't do imports
 */
beforeAll(async () => {
  process.env.IS_TEST = "1"
  process.env.TEST_ENV = "unit"
  process.env.POSTGRES_URL = "http://test:test@localhost:5432/test"
  process.env.MODE = process.env.NODE_ENV = "development"
})
