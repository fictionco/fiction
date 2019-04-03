module.exports.default = Factor => {
  return new class {
    async search(query) {
      return this.query({
        method: "search",
        returnType: [],
        ...query
      })
    }

    async index(query) {
      return this.query({
        method: "index",
        returnType: true,
        ...query
      })
    }

    async read(query) {
      const q = await this.query({
        method: "read",
        returnType: {},
        ...query
      })

      return q.data
    }

    async update(query) {
      const q = await this.query({
        method: "update",
        returnType: true,
        ...query
      })
      return q.data
    }

    async query(args) {
      const { method = "query", returnType = [] } = args

      const served = await Factor.$filters.applyService({
        service: "db",
        filter: `db-service-${method}`,
        args
      })

      const result = served[0] ? served[0].result : { data: returnType }

      const entry = {
        data: returnType,
        ...result
      }

      return entry
    }

    prepare(obj) {
      // Convert abstract objects
      obj = JSON.parse(JSON.stringify(obj))

      for (var p in obj) {
        if (typeof obj[p] === "undefined") {
          delete obj[p]
        } else if (typeof obj[p] === "object") {
          obj[p] = this.prepare(obj[p])
        } else if (typeof obj[p] === "string") {
          obj[p] = obj[p].trim()
        }
      }

      return obj
    }
  }()
}
