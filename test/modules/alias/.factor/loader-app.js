const cwd = process.env.FACTOR_CWD || process.cwd()

let m = {}
try {
  m = require(`${cwd}/.factor/loader-app.js`).default
} catch (error) {
  if (!error instanceof Error || error.code !== "MODULE_NOT_FOUND") console.error(error)
}

export default m
