const inquirer = require("inquirer")
const { pathExistsSync, writeFileSync } = require("fs-extra")
const merge = require("deepmerge")
const chalk = require("chalk")
const figures = require("figures")
module.exports = Factor => {
  return new (class {
    async doSet(set) {}

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

        out.value = group && conf[group] ? conf[group][key] : conf[key] ? conf[key] : null

        if (!out.value) {
          out.missing = true
          out.value = _.default ? _.default : null
        }

        return out
      })
    }

    verify(settings) {
      const total = settings.length
      const missing = settings.filter(_ => _.missing).length
      return {
        total,
        missing,
        set: total - missing
      }
    }

    verifyProviders(groups) {
      const lines = groups.map(_ => {
        const v = _.verification
        const pref = v.missing ? chalk.red(figures.cross) : chalk.green(figures.tick)
        return { title: `${pref} ${_.title}`, value: `${v.set} of ${v.total} Settings are Configured` }
      })

      const message = {
        title: "Providers Verification",
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

        const verification = this.verify(settings)
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

    async runSetup() {
      let answers
    }

    async cli() {
      const groups = this.parseSettings(Factor.$stack.getProviders())

      this.verifyProviders(groups)

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
          if (envs == "multi") {
            answers = await inquirer.prompt({
              type: "confirm",
              name: `useMulti`,
              message: `Set up ${title} with different settings for "development" & "production"? (If no, use same)`,
              default: false
            })

            if (answers.useMulti) {
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

          answers = await inquirer.prompt({
            type: "confirm",
            name: `writeFiles`,
            message: `Write the following ${title} settings? \n\n ${chalk.cyan(JSON.stringify(write, null, "  "))} \n`,
            default: true
          })

          if (answers.writeFiles) {
            this.writeFiles(write)
            Factor.$log.success(`Wrote ${title} settings to config...\n\n`)
          } else {
            Factor.$log.log(`Writing ${title} settings skipped.`)
          }
        }
      }
    }

    // async cli(args) {

    //   const groups = this.parseSettings(Factor.$stack.getProviders())

    //   let answers = {}
    //   const questions = []

    //   for (const { title, description, settings, group, envs } of groups) {
    //     answers = await inquirer.prompt({
    //       type: "confirm",
    //       name: `isReady`,
    //       message: `${title}: you'll need the following:\n\n\t${settings
    //         .map(({ key, scope }) => `${key} [${scope}]`)
    //         .join("\n\t")}.\n\n Ready? (If no, skip)`,
    //       default: true
    //     })
    //     console.log() // break

    //     if (answers.isReady) {
    //       let environments = ["config"]
    //       if (envs == "multi") {
    //         answers = await inquirer.prompt({
    //           type: "confirm",
    //           name: `useMulti`,
    //           message: `Set up ${title} with different development & production environments? (If no, use same)`,
    //           default: false
    //         })

    //         if (answers.useMulti) {
    //           environments = ["development", "production"]
    //         }
    //       }

    //       let write = {}
    //       for (const env of environments) {
    //         for (const { key, scope, input, message } of settings) {
    //           let fields

    //           let message = message ? message : `${title}: ${key} [${scope}/${env}]?`

    //           if (input == "object") {
    //             fields = {
    //               type: "editor",
    //               message,
    //               validate: value => {
    //                 if (typeof value != "object") {
    //                   return "The answer must be readable as valid JSON."
    //                 } else {
    //                   return true
    //                 }
    //               },
    //               filter: value => {
    //                 return JSON.parse(value)
    //               }
    //             }
    //           } else {
    //             fields = { type: "input", message }
    //           }

    //           answers = await inquirer.prompt({
    //             name: "keyValue",
    //             default: "",
    //             ...fields
    //           })

    //           if (!write[scope]) {
    //             write[scope] = {}
    //           }
    //           if (!write[scope][env]) {
    //             write[scope][env] = {}
    //           }

    //           if (!write[scope][env][provider]) {
    //             write[scope][env][provider] = {}
    //           }

    //           write[scope][env][provider][key] = answers.keyValue
    //         }
    //       }
    //     }
    //   }
    // }
  })()
}
