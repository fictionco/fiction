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
    config: nodemon.Settings
  }): Promise<void> => {
    const { command, config } = args

    const defaultConfig = {
      verbose: true,
      ignore: [
        "**/dist/**",
        "**/node_modules/**",
        "**/__*/**",
        "**/.ref/**",
        "**/.git/**",
      ],
      ext: "js,ts,cjs,mjs",
    }

    const fullConfig = { ...defaultConfig, ...config }

    const passArgs = process.argv.slice(
      process.argv.findIndex((_) => _ == "rdev"),
    )

    passArgs.shift()

    const script = [`npm exec --`, `factor run ${command}`, passArgs.join(" ")]
    const runScript = script.join(" ")
    fullConfig.exec = runScript
    fullConfig.cwd = process.cwd()

    this.log.info(`running [${runScript}]`, { data: fullConfig })

    /**
     * The nodemon function takes either an object (that matches the nodemon config)
     * or can take a string that matches the arguments that would be used on the command line
     */
    nodemon(fullConfig)

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
