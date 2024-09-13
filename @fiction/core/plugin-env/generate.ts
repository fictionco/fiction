import type { JSONSchema } from 'json-schema-to-typescript'
import type { FictionEnv } from './index.js'
import path from 'node:path'
import fs from 'fs-extra'
import { log } from '../plugin-log/index.js'
import { stringify } from '../utils/utils.js'

export async function generateStaticConfig(fictionEnv: FictionEnv): Promise<void> {
  const context = 'generateStaticConfig'

  const cwd = fictionEnv.cwd

  if (!cwd)
    throw new Error(`${context}: cwd not found`)

  const genConfigPath = path.join(cwd, '/.fiction')
  await fs.emptyDir(genConfigPath)

  /**
   * Handle Schema
   */
  const title = 'CompiledServiceConfig'

  const _staticSchemaProps = await fictionEnv.runHooks('staticSchema', {})

  const staticSchemaProps = _staticSchemaProps || {}

  // remove empty arrays from static schema to prevent errors.
  Object.entries(staticSchemaProps || {}).forEach(([key, value]) => {
    if (typeof value.enum && (!value.enum || value.enum.length === 0))
      staticSchemaProps[key].enum = ['']
  })

  const staticSchema: JSONSchema = {
    title,
    type: 'object',
    properties: staticSchemaProps,
  }

  staticSchema.required = Object.keys(staticSchema.properties ?? {})

  const { compile } = await import('json-schema-to-typescript')

  const ts = await compile(staticSchema, title, {
    format: true,
    bannerComment: `/* tslint:disable */\n/**\n* Automatically generated file, do not modify by hand.\n*/`,
    style: { singleQuote: true, semi: false },
  })

  const types = path.join(genConfigPath, 'config.ts')

  const staticConfig = await fictionEnv.runHooks('staticConfig', {})

  const stringed = stringify(staticConfig)

  const json = path.join(genConfigPath, 'config.json')

  await fs.ensureFile(json)

  /**
   * Write files
   */
  await Promise.all([fs.writeFile(json, stringed), fs.writeFile(types, ts)])

  log.debug(context, 'generated static schema', { data: { json, types } })
}
