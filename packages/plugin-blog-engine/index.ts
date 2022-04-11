import { UserConfig, safeDirname } from "@factor/api"
import { createSettings, getPostRoutes } from "./helpers"
import { BlogOptions } from "./types"

export * from "./helpers"
export * from "./types"

export const setup = (options: Partial<BlogOptions> = {}): UserConfig => {
  createSettings(options)

  return {
    name: "blogEngine",
    sitemaps: [{ topic: "posts", paths: getPostRoutes() }],
    server: () => {
      return { variables: { TEST_BLOG_PLUGIN: "TEST_BLOG_PLUGIN" } }
    },
    paths: [safeDirname(import.meta.url)],
  }
}
