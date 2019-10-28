import { resolve, dirname } from "path"

import moduleAlias from "module-alias"

export default () => {
  const { main = "index.js" } = require(resolve(process.env.FACTOR_CWD, "package.json"))

  moduleAlias.addAlias("~", process.env.FACTOR_CWD)
  moduleAlias.addAlias("@", dirname(resolve(process.env.FACTOR_CWD, main)))
  moduleAlias.addAlias("#", dirname(require.resolve("@factor/app")))
}
