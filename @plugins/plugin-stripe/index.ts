import { createSettings } from "./util"

import { StripeOptions } from "./types"
import { FactorPluginConfig } from "@factor/types"
export * from "./request"
export * from "./util"
export * from "./types"

export default (options: Partial<StripeOptions>): FactorPluginConfig => {
  createSettings(options)
  return { name: "StripeApp" }
}
