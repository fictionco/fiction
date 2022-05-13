import { FactorPlugin, FactorApp, vue } from "@factor/api"
import stringSimilarity from "string-similarity"

import * as types from "./types"
export * from "./types"

export type BlogOptions = {
  baseRoute: string
  posts: types.BlogPost<string>[]
  factorApp?: FactorApp
}

export class FactorBlogEngine extends FactorPlugin<BlogOptions> {
  factorApp?: FactorApp
  constructor(settings: BlogOptions) {
    super(settings)

    this.factorApp = settings.factorApp

    if (this.factorApp) {
      this.factorApp.addSitemaps([
        { topic: "posts", paths: this.getPostRoutes() },
      ])
    }
  }
  setup = () => {
    return {
      name: this.constructor.name,
    }
  }

  readingMinutes = (content?: string): number => {
    if (!content) return 0

    const wpm = 225
    const words = content.trim().split(/\s+/).length
    const time = Math.ceil(words / wpm)
    return time
  }

  getPosts = (): types.BlogPost<string>[] => {
    return this.setting("posts") ?? []
  }

  getIndex = (args: types.IndexArgs = {}): types.BlogPost<string>[] => {
    const { total = 10, category } = args

    const posts = this.getPosts()

    let entries = posts.sort((valA, valB) => {
      if (!valB.publishDate || !valA.publishDate) return 0

      const after = this.utils
        .dayjs(valB.publishDate)
        .isAfter(this.utils.dayjs(valA.publishDate))

      return after ? 1 : -1
    })

    if (category) {
      entries = entries.filter((item) => {
        return item.category && item.category.includes(category)
      })
    }

    entries = entries.slice(0, total)

    return entries
  }

  /**
   * Gets all the routes for docs
   */
  scanRoutes = (posts: types.BlogPost<string>[]): string[] => {
    const routes: string[] = []
    const baseRoute = this.setting("baseRoute") ?? "/blog"

    const pathBase = baseRoute == "/" ? "" : baseRoute

    posts.forEach((c) => {
      if (
        !c.status ||
        c.status == "published" ||
        process.env.NODE_ENV == "development"
      ) {
        const permalink = c.permalink || this.utils.camelToKebab(c.key)
        routes.push(`${pathBase}/${permalink}`)
      }
    })

    return routes
  }
  getPostRoutes = (): string[] => {
    return this.scanRoutes(this.getPosts())
  }

  /**
   * Gets the full page configuration for an individual doc
   */
  getPostConfig = async (
    slug?: string,
  ): Promise<types.PostEntryConfig | undefined> => {
    if (!slug) return

    const storeKey = `blog-${slug}`

    if (this.utils.stored(storeKey)) {
      return this.utils.stored(storeKey)
    }

    const baseRoute = this.setting("baseRoute") ?? "/blog"

    const pathBase = baseRoute == "/" ? "" : baseRoute

    const posts = this.setting("posts") ?? []

    const listWithPermalinks = posts.map((value) => {
      return {
        ...value,
        permalink: value.permalink || this.utils.camelToKebab(value.key),
      }
    })

    let fileConfig: types.BlogPost<string> | undefined =
      listWithPermalinks.find((_) => _.permalink == slug)

    /**
     * If 404, then get closest match
     * This helps if permalinks need to change after they've been posted
     */
    if (!fileConfig) {
      const matches = stringSimilarity.findBestMatch(
        slug,
        listWithPermalinks.map((_) => _.permalink),
      )

      fileConfig = listWithPermalinks[matches.bestMatchIndex]
    }

    let config: types.PostEntryConfig | undefined = undefined
    if (fileConfig?.fileImport) {
      const { fileImport, imageImport, permalink, ...rest } = fileConfig
      const fileData = await fileImport()
      const imageModule = imageImport ? await imageImport() : ""
      const postImage = imageModule ? imageModule.default : ""

      const path = `${pathBase}/${permalink}`
      config = {
        readingMinutes: this.readingMinutes(fileData.html),
        content: fileData.html,
        component: vue.markRaw(fileData.VueComponent),
        attributes: { ...rest, ...fileData.attributes, postImage },
        path,
        postImage,
        ...rest,
        ...fileData.attributes,
      }
    }

    this.utils.storeItem(storeKey, config)

    return config
  }

  getIndexContent = async (
    args: types.IndexArgs = {},
  ): Promise<types.PostEntryConfig[]> => {
    const postIndexPromises = this.getIndex(args).map(async (value) => {
      const config = await this.getPostConfig(value.key)

      return { ...value, ...config }
    })

    const r = await Promise.all(postIndexPromises)

    return r.filter(Boolean)
  }

  activePostGroup = async (doc: string): Promise<string> => {
    const config = await this.getPostConfig(doc)
    const parents = config?.parentGroup
    const group = parents ? parents.title ?? "" : ""
    return group
  }
}
