// Helps with resolution in node_modules

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />
import { log } from "@factor/api"
import { pushToFilter, addCallback, runCallbacks } from "@factor/api/hooks"
import { addNotice } from "@factor/cli/setup"
import mongoose, { Model, Schema, Document } from "mongoose"
import { PostTypeConfig } from "@factor/api/post-types"

import { FactorPost } from "./types"

import { getAddedSchemas, getBaseSchema } from "./util"

export type FactorPostDocument = FactorPost & Document

declare module "mongoose" {
  export const modelSchemas: { [index: string]: Schema }
}

let __schemas: { [index: string]: Schema } = {}
let __models: { [index: string]: Model<any> } = {}
let __offline = false

export const demoDbUrl = (): string => {
  return "mongodb+srv://demo:demo@cluster0-yxsfy.mongodb.net/demo?retryWrites=true&w=majority"
}

export const getDbUrl = (): string => {
  const connectionString =
    process.env.FACTOR_DB_CONNECTION || process.env.DB_CONNECTION || demoDbUrl()

  return connectionString.replace(/\\"/g, "")
}

export const usingDemoDb = (): boolean => {
  return getDbUrl().includes("demo:demo") ? true : false
}

/**
 * Is the db running in offline mode?
 */
export const dbIsOffline = (): boolean => {
  return __offline && process.env.FACTOR_ENV !== "test"
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
  const dbUrl = getDbUrl()

  if (__offline) {
    return
  }

  if (!isConnected()) {
    try {
      const result = await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
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
  schemaConfig: PostTypeConfig,
  baseModel?: Model<FactorPostDocument> | void
): { schema: Schema; model: Model<any> } => {
  const { Schema, model } = mongoose
  const {
    schemaDefinition = {},
    schemaOptions = {},
    schemaMiddleware,
    postType,
  } = schemaConfig

  const schema =
    typeof schemaDefinition == "function" ? schemaDefinition() : schemaDefinition

  const loadSchema = new Schema(schema, schemaOptions)

  // Callback for hooks, etc.
  if (schemaMiddleware) schemaMiddleware(loadSchema)

  runCallbacks(`schema-hooks-${postType}`, loadSchema)

  const loadModel = !baseModel
    ? model(postType, loadSchema)
    : baseModel.discriminator(postType, loadSchema)

  __schemas[postType] = loadSchema
  __models[postType] = loadModel

  return { schema: loadSchema, model: loadModel }
}

/**
 * Gets a Mongoose model based on postType name
 * Must be async so it can be chained as recommended by Mongoose docs
 * @param postType - name of postType/model
 */
export const getModel = <T>(
  postType: string
): Model<(T & Document) & FactorPostDocument> => {
  // If model doesn't exist, create a vanilla one
  if (!__models[postType] && postType != "post") {
    setModel({ postType }, getModel("post"))
  }

  return __models[postType]
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
    const _promises = Object.values(__models).map((m) => m.ensureIndexes())

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

  sch.filter((s) => s.postType != "post").forEach((s) => setModel(s, baseModel))
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
  Object.keys(mongoose.models).forEach((m) => {
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
  if (usingDemoDb()) {
    pushToFilter({
      key: "dbDemo",
      hook: "setup-needed",
      item: {
        title: "Using Demo DB",
        value:
          "The demo DB resets itself every 30 minutes (set process.env.FACTOR_DB_CONNECTION)",
        file: ".env",
        name: "FACTOR_DB_CONNECTION",
      },
    })
  }
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
    },
  })
}
setup()
