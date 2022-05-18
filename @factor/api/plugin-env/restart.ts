import path from "path"
import fs from "fs-extra"
import nodemon from "nodemon"
import { FactorPlugin } from "../plugin"
import { getRequire } from "../utils"
import { done } from "./utils"

export class FactorDevRestart extends FactorPlugin {
  constructor() {
    super({})
  }
  setup() {}

  isRestart = (): boolean => {
    return process.env.IS_RESTART == "1"
  }

  restartInitializer = async (args: {
    command: string
    config: nodemon.Settings
  }): Promise<void> => {
    const { command, config } = args

    const passArgs = process.argv.slice(
      process.argv.findIndex((_) => _ == "rdev"),
    )

    passArgs.shift()

    const script = [`npm exec --`, `factor run ${command}`, passArgs.join(" ")]
    const runScript = script.join(" ")
    config.exec = runScript
    config.cwd = process.cwd()

    this.log.info(`running [${runScript}]`, { data: config })

    /**
     * The nodemon function takes either an object (that matches the nodemon config)
     * or can take a string that matches the arguments that would be used on the command line
     */
    nodemon(config)

    nodemon
      .on("log", () => {})
      .on("start", () => {})
      .on("exit", () => {
        this.log.error("nodemon exit")
      })
      .on("crash", () => {
        this.log.error("nodemon crash")
      })
      .on("quit", () => done(0, "exited nodemon"))
      .on("restart", (files: string[]) => {
        process.env.IS_RESTART = "1"
        this.log.info("restarted due to:", { data: { files } })
      })
  }
}
