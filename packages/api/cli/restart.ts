import path from "path"
import fs from "fs-extra"
import { FactorPlugin, UserConfig } from "../config"
import { done, RunConfig } from "./utils"

export class FactorDevRestart extends FactorPlugin {
  constructor() {
    super({})
  }
  setup(): UserConfig {
    return {
      hooks: [
        {
          hook: "runCommand",
          callback: async (runConfig: RunConfig) => {
            const { command } = runConfig

            if (command == "rdev") {
              await this.restartInitializer()
            }
          },
        },
      ],
    }
  }

  isRestart = (): boolean => {
    return process.env.IS_RESTART == "1"
  }

  restartInitializer = async (): Promise<void> => {
    const { default: nodemon } = await import("nodemon")

    let conf: Record<string, any> = {}

    const configPath = path.join(process.cwd(), "./.nodemon.json")

    if (fs.existsSync(configPath)) {
      conf = require(configPath) as Record<string, any>
    }

    const passArgs = process.argv.slice(
      process.argv.findIndex((_) => _ == "rdev"),
    )

    passArgs.shift()

    const script = [`npm exec --`, `factor run dev`, passArgs.join(" ")]
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
