import { beforeAll } from "vitest"
import { setup } from "@factor/server"

const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

beforeAll(async () => {
  process.env.POSTGRES_URL = "http://test:test@localhost:5432/test"
  process.env.POSTGRES_PASSWORD = "test"
  process.env.TEST_ENV = "unit"
  process.env.FACTOR_TOKEN_SECRET = "test"

  process.env.PORT = String(randomIntFromInterval(1000, 10_000))

  await setup({ moduleName: "@factor/site" })
})
