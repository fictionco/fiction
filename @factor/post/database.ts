import { log } from "@factor/api"
import { pushToFilter, addCallback, runCallbacks } from "@factor/api/hooks"
import { writeConfig, addNotice } from "@factor/cli/setup"
import mongoose, { Model, Schema, Document } from "mongoose"
import inquirer from "inquirer"
import mongooseBeautifulUniqueValidation from "mongoose-beautiful-unique-validation"

import { FactorSchema, FactorPost } from "./types"

import { getAddedSchemas, getBaseSchema } from "./util"

export type FactorPostDocument = FactorPost & Document

let __schemas: { [index: string]: Schema } = {}
let __models: { [index: string]: Model<any> } = {}
let __offline = false

/**
 * Is the db running in offline mode?
 */
export const dbIsOffline = (): boolean => {
  return (__offline || !process.env.DB_CONNECTION) && process.env.FACTOR_ENV !== "test"
}

/**
 * What is the current state of the database connection?
 */
export const dbReadyState = (): string => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"]

  return states[mongoose.connection.readyState]
}

/**
 * Is the DB connected?
 */
export const isConnected = (): boolean => {
  return ["connected"].includes(dbReadyState())
}

/**
 * Disconnect the db (if it is connected)
 */
export const dbDisconnect = async (): Promise<void> => {
  if (isConnected()) {
    await mongoose.connection.close()
  }
}

/**
 * Special handling and improvements to typical errors from db
 * @param error - the thrown error
 */
const dbHandleError = (error: Error & { code?: string }): void => {
  if (
    error.code === "ECONNREFUSED" ||
    error.code === "ENODATA" ||
    error.code === "ETIMEOUT"
  ) {
    __offline = true
    addNotice(
      `Couldn't connect to the database. Serving in offline mode. [${error.code}]`
    )
  } else if (
    dbReadyState() == "connecting" &&
    error.code == "EDESTRUCTION" &&
    !process.env.FACTOR_DEBUG
  ) {
    addNotice(`DB Error [${error.code}]`)
    // TODO not sure the exact context/meaning of this error
    // do nothing, this occurs in offline mode on server restart
  } else {
    log.error(error)
  }
}

/**
 * Connect to database using a MongoDb "connection string"
 */
export const dbConnect = async (): Promise<mongoose.Connection | void> => {
  if (__offline) {
    return
  }
  if (!isConnected() && process.env.DB_CONNECTION) {
    try {
      let connectionString = process.env.DB_CONNECTION

      // Remove any erroneous escaped double quotes if they exist
      // Depending on handling of .env this can happen
      connectionString = connectionString.replace(/\\"/g, "")

      const result = await mongoose.connect(connectionString, {
        useNewUrlParser: true
        // useUnifiedTopology: true // this was causing issues
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

  runCallbacks(`schema-hooks-${name}`, loadSchema)

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

/**
 * Make any upgrade changes to the indexes or fields
 */
const runDbUpgrades = async (): Promise<void> => {
  if (!__offline) {
    /**
     * Create missing indexes
     * ensureIndexes creates indexes that don't exist but can't drop indexes
     * syncIndexes will drop indexes then recreate them, problem is that we can't do this every time
     */
    const _promises = Object.values(__models).map(m => m.ensureIndexes())

    /**
     * @reference version 1.1
     * Rename subTitle to synopsis
     * Left here for reference in future changes
     */
    // await getModel("post").update(
    //   {},
    //   { $rename: { subTitle: "synopsis" } },
    //   { multi: true }
    // )

    await Promise.all(_promises)
  }

  return
}

/**
 * Get schemas and create Mongoose models
 */
const initializeModels = (): void => {
  __schemas = {}
  __models = {}

  const sch = getAddedSchemas()

  const baseSchema = getBaseSchema()

  const { model: baseModel } = setModel(baseSchema)

  sch.filter(s => s.name != "post").forEach(s => setModel(s, baseModel))
}

/**
 * Initialize the database and run any upgrades
 */
export const dbInitialize = async (): Promise<void> => {
  await dbConnect()

  if (process.env.FACTOR_DEBUG == "yes") {
    mongoose.set("debug", true)
  }

  mongoose.set("useCreateIndex", true)

  mongoose.plugin(mongooseBeautifulUniqueValidation, {
    defaultMessage: "{PATH}: '{VALUE}' is already being used."
  })

  initializeModels()

  await runCallbacks(`db-initialized`)

  /**
   * This must run after DB has been initialized to determine offline/online
   */
  await runDbUpgrades()
}

/**
 * Remove all persistent objects in Mongoose
 * To allow for smooth server restart
 */
export const tearDown = (): void => {
  Object.keys(mongoose.models).forEach(m => {
    mongoose.connection.deleteModel(m)
    delete mongoose.connection.models[m]
    delete mongoose.models[m]
    delete mongoose.modelSchemas[m]
  })
}

/**
 * Adds notifications and tools for setting up the basic DB connection
 */
export const dbSetupUtility = (): void => {
  if (!process.env.DB_CONNECTION) {
    pushToFilter({
      key: "dbConnection",
      hook: "setup-needed",
      item: {
        title: "DB Connection",
        value:
          "There is no DB connection URL set. This is needed for dashboard and auth.",
        file: ".env",
        name: "DB_CONNECTION"
      }
    })
  } else if (process.env.DB_CONNECTION.includes("demo:demo")) {
    pushToFilter({
      key: "dbDemo",
      hook: "setup-needed",
      item: {
        title: "Using Demo DB",
        value:
          "You are using the demo DB (resets every 30 minutes). Change it to your own connection in .env",
        file: ".env",
        name: "DB_CONNECTION"
      }
    })
  }

  pushToFilter({
    key: "dbConnectionSetup",
    hook: "cli-add-setup",
    item: () => {
      return {
        name: "DB Connection - Add/edit the database connection",
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
  /**
   * Clear DB info on server restart
   */
  addCallback({
    key: "teardownDb",
    hook: "rebuild-server-app",
    callback: () => {
      tearDown()
    }
  })
}
setup()
