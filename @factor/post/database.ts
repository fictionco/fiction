import { log } from "@factor/api"
import { pushToFilter, addCallback } from "@factor/api/hooks"
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

export const dbIsOffline = (): boolean => {
  return (__offline || !process.env.DB_CONNECTION) && process.env.FACTOR_ENV !== "test"
}

export const dbReadyState = (): string => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"]

  return states[mongoose.connection.readyState]
}

export const isConnected = (): boolean => {
  return ["connected"].includes(dbReadyState())
}

export const dbDisconnect = async (): Promise<void> => {
  if (isConnected()) {
    await mongoose.connection.close()
  }
}

const dbHandleError = (error: Error & { code?: string }): void => {
  if (error.code === "ECONNREFUSED" || error.code === "ENODATA") {
    __offline = true
    log.warn(`Couldn't connect to the database. Serving in offline mode. [${error.code}]`)
  } else if (
    dbReadyState() == "connecting" &&
    error.code == "EDESTRUCTION" &&
    !process.env.FACTOR_DEBUG
  ) {
    log.warn(`DB Error [${error.code}]`)
    // TODO not sure the exact context/meaning of this error
    // do nothing, this occurs in offline mode on server restart
  } else {
    log.error(error)
  }
}

export const dbConnect = async (): Promise<mongoose.Connection | void> => {
  if (!isConnected() && process.env.DB_CONNECTION) {
    try {
      const connectionString = process.env.DB_CONNECTION

      const result = await mongoose.connect(connectionString, {
        useNewUrlParser: true
        // useUnifiedTopology: true
      })

      __offline = false

      return result.connection
    } catch (error) {
      dbHandleError(error)
      return
    }
  } else {
    return mongoose.connection
  }
}

/**
 * Set schemas and model configuration in Mongoose/MongoDB and Factor
 * @param schemaConfig - Factor schema configuration object
 * @param baseModel - Base post model
 */
export const setModel = (
  schemaConfig: FactorSchema,
  baseModel?: Model<FactorPostDocument> | void
): { schema: Schema; model: Model<any> } => {
  const { Schema, model } = mongoose
  const { schema = {}, options = {}, callback, name } = schemaConfig

  const loadSchema = new Schema(schema, options)

  // Callback for hooks, etc.
  if (callback) callback(loadSchema)

  const loadModel = !baseModel
    ? model(name, loadSchema)
    : baseModel.discriminator(name, loadSchema)

  __schemas[name] = loadSchema
  __models[name] = loadModel

  return { schema: loadSchema, model: loadModel }
}

/**
 * Gets a Mongoose model based on postType name
 * Must be async so it can be chained as recommended by Mongoose docs
 * @param name - name of postType/model
 */
export const getModel = <T>(name: string): Model<(T & Document) & FactorPostDocument> => {
  // If model doesn't exist, create a vanilla one
  if (!__models[name] && name != "post") {
    setModel({ name }, getModel("post"))
  }

  return __models[name]
}

const runDbUpgrades = async (): Promise<void> => {
  // Create missing indexes
  if (!__offline) {
    const _promises = Object.values(__models).map(m => m.createIndexes())

    // version 1.1
    // upgrade fields
    // Rename subTitle to synopsis
    await getModel("post").update(
      {},
      { $rename: { subTitle: "synopsis" } },
      { multi: true }
    )

    await Promise.all(_promises)
  }

  return
}

const initializeModels = (): void => {
  __schemas = {}
  __models = {}

  const sch = getAddedSchemas()

  const baseSchema = getBaseSchema()

  const { model: baseModel } = setModel(baseSchema)

  sch.filter(s => s.name != "post").forEach(s => setModel(s, baseModel))
}

export const dbInitialize = async (): Promise<void> => {
  await dbConnect()

  if (process.env.FACTOR_DEBUG == "yes") mongoose.set("debug", true)

  mongoose.plugin(mongooseBeautifulUniqueValidation, {
    defaultMessage: "{PATH}: '{VALUE}' is already being used."
  })

  initializeModels()

  await runDbUpgrades()
}

export const tearDown = (): void => {
  Object.keys(mongoose.models).forEach(m => {
    mongoose.connection.deleteModel(m)
    delete mongoose.connection.models[m]
    delete mongoose.models[m]
    delete mongoose.modelSchemas[m]
  })
}

export const dbSetupUtility = (): void => {
  // ADD CLI
  if (!process.env.DB_CONNECTION) {
    pushToFilter({
      key: "dbConnection",
      hook: "setup-needed",
      item: {
        title: "DB Connection",
        value: "Needed for auth, users, posts, dashboard, etc...",
        location: ".env / DB_CONNECTION"
      }
    })

    return
  } else if (process.env.DB_CONNECTION.includes("demo")) {
    log.warn(
      "Looks like you are using the demo DB (resets every 30 minutes). Change it to your own connection in .env."
    )
  }

  pushToFilter({
    key: "dbConnection",
    hook: "cli-add-setup",
    item: () => {
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

          await writeConfig("private", { DB_CONNECTION: connection })
        }
      }
    }
  })
}

export const setup = (): void => {
  addCallback({
    key: "teardownDb",
    hook: "rebuild-server-app",
    callback: () => {
      tearDown()
    }
  })
}
setup()
