/* eslint-disable no-console */
const execa = require("execa")

const run = () => {
  if (!process.env.BUILD_ENV) {
    console.error("no BUILD_ENV variable is set")
    return
  } else {
    console.log("Building App", process.env.BUILD_ENV)
  }

  const _process = execa("yarn", ["workspace", process.env.BUILD_ENV, "factor", "build"])

  if (_process.stdout) {
    _process.stdout.pipe(process.stdout)
  }

  if (_process.stderr) {
    _process.stderr.pipe(process.stderr)
  }
}

run()
