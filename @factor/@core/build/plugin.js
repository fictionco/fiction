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

  require("@factor/build-extend")(Factor, FACTOR_CONFIG)

  Factor.$filters.apply("server")
}
