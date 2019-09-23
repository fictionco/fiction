const execa = require("execa")
const Factor = require("vue")
import { exec } from "child_process"
import { resolve } from "path"
import { promisify } from "util"

const execify = promisify(exec)

const binFile = resolve(__dirname, "../cli.js")

jest.mock("execa")
jest.mock("@factor/server-extend", () => ({ default: () => ({ run: async () => {} }) }))
Factor.$filters = { callback: () => {} }
describe("cli scripts", () => {
  let cli
  beforeAll(async () => {
    cli = require("../cli.js").default
  })

  test("cli commands exist", () => {
    const programCommands = cli.program.commands.map(c => c._name)
    const cmds = ["dev", "start", "setup", "build", "serve", "run", "help"]

    cmds.forEach(cmd => {
      expect(programCommands).toContain(cmd)
    })
  })

  test("generates loader files", async () => {
    await cli.extend({ install: true })

    // const { stdout } = await execify(`node -r esm ${binFile} dev`)
    // console.log(stdout)
    // expect(stdout.includes("success")).toBe(true)

    // // await execa(`yarn`, ["factor", "dev"], {
    // //   stdout: process.stdout,
    // //   stderr: process.stderr,
    // //   stdin: process.stdin
    // // })

    expect(execa).toHaveBeenCalledWith(
      "factor",
      expect.arrayContaining(["run", "create-loaders"]),
      expect.any(Object)
    )
  })

  test("runs yarn install", async () => {
    await cli.extend({ install: true })

    expect(execa).toHaveBeenCalledWith(
      "yarn",
      expect.arrayContaining(["install"]),
      expect.any(Object)
    )
  })

  test("dev starts development server", () => {})
})
