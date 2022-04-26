import type { JSONSchema } from "json-schema-to-typescript"
import type { RunConfig } from "../cli/utils"
import type { UserConfig } from "./types"

export type HookDictionary = {
  staticConfig: {
    args: [
      { staticConfig: Record<string, any>; staticSchema: JSONSchema },
      UserConfig,
    ]
  }
  afterConfigCreated: { args: [UserConfig] }
  runCommand: { args: [RunConfig] }
}
