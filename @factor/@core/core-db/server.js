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

    setModels() {
      // test
      const { Schema, model } = Factor.$mongoose

      const postSchema = new Schema(
        Factor.$filters.apply("post-schema", {
          postType: { type: String, index: true, sparse: true },
          title: { type: String, trim: true },
          body: { type: String, trim: true },
          author: [{ type: Schema.Types.ObjectId, ref: "User" }],
          images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
          avatar: { type: Schema.Types.ObjectId, ref: "Image" },
          tag: [String],
          category: [String],
          status: {
            type: String,
            enum: ["published", "draft", "trash"],
            index: true
          },
          permalink: {
            type: String,
            trim: true,
            index: { unique: true, sparse: true },
            minlength: 3,
            validator: function(v) {
              return /^[a-z0-9-]+$/.test(v)
            },
            message: props => `${props.value} is not URL compatible.`
          }
        }),
        { timestamps: true }
      )

      postSchema.index({ status: 1, postType: 1 }, { sparse: true })
      postSchema.index({ tag: 1, postType: 1 }, { sparse: true })
      postSchema.index({ category: 1, postType: 1 }, { sparse: true })

      postSchema.pre("save", function(next) {
        if (this.images && this.images.length > 0) {
          this.avatar = this.images[0]
        }

        this.postType = this.get("__t") || "Post"
        next()
      })

      this._schemas = { Post: postSchema }

      const Post = model("Post", postSchema)

      this._models = { Post }

      const schemas = Factor.$filters.apply("data-schemas", [])

      schemas.forEach(({ name, schema, options = {}, callback = null }) => {
        options.discriminatorKey = "kind"

        this._schemas[name] = new Schema(schema, options)

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
