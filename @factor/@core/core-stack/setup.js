const inquirer = require("inquirer")
const { pathExistsSync, writeFileSync } = require("fs-extra")
const merge = require("deepmerge")
module.exports = Factor => {
  return new (class {
    async doSet(set) {}

    normalize({ settings, group, scope }) {
      const existing = Factor.$config.settings()

      return settings.map(_ => {
        let out
        if (typeof _ == "string") {
          out = { group, scope, key: _, input: "input" }
        } else {
          out = { group, scope, ..._ }
        }

        out.value = group && existing[group] ? existing[group][out.key] : existing[out.key] ? existing[out.key] : ""

        return out
      })
    }

    parseSettings(settingsGroup) {
      return settingsGroup.map(_ => {
        const { config = [], secrets = [] } = _.settings || {}
        let settings = []

        settings = settings.concat(this.normalize({ settings: config, scope: "public", ..._.settings }))
        settings = settings.concat(this.normalize({ settings: secrets, scope: "private", ..._.settings }))
        return {
          ..._,
          ..._.settings,
          settings
        }
      })
    }

    writeFiles(write) {
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

    async cli(args) {
      const { configure } = Factor.$stack.verifyProviders({ log: true })

      const groups = this.parseSettings(Factor.$stack.getProviders())

      //Factor.$stack.verifyServices({ log: true })

      let answers = {}
      const questions = []

      for (const { title, description, settings, group, envs } of groups) {
        answers = await inquirer.prompt({
          type: "confirm",
          name: `isReady`,
          message: `To setup ${title}, you'll need the following keys:\n\n\t${settings
            .map(({ key, scope }) => `${key} [${scope}]`)
            .join("\n\t")}.\n\n Ready? (skip if no)`,
          default: true
        })
        console.log() // break

        if (answers.isReady) {
          let environments = ["config"]
          if (envs == "multi") {
            answers = await inquirer.prompt({
              type: "confirm",
              name: `useMulti`,
              message: `Set up ${provider} with different development & production environments? (If no, same settings are used for both.)`,
              default: false
            })

            if (answers.useMulti) {
              environments = ["development", "production"]
            }
          }

          let write = {}
          for (const env of environments) {
            for (const { key, scope, input, message } of settings) {
              let fields

              let message = message ? message : `${title}: ${key} [${scope}/${env}]?`

              if (input == "object") {
                fields = {
                  type: "editor",
                  message,
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
        }
      }
    }
  })()
}
