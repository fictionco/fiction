import path from "path"
import { Command } from "commander"
import { log } from "@factor/api/plugin-log"
import minimist from "minimist"
import { camelize } from "../utils"
import { emitEvent } from "../utils/event"
import pkg from "../package.json"
import { MainFile } from "./types"
import { packageMainFile } from "./utils"

const commander = new Command()

export const runCommand = async (
  command: string,
  optionsFromCli: Record<string, unknown>,
) => {
  try {
    const cwd = process.cwd()
    const mainFileRelPath = packageMainFile(cwd)
    const mainFilePath = path.resolve(cwd, mainFileRelPath)

    process.env.FACTOR_ENV_COMMAND = command
    process.env.FACTOR_ENV_COMMAND_OPTS = JSON.stringify(optionsFromCli || {})
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

    await factorEnv.runCurrentCommand()
  } catch (error) {
    log.error("CLI", `Error Running CLI Command [${command}]`, { error })
    exitHandler({ exit: true })
  }
}

/**
 * Handle the CLI using Commander
 * Set up initial Node environment
 */
export const execute = async (): Promise<void> => {
  commander.version(pkg.version).allowUnknownOption()

  commander
    .command("run")
    .allowUnknownOption()
    .argument("<command>", "command to run")
    .action(async (command: string) => {
      const originalCliOptions = process.argv.slice(2)
      const opts = Object.fromEntries(
        Object.entries(minimist(originalCliOptions)).map(([rawKey, val]) => {
          return [camelize(rawKey), val] as [string, unknown]
        }),
      )
      delete opts._ // delete this added by minimist
      await runCommand(command, opts)
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
// process.stdin.resume() //so the program will not close instantly

// //do something when app is closing
// process.on("exit", () => exitHandler({ shutdown: true }))

// //catches ctrl+c event
// process.on("SIGINT", () => exitHandler({ exit: true }))

// // catches "kill pid" (for example: nodemon restart)
// process.on("SIGUSR1", () => exitHandler({ exit: true }))
// process.on("SIGUSR2", () => exitHandler({ exit: true }))

// //catches uncaught exceptions
// process.on("uncaughtException", (error) => {
//   log.error("uncaughtException", "uncaught error!", { error })
//   process.exit(1)
// })
