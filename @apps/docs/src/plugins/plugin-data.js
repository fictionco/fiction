import { plugins } from "../extensions"
import { deepMerge } from "@factor/tools/utils"
import axios from "axios"
import { addCallback, storeItem, log } from "@factor/tools"

addCallback("endpoints", { id: "pluginData", handler: { getIndex, getSingle } })

export async function getIndex() {
  const slugs = plugins

  const index = await Promise.all(slugs.map(async slug => getSingle(slug)))

  storeItem("plugins-index", index)

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

  const results = await Promise.all(
    requests.map(async ({ url, options = {} }) => {
      return await axios.get(url, options)
    })
  )

  const merged = deepMerge(
    results.map((result, index) => {
      const _id = requests[index]._id
      return Array.isArray(result.data) ? { [_id]: result.data } : result.data
    })
  )

  return merged
}
