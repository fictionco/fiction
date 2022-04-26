import path from "path"
import fs from "fs-extra"
import { Command } from "commander"
import { log } from "../logger"
import { emitEvent } from "../utils/event"
import pkg from "../package.json"
import { done, runCommand } from "./utils"

const commander = new Command()

/**
 * Handle the CLI using Commander
 * Set up initial Node environment
 */
export const execute = async (): Promise<void> => {
  commander
    .version(pkg.version)
    .option("-e, --exit", "exit after successful setup")
    .option("-i, --inspector", "run the node inspector")
    .option("-a, --port-app <number>", "primary service port")
    .option("-p, --port <number>", "server specific port")
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
    done(code)
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
  done(1)
})
