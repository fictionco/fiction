import { resolve, join } from "path"
import { spawn } from "cross-spawn"
import { writeFileSync } from "fs-extra"
import { getPort, rp, waitFor } from "../utils"

let port
const rootDir = resolve(__dirname, "..", "fixtures/cli")

const url = route => "http://localhost:" + port + route

const factorBin = resolve(__dirname, "../../@factor/@core/cli/cli.js")

const spawnFactor = (command, opts) =>
  spawn("yarn", ["factor", "dev"], { cwd: rootDir, ...opts })

const start = (cmd, env, cb) => {
  return new Promise(resolve => {
    const Factor = spawnFactor(cmd, { env, detached: true })
    const listener = data => {
      console.log("here", data.toString())
      if (data.includes(`${port}`)) {
        Factor.stdout.removeListener("data", listener)
        resolve(Factor)
      }
    }
    if (typeof cb === "function") {
      cb(Factor)
    }
    Factor.stdout.on("data", listener)
  })
}

const close = Factor => {
  return new Promise(resolve => {
    Factor.on("exit", resolve)
    process.kill(-Factor.pid)
  })
}

describe.posix("cli", () => {
  test("CLI: factor dev", async () => {
    const { env } = process
    env.PORT = port = await getPort()

    const FactorDev = await start("dev", env)

    // // Change file specified in `watchers` (nuxt.config.js)
    // const customFilePath = join(rootDir, "custom.file")
    // writeFileSync(customFilePath, "This file is used to test custom chokidar watchers.")

    // // Change file specified in `serverMiddleware` (nuxt.config.js)
    // const serverMiddlewarePath = join(rootDir, "middleware.js")
    // writeFileSync(
    //   serverMiddlewarePath,
    //   "// This file is used to test custom chokidar watchers.\n"
    // )
    console.log("here")

    // Wait 2s for picking up changes
    await waitFor(2000)

    // [Add actual test for changes here]

    await close(FactorDev)
  })

  // test("nuxt start", async () => {
  //   let error

  //   const { env } = process
  //   env.PORT = port = await getPort()

  //   await new Promise(resolve => {
  //     const nuxtBuild = spawnFactor("build", { env })
  //     nuxtBuild.on("close", resolve)
  //   })

  //   const nuxtStart = await start("start", env, nuxtStart => {
  //     nuxtStart.on("error", err => {
  //       error = err
  //     })
  //   })

  //   expect(error).toBe(undefined)

  //   const html = await rp(url("/"))
  //   expect(html).toMatch("<div>CLI Test</div>")

  //   await close(nuxtStart)
  // })
})
