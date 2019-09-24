const execa = require("execa")
const Factor = require("vue")

jest.mock("execa")

process.env.FACTOR_ENV = "test"

const cli = require("../cli.js").default
describe("cli scripts", () => {
  beforeEach(() => {})

  test("verify cli commands exist", () => {
    const programCommands = cli.program.commands.map(c => c._name)
    const cmds = ["dev", "start", "setup", "build", "serve", "run"]

    cmds.forEach(cmd => {
      expect(programCommands).toContain(cmd)
    })
  })

  test("runs dev command", async () => {
    // Setup

    const spy = jest.spyOn(cli, "runServer").mockImplementation(_ => _)

    // Run
    await cli.runCommand({ command: "dev", install: false, NODE_ENV: "development" })

    // Assert
    expect(process.env.FACTOR_COMMAND).toBe("dev")

    expect(spy).toBeCalledWith(
      expect.objectContaining({
        NODE_ENV: "development"
      })
    )
  })

  test("generates loader files", async () => {
    await cli.extend({ install: true })

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
})

// import { exec } from "child_process"
// import { resolve } from "path"
// import { promisify } from "util"

// const execify = promisify(exec)

// const binFile = resolve(__dirname, "../cli.js")
// const { stdout } = await execify(`node -r esm ${binFile} dev`)
// console.log(stdout)
// expect(stdout.includes("success")).toBe(true)
