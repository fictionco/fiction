module.exports.default = Factor => {
  return new (class {
    constructor() {
      // https://github.com/Automattic/mongoose/issues/4965
      Factor.$mongoose.set("applyPluginsToDiscriminators", true)

      // Add an array of populated fields
      Factor.$mongoose.plugin(this.registerPopulatedFields)

      this.DB = require("./server-db").default(Factor)
      Factor.$filters.callback("endpoints", { id: "db", handler: this })

      Factor.$filters.add("initialize-server", () => {
        this.setModels()

        // sync indexes only on serve commands
        if (process.env.FACTOR_COMMAND == "serve") {
          this._syncSchemaIndexes()
        }
      })
    }

    objectId(str) {
      return Factor.$mongoose.Types.ObjectId(str)
    }

    async runRequest(params) {
      const { model, method, _arguments = [] } = params
      const DataModel = await this.model(model)
      let result
      if (!DataModel) {
        throw new Error(`DB Model for ${model} does not exist.`)
      } else {
        try {
          result = await DataModel[method].apply(DataModel, _arguments)
        } catch (error) {
          throw new Error(error)
        }
      }

      return result
    }
    async run() {
      const params =
        arguments.length > 1
          ? {
              model: arguments[0],
              method: arguments[1],
              _arguments: arguments[2]
            }
          : arguments[0]
      return await this.runRequest(params)
    }
    canEdit({ doc, bearer, scope }) {
      if (!bearer) {
        Factor.$error.throw(400, "Not authorized.")
      }
      const { _id, authors = [] } = doc
      if (
        _id !== bearer._id &&
        !authors.some(_ => _._id == bearer._id) &&
        !bearer.accessLevel &&
        bearer.accessLevel >= 300
      ) {
        Factor.$error.throw(400, "Not authorized to edit")
      }
    }

    async populate({ _ids }) {
      const _in = Array.isArray(_ids) ? _ids : [_ids]
      const result = await this.model("Post").find({
        _id: { $in: _in }
      })

      return Array.isArray(_ids) ? result : result[0]
    }

    // Must be non-async so we can use chaining
    model(name) {
      // If model doesnt exist, create a vanilla one
      if (!this._models[name]) {
        this._models[name] = this._models.Post.discriminator(name, new Factor.$mongoose.Schema())
      }
      return this._models[name]
    }

    schema(name) {
      return this._schemas[name] || null
    }

    createPostModel() {
      const { schema, options, callback, name } = require("./schema").default(Factor)

      const postSchema = new Factor.$mongoose.Schema(schema, options)

      callback(postSchema)

      this._schemas[name] = postSchema

      this._models[name] = Factor.$mongoose.model(name, postSchema)

      return this._models[name]
    }

    // For server restarts
    resetModels() {
      const existingModels = Factor.$mongoose.modelNames()

      if (existingModels.length > 0) {
        existingModels.forEach(name => {
          delete Factor.$mongoose.models[name]
          delete Factor.$mongoose.modelSchemas[name]
        })
      }
    }

    setModels() {
      this.resetModels()
      this._schemas = {}
      this._models = {}
      const Post = this.createPostModel()

      const schemas = Factor.$filters.apply("data-schemas", [])

      schemas.forEach(({ name, schema, options = {}, callback = null }) => {
        options.discriminatorKey = "kind"

        this._schemas[name] = new Factor.$mongoose.Schema(schema, options)

        if (callback) callback(this._schemas[name])

        this._models[name] = Post.discriminator(name, this._schemas[name])
      })
    }

    // Scans a schema and adds the populated field names to an array property
    // Needed to help determine when/where to populate them
    registerPopulatedFields(schema, options) {
      const populated = []
      schema.eachPath(function process(pathName, schemaType) {
        if (pathName == "_id") return
        if (schemaType.options.ref || (schemaType.caster && schemaType.caster.options.ref)) {
          if (!populated.includes(pathName)) {
            populated.push(pathName)
          }
        }
      })

      schema.populatedFields = populated
    }

    // https://thecodebarbarian.com/whats-new-in-mongoose-5-2-syncindexes
    async _syncSchemaIndexes() {
      for (let model of Object.values(this._models)) {
        await model.syncIndexes()
      }

      return
    }
  })()
}
