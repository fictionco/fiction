import mongoose from "mongoose"
import connectDb from "./connect-db"
import addSetupCli from "./setup-cli"
import { getAddedSchemas } from "./util"
import endpoint from "./endpoint"

export default Factor => {
  return new (class {
    constructor() {
      addSetupCli()
      connectDb()
      Factor.$filters.callback("endpoints", { id: "db", handler: endpoint })
      Factor.$filters.callback("initialize-server", () => this.initialize())
    }

    initialize() {
      this.__schemas = {}
      this.__models = {}

      const allPostSchemas = getAddedSchemas()
      const baseSchema = allPostSchemas.find(_ => _.name == "post")

      const { model: baseModel } = this.setModel(baseSchema)

      allPostSchemas
        .filter(s => s.name != "post")
        .forEach(s => this.setModel(s, baseModel))
    }

    // Set schemas and models
    // For server restarting we need to inherit from already constructed mdb models if they exist
    setModel(config, baseModel = false) {
      const { Schema, modelSchemas, models, model } = mongoose
      const { schema = {}, options = {}, callback, name } = config

      let _model_
      let _schema_

      // If already set in mongoose
      if (models[name]) {
        _schema_ = modelSchemas[name]
        _model_ = models[name]
      } else {
        _schema_ = new Schema(schema, options)

        // Callback for hooks, etc.
        if (callback) callback(_schema_)

        _model_ = !baseModel
          ? model(name, _schema_)
          : baseModel.discriminator(name, _schema_)

        _model_.ensureIndexes()
      }

      this.__schemas[name] = _schema_
      this.__models[name] = _model_

      return { schema: _schema_, model: _model_ }
    }

    // Must be non-async so we can use chaining
    model(name) {
      // If model doesnt exist, create a vanilla one
      if (!this.__models[name]) this.setModel({ name }, this.model("post"))

      return this.__models[name]
    }

    schema(name) {
      return this.__schemas[name] || null
    }
  })()
}
