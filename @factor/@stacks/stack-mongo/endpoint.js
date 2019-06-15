const mongoose = require("mongoose")

module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.DB_CONNECTION = Factor.$config.setting("DB_CONNECTION")

      this.mongooseConfig()
      this.db()

      // Wait til plugins loaded
      Factor.$filters.add("initialize-server", () => {
        this.setModels()
      })
    }

    mongooseConfig() {
      // https://mongoosejs.com/docs/guide.html#autoIndex
      if (process.env.NODE_ENV == "production") {
        mongoose.use("autoIndex", false)
      }
    }

    setModels() {
      const Base = mongoose.model("Base", new mongoose.Schema({}, { timestamps: true }))
      this._models = { Base }
      const schemas = Factor.$filters.apply("data-schemas", [])
      schemas.forEach(({ name, schema, options = {}, callback = null }) => {
        options.discriminatorKey = "kind"
        let ObjectSchema = new mongoose.Schema(schema, options)

        if (callback) {
          callback(ObjectSchema)

          //     ObjectSchema = callback(ObjectSchema)
        }

        this._models[name] = Base.discriminator(name, ObjectSchema)
      })
    }

    getModel(name) {
      return this._models[name] || null
    }

    async db() {
      if (this._db) {
        return this._db
      } else {
        try {
          await mongoose.connect(this.DB_CONNECTION, { useNewUrlParser: true })
          return mongoose.connection
        } catch (error) {
          throw new Error(error)
        }
      }
    }

    async run(params) {
      const { model, method, data } = params
      const DataModel = this.getModel(model)

      if (!DataModel) {
        throw new Error(`Model for ${model} does not exist.`)
      } else {
        DataModel[method](data)
        console.log("RAN THIS")
      }

      return params
    }
  })()
}
