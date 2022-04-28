import { HookType } from "../utils"
import type { FactorDb } from "."

export type FactorDBTables = "factor_user" | "factor_post" | "factor_version"

export type FactorDbHookDictionary = {
  onStart: { args: [FactorDb] }
}

export type FactorDbSettings = {
  connectionUrl?: string
  hooks?: HookType<FactorDbHookDictionary>[]
}
