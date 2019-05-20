export default Factor => {
  return new (class {
    constructor() {
      Factor.$stack.registerProvider({
        provider: "algolia",
        title: "Algolia",
        description: "Site search and data indexing.",
        settings: {
          group: "algolia",
          secrets: ["adminKey"],
          config: ["searchKey", "appId"]
        }
      })

      Factor.$stack.cover({
        provider: "algolia",
        description: "Searches index using Algolia",
        id: "db-service-search",
        service: _ => this.search(_)
      })

      Factor.$stack.cover({
        provider: "algolia",
        description: "Updates a record.",
        id: "db-service-update",
        service: _ => this.update(_)
      })

      Factor.$stack.cover({
        provider: "algolia",
        description: "Deletes an index record by ID",
        id: "db-service-delete",
        service: _ => this.delete(_)
      })

      const { appId, searchKey } = Factor.$config.setting("algolia") || {}

      const algoliasearch = require("algoliasearch")
      this.prefix = `${Factor.$config.setting("env")}_`

      this.client = appId && searchKey ? algoliasearch(appId, searchKey) : false
    }

    // ENDPOINT
    async request(action, params) {
      return await Factor.$endpoint.request({
        endpoint: "algolia",
        action,
        ...params
      })
    }

    async update(args) {
      if (args.collection != "public" || args.noIndex) {
        return false
      } else {
        return await this.request("saveObject", this.transformQuery(args))
      }
    }

    async delete(args) {
      return await this.request("deleteObject", this.transformQuery(args))
    }

    async search(args) {
      const { index, ...algoliaSearchArgs } = this.transformQuery(args)
      const r = await new Promise((resolve, reject) => {
        this.client.initIndex(index).search(algoliaSearchArgs, (err, r) => {
          //console.log("Algolia Result", r, algoliaSearchArgs, index, err)
          if (err) reject(err)
          else
            resolve({
              data: r.hits,
              total: r.nbHits,
              categories: r.facets,
              pageCurrent: r.page + 1,
              pageTotal: r.nbPages,
              pagePer: r.hitsPerPage
            })
        })
      })
      return r
    }

    transformQuery({
      id,
      collection = "public",
      filters = null,
      limit = null,
      searchText = null,
      data = null,
      page = 1
    }) {
      const out = {}

      out.index = this.prefix + collection

      // Text based search
      out.query = searchText || ""

      if (id) {
        out.objectID = id
      }

      // Faceting/Filters
      if (filters) {
        let algoliaFilters = []

        filters.forEach(({ field, value }) => {
          let item
          if (typeof value == "string") {
            item = `${field}:${value}`
          } else if (Array.isArray(value)) {
            item = `(${value.map(v => `${field}:${v}`).join(" OR ")})`
          }
          if (item) {
            algoliaFilters.push(item)
          }
        })

        out.filters = algoliaFilters.join(" AND ")
      }

      out.facets = ["*"]

      // Pagination
      if (limit) {
        out.hitsPerPage = limit
      }

      if (data) {
        out.data = this.prepareData(data)
      }

      if (page > 1) {
        out.page = page - 1 // pages with algolia are zero-indexed
      }

      return out
    }

    // initializeCollectionIndex(collection) {
    //   return this.client.initIndex(this.prefix + collection)
    // }

    async searchQuery(query) {
      const { table, filters } = query

      const s = await this.search(table, {
        filters,
        query: ""
      })

      return { results: s }
    }

    // // Creates or updates an item in the index
    // async partialUpdateObject(query) {
    //   const preparedQuery = this.prepare(query)

    //   return await this.request("partialUpdateObject", preparedQuery)
    // }

    // Algolia only supports a 20kb total data size limit
    // This function concatenates long text fields so errors aren't thrown
    prepareData(data) {
      // Fix mutability issues
      const newData = Factor.$lodash.cloneDeep(data)

      Object.keys(newData).forEach(key => {
        const datum = newData[key]
        if (typeof datum == "string" && datum.length > 2000) {
          newData[key] = datum.substring(0, 2000)
        } else if (typeof datum == "undefined" || key == "revisions") {
          delete newData[key]
        }
      })

      return newData
    }

    // queryHandler() {
    //   return async query => {
    //     let result

    //     if (query.method == "publish") {
    //       delete query.data.revisions
    //       // No blocking - don't wait
    //       this.partialUpdateObject(query)
    //       result = true
    //     } else if (query.method == "search") {
    //       result = await this.searchQuery(query)
    //     }

    //     return result
    //   }
    // }
    // https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
    // isJson(item) {
    //   item = typeof item !== "string" ? JSON.stringify(item) : item

    //   try {
    //     item = JSON.parse(item)
    //   } catch (error) {
    //     return false
    //   }

    //   if (typeof item === "object" && item !== null) {
    //     return true
    //   }

    //   return false
    // }

    // Algolia sometimes returns JSON
    // parse(hits) {
    //   console.log("PARSss", hits)
    //   const parsed = hits.map(h => {
    //     for (var key in h) {
    //       if (Array.isArray(h[key])) {
    //         h[key] = h[key].map(k => {
    //           return this.isJson(k) ? JSON.parse(k) : k
    //         })
    //       }
    //     }
    //     return h
    //   })

    //   return parsed
    // }
  })()
}
