import mongoose from "mongoose"
import { logError } from "@factor/logger/util"
import DB from "./db"
import PostEndpoint from "./endpoint"
import { addCallback } from "@factor/filters/util"

const __DB = new DB()
const __PostEndpoint = new PostEndpoint()

addCallback("endpoints", { id: "posts", handler: __PostEndpoint })

export async function savePost(_parameters, meta = {}) {
  return await __PostEndpoint.save(_parameters, meta)
}

export async function getSinglePost(_parameters, meta = {}) {
  return await PostEndpoint.single(_parameters, meta)
}

export function getModel(postType) {
  return __DB.model(postType)
}

export async function dbDisconnect() {
  if (["connected", "connecting"].includes(dbReadyState())) {
    await mongoose.connection.close()
  }
}

export async function dbConnect() {
  if (!["connected", "connecting"].includes(dbReadyState())) {
    try {
      const connectionString = process.env.DB_CONNECTION_TEST || process.env.DB_CONNECTION

      return await mongoose.connect(connectionString, { useNewUrlParser: true })
    } catch (error) {
      logError(error)
    }
  }
}

export function dbReadyState() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"]

  return states[mongoose.connection.readyState]
}
