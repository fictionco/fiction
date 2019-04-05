module.exports.default = Factor => {
  return new class {
    constructor() {
      this.algoliaConfig = require(`./config.json`)
      this.algoliasearch = require("algoliasearch")

      const {
        algolia: { adminKey, appId },
        env
      } = Factor.$config.settings()

      this.prefix = env
      this.client = this.algoliasearch(appId, adminKey)
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
          throw new Error("Insuffient priveliges to edit algolia object.")
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

    _initIndex(name) {
      // Make sure that this isn't already using a prefixed index name (replicas)
      // Prefixes are used to sep prod/dev/testing scenarios (keep data clean)
      const actualIndexName = name.includes(this.prefix) ? name : this.prefix + name

      const index = this.client.initIndex(actualIndexName)

      if (this.algoliaConfig[name]) {
        const settings = this.algoliaConfig[name]
        if (settings.replicas) {
          settings.replicas = settings.replicas.map(r => `${this.prefix}${name}_${r}`)
        }
        index.setSettings(this.algoliaConfig[name])
      }

      return index
    }

    updateIndexSettings() {
      Object.keys(this.algoliaConfig).forEach(key => {
        this._initIndex(key)
      })
    }

    async saveObject(args) {
      const index = this._initIndex(args.index)

      const saveObject = { index: args.index, objectID: args.objectID, ...args.data }

      this.userCanEdit({ index, objectID: args.objectID })

      const content = await new Promise((resolve, reject) => {
        index.saveObject(saveObject, (err, content) => {
          console.log("Save Object", args, err, content)
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
      const searchIndex = this._initIndex(index)

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
      const searchIndex = this._initIndex(index)

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
  }()
}
