const { resolve } = require("path")
const argv = require("yargs").argv
module.exports = () => {
  const baseDir = process.cwd()

  let { factor: USER_CONFIG = {} } = require(resolve(baseDir, "package"))

  try {
    var userFile = require(resolve(baseDir, "factor-config.js"))
    USER_CONFIG = Object.assign({}, USER_CONFIG, userFile)
  } catch (error) {}

  const DEFAULT_CONFIG = {
    baseDir,
    argv
  }

  const FACTOR_CONFIG = Object.assign({}, DEFAULT_CONFIG, USER_CONFIG)

  return FACTOR_CONFIG
}
