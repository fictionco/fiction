import fs from "fs-extra"
import inquirer from "inquirer"
import chalk from "chalk"
import figures from "figures"
import envfile from "envfile"
import log from "@factor/logger"
import { getExtensions } from "@factor/build/util"
import { getPath } from "@factor/paths"
import { sortPriority, deepMerge, applyFilters, addCallback } from "@factor/tools"

export class FactorSetup {
  constructor() {
    this.configFile = getPath("config-file-public")
    this.secretsFile = getPath("config-file-private")
    addCallback("cli-setup", _ => this.runSetup(_))

    addCallback("after-first-server-extend", () => {
      this.setupNeeded = applyFilters("setup-needed", [])
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

        log.formatted({
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

    log.formatted({
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

    let setups = applyFilters(
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

    setups = sortPriority(setups)

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
    if (!fs.pathExistsSync(this.configFile)) {
      fs.writeJsonSync(this.configFile, { config: {} })
    }
    const publicConfig = require(this.configFile)

    fs.ensureFileSync(this.secretsFile)
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
      log.success(`Wrote to ${file}...\n\n`)
    } else {
      log.log(`Writing skipped.`)
    }
    console.log()

    return
  }

  writeFiles(file, values) {
    const { publicConfig, privateConfig } = this.existingSettings()

    if (file.includes("factor-config")) {
      const conf = deepMerge([publicConfig, values])
      fs.writeFileSync(this.configFile, JSON.stringify(conf, null, "  "))
    }

    if (file.includes("env")) {
      const sec = deepMerge([privateConfig, values])

      fs.writeFileSync(this.secretsFile, envfile.stringifySync(sec))
    }
  }
}

export default new FactorSetup()
