module.exports = Factor => {
  return new (class {
    constructor() {
      this.providers = []
      this.serviceRequests = []
      this.services = []
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
    }

    async requestValue(filter, args) {
      return await Factor.$filters.apply(filter, args)
    }

    getServiceRequests() {
      return this.serviceRequests.map(_ => {
        return {
          ..._,
          missing: Factor.$filters.count(_.id) == 0 ? true : false
        }
      })
    }

    // verifyServices({ log = false } = {}) {
    //   let needed = 0
    //   let total = 0
    //   this.serviceRequests.forEach(_ => {
    //     const { id, description, args, result, title } = _

    //     if (Factor.$filters.count(id) == 0) {
    //       const lines = []

    //       if (description) lines.push({ title: "Description", value: description })
    //       if (args) lines.push({ title: "Arguments", value: args })
    //       if (result) lines.push({ title: "Returns", value: result })

    //       const message = {
    //         title: `Service Handler Needed: ${title} (${id})`,
    //         lines
    //       }

    //       if (log) {
    //         Factor.$log.formatted(message)
    //       }

    //       needed++
    //     }
    //     total++
    //   })

    //   return { needed, total, setup: total - needed }
    // }

    registerProvider(args) {
      this.providers.push(args)
    }

    getProviders() {
      return this.providers
    }

    // verifyProviders({ log = false } = {}) {
    //   const config = Factor.$config.settings()
    //   let needed = 0
    //   let total = 0
    //   let configure = []

    //   this.providers.forEach(_ => {
    //     let { provider, publicKeys, privateKeys, description, title, link, multiEnv = false } = _

    //     const normalizeKeys = (keys = []) =>
    //       keys.map(_ => {
    //         if (typeof _ == "string") {
    //           return { key: _, input: "string" }
    //         } else {
    //           return _
    //         }
    //       })

    //     const settings = config[provider]
    //     const keys = [
    //       { scope: "public", keys: normalizeKeys(publicKeys) },
    //       { scope: "private", keys: normalizeKeys(privateKeys) }
    //     ]
    //     const keysNeeded = []
    //     let verified = true

    //     keys.forEach(({ scope, keys }) => {
    //       if (keys && keys.length > 0) {
    //         keys.forEach(({ key, input }) => {
    //           if (!settings || !settings[key]) {
    //             verified = false
    //             keysNeeded.push({ scope, key, input })
    //           }
    //         })
    //       }
    //     })

    //     if (!verified) {
    //       needed++
    //       configure.push({ ..._, keysNeeded })
    //     }

    //     total++

    //     // const groupTitle = `Configure Provider: ${title || Factor.$utils.toLabel(provider)}`
    //     // const lines = []
    //     // lines.push({ title: "Description", value: description })
    //     // lines.push({ title: "Link", value: link })

    //     // keys.forEach(({ scope, keys }) => {
    //     //   if (keys && keys.length > 0) {
    //     //     const keysNeeded = []
    //     //     keys.forEach(key => {
    //     //       if (!settings || !settings[key]) {
    //     //         keysNeeded.push(key)
    //     //       }
    //     //     })

    //     //     // if (keysNeeded.length > 0) {
    //     //     //   verified = false
    //     //     //   const file = scope == "public" ? "factor-config.json" : "factor-secrets.json"
    //     //     //   lines.push({ title: `${Factor.$utils.toLabel(scope)} Config`, value: "" })
    //     //     //   lines.push({ indent: true, title: "Keys", value: keysNeeded.map(_ => `[${_}]`).join(" ") })
    //     //     //   lines.push({ indent: true, title: "To Fix", value: `Add under [env]:{${provider}} in [${file}]` })
    //     //     // }
    //     //   }
    //     // })

    //     // configure.push({ provider, privateKeys, publicKeys })

    //     // if (!verified) {
    //     //   if (log) {
    //     //     const message = {
    //     //       title: groupTitle,
    //     //       lines
    //     //     }
    //     //     Factor.$log.formatted(message)
    //     //   }

    //     //   needed++
    //     // }
    //     // total++
    //   })

    //   return { needed, total, setup: total - needed, configure }
    // }
  })()
}
