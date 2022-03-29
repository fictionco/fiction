import { UserConfig } from "@factor/types"
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
    paths: [new URL(".", import.meta.url).pathname],
  }
}
