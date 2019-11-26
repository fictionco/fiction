import { endpointRequest } from "@factor/endpoint"
import { storeItem, stored } from "@factor/tools"
import { endpointId } from "./util"

export async function requestExtensionIndex({ type = "plugins" }) {
  const data = await endpointRequest({
    id: endpointId,
    method: "getIndex",
    params: { type }
  })

  storeItem(`${type}-index`, data)

  return data
}

export async function requestExtensionSingle(name: string) {
  const data = await endpointRequest({
    id: endpointId,
    method: "getSingle",
    params: { name }
  })

  storeItem(`extension-${name}`, data)

  return data
}

export function getIndexCache(type = "plugins") {
  return stored(`${type}-index`)
}

export function getSingleCache(name: string) {
  return stored(`extension-${name}`)
}
