import { endpointRequest, EndpointParameters } from "@factor/endpoint"
import { storeItem, stored } from "@factor/api"
import { FactorExtensionListing } from "../types"
import { endpointId } from "./util"

export const sendRequest = async <T>(
  method: string,
  params: EndpointParameters
): Promise<T> => {
  const result = await endpointRequest<T>({
    id: endpointId,
    method,
    params
  })

  return result
}

export const getIndexCache = (type: "plugin" | "theme"): FactorExtensionListing[] => {
  return stored(`${type}-index`)
}

export const getSingleCache = (name: string): FactorExtensionListing => {
  return stored(`extension-${name}`)
}

export const requestExtensionIndex = async ({
  type
}: {
  type: "plugin" | "theme";
}): Promise<FactorExtensionListing[]> => {
  let data = getIndexCache(type)

  if (!data) {
    data = await sendRequest<FactorExtensionListing[]>("getIndex", { type })

    storeItem(`${type}-index`, data)
  }

  return data
}

/**
 * Get information for a single extension
 * @param name - the name of the npm package
 */
export const requestExtensionSingle = async (
  name: string
): Promise<FactorExtensionListing> => {
  let data = getSingleCache(name)

  if (!data) {
    data = await sendRequest<FactorExtensionListing>("getSingle", { name })

    storeItem(`extension-${name}`, data)
  }

  return data
}
