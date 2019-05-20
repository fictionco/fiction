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

    cover(args) {
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

    // async requestValue(filter, args) {
    //   return await Factor.$filters.apply(filter, args)
    // }

    getServiceRequests() {
      return this.serviceRequests.map(_ => {
        return {
          ..._,
          missing: Factor.$filters.count(_.id) == 0 ? true : false
        }
      })
    }

    registerProvider(args) {
      this.providers.push(args)
    }

    getProviders() {
      return this.providers
    }
  })()
}
