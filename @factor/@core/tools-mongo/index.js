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
        .map(schema => {
          return typeof schema == "function" ? schema() : schema
        })
    }

    configureMongoose() {
      if (Factor.$isNode && Factor.FACTOR_TARGET == "server") {
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
      // Factor.$filters.callback("initial-server-start", () => this._syncSchemaIndexes())
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
