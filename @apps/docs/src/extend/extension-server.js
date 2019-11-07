import { addCallback } from "@factor/tools"
import { deepMerge } from "@factor/tools/utils"
import axios from "axios"

import { endpointId } from "./util"
import * as extensions from "../extensions"

addCallback("endpoints", { id: endpointId, handler: { getIndex, getSingle } })

export async function getIndex({ type = "plugins" }) {
  const list = extensions[type]
  return await Promise.all(list.map(async plugin => getSingle(plugin)))
}

export async function getSingle(plugin) {
  const { name } = plugin

  const latest = await latestPackageVersion(name)

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
    requests.map(async ({ _id, url, options = {} }) => {
      try {
        return await axios.get(url, options)
      } catch (error) {
        error.message = `${_id} Request to ${url}: ${error.message}`
        throw new Error(error)
      }
    })
  )

  const parsed = results.map(result => result.data)

  const otherData = { cdnBaseUrl: `https://cdn.jsdelivr.net/npm/${name}@${latest}` }

  // Ensure array of objects and deep merge results
  const merged = deepMerge([plugin, otherData, ...parsed])

  const item = { ...merged, pkg: merged.versions[latest] }

  delete item.versions
  //test
  return item
}

export async function latestPackageVersion(name) {
  const { data } = await axios.get(`https://data.jsdelivr.com/v1/package/npm/${name}`)

  if (data) {
    const {
      tags: { latest }
    } = data

    return latest
  } else return ""
}
