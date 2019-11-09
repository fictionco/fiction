const cwd = process.env.FACTOR_CWD || process.cwd()

let m = []
try {
  const mod = require(`${cwd}/.factor/loader-settings.js`).default

  if (mod) m = mod
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") console.error(error)
}

export default m
