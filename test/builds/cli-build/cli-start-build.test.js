import { resolve } from "path"

import { removeSync } from "fs-extra"

import { getPort, rp, waitFor } from "@test/utils"
import { startProcess, closeProcess, getUrl } from "./build-util"

jest.setTimeout(80000)

// Don't run these in windows
describe["posix"]("cli factor start", () => {
  beforeAll(() => {
    process.env.FACTOR_CWD = __dirname
    removeSync(resolve(__dirname, ".factor"))
    removeSync(resolve(__dirname, "dist"))
  })

  it("builds and serves", async () => {
    let error

    process.env.PORT = String(await getPort())

    const __process = await startProcess({
      command: "start",
      env: process.env,
      callback: __process => {
        __process.on("error", err => {
          error = err
        })
      },
      cwd: __dirname
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
