import { $DB } from "./database"
import { $PostServer } from "./endpoint"
import "./hooks-server"

export async function savePost(_parameters, meta = {}) {
  return await $PostServer.save(_parameters, meta)
}

export async function getSinglePost(_parameters, meta = {}) {
  return await $PostServer.single(_parameters, meta)
}

export function getModel(postType) {
  return $DB.model(postType)
}
