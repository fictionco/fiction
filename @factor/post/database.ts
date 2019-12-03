import { log } from "@factor/tools"
import { pushToFilter, addCallback } from "@factor/tools/filters"
import { writeConfig } from "@factor/cli/setup"
import mongoose, { Model, Schema, Document } from "mongoose"
import inquirer from "inquirer"
import mongooseBeautifulUniqueValidation from "mongoose-beautiful-unique-validation"
import { FactorSchema, FactorPost } from "./types"

import { getAddedSchemas, getBaseSchema } from "./util"

type FactorPostDocument = FactorPost & Document

let __schemas: { [index: string]: Schema } = {}
let __models: { [index: string]: Model<any> } = {}
let __offline = false

addCallback("rebuild-server-app", () => {
  tearDown()
})

export function dbIsOffline(): boolean {
  return __offline || !process.env.DB_CONNECTION
}

// Must be non-async so we can use chaining
export function getModel<T>(name: string): Model<(T & Document) & FactorPostDocument> {
  // If model doesn't exist, create a vanilla one
  if (!__models[name] && name != "post") setModel({ name }, getModel("post"))

  return __models[name]
}

export async function dbInitialize(): Promise<void> {
  await dbConnect()

  if (process.env.FACTOR_DEBUG == "yes") mongoose.set("debug", true)
  mongoose.plugin(mongooseBeautifulUniqueValidation)
  initializeModels()
}

function initializeModels(): void {
  __schemas = {}
  __models = {}

  const sch = getAddedSchemas()

  const baseSchema = getBaseSchema()

  const { model: baseModel } = setModel(baseSchema)

  sch.filter(s => s.name != "post").forEach(s => setModel(s, baseModel))
}

// Set schemas and models
// For server restarting we need to inherit from already constructed mdb models if they exist
export function setModel(
  schemaConfig: FactorSchema,
  baseModel?: Model<FactorPostDocument> | void
): { schema: Schema; model: Model<any> } {
  const { Schema, model } = mongoose
  const { schema = {}, options = {}, callback, name } = schemaConfig

  const loadSchema = new Schema(schema, options)

  // Callback for hooks, etc.
  if (callback) callback(loadSchema)

  const loadModel = !baseModel
    ? model(name, loadSchema)
    : baseModel.discriminator(name, loadSchema)

  loadModel.createIndexes()

  __schemas[name] = loadSchema
  __models[name] = loadModel

  return { schema: loadSchema, model: loadModel }
}

export function tearDown(): void {
  Object.keys(mongoose.models).forEach(m => {
    delete mongoose.models[m]
  })
}

export async function dbDisconnect(): Promise<void> {
  if (isConnected()) {
    await mongoose.connection.close()
  }
}

export async function dbConnect(): Promise<mongoose.Connection | void> {
  if (!isConnected() && process.env.DB_CONNECTION) {
    try {
      const connectionString = process.env.DB_CONNECTION

      const result = await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })

      __offline = false

      return result.connection
    } catch (error) {
      dbHandleError(error)
    }
  } else {
    return mongoose.connection
  }
}

function dbHandleError(error: Error & { code?: string }): void {
  if (error.code === "ECONNREFUSED") {
    __offline = true
    log.warn("Couldn't connect to the database. Serving in offline mode.")
  } else if (
    dbReadyState() == "connecting" &&
    error.code == "EDESTRUCTION" &&
    !process.env.FACTOR_DEBUG
  ) {
    // TODO not sure the exact context/meaning of this error
    // do nothing, this occurs in offline mode on server restart
  } else {
    log.error(error)
  }
}

export function isConnected(): boolean {
  return ["connected"].includes(dbReadyState())
}

export function dbReadyState(): string {
  const states = ["disconnected", "connected", "connecting", "disconnecting"]

  return states[mongoose.connection.readyState]
}

export function dbSetupUtility(): void {
  // ADD CLI
  if (!process.env.DB_CONNECTION) {
    pushToFilter("setup-needed", {
      title: "DB Connection",
      value: "Needed for auth, users, posts, dashboard, etc...",
      location: ".env / DB_CONNECTION"
    })

    return
  }

  pushToFilter("cli-add-setup", () => {
    return {
      name: "DB Connection - Add/edit the connection string for MongoDB",
      value: "db",
      callback: async (): Promise<void> => {
        const questions = [
          {
            name: "connection",
            message: "What's your MongoDB connection string? (mongodb://...)",
            type: "input",
            default: process.env.DB_CONNECTION
          }
        ]

        const { connection } = await inquirer.prompt(questions)

        await writeConfig(".env", { DB_CONNECTION: connection })
      }
    }
  })
}
