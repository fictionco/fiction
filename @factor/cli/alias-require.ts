import { resolve, dirname } from "path"

import moduleAlias from "module-alias"
import { applyFilters } from "@factor/api/hooks"
export default (): void => {
  const cwd = process.env.FACTOR_CWD ?? process.cwd()
  const primaryPackage = resolve(cwd, "package.json")
  const { main = "index.js" } = require(primaryPackage)

  moduleAlias.addAlias("__CWD__", (fromPath, request, alias) => {
    return applyFilters("node-alias-cwd", cwd, { fromPath, request, alias })
  })

  moduleAlias.addAlias("__SRC__", (fromPath, request, alias) => {
    return applyFilters("node-alias-src", dirname(resolve(cwd, main)), {
      fromPath,
      request,
      alias
    })
  })

  moduleAlias.addAlias("__FALLBACK__", dirname(require.resolve("@factor/app")))
}
