const execa = require("execa")

const run = () => {
  if (!process.env.BUILD_ENV) {
    // eslint-disable-next-line no-console
    console.error("no BUILD_ENV variable is set")
    return
  }

  const _process = execa("yarn", ["workspace", process.env.BUILD_ENV, "factor", "build"])

  if (_process.stdout) {
    _process.stdout.pipe(process.stdout)
  }
}

run()