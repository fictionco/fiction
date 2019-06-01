module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.algoliaConfig = require("./config.json")
      this.algoliasearch = require("algoliasearch")

      const { algolia: { adminKey, appId } = {}, env } = Factor.$config.settings()

      if (adminKey && appId) {
        this.prefix = env
        this.client = this.algoliasearch(appId, adminKey)

        Factor.$filters.add("cli-tasks", _ => {
          _.push({
            command: (ctx, task) => {
              this.updateIndexSettings()
              task.title = "Algolia indexes updated."
            },
            title: `Updating Algolia index settings`
          })
          return _
        })

        Factor.$filters.add("cli-run-data-index", _ => this.dataIndexJson(_))
      }
      return
    }

    async dataIndexJson({ program, inquirer }) {
      const { collection, file } = program

      if (!collection || !file) {
        Factor.$log.error(
          "Algolia data index operation requires --collection and --file. Set --env to production (defaults: development)"
        )
        return
      }

      const index = await this._initIndex(collection)

      const fs = require("fs-extra")
      const { resolve } = require("path")

      const data = await fs.readJson(resolve(process.cwd(), file))
      const preparedData = this._prepareData(data)
      const objects = []
      preparedData.forEach(datum => {
        if (datum.objectID) {
          datum.objectID = datum.id
          objects.push(datum)
        }
      })

      const saved = await index.saveObjects(objects)

      Factor.$log.box(`Saved ${data.length} objects in Algolia [${index.indexName}]`)
    }

    async userCanEdit({ index, objectID }) {
      const { accessLevel, uid } = Factor.$headers.auth

      if (accessLevel > 100) {
        return true
      } else {
        const post = await getCurrentValue({ index, objectID })
        if (!post || (post.authors && post.authors.includes[uid])) {
          return true
        } else {
          throw new Error("Insuffient access level to edit algolia object.")
        }
      }
    }

    getCurrentValue({ index, objectID }) {
      // Retrieves all attributes
      return new Promise((resolve, reject) => {
        index.getObject(objectID, function(err, content) {
          if (err) reject(err)

          resolve(content)
        })
      })
    }

    _prepareData(data) {
      const newData = []
      data.forEach(_ => {
        if (_.id) {
          _.objectID = _.id
        }

        const newObject = {}
        Object.keys(_).forEach(key => {
          const datum = _[key]
          if (typeof datum == "string" && datum.length > 2000) {
            newObject[key] = datum.substring(0, 2000)
          } else if (typeof datum !== "undefined" || key !== "revisions") {
            newObject[key] = datum
          }
        })
        newData.push(newObject)
      })

      return newData
    }

    async _initIndex(name, prefix) {
      prefix = prefix || this.prefix
      // Make sure that this isn't already using a prefixed index name (replicas)
      // Prefixes are used to sep prod/dev/testing scenarios (keep data clean)
      const actualIndexName = name.includes(prefix) ? name : `${prefix}_${name}`

      const index = this.client.initIndex(actualIndexName)

      if (this.algoliaConfig[name]) {
        const settings = this.algoliaConfig[name]
        if (settings.replicas) {
          settings.replicas = settings.replicas.map(r => `${prefix}${name}_${r}`)
        }
        try {
          await index.setSettings(this.algoliaConfig[name])
        } catch (error) {
          Factor.$log.error(error)
        }
      }

      return index
    }

    async updateIndexSettings() {
      const _promises = []

      Object.keys(this.algoliaConfig).forEach(async key => {
        const es = ["development", "production"]
        es.forEach(environment => {
          _promises.push(this._initIndex(key, environment))
        })
      })

      return await Promise.all(_promises)
    }

    async saveObject(args) {
      const index = await this._initIndex(args.index)

      const saveObject = { index: args.index, objectID: args.objectID, ...args.data }

      this.userCanEdit({ index, objectID: args.objectID })

      const content = await new Promise((resolve, reject) => {
        index.saveObject(saveObject, (err, content) => {
          console.log("Algolia Save", args, err, content)
          if (err) {
            reject(err)
          } else {
            resolve(content)
          }
        })
      })

      return content
    }

    async deleteObject({ index, objectID }) {
      const searchIndex = await this._initIndex(index)

      const content = await new Promise((resolve, reject) => {
        searchIndex.deleteObject(objectID, (err, content) => {
          if (err) {
            reject(err)
          } else {
            resolve(content)
          }
        })
      })

      return content
    }

    async partialUpdateObject(args) {
      const { index, id: objectID, data } = args
      const searchIndex = await this._initIndex(index)

      const content = await new Promise((resolve, reject) => {
        searchIndex.partialUpdateObject({ objectID, ...data }, true, (err, content) => {
          if (err) {
            reject(err)
          } else {
            resolve(content)
          }
        })
      })

      return content
    }
  })()
}
