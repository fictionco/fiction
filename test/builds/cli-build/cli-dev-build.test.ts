import { resolve } from "path"

import { ChildProcess } from "child_process"
import { removeSync } from "fs-extra"

import { getPort, waitFor } from "@test/utils"
import rp from "request-promise-native"
import { startProcess, closeProcess, getUrl } from "./build-util"
jest.setTimeout(70000)

// Don't run these in windows
describe.posix("cli factor dev", () => {
  beforeAll(() => {
    removeSync(resolve(__dirname, ".factor"))
    removeSync(resolve(__dirname, "dist"))
  })

  it("it builds and serves for development", async () => {
    let error

    process.env.PORT = String(await getPort())

    const __process = await startProcess({
      command: "dev",
      env: process.env,
      callback: (__process: ChildProcess) => {
        __process.on("error", (err) => {
          error = err
        })
      },
      cwd: __dirname,
    })

    const SECOND = 1000
    await waitFor(SECOND)

    expect(error).toBe(undefined)

    const theUrl = getUrl({ route: "/", port: process.env.PORT })

    const html = await rp(theUrl)

    expect(html).toMatch("hi")

    await closeProcess(__process)
  })
})
