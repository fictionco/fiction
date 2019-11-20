import { stdin } from "mock-stdin"
import { spawn } from "cross-spawn"
import { waitFor } from "@test/utils"
import { dirname } from "path"
const keys = {
  up: "\u001B\u005B\u0041",
  down: "\u001B\u005B\u0042",
  enter: "\u000D",
  space: "\u0020"
}
describe("create-factor-app", () => {
  let io = null
  beforeAll(() => (io = stdin()))
  afterAll(() => io.restore())
  describe("cli", () => {
    it("asks for app name, email, url", async () => {
      const cwd = dirname(require.resolve("./test-files/init.json"))
      const __spawned = spawn("npx", ["create-factor-app"], { detached: true, cwd })

      __spawned.stdout.on("data", data => {
        console.log(`${data.toString()}`)
      })

      await waitFor(200)

      __spawned.stdin.write(`PROJECT-NAME${keys.enter}`)

      await waitFor(200)

      __spawned.stdin.write(`PROJECT-DESCRIPTION${keys.enter}`)

      await waitFor(200)

      __spawned.stdin.write(`ELVIS${keys.enter}`)

      await waitFor(200)

      __spawned.stdin.write(`elvis@fiction.com${keys.enter}`)

      await waitFor(200)

      __spawned.stdin.write(`${keys.down}${keys.enter}`)

      await waitFor(200)

      __spawned.stdin.write(`${keys.enter}`)

      await waitFor(200)

      __spawned.stdin.write(`${keys.enter}`)

      await new Promise(resolve => {
        __spawned.on("close", code => {
          resolve()
        })
      })
    })
    it.todo("provides guidance on how to get started")
    it.todo("logs package version (needed in case of cache)")
    it.todo("asks if minimal or recommended app is desired")
    it.todo("asks theme should be installed")
  })

  describe("generated app", () => {
    it.todo("generates app correctly")
    it.todo("renders")
  })
})
