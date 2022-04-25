import { Endpoint } from "../engine"
import { HookType } from "../utils"

export type HookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

export type FactorServerSettings = {
  port: number
  hooks?: HookType<HookDictionary>[]
  endpoints?: Endpoint[]
  serverUrl?: string
}
