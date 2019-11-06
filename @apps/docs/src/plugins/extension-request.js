import { endpointRequest } from "@factor/endpoint"
import { storeItem, stored } from "@factor/tools"
import { endpointId } from "./util"

export async function requestExtensionIndex() {
  const data = await endpointRequest({ id: endpointId, method: "getIndex" })
  storeItem("plugins-index", data)

  return data
}

export async function requestExtensionSingle(name) {
  const data = await endpointRequest({
    id: endpointId,
    method: "getSingle",
    params: { name }
  })
  storeItem(`extension-${name}`, data)

  return data
}

export function getIndexCache() {
  return stored("plugins-index")
}

export function getSingleCache(name) {
  return stored(`extension-${name}`)
}
