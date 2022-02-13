import { FactorPluginConfigServer } from "@factor/types"
import { createSettings, getDocRoutes } from "./helpers"
import { DocsOptions } from "./types"

export default (
  options: Partial<DocsOptions> = {},
): FactorPluginConfigServer => {
  createSettings(options)

  return {
    name: "DocsEngineServer",
    sitemaps: [{ topic: "docs", paths: getDocRoutes() }],
  }
}
