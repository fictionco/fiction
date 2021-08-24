import { createSettings, getPostRoutes } from "./helpers"
import { BlogOptions } from "./types"
import { FactorPluginConfigServer } from "@factor/types"

export default (
  options: Partial<BlogOptions> = {},
): FactorPluginConfigServer => {
  createSettings(options)

  return {
    name: "BlogEngineServer",
    sitemaps: [{ topic: "posts", paths: getPostRoutes() }],
  }
}
