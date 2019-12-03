import { resolve, dirname } from "path"

import moduleAlias from "module-alias"

export default (): void => {
  const cwd = process.env.FACTOR_CWD ?? process.cwd()
  const primaryPackage = resolve(cwd, "package.json")
  const { main = "index.js" } = require(primaryPackage)

  moduleAlias.addAlias("__CWD__", cwd)
  moduleAlias.addAlias("__SRC__", dirname(resolve(cwd, main)))
  moduleAlias.addAlias("__FALLBACK__", dirname(require.resolve("@factor/app")))
}
