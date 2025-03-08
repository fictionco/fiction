import type { InputOption } from '@fiction/ui/index.js'
import type { z } from 'zod'
import type { JsonSchema7ObjectType, JsonSchema7Type } from 'zod-to-json-schema'

type RefineOptionsResult = {
  options: InputOption[]
  unusedSchema?: Record<string, string>
  hiddenOptions: string[]
  dotRecord?: Record<string, string>
}
export async function refineOptions<T extends z.AnyZodObject>(args: {
  options: InputOption[]
  schema?: T
  templateId?: string
}): Promise<RefineOptionsResult> {
  const { options, schema } = args

  // Return early if no schema is available
  if (!schema)
    return { options, unusedSchema: undefined, hiddenOptions: [] }

  const dotRecord = await zodSchemaToDotPathRecord(schema)

  const hiddenOptions: string[] = []

  // Simplified checkRecord to handle both normal paths and wildcard paths
  const checkRecord = (path: string) => {
    if (dotRecord[path]) {
      const prompt = dotRecord[path]
      delete dotRecord[path]
      return prompt
    }

    // Handle wildcard paths
    const wildcardBase = path.replace('.*', '')
    const matches = Object.keys(dotRecord).filter(key => key.startsWith(wildcardBase))

    if (matches.length > 0) {
      matches.forEach(key => delete dotRecord[key])
      return matches.filter(Boolean).join(', ') || true
    }

    hiddenOptions.push(path)
    return false
  }

  const removeDotKeyParents = (key: string, basePath: string) => {
    const parts = key.split('.')

    const subPath = parts.slice(0, parts.length - 1).join('.')

    const path = basePath ? `${basePath}.${subPath}` : subPath

    if (dotRecord[path])
      delete dotRecord[path]

    if (subPath.includes('.'))
      removeDotKeyParents(subPath, basePath)
  }

  const refineOptionRecursive = (option: InputOption, basePath = '', parent?: InputOption) => {
    const isGroup = option.input.value === 'group'
    const key = option.key.value
    // Check for a refinement based on the option's key
    const path = basePath ? `${basePath}.${key}` : key

    if (!isGroup) {
      const optionIsUtility = option.settings.isUtility || parent?.settings.isUtility

      const result = checkRecord(path)

      if (!isGroup && !optionIsUtility && !result)
        option.isHidden.value = true

      // option.generation.value = { ...option.generation.value }

      // remove empty objects that dont need inputs
      removeDotKeyParents(key, basePath)
    }

    // If the option is a group, refine its children
    if (option.options?.value.length > 0) {
      option.options.value.map(_ => refineOptionRecursive(_, !isGroup ? `${path}.0` : basePath, option))
      return option
    }
    else if (option.shape.value.length > 0) {
      const newShape: string[] = []

      option.shape.value.forEach((k) => {
        const shapePath = `${path}.${k}`

        if (checkRecord(shapePath))
          newShape.push(k)
      })
      option.shape.value = newShape
    }

    return option
  }

  return {
    options: options.map(_ => refineOptionRecursive(_)),
    unusedSchema: dotRecord,
    dotRecord: await zodSchemaToDotPathRecord(schema),
    hiddenOptions,
  }
}

export function collectKeysFromOptions(inputOptions: InputOption[] | readonly InputOption[]): string[] {
  const collectKeys = (options: InputOption[] | readonly InputOption[], basePath = ''): string[] =>
    options.flatMap((option) => {
      const path = basePath ? `${basePath}.${option.key.value}` : option.key.value
      // Recursively collect keys if there are nested options

      if (option.options?.value.length > 0) {
        return option.input.value !== 'group'
          ? [path, ...collectKeys(option.options.value, `${path}.0`)]
          : collectKeys(option.options.value)
      }
      else if (option.shape.value.length > 0) {
        return [path, ...option.shape.value.map(k => `${path}.${k}`)]
      }

      return [path]
    })

  return collectKeys(inputOptions)
}

export type SimpleSchema = {
  [key: string]: string | SimpleSchema | SimpleSchema[]
}

function simplifySchema(schema: JsonSchema7ObjectType): SimpleSchema {
  const val = (value: any) => [value.type, value.description].filter(Boolean).join(', ')
  // Recursively process each property to build a simplified structure
  function processProperties(properties: JsonSchema7Type) {
    return Object.entries(properties).reduce((acc, [key, value]) => {
      if (value.properties) {
        // Handle nested object properties
        acc[`$${key}`] = val(value)
        acc[key] = processProperties(value.properties)
      }
      else if (value.items && value.items.properties) {
        // Handle nested properties in array items
        acc[`$${key}`] = val(value)
        acc[key] = [processProperties(value.items.properties)]
      }
      else {
        // Store the description if available; otherwise, use the type
        acc[key] = val(value)
      }
      return acc
    }, {} as SimpleSchema)
  }

  // Start processing from the top-level properties if they exist
  return schema.properties ? processProperties(schema.properties) : {}
}

function flattenSchema(schema: SimpleSchema | SimpleSchema[], prefix: string = ''): Record<string, string> {
  const result: Record<string, string> = {}

  Object.entries(schema).forEach(([key, value]) => {
    const fullPath = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenSchema(value, fullPath))
    }
    else {
      const finalPath = fullPath.replace(/^\$|(?<=\.)\$/g, '')

      // // Skip hidden keys / internal
      // if (fullPath.startsWith('_')) {
      //   console.log('STARTS WITH _', fullPath, finalPath || 'none', 'x')
      // }

      result[finalPath] = value || 'unknown'
    }
  })

  return result
}

type DotPathOptions = {
  removePlainObjects?: boolean
}

export function createDotPathRecord(schema: JsonSchema7ObjectType, options: DotPathOptions = {}): Record<string, string> {
  const { removePlainObjects = false } = options

  const simpleSchema = simplifySchema(schema)

  const flatSchema = flattenSchema(simpleSchema)

  if (removePlainObjects) {
    Object.entries(flatSchema).forEach(([key, value]) => {
      if (value === 'object')
        delete flatSchema[key]
    })
  }

  return flatSchema
}

export async function zodToSimpleSchema<T extends z.AnyZodObject>(schema: T): Promise<SimpleSchema> {
  const { default: zodToJsonSchema } = await import('zod-to-json-schema')
  return simplifySchema(zodToJsonSchema(schema, { $refStrategy: 'none' }) as JsonSchema7ObjectType)
}

export async function zodSchemaToDotPathRecord<T extends z.AnyZodObject>(schema: T, options: DotPathOptions = {}): Promise<Record<string, string>> {
  const { default: zodToJsonSchema } = await import('zod-to-json-schema')
  return createDotPathRecord(zodToJsonSchema(schema, { $refStrategy: 'none' }) as JsonSchema7ObjectType, options)
}
