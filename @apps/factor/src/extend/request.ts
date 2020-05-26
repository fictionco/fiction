import { endpointRequest, EndpointParameters } from "@factor/endpoint"
import { storeItem, stored } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"
import { currentRoute } from "@factor/app/router"
import { PostStatus } from "@factor/post/types"
import { FactorExtensionInfo } from "./types"
import { endpointId, postType } from "./util"
export const sendRequest = async <T>(
  method: string,
  params: EndpointParameters
): Promise<T> => {
  const result = await endpointRequest<T>({
    id: endpointId,
    method,
    params,
  })

  return result
}

export const getIndexCache = (type: "plugin" | "theme"): FactorExtensionInfo[] => {
  return stored(`${type}-index`)
}

export const getSingleCache = (name: string): FactorExtensionInfo => {
  return stored(`extension-${name}`)
}

/**
 * Gets the index of extensions, stores under post type
 */
export const requestIndex = async ({
  extensionType,
}: {
  extensionType: "theme" | "plugin"
}): Promise<void> => {
  const route = currentRoute()
  const { params, query } = route

  const tag = params.tag ?? query.tag ?? ""
  const category = params.category ?? query.category ?? ""
  const page = Number.parseInt(params.page ?? query.page ?? 1)
  const limit = 20

  await requestPostIndex({
    postType,
    storeKey: [postType, extensionType].join(""),
    tag,
    category,
    sort: "updatedAt",
    page,
    limit,
    status: PostStatus.Published,
    conditions: { extensionType, discover: { $ne: false } },
  })
}

export const requestExtensionIndex = async ({
  type,
}: {
  type: "plugin" | "theme"
}): Promise<FactorExtensionInfo[]> => {
  let data = getIndexCache(type)

  if (!data) {
    data = await sendRequest<FactorExtensionInfo[]>("getIndex", { type })

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
): Promise<FactorExtensionInfo> => {
  let data = getSingleCache(name)

  if (!data) {
    data = await sendRequest<FactorExtensionInfo>("getSingle", { name })

    storeItem(`extension-${name}`, data)
  }

  return data
}
