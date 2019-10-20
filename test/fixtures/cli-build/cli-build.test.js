import { resolve, join } from "path"
import { spawn } from "cross-spawn"
import { writeFileSync, removeSync } from "fs-extra"

import { getPort, rp, waitFor } from "@test/utils"
let port
const rootDir = __dirname

const url = route => `http://localhost:${port}${route}`

const spawnFactor = (command, _options) =>
  spawn("yarn", ["factor", command], { cwd: rootDir, ..._options })

const start = (cmd, env, cb) => {
  return new Promise(resolve => {
    const __process = spawnFactor(cmd, { env, detached: true })

    const listener = data => {
      if (data.includes(`Ready`) || data.includes(`Listening on PORT`)) {
        __process.stdout.removeListener("data", listener)
        resolve(__process)
      }
    }
    if (typeof cb === "function") cb(__process)

    __process.stdout.on("data", listener)
    __process.stderr.on("data", data =>
      data
        .toString()
        .toLowerCase()
        .includes("error")
        ? console.error(data.toString())
        : null
    )
  })
}

const close = __process => {
  return new Promise(resolve => {
    __process.on("exit", resolve)
    process.kill(-__process.pid)
  })
}

describe.posix("build-commands", () => {
  beforeEach(() => {
    removeSync(resolve(rootDir, ".factor"))
    removeSync(resolve(rootDir, "dist"))
  })

  // test("build from factor dev", async () => {
  //   console.log("dev tst")
  //   const { env } = process
  //   env.PORT = port = await getPort()

  //   const __process = await start("dev", env, __process => {
  //     __process.on("error", err => {
  //       error = err
  //     })
  //   })

  //   // Wait 2s for picking up changes
  //   await waitFor(2000)

  //   // [Add actual test for changes here]

  //   await close(__process)

  // })

  test("build with factor start", async () => {
    let error

    const { env } = process
    env.PORT = port = await getPort()

    const __process = await start("start", env, __process => {
      __process.on("error", err => {
        error = err
      })
    })

    expect(error).toBe(undefined)
    const theUrl = url("/")
    console.log("RULR", theUrl)

    const html = await rp(theUrl)
    expect(html).toMatch("hi")

    await close(__process)
  })
})
