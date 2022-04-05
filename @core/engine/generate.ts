import path from "path"
import fs from "fs-extra"
import { compile, JSONSchema } from "json-schema-to-typescript"
import { UserConfig } from "@factor/types"
import { logger } from "@factor/api"
import { runHooks } from "./hook"

export const generateStaticConfig = async (
  config: UserConfig,
): Promise<void> => {
  logger.log({
    level: "debug",
    description: "generating",
    context: "generateStaticConfig",
  })

  const genConfigPath = path.join(config.root || process.cwd(), "/.factor")
  const title = "CompiledUserConfig"

  const staticConfig = {
    routes:
      config.routes
        ?.map((_) => _.name)
        .filter(Boolean)
        .sort() ?? [],
    paths: config.paths?.sort() || [],
    endpoints: config.endpoints
      ?.map((_) => _.key)
      .sort()
      .filter(Boolean) ?? [""],
  }

  const staticSchema: JSONSchema = {
    title,
    type: "object",
    properties: {
      endpoints: {
        enum: staticConfig.endpoints,
        type: "string",
      },
      routes: {
        enum: staticConfig.routes,
        type: "string",
      },
      paths: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: ["routes"],
  }

  const schema = await runHooks(
    "staticConfig",
    { staticConfig, staticSchema },
    config,
  )

  const stringed = JSON.stringify(schema.staticConfig, null, 2)

  const json = path.join(genConfigPath, "config.json")
  const ts = await compile(schema.staticSchema, title, { format: true })

  await fs.emptyDir(genConfigPath)
  await fs.ensureFile(json)

  const types = path.join(genConfigPath, "config.ts")
  await Promise.all([fs.writeFile(json, stringed), fs.writeFile(types, ts)])

  logger.log({
    level: "debug",
    description: "done",
    context: "generateStaticConfig",
    data: { json, types },
  })
}
