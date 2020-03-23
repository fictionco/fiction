import { deepMerge } from "@factor/api/utils"
import axios from "axios"

//import { addEndpoint } from "@factor/api/endpoints"
import { addMiddleware } from "@factor/server/middleware"
import { Request, Response } from "express"
import latestVersion from "latest-version"
import { addPostSchema } from "@factor/post/util"

import { getModel } from "@factor/post/database"
import log from "@factor/api/logger"
import { extensions } from "../extension-record"
import { FactorExtensionInfo } from "./types"
import extensionSchema from "./schema"
import { postType, screenshotsList, extensionImage } from "./util"
export const getSingle = async (params: {
  name: string;
  featured?: true;
}): Promise<FactorExtensionInfo> => {
  const { name, featured } = params

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

  // Ensure array of objects and deep merge results
  const merged: any = deepMerge([...parsed])

  const packageJson = merged.versions[latest]

  const item = { ...merged, factor: packageJson.factor ?? {}, pkg: packageJson }

  // Delete all the data from versions we don't care about
  delete item.versions

  const Model = getModel<FactorExtensionInfo>(postType)

  let post = await Model.findOne({ permalink: name })

  if (!post) {
    post = new Model({ permalink: name })
  }

  const {
    description,
    keywords,
    readme,
    maintainers,
    downloads,
    factor,
    license,
    homepage,
    repository,
    author,
    files,
    time: { modified }
  } = item

  const cdnUrl = `https://cdn.jsdelivr.net/npm/${name}@${latest}`

  const screenshots = screenshotsList(files, cdnUrl)
  const icon = extensionImage(files, cdnUrl, "icon.svg")
  const extensionType = factor.extend ?? "plugin"

  Object.assign(post, {
    featured,
    title: factor.title ?? packageJson.name,
    synopsis: factor.synopsis ?? description,
    content: readme,
    tags: keywords,
    version: latest,
    maintainers,
    downloads,
    packageName: packageJson.name,
    extensionType,
    cdnUrl: `https://cdn.jsdelivr.net/npm/${name}@${latest}`,
    updatedAt: modified,
    license,
    homepage,
    repository: repository?.url,
    extensionAuthor: author?.name,
    screenshots,
    icon
  })

  const saved = await post.save()

  log.info(`Saved post for ${post.packageName}`)

  return saved
}

export const saveIndex = async (): Promise<FactorExtensionInfo[]> => {
  const list = extensions

  return await Promise.all(list.map(async extension => getSingle(extension)))
}

export const setup = (): void => {
  // addEndpoint({ id: endpointId, handler: { getIndex, getSingle } })
  addPostSchema(() => extensionSchema)

  addMiddleware({
    key: "saveIndex",
    path: "/_extensions",
    middleware: [
      async (request: Request, response: Response): Promise<void> => {
        const { query, body } = request

        const data = { ...body, ...query }

        if (data.key == process.env.CRON_KEY) {
          await saveIndex()
          response.send("cool").end()
        } else {
          response.send("not cool").end()
        }

        return
      }
    ]
  })
}

setup()
