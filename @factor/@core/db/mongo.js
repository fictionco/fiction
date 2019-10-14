export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("webpack-ignore-modules", _ => [..._, "mongoose"])
      this.configureMongoose()

      Factor.$filters.callback("initialize-server", () => this.init())
      Factor.$filters.callback("initialize-app", () => this.init())
    }

    init() {
      this.schemas = Factor.$filters
        .apply("data-schemas", [require("@factor/post/schema").default(Factor)])
        .map(schemaConfig => {
          const _s = typeof schemaConfig == "function" ? schemaConfig() : schemaConfig
          return Factor.$filters.apply(`data-schema-${_s.name}`, _s)
        })
    }

    configureMongoose() {
      if (Factor.$isNode && process.env.FACTOR_TARGET == "server") {
        this.mongoose = require("mongoose")

        // https://github.com/Automattic/mongoose/issues/4965
        this.mongoose.set("applyPluginsToDiscriminators", true)

        // https://mongoosejs.com/docs/guide.html#autoIndex
        if (process.env.NODE_ENV == "production") {
          this.mongoose.set("autoIndex", false)
        } else if (Factor.FACTOR_DEBUG) {
          this.mongoose.set("debug", true)
        }

        // Improve duplicate value validation errors
        // https://github.com/matteodelabre/mongoose-beautiful-unique-validation
        const beautifyUnique = require("mongoose-beautiful-unique-validation")
        this.mongoose.plugin(beautifyUnique)
      } else {
        this.mongoose = require("mongoose/browser")
      }
      // Factor.$filters.callback("after-first-server-extend", () => this._syncSchemaIndexes())
    }

    objectIdType() {
      return this.mongoose.Schema.Types.ObjectId
    }

    objectId(str) {
      return this.mongoose.Types.ObjectId(str)
    }

    getSchemas() {
      return this.schemas
    }

    getSchema(postType = "post") {
      return this.schemas.find(_ => _.name == postType)
    }

    canUpdatePost({ user, post, action, isNew }) {
      const schema = this.getSchema(post.__t)

      if (isNew && action == "save" && schema.anonymousUserCanCreate) {
        return true
      } else if (
        bearer &&
        (bearer.accessLevel >= 300 ||
          post.author.includes(bearer._id) ||
          bearer._id.toString() == post._id.toString())
      ) {
        return true
      } else {
        throw new Error("Insufficient permissions.")
      }
    }

    getPopulatedFields({ postType = "post", depth = 10 }) {
      let fields = this.getSchema("post").populatedFields || []

      const schema = this.getSchema(postType)

      if (postType != "post" && schema) {
        const postTypePopulated = schema.populatedFields || []
        fields = [...fields, ...postTypePopulated]
      }

      const pop = fields.filter(_ => _.depth <= depth).map(_ => _.field)

      return pop
    }

    // Ensure all post indexes are up to date .
    // https://thecodebarbarian.com/whats-new-in-mongoose-5-2-syncindexes
    async _syncSchemaIndexes() {
      for (let key of Object.keys(this._models)) {
        const model = this._models[key]

        await model.ensureIndexes()
      }
      return
    }
  })()
}
