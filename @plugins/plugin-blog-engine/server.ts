import { FactorPluginConfigServer } from "@factor/types"
import { createSettings, getPostRoutes } from "./helpers"
import { BlogOptions } from "./types"

export default (
  options: Partial<BlogOptions> = {},
): FactorPluginConfigServer => {
  createSettings(options)

  return {
    name: "BlogEngineServer",
    sitemaps: [{ topic: "posts", paths: getPostRoutes() }],
  }
}
