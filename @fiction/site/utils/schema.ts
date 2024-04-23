import type { JsonSchema7ObjectType, JsonSchema7Type } from 'zod-to-json-schema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { z } from 'zod'
import type { InputOption } from '@fiction/ui'

type RefineOptionsResult = {
  options: InputOption[]
  unusedSchema?: Record<string, string>
  hiddenOptions: string[]
}
export function refineOptions<T extends z.AnyZodObject>(args: {
  options: InputOption[]
  schema?: T
}): RefineOptionsResult {
  const { options, schema } = args

  // Return early if no schema is available
  if (!schema)
    return { options, unusedSchema: undefined, hiddenOptions: [] }

  const dotRecord = zodSchemaToDotPathRecord(schema)
  const hiddenOptions: string[] = []

  const checkRecord = (path: string) => {
    if (dotRecord[path]) {
      delete dotRecord[path]
      return true
    }
    else {
      hiddenOptions.push(path)
      return false
    }
  }

  const refineOption = (option: InputOption, basePath = '') => {
    const isGroup = option.input.value === 'group'
    // Check for a refinement based on the option's key
    const path = basePath ? `${basePath}.${option.key.value}` : option.key.value

    if (!isGroup && !checkRecord(path))
      option.isHidden.value = true

    // If the option is a group, refine its children
    if (option.options?.value.length > 0) {
      option.options.value = option.options.value.map(_ => refineOption(_, !isGroup ? `${path}.0` : basePath))
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

  return { options: options.map(_ => refineOption(_)), unusedSchema: dotRecord, hiddenOptions }
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
  const defaultDesc = 'no description'
  const val = (value: any) => `${value.type}: ${value.description || defaultDesc}`
  // Recursively process each property to build a simplified structure
  function processProperties(properties: JsonSchema7Type) {
    return Object.entries(properties).reduce((acc, [key, value]) => {
      if (value.properties) {
        // Handle nested object properties
        acc[`_${key}`] = val(value)
        acc[key] = processProperties(value.properties)
      }
      else if (value.items && value.items.properties) {
        // Handle nested properties in array items
        acc[`_${key}`] = val(value)
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
    if (typeof value === 'object' && value !== null)
      Object.assign(result, flattenSchema(value, fullPath))
    else
      result[fullPath.replace(/^_/, '')] = value
  })

  return result
}

export function createDotPathRecord(schema: JsonSchema7ObjectType): Record<string, string> {
  const simpleSchema = simplifySchema(schema)

  const flatSchema = flattenSchema(simpleSchema)

  return flatSchema
}

export function zodToSimpleSchema<T extends z.AnyZodObject>(schema: T): SimpleSchema {
  return simplifySchema(zodToJsonSchema(schema) as JsonSchema7ObjectType)
}

export function zodSchemaToDotPathRecord<T extends z.AnyZodObject>(schema: T): Record<string, string> {
  return createDotPathRecord(zodToJsonSchema(schema) as JsonSchema7ObjectType)
}
