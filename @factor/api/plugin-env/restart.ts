import fs from "fs-extra"
import nodemon from "nodemon"
import { FactorPlugin } from "../plugin"
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
    configPath: string
  }): Promise<void> => {
    const { command, configPath } = args
    let conf: Record<string, any> = {}

    if (configPath && fs.existsSync(configPath)) {
      const fileConfig = (await import(
        /* @vite-ignore */ configPath
      )) as Record<string, any>

      conf = { ...fileConfig }
    }

    const passArgs = process.argv.slice(
      process.argv.findIndex((_) => _ == "rdev"),
    )

    passArgs.shift()

    const script = [`npm exec --`, `factor run ${command}`, passArgs.join(" ")]
    const runScript = script.join(" ")
    conf.exec = runScript

    this.log.debug(`running [${runScript}]`, { data: conf })

    /**
     * The nodemon function takes either an object (that matches the nodemon config)
     * or can take a string that matches the arguments that would be used on the command line
     */
    nodemon(conf)

    nodemon
      .on("log", () => {})
      .on("start", () => {})
      .on("exit", () => {
        this.log.error("exit")
      })
      .on("crash", () => {
        this.log.error("crash")
      })
      .on("quit", () => done(0, "exited nodemon"))
      .on("restart", (files: string[]) => {
        process.env.IS_RESTART = "1"
        this.log.info("restarted due to:", { data: { files } })
      })
  }
}
