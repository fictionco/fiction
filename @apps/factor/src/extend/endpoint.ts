import { deepMerge } from "@factor/api/utils"
import axios from "axios"

//import { addEndpoint } from "@factor/api/endpoints"
import { addMiddleware } from "@factor/server/middleware"
import { Request, Response } from "express"
import latestVersion from "latest-version"
import { addPostSchema } from "@factor/post/util"
import { PostStatus } from "@factor/post/types"
import { getModel } from "@factor/post/database"
import log from "@factor/api/logger"
import { extensions } from "../extension-record"
import { FactorExtensionInfo } from "./types"
import extensionSchema from "./schema"
import { postType, screenshotsList, extensionImage } from "./util"

export const saveSingleExtension = async (params: {
  packageName: string
  featured?: true
}): Promise<FactorExtensionInfo | undefined> => {
  const { packageName, featured } = params

  const latest = await latestVersion(packageName)
  const requests = [
    {
      _id: "npmData",
      url: `https://registry.npmjs.org/${packageName}`,
    },
    {
      _id: "npmDownloads",
      url: `https://api.npmjs.org/downloads/point/last-month/${packageName}`,
    },
    {
      _id: "npmFiles",
      url: `https://data.jsdelivr.com/v1/package/npm/${packageName}@${latest}`,
    },
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

  const parsed = results.map((result) => result.data)

  // Ensure array of objects and deep merge results
  const merged: any = deepMerge([...parsed])

  const packageJson = merged.versions[latest]

  const item = { ...merged, factor: packageJson.factor ?? {}, pkg: packageJson }

  // Delete all the data from versions we don't care about
  delete item.versions

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
    time: { modified },
  } = item

  const cdnUrl = `https://cdn.jsdelivr.net/npm/${packageName}@${latest}`

  const screenshots = screenshotsList(files, cdnUrl)
  const icon = extensionImage(files, cdnUrl, "icon.svg")
  const extensionType = factor.extend ?? "plugin"
  const tag = keywords.filter((_: string) => !_.includes("factor"))
  const themeColor = factor.themeColor ?? "#FFFFFF"
  const permalink = factor.permalink ?? packageName

  const Model = getModel<FactorExtensionInfo>(postType)

  /**
   * Cant be packageName because of potential dupes
   */
  let post = await Model.findOne({ permalink })

  if (!post) {
    post = new Model({ permalink })
  }

  const category = Array.isArray(factor.category) ? factor.category : [factor.category]

  Object.assign(post, {
    status: PostStatus.Published,
    featured,
    permalink,
    themeColor,
    title: factor.title ?? packageName,
    demo: factor.demo,
    category,
    synopsis: description,
    content: readme,
    tag,
    version: latest,
    maintainers,
    downloads,
    packageName,
    extensionType,
    cdnUrl,
    updatedAt: modified,
    license,
    homepage,
    repositoryUrl: repository?.url,
    extensionAuthor: author?.name,
    screenshots,
    icon,
  })

  let saved
  try {
    saved = await post.save()
    log.info(`Saved post for ${post.packageName}`)
    return saved
  } catch (error) {
    log.error(error)
  }
  return
}

export const saveIndex = async (): Promise<FactorExtensionInfo[]> => {
  /**
   * Reset all extensions to draft, in case some have been removed
   * Set them to published again on save
   */
  const Model = getModel<FactorExtensionInfo>(postType)

  await Model.updateMany({ postType }, { status: PostStatus.Draft })

  const posts = await Promise.all(
    extensions.map(async (extension) => saveSingleExtension(extension))
  )

  return posts.filter((_) => _) as FactorExtensionInfo[]
}

export const setup = (): void => {
  // addEndpoint({ id: endpointId, handler: { getIndex, saveSingleExtension } })
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
      },
    ],
  })
}

setup()
