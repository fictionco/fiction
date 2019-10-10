const cwd = process.env.FACTOR_CWD || process.cwd()

let m = {}
try {
  m = require(`${cwd}/.factor/loader-app.js`)
} catch (error) {}

module.exports = m
