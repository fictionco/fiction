const execa = require("execa")
const Factor = require("vue")

jest.mock("execa")

process.env.FACTOR_ENV = "test"

const cli = require("../cli.js").default
describe("cli scripts", () => {
  beforeAll(async () => {
    await cli.factorize()
    jest.spyOn(process, "exit").mockImplementation(code => code)
  })

  afterAll(() => {
    process.exit.mockRestore()
  })

  test("verify cli commands exist", () => {
    const programCommands = cli.program.commands.map(c => c._name)
    const cmds = ["dev", "start", "setup", "build", "serve", "run"]

    cmds.forEach(cmd => {
      expect(programCommands).toContain(cmd)
    })
  })

  test("command: dev", async () => {
    const spy = jest.spyOn(cli, "runServer").mockImplementation(_ => _)
    await cli.runCommand({
      command: "dev",
      install: false,
      extend: false
    })
    expect(process.env.FACTOR_COMMAND).toBe("dev")

    expect(spy).toBeCalledWith(
      expect.objectContaining({
        NODE_ENV: "development"
      })
    )
  })

  test("command: build", async () => {
    const spy = jest.spyOn(Factor.$filters, "run").mockImplementation(_ => _)

    await cli.runCommand({ command: "build", extend: false })

    expect(spy).toBeCalledWith("create-distribution-app", expect.any(Object))
    expect(process.exit).toHaveBeenCalledTimes(1)
  })

  test("command: serve", async () => {
    const spy = jest.spyOn(cli, "runServer").mockImplementation(_ => _)

    const _args = { command: "serve", extend: false, install: false }

    await cli.runCommand({ ..._args, NODE_ENV: "development" })

    expect(spy).toBeCalledWith(expect.objectContaining({ NODE_ENV: "development" }))

    await cli.runCommand({ ..._args, NODE_ENV: "production" })

    expect(spy).toBeCalledWith(expect.objectContaining({ NODE_ENV: "production" }))
  })

  test("extend installs and creates loaders", async () => {
    await cli.factorize({ install: true })

    expect(execa).toHaveBeenCalledWith(
      "factor",
      expect.arrayContaining(["run", "create-loaders"]),
      expect.any(Object)
    )
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
