module.exports = Factor => {
  return new (class {
    constructor() {
      this.credentials = []
      this.serviceRequests = []
      this.services = []
      this.values = []
      this.valueRequests = []

      Factor.$filters.add("plugins-added", () => {
        // console.log("this.serviceRequests", this.serviceRequests, this.services)
        this.verifyCredentials()
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

    // registerValue(args) {
    //   const { service, id } = args
    //   Factor.$filters.add(id, service)
    //   this.values.push(args)
    // }

    // registerValueRequest(args) {
    //   this.valueRequests.push(args)
    // }

    verifyServices() {
      this.serviceRequests.forEach(_ => {
        const { id, description, args, result, title } = _

        if (!Factor.$filters.count(id)) {
          const lines = []

          if (description) lines.push(description)
          if (args) lines.push(args)
          if (result) lines.push(result)

          const message = {
            title: `Service Needed: ${title}`,
            lines
          }
          Factor.$log.formatted(message)
        }
      })
    }

    registerCredentials(args) {
      this.credentials.push(args)
    }

    verifyCredentials() {
      const config = Factor.$config.settings()

      this.credentials.forEach(_ => {
        const { provider, keys, description, title, scope, link } = _

        if (!config[provider] || keys.some(k => typeof config[provider][k] == "undefined")) {
          const file = scope == "public" ? "factor-config.json" : "factor-secrets.json"

          const message = {
            title: `Credentials: ${title}`,
            lines: [
              description,
              `More Info: ${link}`,
              "Instructions:",
              `- Add keys: ${keys.map(_ => `[${_}]`).join(" ")}`,
              `- Under provider (object key): ${provider}`,
              `- In Factor file: ${file}`
            ]
          }
          Factor.$log.formatted(message)
        }
      })
    }
  })()
}
