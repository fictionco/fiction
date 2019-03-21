const Factor = require("vue")
const { resolve } = require("path")
const argv = require("yargs").argv
module.exports = async (USER_CONFIG = {}) => {
  const baseDir = process.cwd()

  const pkg = require(resolve(baseDir, "package"))

  if (pkg.factor) {
    USER_CONFIG = Object.assign({}, USER_CONFIG, pkg.factor)
  }

  try {
    var userFile = require(resolve(baseDir, "factor.js"))
    USER_CONFIG = Object.assign({}, USER_CONFIG, userFile)
  } catch (error) {}

  const DEFAULT_CONFIG = {
    baseDir,
    pkg,
    argv
  }

  const FACTOR_CONFIG = Object.assign({}, DEFAULT_CONFIG, USER_CONFIG)
  // Add aliases for modules
  // This allows us to use the same format for node/webpack
  // (otherwise webpack doesn't allow variables in imports)

  require("@factor/build-extend")(Factor, FACTOR_CONFIG)

  const {
    setup,
    argv: { build }
  } = FACTOR_CONFIG

  // User defined setup hook
  // The code that trigger this should be in the start.js in the app 'config' folder
  if (typeof setup == "function") {
    setup(Factor)
  }

  if (build) {
    await Factor.$filters.apply("build-production")
  }

  Factor.$filters.apply("server")
}
