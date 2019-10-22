const cwd = process.env.FACTOR_CWD || process.cwd()

let m = {}
try {
  const mod = require(`${cwd}/.factor/loader-server.js`).default

  if (mod) m = mod
} catch (error) {
  console.error(error)
}

export default m
