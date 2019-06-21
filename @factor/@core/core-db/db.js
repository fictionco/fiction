const mongoose = require("mongoose")
module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.DB_CONNECTION = Factor.$config.setting("DB_CONNECTION")
      this.mongooseConfig()

      Factor.$filters.callback("close-server", async () => {
        if (this._connected) {
          await mongoose.connection.close()

          this._connected = false
        }
        return
      })
      Factor.$filters.add("initialize-server", () => {
        this.setModels()
      })
    }
    mongooseConfig() {
      // https://mongoosejs.com/docs/guide.html#autoIndex
      if (process.env.NODE_ENV == "production") {
        mongoose.set("autoIndex", false)
      }
    }

    async getModel(name) {
      await this.connectDb()
      return this._models[name] || null
    }

    setModels() {
      const Post = mongoose.model("Post", new mongoose.Schema({}, { timestamps: true }))

      this._models = { Post }
      const schemas = Factor.$filters.apply("data-schemas", [])

      schemas.forEach(({ name, schema, options = {}, callback = null }) => {
        options.discriminatorKey = "kind"
        let ObjectSchema = new mongoose.Schema(schema, options)

        if (callback) callback(ObjectSchema)

        this._models[name] = Post.discriminator(name, ObjectSchema)
      })
    }

    async connectDb() {
      if (!this._connected) {
        try {
          this._connected = true
          await mongoose.connect(this.DB_CONNECTION, { useNewUrlParser: true })
          return
        } catch (error) {
          Factor.$error.throw(error)
        }
      }
    }
  })()
}
