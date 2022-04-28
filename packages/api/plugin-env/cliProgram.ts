import path from "path"
import fs from "fs-extra"
import { Command } from "commander"
import { log } from "../logger"
import { camelToUpperSnake } from "../utils"
import { emitEvent } from "../utils/event"
import pkg from "../package.json"
import { PackageJson } from "../types"
import { commands } from "./commands"
import { MainFile } from "."

const commander = new Command()

const packageMainFile = async (cwd: string): Promise<string> => {
  const pkgPath = path.resolve(cwd, "package.json")
  const pkg = (await import(pkgPath)) as PackageJson
  return pkg.main ?? "index"
}

export const runCommand = async (
  command: string,
  opts: Record<string, unknown>,
) => {
  const cwd = process.cwd()
  const mainFileRelPath = await packageMainFile(cwd)
  const mainFilePath = path.resolve(cwd, mainFileRelPath)

  const cliCommand = commands
    .find((_) => _.command === command)
    ?.setOptions(opts)

  if (!cliCommand) throw new Error(`Command ${command} not found`)

  const fullOpts = cliCommand?.options ?? {}

  const params: Record<string, string> = {}

  if (fullOpts.mode) {
    process.env.NODE_ENV = fullOpts.mode
  }

  Object.entries(fullOpts).forEach(([key, value]) => {
    if (value) {
      params[key] = String(value)
      const processKey = `FACTOR_${camelToUpperSnake(key)}`
      process.env[processKey] = String(value)
    }
  })

  /**
   * ! THIS MUST COME AFTER ENV VARIABLES ARE SET
   *   Plugins expect the CLI vars (mode, port, etc. )
   *   At the time of initial load
   */
  const mainFile = (await import(mainFilePath)) as MainFile

  const factorEnv = mainFile.factorEnv

  if (!factorEnv) {
    throw new Error(`no factorEnv at [${mainFilePath}]`)
  }

  await factorEnv.runCommand(cliCommand)
}

/**
 * Handle the CLI using Commander
 * Set up initial Node environment
 */
export const execute = async (): Promise<void> => {
  commander
    .version(pkg.version)
    .option("-e, --exit", "exit after successful setup")
    .option("-i, --inspector", "run the node inspector")
    .option("-a, --app-port <number>", "primary service port")
    .option("-p, --server-port <number>", "server specific port")
    .option("-s, --serve", "serve static site after build")
    .option("-m, --mode <mode>", "node environment (development or production)")
    .option("-pa, --patch", "patch release")
    .option("-st, --skip-tests", "skip tests")

  const extendCliFile = path.join(process.cwd(), "program.ts")
  if (fs.existsSync(extendCliFile)) {
    const extendCli = (await import(extendCliFile)) as {
      setup: (c: Command) => void
    }

    extendCli.setup(commander)
  }

  commander
    .command("run")
    .argument("<command>", "command to run")
    .action(async (command: string) => {
      await runCommand(command, commander.opts())
    })

  commander.parse(process.argv)
}

const exitHandler = (options: {
  exit?: boolean
  shutdown?: boolean
  code?: 0 | 1
}): void | never => {
  const { exit, shutdown, code = 0 } = options
  if (shutdown) {
    emitEvent("shutdown")
  }
  if (exit) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(code)
  }
}

// /**
//  * Handle exit events
//  * This is so we can do clean up whenever node exits (if needed)
//  * https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
//  */
process.stdin.resume() //so the program will not close instantly

//do something when app is closing
process.on("exit", () => exitHandler({ shutdown: true }))

//catches ctrl+c event
process.on("SIGINT", () => exitHandler({ exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", () => exitHandler({ exit: true }))
process.on("SIGUSR2", () => exitHandler({ exit: true }))

//catches uncaught exceptions
process.on("uncaughtException", (error) => {
  log.error("uncaughtException", "uncaught error!", { error })
  process.exit(1)
})
