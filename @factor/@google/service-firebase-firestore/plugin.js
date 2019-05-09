module.exports.default = Factor => {
  return new (class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        Factor.$filters.add("cli-data-export", (_, program) => {
          _.firestore = () => this.dataExport(program)
        })
        Factor.$filters.add("cli-data-import", (_, program) => {
          _.firestore = () => this.dataImport(program)
        })
        this.addConfig()
      } else {
        if (Factor.FACTOR_ENV == "cloud") {
          this.client = require("firebase-admin")
        } else {
          const firebaseApp = require("@factor/service-firebase-app").default
          require("firebase/firestore")
          this.client = firebaseApp(Factor).client
        }

        Factor.$stack.add({
          provider: "firebase",
          id: "db-service-read",
          service: _ => this.read(_)
        })

        Factor.$stack.add({
          provider: "firebase",
          id: "db-service-update",
          service: _ => this.update(_)
        })
      }
    }

    async dataImport(program) {
      const fs = require("fs-extra")
      const { resolve } = require("path")
      const { collection, file } = program

      const data = await fs.readJson(resolve(process.cwd(), file))

      const db = require("firebase-admin").firestore()

      const batch = db.batch()
      const imported = []
      data.forEach(_ => {
        const id = _.id ? _.id : _.uid ? _.uid : false
        if (id) {
          const ref = db.collection(collection).doc(id)
          batch.set(ref, _)
          imported.push(_)
        }
      })

      Factor.$log.box(
        `Imported ${imported.length} objects to Firestore [${Factor.$config.setting("env")} ${collection}]`
      )

      return await batch.commit()
    }

    async getCollectionData(collection) {
      const data = []
      let ref = await require("firebase-admin")
        .firestore()
        .collection(collection)

      const list = await ref.get()

      list.forEach(_ => {
        data.push(_.data())
      })
      console.log("daty", data)
      return data
    }

    async dataExport({ collection }) {
      if (!collection) {
        throw new Error("No collection name provided.")
      }
      const data = []

      const fs = require("fs-extra")

      const collections = collection.trim().split(",")

      const _promises = collections.map(c => {
        return this.getCollectionData(c)
      })

      const results = await Promise.all(_promises)

      const datas = [].concat.apply([], results)

      if (datas.length == 0) {
        console.log("Nothing returned.", collections, Factor.$config.setting("env"))
        return
      }

      const basePath = Factor.$paths.get("data-exports")
      const timestamp = Factor.$time.stamp()
      const destination = `${basePath}/firestore-${collections.join("-")}-${timestamp}.json`

      await fs.ensureDir(basePath)

      await fs.writeFile(destination, JSON.stringify(datas, null, 2))

      return
    }

    // Add configuration fields to config file on build
    addConfig() {
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

    // async query({ collection, filters }) {
    //   return this.refineQueryResults(ref.get())
    // }

    async read({ id, collection, field = null, value = null }) {
      let ref = await this.client.firestore().collection(collection)

      let data

      if (!id && field) {
        ref = ref.where(field, "==", value)
        const list = await ref.get()

        const docs = []

        list.forEach(_ => {
          docs.push(_.data())
        })
        data = docs
      } else {
        const doc = await ref.doc(id).get()
        data = doc.data() || {}
      }

      return { data }
    }

    async update({ id, collection, data }) {
      await this.client
        .firestore()
        .collection(collection)
        .doc(id)
        .set(data, { merge: true })

      return { data: true }
    }

    refineQueryResults(doc) {
      const out = {}

      if (typeof doc.forEach === "function") {
        out.results = []

        doc.forEach(item => {
          const docData = Object.assign(
            {},
            {
              exists: item.exists,
              doc: item.id
            },
            item.data()
          )
          out.results.push(docData)
        })
      } else {
        out.exists = doc.exists

        out.results = doc.exists ? doc.data() : {}

        // results.service = doc

        out.doc = doc.id
      }

      return out
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
  })()
}
