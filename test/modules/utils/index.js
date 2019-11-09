/* eslint-disable jest/no-export */
import { dirname, resolve } from "path"
import { runCallbacks } from "@factor/tools"
import { factorize } from "@factor/cli/factorize"
export { default as getPort } from "get-port"
export { default as rp } from "request-promise-native"
import { removeSync } from "fs-extra"
import { generateLoaders } from "@factor/cli/extension-loader"
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

  removeSync(resolve(process.env.FACTOR_CWD, ".factor"))
  removeSync(resolve(process.env.FACTOR_CWD, "dist"))

  test(`Build ${fixture}`, async () => {
    let error

    try {
      generateLoaders()
      await factorize()

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

  return await factorize()
}
