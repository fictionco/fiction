import { currentRoute, endpointRequest, stored, storeItem } from "@factor/api"
import { EndpointParameters, EndpointResponse, PostStatus } from "@factor/types"

import { endpointId, postType } from "./helpers"
import { FactorExtensionInfo } from "./types"

export const sendRequest = async <T>(
  method: string,
  params: EndpointParameters,
): Promise<EndpointResponse<T>> => {
  const result = await endpointRequest<T>({
    url: endpointId,

    params,
  })

  return result
}

export const getIndexCache = (
  type: "plugin" | "theme",
): FactorExtensionInfo[] | undefined => {
  return stored(`${type}-index`)
}

export const getSingleCache = (
  name: string,
): FactorExtensionInfo | undefined => {
  return stored(`extension-${name}`)
}

// /**
//  * Gets the index of extensions, stores under post type
//  */
// export const requestIndex = async ({
//   extensionType,
// }: {
//   extensionType: "theme" | "plugin"
// }): Promise<void> => {
//   const route = currentRoute()
//   const { params = {}, query = {} } = route ?? {}
//   const args = { ...params, ...query }

//   const tag = params.tag ?? query.tag ?? ""
//   const category = params.category ?? query.category ?? ""
//   const page = Number.parseInt((args.page as string) ?? 1)
//   const limit = 20

//   await fetchPostIndex({
//     postType,
//     storeKey: [postType, extensionType].join(""),
//     tag,
//     category,
//     sort: "updatedAt",
//     page,
//     limit,
//     status: PostStatus.Published,
//     conditions: { extensionType, discover: { $ne: false } },
//   })
// }

export const requestExtensionIndex = async ({
  type,
}: {
  type: "plugin" | "theme"
}): Promise<FactorExtensionInfo[]> => {
  const data = getIndexCache(type)

  if (!data) {
    const { data } = await sendRequest<FactorExtensionInfo[]>("getIndex", {
      type,
    })

    storeItem(`${type}-index`, data)
  }

  return data ?? []
}

/**
 * Get information for a single extension
 * @param name - the name of the npm package
 */
export const requestExtensionSingle = async (
  name: string,
): Promise<FactorExtensionInfo | undefined> => {
  const data = getSingleCache(name)

  if (!data) {
    const { data } = await sendRequest<FactorExtensionInfo>("getSingle", {
      name,
    })

    storeItem(`extension-${name}`, data)
  }

  return data
}
