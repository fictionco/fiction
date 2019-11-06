import { addCallback } from "@factor/tools"
import { deepMerge } from "@factor/tools/utils"
import axios from "axios"

import { endpointId } from "./util"
import { plugins } from "../extensions"

addCallback("endpoints", { id: endpointId, handler: { getIndex, getSingle } })

export async function getIndex() {
  const slugs = plugins

  const index = await Promise.all(slugs.map(async slug => getSingle({ slug })))

  return index
}

export async function latestPackageVersion(slug) {
  const { data } = await axios.get(`https://data.jsdelivr.com/v1/package/npm/${slug}`)

  if (data) {
    const {
      tags: { latest }
    } = data

    return latest
  } else return ""
}

export async function getSingle({ slug }) {
  const latest = await latestPackageVersion(slug)

  const requests = [
    {
      _id: "npmData",
      url: `https://registry.npmjs.org/${slug}`
    },
    {
      _id: "npmDownloads",
      url: `https://api.npmjs.org/downloads/point/last-month/${slug}`
    },
    {
      _id: "npmFiles",
      url: `https://data.jsdelivr.com/v1/package/npm/${slug}@${latest}`
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

  // Ensure array of objects and deep merge results
  const merged = deepMerge(
    results.map((result, index) => {
      const _id = requests[index]._id
      const data = Array.isArray(result.data) ? { [_id]: result.data } : result.data
      return data
    })
  )

  return merged
}
