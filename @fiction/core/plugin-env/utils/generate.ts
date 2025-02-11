import type { JSONSchema } from 'json-schema-to-typescript'
import type { FictionEnv } from '../index.js'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import { log } from '../../plugin-log/index.js'
import { stringify } from '../../utils/utils.js'
import { generateProjectStructure } from './projectStructure.js'

export type ConfigFileGenerator = ((args: { fictionEnv: FictionEnv }) => Promise<{ fileName?: string, content?: string }>)

export async function generateStaticConfig(fictionEnv: FictionEnv): Promise<void> {
  const context = 'generateStaticConfig'

  const cwd = fictionEnv.cwd

  if (!cwd)
    throw new Error(`${context}: cwd not found`)

  const genConfigPath = fictionEnv.generatedFolder
  await fs.emptyDir(genConfigPath)

  const buildInfoJsonLines = [
    `  "BUILD_COMMIT": "${process.env.BUILD_COMMIT || ''}"`,
    `  "BUILD_VERSION": "${process.env.BUILD_VERSION || ''}"`,
    `  "BUILD_TIME": "${process.env.BUILD_TIME || ''}"`,
    `  "BUILD_NUMBER": "${process.env.BUILD_NUMBER || ''}"`,
    `  "BUILD_BRANCH": "${process.env.BUILD_BRANCH || ''}"`,
  ]

  const buildInfoPath = path.join(genConfigPath, 'buildInfo.json')

  await fs.writeFile(buildInfoPath, `{\n${buildInfoJsonLines.join(`,\n`)}\n}`)

  fictionEnv.generators.push(() => generateProjectStructure({ fictionEnv }))

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

  const typesPath = path.join(genConfigPath, 'config.ts')

  const staticConfig = await fictionEnv.runHooks('staticConfig', {})

  const stringed = stringify(staticConfig)

  const jsonPath = path.join(genConfigPath, 'config.json')

  await fs.ensureFile(jsonPath)

  const generators = await Promise.all(fictionEnv.generators.map(generator => generator({ fictionEnv })))

  const genPaths = generators.filter(generator => generator.fileName && generator.content).map((generator) => {
    return { filePath: path.join(genConfigPath, generator.fileName || ''), ...generator }
  })

  const generateFilePromises = genPaths.map(({ filePath, content }) => {
    return fs.writeFile(filePath, content || '')
  })

  await Promise.all([
    fs.writeFile(jsonPath, stringed),
    fs.writeFile(typesPath, ts),
    ...generateFilePromises,
  ])

  const filePaths = [jsonPath, typesPath, ...genPaths.map(r => r.filePath)]

  log.debug(context, 'generated static schema', { data: filePaths })
}
