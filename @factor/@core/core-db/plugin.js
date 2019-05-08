module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$stack.register({
        id: `db-service-read`,
        title: "DB - Read Record",
        description: "Datastore read a record based on record ID or attribute.",
        args: "Object { collection, id OR field, value }",
        result: "Object { result }"
      })

      Factor.$stack.register({
        id: `db-service-update`,
        title: "DB - Update Record",
        description: "Datastore update a record based on ID.",
        args: "Object { collection, id, data }",
        result: "Object { data }"
      })

      Factor.$stack.register({
        id: `db-service-search`,
        title: "DB - Search",
        description: "Retrieves records based on query criteria.",
        args: "Object { collection, searchText, filters: [{field, value}], limit, page }",
        result: "Object { data }"
      })
    }
    async search(query) {
      return this.query({
        method: "search",
        returnType: [],
        ...query
      })
    }

    // async index(query) {
    //   return this.query({
    //     method: "index",
    //     returnType: true,
    //     ...query
    //   })
    // }

    async read(query) {
      const q = await this.query({
        method: "read",
        returnType: {},
        ...query
      })

      return q.data
    }

    async update(query) {
      query = this.prepareRecord(query)

      const q = await this.query({
        method: "update",
        returnType: true,
        ...query
      })
      return q.data
    }

    async query(args) {
      const { method = "query", returnType = [] } = args

      const served = await Factor.$stack.service(`db-service-${method}`, args)

      const result = served && served[0] ? served[0].result : { data: returnType }

      const entry = {
        data: returnType,
        ...result
      }

      return entry
    }

    prepareRecord(query) {
      // Ensure every record has a type field
      if (!query.type && !query.merge) {
        console.warn("[Factor DB Update] Missing 'type' in data.", query)
      } else if (query.type && !query.data.type) {
        query.data.type = query.type
      }

      // Every post should have an id
      if (query.id && !query.data.id) {
        query.data.id = query.id
      }

      query.data = this.prepareData(query.data)

      return query
    }

    prepareData(data) {
      // Convert abstract objects
      data = JSON.parse(JSON.stringify(data))

      for (var p in data) {
        if (typeof data[p] === "undefined") {
          delete data[p]
        } else if (typeof data[p] === "object") {
          data[p] = this.prepareData(data[p])
        } else if (typeof data[p] === "string") {
          data[p] = data[p].trim()
        }
      }

      return data
    }
  })()
}
