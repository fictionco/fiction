module.exports.default = Factor => {
  return new class {
    // Publish is
    // async publish(query) {
    //   return this.query({
    //     method: "publish",
    //     ...query
    //   })
    // }

    async search(query) {
      return this.query({
        method: "search",
        returnType: [],
        ...query
      })
    }

    async read(query) {
      return this.query({
        method: "read",
        returnType: {},
        ...query
      })
    }

    async update(query) {
      return this.query({
        method: "update",
        returnType: true,
        ...query
      })
    }

    async query(args) {
      const { method = "query", returnType = [] } = args

      const entry = await Factor.$filters.applyService({
        service: "db",
        filter: `db-service-${method}`,
        args
      })

      const { results = returnType } = entry || {}

      return results
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
