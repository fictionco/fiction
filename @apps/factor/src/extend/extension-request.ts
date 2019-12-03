import { endpointRequest } from "@factor/endpoint"
import { storeItem, stored } from "@factor/tools"
import { FactorExtensionListing } from "../types"
import { endpointId } from "./util"

export async function requestExtensionIndex({
  type = "plugins"
}): Promise<FactorExtensionListing[]> {
  const data = await endpointRequest({
    id: endpointId,
    method: "getIndex",
    params: { type }
  })

  storeItem(`${type}-index`, data)

  return data
}

export async function requestExtensionSingle(
  name: string
): Promise<FactorExtensionListing> {
  const data = await endpointRequest({
    id: endpointId,
    method: "getSingle",
    params: { name }
  })

  storeItem(`extension-${name}`, data)

  return data
}

export function getIndexCache(type = "plugins"): unknown {
  return stored(`${type}-index`)
}

export function getSingleCache(name: string): unknown {
  return stored(`extension-${name}`)
}
