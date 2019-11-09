const execa = require("execa")

function run() {
  if (!process.env.BUILD_ENV) {
    // eslint-disable-next-line no-console
    console.error("no BUILD_ENV variable is set")
    return
  }

  execa("yarn", ["workspace", process.env.BUILD_ENV, "factor", "build"]).stdout.pipe(
    process.stdout
  )
}

run()
