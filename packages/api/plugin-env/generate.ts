import path from "path"
import fs from "fs-extra"
import { compile, JSONSchema } from "json-schema-to-typescript"
import { log } from "../logger"
import { stringify } from "../utils"
import { runHooks } from "../utils/hook"

import { HookDictionary } from "./types"
import type { FactorEnv } from "."

export const generateStaticConfig = async (
  factorEnv: FactorEnv<string>,
): Promise<void> => {
  const context = "generateStaticConfig"
  log.debug(context, "generating")

  const cwd = factorEnv.standardPaths?.cwd

  if (!cwd) throw new Error(`${context}: cwd not found`)

  const genConfigPath = path.join(cwd, "/.factor")
  const title = "CompiledUserConfig"

  const staticConfig = await runHooks<HookDictionary, "staticConfig">({
    list: factorEnv.hooks ?? [],
    hook: "staticConfig",
    args: [{}],
  })

  const _staticSchemaProps = await runHooks<HookDictionary, "staticSchema">({
    list: factorEnv.hooks ?? [],
    hook: "staticSchema",
    args: [{}],
  })
  const staticSchemaProps = _staticSchemaProps || {}

  // remove empty arrays from static schema to prevent errors.
  Object.entries(staticSchemaProps || {}).map(([key, value]) => {
    if (typeof value["enum"] && (!value.enum || value.enum.length === 0)) {
      staticSchemaProps[key].enum = [""]
    }
  })

  const staticSchema: JSONSchema = {
    title,
    type: "object",
    properties: staticSchemaProps,
  }

  staticSchema.required = Object.keys(staticSchema.properties ?? {})

  const stringed = stringify(staticConfig)

  const json = path.join(genConfigPath, "config.json")
  const ts = await compile(staticSchema, title, { format: true })

  await fs.emptyDir(genConfigPath)
  await fs.ensureFile(json)

  const types = path.join(genConfigPath, "config.ts")
  await Promise.all([fs.writeFile(json, stringed), fs.writeFile(types, ts)])

  log.debug(context, "done", { data: { json, types } })
}
