const cwd = process.env.FACTOR_CWD || process.cwd()

let m = {}
try {
  m = require(`${cwd}/.factor/loader-app.js`).default
} catch (error) {}

export default m
