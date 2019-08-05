export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("webpack-ignore-modules", _ => [..._, "mongoose"])

      this.configureMongoose()

      Factor.$filters.callback("initialize-server", () => this.init())
      Factor.$filters.callback("initialize-app", () => this.init())
    }

    init() {
      this.schemas = Factor.$filters.apply("data-schemas", {
        post: require("@factor/post/schema").default(Factor)
      })
    }

    configureMongoose() {
      if (Factor.$isNode) {
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

    getPopulatedFields({ postType = "post", depth = 10 }) {
      // console.log('this.schemas', this.schemas)

      let fields = this.schemas.post.populatedFields || []

      if (postType != "post" && this.schemas[postType]) {
        const postTypePopulated = this.schemas[postType].populatedFields || []
        fields = [...fields, ...postTypePopulated]
      }

      const pop = fields.filter(_ => _.depth <= depth).map(_ => _.field)

      return pop
    }

    // Scans a schema and adds the populated field names to an array property
    // Needed to help determine when/where to populate them
    // _registerPopulatedFields(schema, options) {
    //   const populated = []
    //   schema.eachPath(function process(pathName, schemaType) {
    //     if (pathName == "_id") return
    //     if (schemaType.options.ref || (schemaType.caster && schemaType.caster.options.ref)) {
    //       if (!populated.includes(pathName)) {
    //         populated.push(pathName)
    //       }
    //     }
    //   })

    //   schema.populatedFields = populated
    // }

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
