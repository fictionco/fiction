import { FactorPluginConfigApp } from "@factor/types"
import { createSettings } from "./helpers"
import { BlogOptions } from "./types"

export * from "./helpers"
export * from "./types"

/**
 * Install as a Factor plugin
 */
export default (options: Partial<BlogOptions> = {}): FactorPluginConfigApp => {
  createSettings(options)

  return {
    name: "BlogEngineApp",
    setup: (): void => {},
  }
}
