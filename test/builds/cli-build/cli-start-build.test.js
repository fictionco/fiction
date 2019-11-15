import { resolve } from "path"

import { removeSync } from "fs-extra"

import { getPort, rp, waitFor } from "@test/utils"
import { startProcess, closeProcess, getUrl } from "./build-util"

jest.setTimeout(90000)
let port
// Don't run these in windows
describe["posix"]("cli factor start", () => {
  beforeAll(() => {
    process.env.FACTOR_CWD = __dirname
    removeSync(resolve(__dirname, ".factor"))
    removeSync(resolve(__dirname, "dist"))
  })

  it("builds and serves", async () => {
    let error

    process.env.PORT = await getPort()
    port = process.env.PORT
    console.log(process.env.PORT)
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
    console.log("1process.env.PORT", process.env.PORT)
    const theUrl = getUrl({ route: "/", port })

    const html = await rp(theUrl)
    expect(html).toMatch("hi")

    await closeProcess(__process)
  })
})
