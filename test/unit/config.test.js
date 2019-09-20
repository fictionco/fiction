import { resolve, join } from "path"
import { spawn } from "cross-spawn"
import { writeFileSync } from "fs-extra"
import { getPort, rp, waitFor } from "../utils"

let port
const rootDir = resolve(__dirname, "..", "fixtures/cli")

const url = route => "http://localhost:" + port + route

const factorBin = resolve(__dirname, "../../@factor/@core/cli/cli.js")

const spawnFactor = (command, opts) =>
  spawn("yarn", ["factor", command], { cwd: rootDir, ...opts })

const start = (cmd, env, cb) => {
  return new Promise(resolve => {
    const FactorProcess = spawnFactor(cmd, { env, detached: true })
    const listener = data => {
      if (data.includes(`Ready`)) {
        FactorProcess.stdout.removeListener("data", listener)
        resolve(FactorProcess)
      }
    }
    if (typeof cb === "function") {
      cb(FactorProcess)
    }
    FactorProcess.stdout.on("data", listener)
    FactorProcess.stderr.on("data", data =>
      data
        .toString()
        .toLowerCase()
        .includes("error")
        ? console.error(data.toString())
        : null
    )
  })
}

const close = FactorProcess => {
  return new Promise(resolve => {
    FactorProcess.on("exit", resolve)
    process.kill(-FactorProcess.pid)
  })
}

describe.posix("cli", () => {
  test("yarn factor dev", async () => {
    const { env } = process
    env.PORT = port = await getPort()

    const FactorProcess = await start("dev", env)

    // Wait 2s for picking up changes
    await waitFor(2000)

    // [Add actual test for changes here]

    await close(FactorProcess)
  })

  test("yarn factor start", async () => {
    let error

    const { env } = process
    env.PORT = port = await getPort()

    const startProcess = await start("start", env, startProcess => {
      startProcess.on("error", err => {
        error = err
      })
    })

    expect(error).toBe(undefined)

    const html = await rp(url("/"))
    expect(html).toMatch("<div>CLI Test</div>")

    await close(startProcess)
  })
})
