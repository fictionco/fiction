module.exports = Factor => {
  return new (class {
    constructor() {
      this.providers = []
      this.serviceRequests = []
      this.services = []

      Factor.$filters.add("verify-app", () => {
        this.verifyProviders()
        this.verifyServices()
      })
    }

    register(args) {
      this.serviceRequests.push(args)
    }

    add(args) {
      let { id, service, key, provider, options = {} } = args

      key = key || provider || Factor.$guid()

      Factor.$filters.add(
        id,
        (_, params) => {
          _.push({
            service: service(params),
            key,
            params
          })

          return _
        },
        options
      )

      this.services.push(args)
    }

    async service(filter, args, opts = {}) {
      const added = Factor.$filters.apply(filter, [], args)

      if (!added || added.length == 0) {
        return null
      }

      const resultsArray = await Promise.all(added.map(({ service }) => service))

      return resultsArray[0]

      // return added.map((item, index) => {
      //   return {
      //     ...item,
      //     result: resultsArray[index]
      //   }
      // })
    }

    async requestValue(filter, args) {
      return await Factor.$filters.apply(filter, args)
    }

    verifyServices() {
      this.serviceRequests.forEach(_ => {
        const { id, description, args, result, title } = _

        if (Factor.$filters.count(id) == 0) {
          const lines = []

          if (description) lines.push({ title: "Description", value: description })
          if (args) lines.push({ title: "Arguments", value: args })
          if (result) lines.push({ title: "Returns", value: result })

          const message = {
            title: `Service Handler Needed: ${title} (${id})`,
            lines
          }
          Factor.$log.formatted(message)
        }
      })
    }

    registerProvider(args) {
      this.providers.push(args)
    }

    verifyProviders() {
      const config = Factor.$config.settings()

      this.providers.forEach(_ => {
        const { provider, publicKeys, privateKeys, description, title, link } = _

        const settings = config[provider]

        const groupTitle = `Provider: ${title || Factor.$utils.toLabel(provider)}`
        const lines = []
        let verified = true

        lines.push({ title: "Description", value: description })
        lines.push({ title: "Link", value: link })

        const keys = [{ scope: "public", keys: publicKeys }, { scope: "private", keys: privateKeys }]
        keys.forEach(({ scope, keys }) => {
          if (keys && keys.length > 0) {
            const keysNeeded = []
            keys.forEach(key => {
              if (!settings || !settings[key]) {
                keysNeeded.push(key)
              }
            })

            if (keysNeeded.length > 0) {
              verified = false
              const file = scope == "public" ? "factor-config.json" : "factor-secrets.json"
              lines.push({ title: `${Factor.$utils.toLabel(scope)} Config`, value: "" })
              lines.push({ indent: true, title: "Keys", value: keysNeeded.map(_ => `[${_}]`).join(" ") })
              lines.push({ indent: true, title: "To Fix", value: `Add under [env]:{${provider}} in [${file}]` })
            }
          }
        })

        if (!verified) {
          const message = {
            title: groupTitle,
            lines
          }
          Factor.$log.formatted(message)
        }
      })
    }
  })()
}
