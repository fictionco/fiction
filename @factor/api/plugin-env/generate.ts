import path from "path"
import fs from "fs-extra"
import type { JSONSchema } from "json-schema-to-typescript"
import { log } from "../plugin-log"
import { mode } from "../utils/vars"
import { stringify } from "../utils/utils"
import { runHooks } from "../utils/hook"
import { FactorEnvHookDictionary } from "./types"
import type { FactorEnv } from "."

export const generateStaticConfig = async (
  factorEnv: FactorEnv,
): Promise<void> => {
  const context = "generateStaticConfig"

  const cwd = factorEnv.standardPaths?.cwd

  if (!cwd) throw new Error(`${context}: cwd not found`)

  const genConfigPath = path.join(cwd, "/.factor")
  await fs.emptyDir(genConfigPath)

  /**
   * Handle Schema
   */
  const title = "CompiledServiceConfig"

  const _staticSchemaProps = await runHooks<
    FactorEnvHookDictionary,
    "staticSchema"
  >({
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

  const { compile } = await import("json-schema-to-typescript")

  const ts = await compile(staticSchema, title, {
    format: true,
    bannerComment: `/* tslint:disable */\n/**\n* Automatically generated file, do not modify by hand.\n*/`,
  })

  const types = path.join(genConfigPath, "config.ts")

  /**
   * Handle config
   */
  const staticConfig = await runHooks<FactorEnvHookDictionary, "staticConfig">({
    list: factorEnv.hooks ?? [],
    hook: "staticConfig",
    args: [{}],
  })

  const stringed = stringify(staticConfig)

  const json = path.join(genConfigPath, "config.json")

  await fs.ensureFile(json)

  /**
   * Write files
   */
  await Promise.all([fs.writeFile(json, stringed), fs.writeFile(types, ts)])

  log.debug(context, "generated static schema", { data: { json, types } })
}
