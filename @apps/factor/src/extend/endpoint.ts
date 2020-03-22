import { deepMerge } from "@factor/api/utils"
import axios from "axios"
import cache from "memory-cache"
import { addEndpoint } from "@factor/api/endpoints"
import { addMiddleware } from "@factor/server/middleware"
import { Request, Response } from "express"
import latestVersion from "latest-version"
import { addPostSchema } from "@factor/post/util"

import { getModel } from "@factor/post/database"
import { FactorExtensionListing } from "../types"
import { extensions, ExtensionRecord } from "../extension-record"
import extensionSchema from "./schema"
import { endpointId, postType } from "./util"
export const getSingle = async (params: {
  name: string;
}): Promise<FactorExtensionListing> => {
  const { name } = params
  // const cached = cache.get(name)
  // if (cached) return cached

  const latest = await latestVersion(name)
  const requests = [
    {
      _id: "npmData",
      url: `https://registry.npmjs.org/${name}`
    },
    {
      _id: "npmDownloads",
      url: `https://api.npmjs.org/downloads/point/last-month/${name}`
    },
    {
      _id: "npmFiles",
      url: `https://data.jsdelivr.com/v1/package/npm/${name}@${latest}`
    }
  ]

  // Run the requests, but add context for errors
  const results = await Promise.all(
    requests.map(async ({ _id, url }) => {
      try {
        return await axios.get(url)
      } catch (error) {
        error.message = `${_id} Request to ${url}: ${error.message}`
        throw new Error(error)
      }
    })
  )

  const parsed = results.map(result => result.data)

  const otherData = { cdnBaseUrl: `https://cdn.jsdelivr.net/npm/${name}@${latest}` }

  // Ensure array of objects and deep merge results
  const merged: any = deepMerge([params, otherData, ...parsed])

  const item = { ...merged, pkg: merged.versions[latest] }

  delete item.versions

  const TWO_DAY = 1000 * 60 * 60 * 48
  cache.put(name, item, TWO_DAY)

  console.log("ITEM", item)
  // const Model = getModel(postType)

  // let post = await Model.findOne({ permalink: name })

  // if (!post) {
  //   post = new Model({ permalink: name })
  // }

  return item
}

export const saveIndex = async (): Promise<FactorExtensionListing[]> => {
  const list = extensions

  return await Promise.all(list.map(async extension => getSingle(extension)))
}

addEndpoint({ id: endpointId, handler: { getIndex, getSingle } })
addPostSchema(() => extensionSchema)

addMiddleware({
  key: "attachment",
  path: "_extensions",
  middleware: [
    async (request: Request, response: Response): Promise<void> => {
      const { query, body } = request

      const data = { ...body, ...query }

      saveIndex()

      response.send("cool").end()
      return
    }
  ]
})
