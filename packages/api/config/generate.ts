import path from "path"
import fs from "fs-extra"
import { compile, JSONSchema } from "json-schema-to-typescript"
import { log } from "../logger"
import { stringify } from "../utils"
import { runHooks } from "../utils/hook"
import { UserConfig } from "./types"
import type { HookDictionary } from "./hookDictionary"
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
    endpoints: config.endpoints?.map((ep) => ({
      key: ep.key,
      path: ep.pathname(),
    })),
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

  const schema = await runHooks<HookDictionary, "staticConfig">({
    list: config.hooks ?? [],
    hook: "staticConfig",
    args: [{ staticConfig, staticSchema }, config],
  })

  const fullStaticSchema = schema?.staticSchema

  fullStaticSchema.required = Object.keys(fullStaticSchema.properties ?? {})

  const stringed = stringify(schema.staticConfig)

  const json = path.join(genConfigPath, "config.json")
  const ts = await compile(fullStaticSchema, title, { format: true })

  await fs.emptyDir(genConfigPath)
  await fs.ensureFile(json)

  const types = path.join(genConfigPath, "config.ts")
  await Promise.all([fs.writeFile(json, stringed), fs.writeFile(types, ts)])

  log.debug(context, "done", { data: { json, types } })
}
