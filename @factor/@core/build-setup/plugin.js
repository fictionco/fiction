const inquirer = require("inquirer")
const { pathExistsSync, writeFileSync } = require("fs-extra")
const merge = require("deepmerge")
const chalk = require("chalk")
const figures = require("figures")
module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("cli-setup", (_, program) => {
        return [..._, this.runSetup()]
      })
    }

    // Setup entry. Give basic information and create an extensible select option for setup.
    async runSetup() {
      let answers

      Factor.$log.formatted({
        title: "Welcome to Factor Setup!",
        lines: [
          { title: "Theme", value: this.extensionNames("theme"), indent: true },
          { title: "Stack", value: this.extensionNames("stack"), indent: true },
          { title: "Modules", value: this.extensionNames("plugin", "count"), indent: true }
        ]
      })

      const setups = Factor.$filters.apply("cli-add-setup", [
        {
          name: "Stack - Setup and verify your services and APIs",
          value: "stack",
          callback: () => {
            const providerGroups = this.parseSettings(Factor.$stack.getProviders())
            this.verifyProviders(providerGroups)
            this.verifyServiceRequests()

            this.stack(providerGroups, { title: "Service Config Settings..." })
          }
        }
      ])

      answers = await inquirer.prompt({
        type: "list",
        name: `setupItem`,
        message: `What would you like to do?`,
        choices: setups.map(({ callback, ...keep }) => keep)
      })

      console.log() // break

      const setupRunner = setups.find(_ => _.value == answers.setupItem)

      const write = await setupRunner.callback(inquirer)

      await this.maybeWriteConfig(write)
    }

    normalize({ settings, group, scope }) {
      const conf = Factor.$config.settings()

      return settings.map(_ => {
        let out
        if (typeof _ == "string") {
          out = { group, scope, key: _, input: "input" }
        } else {
          out = { group, scope, ..._ }
        }
        const { key } = out
        out.message = out.message ? out.message : `${key}`

        out.value = group && conf[group] ? conf[group][key] : conf[key] ? conf[key] : ""

        if (!out.value) {
          out.missing = true
          out.value = _.default ? _.default : ""
        }

        return out
      })
    }

    verifyServiceRequests() {
      const requests = Factor.$stack.getServiceRequests()
      const total = requests.length
      const missing = requests.filter(_ => _.missing)
      const missingNum = missing.length
      const set = total - missingNum
      let lines = [
        {
          title: `${this.verifyPrefix(missingNum)} API Requests`,
          value: `${set} of ${total} Requests are Handled`
        }
      ]

      if (missingNum > 0) {
        lines.push({})
        lines.push({ title: "Missing Requests...", value: "" })
        lines = lines.concat(
          missing.map(({ id, description, args, returns }) => {
            return { title: id, value: description, indent: true }
          })
        )
        lines.push({})
        lines.push({ title: "To Fix", value: "Add a stack, a relevant plugin (or custom code)." })
      }

      const message = {
        title: "API Service Coverage",
        lines
      }
      Factor.$log.formatted(message)
    }

    verifySettings(settings) {
      const total = settings.length
      const missing = settings.filter(_ => _.missing).length
      return {
        total,
        missing,
        set: total - missing
      }
    }

    verifyPrefix(fail) {
      return !fail ? chalk.green(figures.tick) : chalk.red(figures.cross)
    }

    verifyProviders(groups) {
      const lines = groups.map(_ => {
        const v = _.verification
        return {
          title: `${this.verifyPrefix(v.missing)} ${_.title}`,
          value: `${v.set} of ${v.total} Settings are Configured`
        }
      })

      const message = {
        title: "Services",
        lines
      }
      Factor.$log.formatted(message)
    }

    parseSettings(settingsGroup) {
      return settingsGroup.map(_ => {
        const { config = [], secrets = [] } = _.settings || {}
        let settings = []

        settings = settings.concat(this.normalize({ settings: config, scope: "public", ..._.settings }))
        settings = settings.concat(this.normalize({ settings: secrets, scope: "private", ..._.settings }))

        const verification = this.verifySettings(settings)
        return {
          ..._,
          ..._.settings,
          settings,
          verification
        }
      })
    }

    writeFiles(write) {
      if (write.public) {
        const configFile = Factor.$paths.get("config-file-public")
        const existingConfig = pathExistsSync(configFile) ? require(configFile) : {}
        const conf = merge.all([existingConfig, write.public])
        writeFileSync(configFile, JSON.stringify(conf, null, "  "))
      }

      if (write.private) {
        const secretsFile = Factor.$paths.get("config-file-private")
        const existingSecrets = pathExistsSync(secretsFile) ? require(secretsFile) : {}
        const sec = merge.all([existingSecrets, write.private])
        writeFileSync(secretsFile, JSON.stringify(sec, null, "  "))
      }
    }
    extensionNames(type, format = "join") {
      const exts = Factor.$config.setting(type)

      if (exts && exts.length > 0) {
        const names = exts.map(_ => _.name)

        if (format == "count") {
          return names.length
        } else {
          return names.join(", ")
        }
      } else {
        return "none"
      }
    }

    prettyJson(data) {
      const highlight = require("cli-highlight").highlight
      return highlight(require("json2yaml").stringify(data, null, "  "))
    }

    async maybeWriteConfig(write) {
      if (!write) {
        return
      }
      let answers = await inquirer.prompt({
        type: "confirm",
        name: `writeFiles`,
        message: `Write the following settings? \n\n ${this.prettyJson(write)} \n`,
        default: true
      })

      if (answers.writeFiles) {
        this.writeFiles(write)
        Factor.$log.success(`Wrote settings to config...\n\n`)
      } else {
        Factor.$log.log(`Writing settings skipped.`)
      }
    }

    async stack(groups, { title } = {}) {
      if (title) {
        Factor.$log.formatted({ title })
      }

      let answers

      for (const { title, description, settings, group, envs } of groups) {
        answers = await inquirer.prompt({
          type: "confirm",
          name: `isReady`,
          message: `${title}: has the following settings:\n\n\t${settings
            .map(({ key, scope }) => `${key} [${scope}]`)
            .join("\n\t")}.\n\n Set? (If no, skip)`,
          default: true
        })
        console.log() // break

        if (answers.isReady) {
          let environments = ["config"]
          if (envs && envs.includes("multi")) {
            if (envs == "multi-optional") {
              answers = await inquirer.prompt({
                type: "confirm",
                name: `useMulti`,
                message: `Set up ${title} with different settings for "development" & "production"? (If no, use same)`,
                default: false
              })
            }

            if ((answers.useMulti && envs == "multi-optional") || envs == "multi") {
              environments = ["development", "production"]
            }
          }

          let write = {}
          for (const env of environments) {
            for (const { key, scope, input, message, value, parsers = {} } of settings) {
              let fields

              const descriptor =
                env != "config" ? `${title} "${env}" ${message}? (${scope})` : `${title} ${message}? (${scope})`
              fields = {
                type: input,
                message: descriptor,
                default: value,
                ...parsers
              }

              answers = await inquirer.prompt({
                name: "keyValue",
                ...fields
              })

              // Don't write a setting if no default value is given and also is not set by user
              const setVal =
                typeof value !== "undefined" || (typeof value == "undefined" && answers.keyValue) ? true : false

              if (setVal) {
                if (!write[scope]) {
                  write[scope] = {}
                }
                if (!write[scope][env]) {
                  write[scope][env] = {}
                }

                if (!write[scope][env][group]) {
                  write[scope][env][group] = {}
                }
                write[scope][env][group][key] = answers.keyValue
              }
            }
          }

          await this.maybeWriteConfig(write)
        }
      }
    }
  })()
}
