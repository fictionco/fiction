const BUILD_ENV = process.env.BUILD_ENV
const execa = require("execa")

if (!BUILD_ENV) {
  // eslint-disable-next-line no-console
  console.error("NO BUILD_ENV variable")
  return
}

execa("yarn", ["workspace", BUILD_ENV, "factor", "build"]).stdout.pipe(process.stdout)
