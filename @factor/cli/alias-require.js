import { resolve, dirname } from "path"

import moduleAlias from "module-alias"

export default () => {
  const { main = "index.js" } = require(resolve(process.env.FACTOR_CWD, "package.json"))

  const cwd = process.env.FACTOR_CWD || process.cwd()
  moduleAlias.addAlias("~", cwd)
  moduleAlias.addAlias("@", dirname(resolve(cwd, main)))
  moduleAlias.addAlias("#", dirname(require.resolve("@factor/app")))
}
