module.exports.default = Factor => {
  return new class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        this.addConfig()
      } else {
        if (Factor.FACTOR_ENV == "serverless") {
          this.client = require("firebase-admin")
        } else {
          const firebaseApp = require("@factor/service-firebase-app").default
          require("firebase/firestore")
          this.client = firebaseApp(Factor).client
        }

        Factor.$filters.addService({
          name: "db-service-read",
          service: _ => this.read(_)
        })

        Factor.$filters.addService({
          name: "db-service-update",
          service: _ => this.update(_)
        })

        Factor.$filters.addService({
          name: "db-service-query",
          service: _ => this.query(_)
        })
      }
    }

    // Add configuration fields to config file on build
    addConfig() {
      // Webpack can't handle the node targeted firebase-admin package
      // This allows us to use this plugin in both environments
      Factor.$filters.add("webpack-ignore-modules", _ => {
        _.push("firebase-admin")
        return _
      })

      const { resolve } = require("path")
      const { copySync } = require("fs-extra")
      const fldr = Factor.$paths.folder("generated")

      copySync(resolve(__dirname, "files"), Factor.$paths.get("generated"))

      Factor.$filters.add("firebase-config", _ => {
        _.firestore = {
          rules: `${fldr}/firebase-firestore.rules`,
          indexes: `${fldr}/firebase-firestore-indexes.json`
        }

        return _
      })
    }

    async query({ collection, filters }) {
      const ref = await this.client.firestore().collection(collection)

      filters.forEach(_ => {
        const { field, compare = "==", value } = _
        ref.where(field, compare, value)
      })

      return this.refineQueryResults(ref.get())
    }

    async read({ id, collection, field = null, value = null }) {
      const ref = await this.client.firestore().collection(collection)

      let doc = {}

      if (!id && field) {
        ref.where(field, "==", value)
        const list = await ref.get()
        doc = list[0] || {}
      } else {
        doc = await ref.doc(id).get()
      }

      return this.refineQueryResults(doc)
    }

    async update({ id, collection, data }) {
      await this.client
        .firestore()
        .collection(collection)
        .doc(id)
        .set(data, { merge: true })

      return true
    }

    refineQueryResults(doc) {
      const results = {}

      if (typeof doc.forEach === "function") {
        results.results = []

        doc.forEach(item => {
          const docData = Object.assign(
            {},
            {
              exists: item.exists,
              doc: item.id
            },
            item.data()
          )
          results.results.push(docData)
        })
      } else {
        results.exists = doc.exists

        results.results = doc.exists ? doc.data() : {}

        // results.service = doc

        results.doc = doc.id
      }

      return results
    }

    // async queryHandler(query) {
    //   const { method } = query

    //   if (method == "search") {
    //     return
    //   } else if (method == "read") {
    //   } else {
    //   }
    //   let entry = await this.doQueryRecursive(this.client.firestore(), query)

    //   return entry
    // }

    // async doQueryRecursive(container, query) {
    //   const {
    //     table,
    //     where = [],
    //     orderBy = [],
    //     id = false,
    //     data = {},
    //     method = "query",
    //     merge = true,
    //     limit = 30
    //   } = query

    //   const options = { merge }

    //   const isData = !Factor.$lodash.isEmpty(data) ? true : false
    //   const isQuery = where.length > 0 || orderBy.length > 0 ? true : false

    //   let ref = container.collection(table)

    //   let entry = {}

    //   if (isQuery) {
    //     if (where.length > 0) {
    //       where.forEach(({ field, comp, value }) => {
    //         ref = ref.where(field, comp, value)
    //       })
    //     }

    //     if (orderBy.length > 0) {
    //       orderBy.forEach(({ field, direction }) => {
    //         ref = ref.orderBy(field, direction)
    //       })
    //     }

    //     ref = ref.limit(limit)

    //     entry = this.refineQueryResults(await ref.get())
    //   } else if (id && !isData && !query.query) {
    //     ref = ref.doc(id)
    //     entry = this.refineQueryResults(await ref.get())
    //   } else {
    //     // If query has an id, find the doc
    //     // If no id but SET date, then get a new doc ref
    //     ref = id ? ref.doc(id) : isData ? ref.doc() : false

    //     const documentId = ref.id

    //     // Update
    //     if (isData) {
    //       if (!id) {
    //         data.createdAt = Factor.$time.stamp()
    //       }

    //       data.updatedAt = Factor.$time.stamp()

    //       data.id = documentId

    //       const prepared = Factor.$db.prepare(data)

    //       await ref.set(prepared, options)

    //       entry = { results: prepared }
    //     } else if (id && method === "delete") {
    //       await ref.delete()
    //     } else if (query.query) {
    //       entry = await this.doQueryRecursive(ref, query.query) // RECURSION
    //     }
    //   }

    //   return entry
    // }
  }()
}
