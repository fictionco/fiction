const cwd = process.env.FACTOR_CWD || process.cwd()

let m = {}
try {
  m = require(`${cwd}/.factor/loader-settings.js`)
} catch (error) {
  console.error(error)
}

module.exports = m
