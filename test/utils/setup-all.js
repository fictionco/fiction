import { generateLoaders } from "@factor/build/util"
import { dirname } from "path"

module.exports = async () => {
  process.env.FACTOR_ENV = "test"
  process.env.FACTOR_CWD = dirname(require.resolve("@test/loader-basic"))
  generateLoaders()
}
