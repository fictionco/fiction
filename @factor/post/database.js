import mongoose from "mongoose"
import { getAddedSchemas } from "./util"
import { log } from "@factor/tools"
export class FactorDB {
  // Must be non-async so we can use chaining
  model(name) {
    // If model doesnt exist, create a vanilla one
    if (!this.__models[name]) this.setModel({ name }, this.model("post"))

    return this.__models[name]
  }

  schema(name) {
    return this.__schemas[name] || null
  }

  async initialize() {
    await this.dbConnect()

    if (process.env.FACTOR_DEBUG == "yes") mongoose.set("debug", true)
    mongoose.plugin(require("mongoose-beautiful-unique-validation"))
    this.initializeModels()
  }

  initializeModels() {
    this.__schemas = {}
    this.__models = {}

    const sch = getAddedSchemas()

    const baseSchema = sch.find(_ => _.name == "post")

    const { model: baseModel } = this.setModel(baseSchema)

    sch.filter(s => s.name != "post").forEach(s => this.setModel(s, baseModel))
  }

  // Set schemas and models
  // For server restarting we need to inherit from already constructed mdb models if they exist
  setModel(_config, baseModel = false) {
    const { Schema, modelSchemas, models, model } = mongoose
    const { schema = {}, options = {}, callback, name } = _config

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

  async dbDisconnect() {
    if (this.isConnected()) {
      await mongoose.connection.close()
    }
  }

  async dbConnect() {
    if (!this.isConnected()) {
      try {
        const connectionString =
          process.env.DB_CONNECTION_TEST || process.env.DB_CONNECTION

        return await mongoose.connect(connectionString, { useNewUrlParser: true })
      } catch (error) {
        log.error(error)
      }
    }
  }

  isConnected() {
    return ["connected", "connecting"].includes(this.dbReadyState())
  }

  dbReadyState() {
    const states = ["disconnected", "connected", "connecting", "disconnecting"]

    return states[mongoose.connection.readyState]
  }
}

export const $DB = new FactorDB()
