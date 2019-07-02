const chalk = require("chalk")
const figures = require("figures")
module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("cli-run-verify-stack", _ => this.verifyServiceRequests())

      Factor.$filters.add("cli-add-setup", _ => {
        _.push({
          name: "Stack - Setup and verify your services and APIs",
          value: "stack",
          callback: ({ inquirer }) => {
            this.verifyProviders()
            this.verifyServiceRequests()

            //this.stack(providerGroups, { title: "Service Config Settings..." })
          }
        })

        return _
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
          title: `${this._verifyPrefix(missingNum)} API Requests`,
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

    verifyProviders() {
      const providerGroups = this._parseSettings(Factor.$stack.getProviders())

      const lines = providerGroups.map(_ => {
        const v = _.verification
        return {
          title: `${this._verifyPrefix(v.missing)} ${_.title}`,
          value: `${v.set} of ${v.total} Settings are Configured`
        }
      })

      const message = {
        title: "Services",
        lines
      }
      Factor.$log.formatted(message)
    }

    _parseSettings(settingsGroup) {
      return settingsGroup.map(_ => {
        const { config = [], secrets = [] } = _.settings || {}
        let settings = []

        settings = settings.concat(this._normalize({ settings: config, scope: "public", ..._.settings }))
        settings = settings.concat(this._normalize({ settings: secrets, scope: "private", ..._.settings }))

        const verification = this.verifySettings(settings)
        return {
          ..._,
          ..._.settings,
          settings,
          verification
        }
      })
    }

    _normalize({ settings, group, scope }) {
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

    _verifyPrefix(fail) {
      return !fail ? chalk.green(figures.tick) : chalk.red(figures.cross)
    }
  })()
}
