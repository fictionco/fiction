import { importServerEntry } from "@factor/engine/nodeUtils"
import { setupEnvironment } from "@factor/server"
process.env.POSTGRES_URL = "http://test:test@localhost:5432/test"
process.env.POSTGRES_PASSWORD = "test"
process.env.TEST_ENV = "unit"

const serverConfig = await importServerEntry("@factor/site")
await setupEnvironment({
  variables: {
    FACTOR_APP_NAME: "FactorJS",
    FACTOR_APP_EMAIL: "hi@factorjs.org",
    FACTOR_APP_URL: "https://www.factorjs.org",
  },
  ...serverConfig,
})
