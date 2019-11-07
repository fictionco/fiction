import { endpointRequest } from "@factor/endpoint"
import { storeItem, stored } from "@factor/tools"
import { endpointId } from "./util"

export async function requestExtensionIndex(type = "plugins") {
  const data = await endpointRequest({
    id: endpointId,
    method: "getIndex",
    params: { type }
  })
  storeItem(`${type}-index`, data)

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
