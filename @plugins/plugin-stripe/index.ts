import { createSettings } from "./util"

import { StripeOptions } from "./types"
import { FactorPluginConfigApp } from "@factor/types"
export * from "./request"
export * from "./util"
export * from "./types"

export default (options: Partial<StripeOptions>): FactorPluginConfigApp => {
  createSettings(options)
  return { name: "StripeApp" }
}
