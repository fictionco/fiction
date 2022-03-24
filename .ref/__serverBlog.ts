import { FactorPluginConfigServer } from "@factor/types"
import {
  createSettings,
  getPostRoutes,
} from "../@plugins/plugin-blog-engine/helperslugin-blog-engine/helpers"
import { BlogOptions } from "../@plugins/plugin-blog-engine/types/plugin-blog-engine/types"

export default (
  options: Partial<BlogOptions> = {},
): FactorPluginConfigServer => {
  createSettings(options)

  return {
    name: "BlogEngineServer",
    sitemaps: [{ topic: "posts", paths: getPostRoutes() }],
  }
}
