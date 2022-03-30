import { FullUser } from "@factor/types"
import { JSONSchema } from "json-schema-to-typescript"

export interface HookDictionary {
  onUserVerified: { args: [FullUser] }
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
  staticConfig: {
    args: [{ staticConfig: Record<string, any>; staticSchema: JSONSchema }]
  }
}
