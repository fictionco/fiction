import mongoose from "mongoose"
import dbConnector from "./db-connection"
import addSetupCli from "./db-setup-cli"
import { getAddedSchemas } from "./util"
import Factor from "@factor/core"
import { addCallback } from "@factor/filters/util"
export default class FactorDB {
  constructor() {
    addSetupCli()
    dbConnector()
    addCallback("initialize-server", () => this.initialize())
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

  initialize() {
    if (process.env.FACTOR_DEBUG) mongoose.set("debug", true)
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
}
