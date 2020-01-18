import { dirname, resolve } from "path"
import { ChildProcess } from "child_process"
import { removeSync, readFileSync } from "fs-extra"
import { spawn } from "cross-spawn"
import { waitFor } from "@test/utils"

jest.setTimeout(120000)

const unicodeKeys = {
  up: "\u001B\u005B\u0041",
  down: "\u001B\u005B\u0042",
  enter: "\u000D",
  space: "\u0020"
}

let spawnedProcess: ChildProcess
const APP_FOLDER = "generated-app"
const cwd = dirname(require.resolve("@test/create-factor-app"))
describe("create-factor-app", () => {
  beforeAll(() => {
    removeSync(resolve(cwd, APP_FOLDER))
  })

  describe("cli", () => {
    it("asks for app name, email, url", async () => {
      await waitFor(10000)

      spawnedProcess = spawn("npx", ["create-factor-app", APP_FOLDER], {
        detached: true,
        cwd
      })

      const output: string[] = []

      if (spawnedProcess.stdout) {
        spawnedProcess.stdout.on("data", data => {
          output.push(data.toString())
        })
      }

      if (spawnedProcess.stderr) {
        spawnedProcess.stderr.on("data", data => {
          output.push(`[err] ${data.toString()}`)
        })
      }

      await waitFor(200)

      if (spawnedProcess.stdin) {
        spawnedProcess.stdin.write(`UNIT-TEST${unicodeKeys.enter}`)
      }

      await new Promise(resolve => {
        spawnedProcess.on("close", () => resolve())
      })

      const cliOutput = JSON.parse(JSON.stringify(output.join(" ")))

      expect(cliOutput).toContain(APP_FOLDER)

      const gitIgnore = readFileSync(resolve(cwd, APP_FOLDER, ".gitignore"), "utf-8")

      expect(gitIgnore).toContain(".env")

      const packageJson = require(resolve(cwd, APP_FOLDER, "package.json"))

      expect(packageJson.name).toEqual("unit-test")
    })

    it("create-factor-app runs", async () => {
      spawnedProcess = spawn("yarn", ["factor", "create-loaders"], {
        detached: true,
        cwd: `${cwd}/${APP_FOLDER}`
      })

      await new Promise(resolve => {
        spawnedProcess.on("close", () => resolve())
      })

      let err

      try {
        await import(resolve(cwd, APP_FOLDER, ".factor/loader-server"))
      } catch (error) {
        err = error

        throw error
      }

      expect(err).toBe(undefined)
    })
  })
})
