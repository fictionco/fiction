module.exports.default = Factor => {
  return new (class {
    constructor() {
      // https://github.com/Automattic/mongoose/issues/4965
      Factor.$mongoose.set("applyPluginsToDiscriminators", true)

      // Add an array of populated fields
      Factor.$mongoose.plugin(this.registerPopulatedFields)

      this.DB = require("./server-db").default(Factor)
      Factor.$filters.callback("endpoints", { id: "db", handler: this })

      Factor.$filters.callback("initialize-server", () => this.setModels())
      // Factor.$filters.callback("initial-server-start", () => this._syncSchemaIndexes())
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

      const { _id, authors = [] } = doc
      if (!bearer ||
        (_id !== bearer._id &&
          !authors.some(_ => _._id == bearer._id) &&
          !bearer.accessLevel &&
          bearer.accessLevel >= 300)
      ) {
        throw new Error("Not authorized.")
      }
    }

    async populate({ _ids }) {
      const _in = Array.isArray(_ids) ? _ids : [_ids]
      const result = await this.model("post").find({
        _id: { $in: _in }
      })

      return Array.isArray(_ids) ? result : result[0]
    }

    // Must be non-async so we can use chaining
    model(name) {
      // If model doesnt exist, create a vanilla one
      if (!this._models[name]) {
        this._models[name] = this.model("post").discriminator(name, new Factor.$mongoose.Schema())
      }
      return this._models[name]
    }

    schema(name) {
      return this._schemas[name] || null
    }

    // Set schemas and models
    // For server restarting we need to inherit from already constructed mdb models if they exist
    setModel(config, postModel = false) {
      const { schema, options, callback, name } = config

      let _model
      let _schema
      if (Factor.$mongoose.models[name]) {
        _schema = Factor.$mongoose.modelSchemas[name]
        _model = Factor.$mongoose.models[name]
      } else {
        _schema = new Factor.$mongoose.Schema(schema, options)
        if (callback) callback(_schema)

        if (!postModel) {
          _model = Factor.$mongoose.model(name, _schema)
        } else {
          _model = postModel.discriminator(name, _schema)
          _model.ensureIndexes()
        }
      }

      this._schemas[name] = _schema
      this._models[name] = _model

      return _model
    }

    // setSchema(config) {
    //   const { schema, options, callback, name } = config
    //   let _schema
    //   if (Factor.$mongoose.modelSchemas[name]) {
    //     _schema = Factor.$mongoose.modelSchemas[name]
    //   } else {
    //     _schema = new Factor.$mongoose.Schema(schema, options)

    //     if (callback) callback(_schema)
    //   }

    //   this._schemas[name] = _schema

    //   return _schema
    // }

    // For server restarts
    // resetModels() {
    //   const existingModels = Factor.$mongoose.modelNames()

    //   if (existingModels.length > 0) {
    //     existingModels.forEach(name => {
    //       delete Factor.$mongoose.models[name]
    //       delete Factor.$mongoose.modelSchemas[name]
    //     })
    //   }
    // }

    setModels() {
      //   this.resetModels()
      this._schemas = {}
      this._models = {}
      const postModel = this.setModel(require("./schema").default(Factor))

      const postSchemas = Factor.$filters.apply("data-schemas", [])

      postSchemas.forEach(config => {
        this.setModel(config, postModel)
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
