module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.DB_CONNECTION = Factor.$config.setting("DB_CONNECTION")
      this.dbConfig()

      Factor.$filters.callback("close-server", async () => {
        if (this._connected) {
          await Factor.$mongoose.connection.close()

          this._connected = false
        }
        return
      })
      Factor.$filters.add("initialize-server", () => {
        this.setModels()
      })
    }

    dbConfig() {
      // https://mongoosejs.com/docs/guide.html#autoIndex
      if (process.env.NODE_ENV == "production") {
        Factor.$mongoose.set("autoIndex", false)
      }
    }

    async getModel(name) {
      await this.connectDb()
      return this._models[name] || null
    }

    setModels() {
      // test
      const { Schema, model } = Factor.$mongoose
      const Post = model(
        "Post",
        new Schema(
          Factor.$filters.apply("post-schema", {
            title: { type: String, trim: true },
            body: { type: String, trim: true },
            author: [{ type: Schema.Types.ObjectId, ref: "User" }],
            permalink: {
              type: String,
              trim: true,
              index: { unique: true },
              minlength: 3,
              validator: function(v) {
                return /^[a-z0-9-]+$/.test(v)
              },
              message: props => `${props.value} is not URL compatible.`
            }
          }),
          { timestamps: true }
        )
      )

      this._models = { Post }
      const schemas = Factor.$filters.apply("data-schemas", [])

      schemas.forEach(({ name, schema, options = {}, callback = null }) => {
        options.discriminatorKey = "kind"
        let ObjectSchema = new Schema(schema, options)

        if (callback) callback(ObjectSchema)

        this._models[name] = Post.discriminator(name, ObjectSchema)
      })
    }

    async connectDb() {
      if (!this._connected) {
        try {
          this._connected = true
          await Factor.$mongoose.connect(this.DB_CONNECTION, { useNewUrlParser: true })
          return
        } catch (error) {
          Factor.$error.throw(error)
        }
      }
    }

    readyStateMap() {
      //  console.log("Mongo", this.readyStateMap()[Factor.$mongoose.connection.readyState])
      return ["disconnected", "connected", "connecting", "disconnecting"]
    }
  })()
}
