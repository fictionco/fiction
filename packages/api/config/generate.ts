import path from "path"
import fs from "fs-extra"
import { compile, JSONSchema } from "json-schema-to-typescript"
import { log } from ".."
import { UserConfig } from "./types"
import { runHooks } from "./hook"

export const generateStaticConfig = async (
  config: UserConfig,
): Promise<void> => {
  if (Object.keys(config).length === 0) return

  const context = "generateStaticConfig"
  log.debug(context, "generating")

  const genConfigPath = path.join(config.root || process.cwd(), "/.factor")
  const title = "CompiledUserConfig"

  const staticConfig = {
    routes: config.routes?.sort(),
    paths: config.paths?.sort(),
    endpoints: config.endpoints,
  }

  const staticSchema: JSONSchema = {
    title,
    type: "object",
    properties: {
      endpoints: {
        enum: config.endpoints
          ?.map((_) => _.key)
          .sort()
          .filter(Boolean) ?? [""],
        type: "string",
      },
      routes: {
        enum: config.routes
          ?.map((_) => _.name)
          .filter(Boolean)
          .sort() ?? [""],
        type: "string",
      },
      paths: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  }

  const schema = await runHooks(
    "staticConfig",
    { staticConfig, staticSchema },
    config,
  )

  const fullStaticSchema = schema.staticSchema

  fullStaticSchema.required = Object.keys(fullStaticSchema.properties ?? {})

  const stringed = JSON.stringify(schema.staticConfig, null, 2)

  const json = path.join(genConfigPath, "config.json")
  const ts = await compile(fullStaticSchema, title, { format: true })

  await fs.emptyDir(genConfigPath)
  await fs.ensureFile(json)

  const types = path.join(genConfigPath, "config.ts")
  await Promise.all([fs.writeFile(json, stringed), fs.writeFile(types, ts)])

  log.debug(context, "done", { data: { json, types } })
}
