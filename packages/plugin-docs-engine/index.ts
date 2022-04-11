import { UserConfig, safeDirname } from "@factor/api"
import { createSettings, getDocRoutes } from "./helpers"
import { DocsOptions } from "./types"
export const postType = "docsItem"
export * from "./helpers"
export * from "./types"

export const setup = (options: Partial<DocsOptions> = {}): UserConfig => {
  createSettings(options)
  return {
    name: "DocsEngine",
    sitemaps: [{ topic: "docs", paths: getDocRoutes() }],
    paths: [safeDirname(import.meta.url)],
  }
}
