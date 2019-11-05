import { plugins } from "../extensions"
import { deepMerge } from "@factor/tools/utils"
import axios from "axios"
import { addCallback, log } from "@factor/tools"
import { endpointId } from "./util"

addCallback("endpoints", { id: endpointId, handler: { getIndex, getSingle } })

export async function getIndex() {
  const slugs = plugins

  const index = await Promise.all(slugs.map(async slug => getSingle(slug)))

  return index
}

export async function getSingle(slug) {
  let cleanSlug = slug.replace("@factor/", "")

  const requests = [
    {
      _id: "npmData",
      url: `https://registry.npmjs.org/${slug}`
    },
    {
      _id: "npmDownloads",
      url: `https://api.npmjs.org/downloads/point/last-month/${slug}`
    }
  ]

  let githubToken = process.env.GITHUB_TOKEN

  if (githubToken) {
    requests.push({
      _id: "githubFiles",
      url: `https://api.github.com/repos/fiction-com/factor/contents/@factor/@plugins/${cleanSlug}`,
      options: {
        headers: {
          Authorization: `Bearer ${githubToken}`, //the token is a variable which holds the token
          "Content-Type": "application/json"
        }
      }
    })
  } else {
    log.warn("No Github API token")
  }

  // Run the requests, but add context for errors
  const results = await Promise.all(
    requests.map(async ({ _id, url, options = {} }) => {
      try {
        return await axios.get(url, options)
      } catch (error) {
        error.message = `${_id} Request: ${error.message}`
        throw new Error(error)
      }
    })
  )

  // Ensure array of objects and deep merge results
  const merged = deepMerge(
    results.map((result, index) => {
      const _id = requests[index]._id
      return Array.isArray(result.data) ? { [_id]: result.data } : result.data
    })
  )

  return merged
}
