const inquirer = require("inquirer")
const {
  pathExistsSync,
  writeFileSync,
  ensureFileSync,
  writeJsonSync
} = require("fs-extra")
const chalk = require("chalk")
const figures = require("figures")
const envfile = require("envfile")

import { getExtensions } from "@factor/build/util"

export default Factor => {
  return new (class {
    constructor() {
      this.configFile = Factor.$paths.get("config-file-public")
      this.secretsFile = Factor.$paths.get("config-file-private")
      Factor.$filters.callback("cli-setup", _ => this.runSetup(_))

      Factor.$filters.callback("after-first-server-extend", () => {
        this.setupNeeded = Factor.$filters.apply("setup-needed", [])
        if (this.setupNeeded.length > 0) {
          let lines = this.setupNeeded.map(_ => {
            return {
              title: _.title,
              value: "",
              indent: true
            }
          })
          if (process.env.FACTOR_COMMAND !== "setup") {
            lines.push({ title: "Run 'yarn factor setup'", value: "" })
          }

          Factor.$log.formatted({
            title: "Setup Needed",
            lines,
            color: "yellow"
          })
        }
      })
    }

    // Setup entry. Give basic information and create an extensible select option for setup.
    async runSetup(_arguments) {
      const { inquirer } = _arguments
      let answers

      Factor.$log.formatted({
        title: "Welcome to Factor Setup!",
        lines: [
          { title: "Theme", value: this.extensionNames("theme"), indent: true },
          {
            title: "Modules",
            value: this.extensionNames("plugin", "count"),
            indent: true
          }
        ]
      })

      let setups = Factor.$filters.apply(
        "cli-add-setup",
        [
          {
            name: "Exit Setup",
            value: "exit",
            callback: async () => {
              // eslint-disable-next-line unicorn/no-process-exit
              process.exit()
            },
            priority: 1000
          }
        ],
        this.existingSettings()
      )

      setups = Factor.$utils.sortPriority(setups)

      // Escapes the endless loop
      let askAgain = true

      const ask = async () => {
        answers = await inquirer.prompt({
          type: "list",
          name: `setupItem`,
          message: `What would you like to do?`,
          choices: setups.map(({ callback, ...keep }) => keep)
        })

        console.log() // break

        const setupRunner = setups.find(_ => _.value == answers.setupItem)

        await setupRunner.callback(_arguments)

        if (askAgain) {
          await ask()
        }
      }

      await ask()
    }

    existingSettings() {
      if (!pathExistsSync(this.configFile)) {
        writeJsonSync(this.configFile, { config: {} })
      }
      const publicConfig = require(this.configFile)

      ensureFileSync(this.secretsFile)
      const privateConfig = envfile.parseFileSync(this.secretsFile)

      return { publicConfig, privateConfig }
    }

    extensionNames(type, format = "join") {
      const exts = getExtensions().filter(_ => _.extend == type)

      if (exts && exts.length > 0) {
        const names = exts.map(_ => _.name)

        return format == "count" ? names.length : names.join(", ")
      } else return "none"
    }

    prettyJson(data) {
      const highlight = require("cli-highlight").highlight
      return highlight(require("json2yaml").stringify(data, null, "  "))
    }

    async writeConfig(file, values) {
      if (!file || !values) {
        return
      }
      let answers = await inquirer.prompt({
        type: "confirm",
        name: `writeFiles`,
        message: `Write the following settings to the "${chalk.cyan(
          file
        )}" file? \n\n ${this.prettyJson(values)} \n`,
        default: true
      })

      console.log()
      if (answers.writeFiles) {
        this.writeFiles(file, values)
        Factor.$log.success(`Wrote to ${file}...\n\n`)
      } else {
        Factor.$log.log(`Writing skipped.`)
      }
      console.log()

      return
    }

    writeFiles(file, values) {
      const { publicConfig, privateConfig } = this.existingSettings()

      if (file.includes("factor-config")) {
        const conf = Factor.$utils.deepMerge([publicConfig, values])
        writeFileSync(this.configFile, JSON.stringify(conf, null, "  "))
      }

      if (file.includes("env")) {
        const sec = Factor.$utils.deepMerge([privateConfig, values])

        writeFileSync(this.secretsFile, envfile.stringifySync(sec))
      }
    }
  })()
}
