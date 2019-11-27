import { resolve, dirname } from "path"

import moduleAlias from "module-alias"

export default () => {
  const { main = "index.js" } = require(resolve(process.env.FACTOR_CWD, "package.json"))

  const cwd = process.env.FACTOR_CWD || process.cwd()

  moduleAlias.addAlias("__CWD__", cwd)
  moduleAlias.addAlias("__SRC__", dirname(resolve(cwd, main)))
  moduleAlias.addAlias("__FALLBACK__", dirname(require.resolve("@factor/app")))
}
