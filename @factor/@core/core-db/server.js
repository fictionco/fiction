module.exports.default = Factor => {
  return new (class {
    constructor() {

      this.mongo = Factor.$mongo.mongoose
      this.DB = require("./server-db").default(Factor)
      Factor.$filters.callback("endpoints", { id: "db", handler: this })
      Factor.$filters.callback("initialize-server", () => this.setModels())

    }

    objectId(str) {
      return this.mongo.Types.ObjectId(str)
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
      const { Schema } = this.mongo
      // If model doesnt exist, create a vanilla one
      if (!this._models[name]) {
        this._models[name] = this.model("post").discriminator(name, new Schema())
      }
      return this._models[name]
    }

    schema(name) {
      return this._schemas[name] || null
    }

    // Set schemas and models
    // For server restarting we need to inherit from already constructed mdb models if they exist
    setModel(config, postModel = false) {
      const { Schema } = this.mongo
      const { schema, options, callback, name } = config

      let _model
      let _schema
      if (this.mongo.models[name]) {
        _schema = this.mongo.modelSchemas[name]
        _model = this.mongo.models[name]
      } else {
        _schema = new Schema(schema, options)
        if (callback) callback(_schema)

        if (!postModel) {
          _model = this.mongo.model(name, _schema)
        } else {
          _model = postModel.discriminator(name, _schema)
          _model.ensureIndexes()
        }
      }

      this._schemas[name] = _schema
      this._models[name] = _model

      return _model
    }


    setModels() {
      //   this.resetModels()
      this._schemas = {}
      this._models = {}
      const postModel = this.setModel(require("@factor/post/schema").default(Factor))

      const postSchemas = Factor.$filters.apply("data-schemas", [])

      postSchemas.forEach(config => {
        this.setModel(config, postModel)
      })
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
