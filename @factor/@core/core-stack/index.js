module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.providers = []
      this.serviceRequests = []
      this.services = []

      // ADD CLI Commands
      require("./cli").default(Factor)
    }

    register(args) {
      this.serviceRequests.push(args)
    }

    covered(id) {
      return Factor.$filters.count(id) !== 0 ? true : false
    }

    cover(args) {
      let { id, service = _ => _, key, provider, options = {} } = args

      key = key || provider || Factor.$guid()

      Factor.$filters.add(
        id,
        (_ = [], params) => {
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

    async service(id, args, opts = {}) {
      const added = Factor.$filters.apply(id, [], args)

      if (!added || added.length == 0) {
        return null
      }

      const resultsArray = await Promise.all(added.map(({ service }) => service))

      return resultsArray[0]
    }

    getServiceRequests() {
      return this.serviceRequests.map(_ => {
        return {
          ..._,
          missing: !this.covered(_.id)
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
