import { HookType } from "../utils"

export type HookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

export type FactorServerSettings = {
  hooks?: HookType<HookDictionary>[]
}
