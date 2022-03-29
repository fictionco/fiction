import path from "path"
import fs from "fs-extra"
import { compile, JSONSchema } from "json-schema-to-typescript"

import { UserConfig } from "@factor/types"

export const generateStaticConfig = async (
  config: UserConfig,
): Promise<void> => {
  const genConfigPath = path.join(process.cwd(), "/.factor")
  const title = "CompiledUserConfig"

  const conf = {
    routes: config.routes?.map((_) => _.name) ?? [],
    paths: config.paths ?? [],
  }

  const typeSchema: JSONSchema = {
    title,
    type: "object",
    properties: {
      routes: {
        enum: conf.routes,
        type: "string",
      },
    },
    required: ["routes"],
  }

  const stringed = JSON.stringify(conf, null, 2)

  const configJson = path.join(genConfigPath, "config.json")

  fs.emptyDirSync(genConfigPath)
  fs.ensureFileSync(configJson)
  fs.writeFileSync(configJson, stringed)

  const ts = await compile(typeSchema, title, { format: true })
  fs.writeFileSync(path.join(genConfigPath, "config.ts"), ts)
}
