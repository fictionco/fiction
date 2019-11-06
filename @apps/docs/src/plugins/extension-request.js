import { endpointRequest } from "@factor/endpoint"
import { storeItem, stored } from "@factor/tools"
import { endpointId } from "./util"

export async function requestExtensionIndex() {
  const data = await endpointRequest({ id: endpointId, method: "getIndex" })
  storeItem("plugins-index", data)

  return data
}

export async function requestExtensionSingle() {
  return {}
}

export function getIndexCache() {
  return stored("plugins-index")
}
