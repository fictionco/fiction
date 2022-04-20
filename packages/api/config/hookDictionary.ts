import type { JSONSchema } from "json-schema-to-typescript"
import type { UserConfig } from "./types"

export type HookDictionary = {
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
