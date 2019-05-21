const { resolve } = require("path")
const argv = require("yargs").argv
const env = process.env.NODE_ENV == "development" ? "development" : "production"
const merge = require("deepmerge")
const { existsSync } = require("fs-extra")
module.exports = () => {
  const baseDir = process.cwd()

  let { factor: USER_CONFIG = {}, ...pkg } = require(resolve(baseDir, "package"))

  const configFilePath = resolve(baseDir, "factor-config.json")
  let configFile = {}
  if (existsSync(configFilePath)) {
    configFile = require(resolve(baseDir, "factor-config.json"))
  }

  const configObjects = [configFile[this.env], configFile.config, { env }].filter(_ => typeof _ != "undefined")

  USER_CONFIG = Object.assign({}, USER_CONFIG, merge.all(configObjects))

  const DEFAULT_CONFIG = {
    baseDir,
    argv,
    env
  }

  const FACTOR_CONFIG = Object.assign({}, DEFAULT_CONFIG, pkg, USER_CONFIG)

  return FACTOR_CONFIG
}
