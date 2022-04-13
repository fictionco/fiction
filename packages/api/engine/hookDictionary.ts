import { JSONSchema } from "json-schema-to-typescript"
import { FullUser } from "../types"
import type { UserConfig } from "../types"

export interface HookDictionary {
  onUserVerified: { args: [FullUser] }
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
  afterAppSetup: { args: [{ userConfig: UserConfig; isSSR?: boolean }] }
  staticConfig: {
    args: [
      { staticConfig: Record<string, any>; staticSchema: JSONSchema },
      UserConfig,
    ]
  }
}

export type HookDictionaryIndexed = HookDictionary & {
  [key: string]: { args: unknown[] }
}

export type HookType<T extends keyof HookDictionary = keyof HookDictionary> = {
  [K in keyof HookDictionary]: {
    hook: K
    callback: (
      ...args: HookDictionary[K]["args"]
    ) => Promise<HookDictionary[K]["args"][0] | undefined | void>
  }
}[T]
