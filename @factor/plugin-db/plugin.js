export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.addFilter("mixins", _ => {
        _.db = this.mixin()
        return _
      })
    }

    mixin() {
      return () => {
        this.processors = Factor.$filters.apply("database-query-processors", {})
      }
    }

    async publish(query) {
      return this.query({
        method: "publish",
        ...query
      })
    }

    async search(query) {
      return this.query({
        method: "search",
        ...query
      })
    }

    async read(query) {
      return this.query({
        method: "read",
        ...query
      })
    }

    async update(query) {
      return this.query({
        method: "update",
        ...query
      })
    }

    async query(args) {
      const { method } = args
      const entry = await Factor.$filters.applyService({
        service: "db",
        filter: `db-service-${method}`,
        args
      })

      const { results = null } = entry || {}

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
