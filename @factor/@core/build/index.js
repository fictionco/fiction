const { resolve } = require("path")
const argv = require("yargs").argv

export default Factor => {
  const baseDir = process.env.FACTOR_CWD || process.cwd()
  let { factor: USER_CONFIG = {}, ...packageJson } = require(resolve(baseDir, "package"))

  return Object.assign({}, argv, packageJson, USER_CONFIG)
}
