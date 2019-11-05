/* eslint-disable jest/no-export */
import { dirname } from "path"
import { runCallbacks } from "@factor/tools"
export { default as getPort } from "get-port"
export { default as rp } from "request-promise-native"

export const waitFor = ms => {
  return new Promise(resolve => setTimeout(resolve, ms || 0))
}

export const indexHtml = () => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>NOT SET</title>
    </head>
    <body>
      <div id="app"></div> 
    </body>
  </html>`
}

export const buildFixture = fixture => {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))
  process.env.FACTOR_ENV = "test"

  test(`Build ${fixture}`, async () => {
    let error
    const cli = require("@factor/cli")

    try {
      await cli.factorize()

      await runCallbacks("create-distribution-app", { testing: true })
    } catch (error_) {
      error = error_
    }

    expect(error).not.toBeTruthy()
  }, 100000)
}

export const loadFixture = async fixture => {
  process.env.FACTOR_CWD = dirname(require.resolve(fixture))
  process.env.FACTOR_ENV = "test"
  const cli = require("@factor/cli")

  return await cli.factorize()
}
