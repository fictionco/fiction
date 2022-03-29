import path from "path"
import fs from "fs-extra"
import { compile, JSONSchema } from "json-schema-to-typescript"

import { UserConfig } from "@factor/types"

export const generateStaticConfig = async (
  config: UserConfig,
): Promise<void> => {
  const title = "CompiledUserConfig"
  const userConfigSchema: JSONSchema = {
    title,
    type: "object",
    properties: {
      routes: {
        enum: config.routes?.map((_) => _.name) ?? [],
        type: "string",
      },
      paths: {
        enum: config.paths ?? [],
        type: "string",
      },
    },
    required: ["routes", "paths"],
  }

  const stringed = JSON.stringify(userConfigSchema, null, 2)

  const genConfigPath = path.join(process.cwd(), "/.factor")
  const configJson = path.join(genConfigPath, "config.json")

  fs.emptyDirSync(genConfigPath)
  fs.ensureFileSync(configJson)
  fs.writeFileSync(configJson, stringed)

  const ts = await compile(userConfigSchema, title)
  fs.writeFileSync(path.join(genConfigPath, "config.ts"), ts)
}
