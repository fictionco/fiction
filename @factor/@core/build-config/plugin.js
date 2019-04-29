const { resolve } = require("path")
const argv = require("yargs").argv
const env = process.env.NODE_ENV == "development" ? "development" : "production"

module.exports = () => {
  const baseDir = process.cwd()

  let { factor: USER_CONFIG = {}, url = "", port = 7777 } = require(resolve(baseDir, "package"))

  try {
    //var userFile = require(resolve(baseDir, "factor-config.js"))
    USER_CONFIG = Object.assign({}, USER_CONFIG, {})
  } catch (error) {}

  const DEFAULT_CONFIG = {
    baseDir,
    argv
  }

  const FACTOR_CONFIG = Object.assign({}, DEFAULT_CONFIG, { env, url, port }, USER_CONFIG)

  return FACTOR_CONFIG
}
