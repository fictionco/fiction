module.exports = Factor => {
  return new (class {
    constructor() {
      this.addToLoaders()

      Factor.$filters.add("verify-app", () => {
        const p = Factor.$stack.verifyProviders()
        const s = Factor.$stack.verifyServices()

        if (p.needed || s.needed) {
          const lines = []
          lines.push({ title: "Providers Configured", value: `${p.setup}/${p.total}` })
          lines.push({ title: "App Service Requests", value: `${s.setup}/${s.total}` })
          lines.push({ title: "To Fix", value: `Run "factor run setup" for more information`, indent: true })
          Factor.$log.formatted({
            title: "Setup Needed",
            lines,
            format: "warn"
          })
        } else {
          Factor.$log.formatted({
            title: "Services stack verified",
            lines: [],
            format: "success"
          })
        }
      })

      Factor.$filters.add("cli-setup", (_, program) => {
        _.stack = () => this.setupStack(program)
      })
    }

    addToLoaders() {
      const { stack } = Factor.FACTOR_CONFIG

      if (!stack) {
        return
      }

      this.stackPackage = stack
      const { factor: { id } = {} } = require(`${stack}/package.json`)
      Factor.$filters.add("packages-loader", (load, { target, extensions }) => {
        load.push({
          id: id || "servicesStack",
          name: this.stackPackage,
          mainFile: this.moduleMain(target),
          target: this.moduleTarget(target)
        })
        return load
      })
    }

    async setupStack(args) {
      const inquirer = require("inquirer")

      const { configure } = Factor.$stack.verifyProviders({ log: true })
      Factor.$stack.verifyServices({ log: true })

      let answers = {}
      const questions = []

      for (const { title, provider, keysNeeded, multiEnv } of configure) {
        answers = await inquirer.prompt({
          type: "confirm",
          name: `isReady`,
          message: `To setup ${title}, you'll need the following keys:\n\n\t${keysNeeded
            .map(({ key, scope }) => `${key}`)
            .join("\n\t")}.\n\n Ready? (skip if no)`,
          default: true
        })
        console.log() // break

        if (answers.isReady) {
          let envs = ["config"]
          if (multiEnv) {
            answers = await inquirer.prompt({
              type: "confirm",
              name: `useMulti`,
              message: `Set up ${provider} with different development & production environments? (If no, a the same keys are used for both.)`,
              default: false
            })

            if (answers.useMulti) {
              envs = ["development", "production"]
            }
          }

          let write = {}
          for (const env of envs) {
            for (const { key, scope, input } of keysNeeded) {
              let fields

              let message = `${title}: ${key} [${scope}/${env}]?`

              if (input == "object") {
                fields = {
                  type: "editor",
                  message: message + " (Valid JSON)",
                  validate: value => {
                    if (typeof value != "object") {
                      return "The answer must be readable as valid JSON."
                    } else {
                      return true
                    }
                  },
                  filter: value => {
                    return JSON.parse(value)
                  }
                }
              } else {
                fields = { type: "input", message }
              }

              answers = await inquirer.prompt({
                name: "keyValue",
                default: "",
                ...fields
              })

              if (!write[scope]) {
                write[scope] = {}
              }
              if (!write[scope][env]) {
                write[scope][env] = {}
              }

              if (!write[scope][env][provider]) {
                write[scope][env][provider] = {}
              }

              write[scope][env][provider][key] = answers.keyValue
            }
          }

          const { pathExistsSync, writeFileSync } = require("fs-extra")
          const merge = require("deepmerge")

          if (write.public) {
            const configFile = Factor.$paths.get("config-file")
            const existingConfig = pathExistsSync(configFile) ? require(configFile) : {}
            const conf = merge.all([existingConfig, write.public])
            writeFileSync(configFile, JSON.stringify(conf, null, "  "))
          }

          if (write.private) {
            const secretsFile = Factor.$paths.get("secrets-file")
            const existingSecrets = pathExistsSync(secretsFile) ? require(secretsFile) : {}
            const sec = merge.all([existingSecrets, write.private])
            writeFileSync(secretsFile, JSON.stringify(sec, null, "  "))
          }
        }
      }
    }

    moduleTarget(target) {
      if (target.includes("cloud")) {
        return "cloud"
      } else if (target.includes("build")) {
        return "build"
      } else {
        return "app"
      }
    }

    moduleMain(target) {
      let mainFile
      const entries = ["cloud", "build"]

      entries.forEach(_ => {
        if (target.includes(_)) {
          const mainFileName = `${this.stackPackage}/${_}`
          const exists = require.resolve(mainFileName)

          mainFile = exists ? mainFileName : ""
        }
      })

      return mainFile
    }
  })()
}
