import { HookType } from "../utils"
import type { FactorDb } from "."

export type FactorDBTables = "factor_user" | "factor_post" | "factor_version"

export type HookDictionary = {
  onStart: { args: [FactorDb] }
}

export type FactorDbSettings = {
  connectionUrl?: string
  isTest?: boolean
  hooks?: HookType<HookDictionary>[]
}
