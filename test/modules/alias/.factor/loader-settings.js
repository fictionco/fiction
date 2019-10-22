const cwd = process.env.FACTOR_CWD || process.cwd()
console.log("CWD", cwd)
let m = {}
try {
  m = require(`${cwd}/.factor/loader-settings.js`)
} catch (error) {}

module.exports = m
