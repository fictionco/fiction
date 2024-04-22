import { getNested, setNested } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import type { z } from 'zod'
import type { JsonSchema7ObjectType, JsonSchema7Type } from 'zod-to-json-schema'
import { zodToJsonSchema } from 'zod-to-json-schema'

export type SimpleSchema = {
  [key: string]: string | SimpleSchema
}
function simplifySchema(schema: JsonSchema7ObjectType): SimpleSchema {
  // Recursively process each property to build a simplified structure
  function processProperties(properties: JsonSchema7Type) {
    return Object.entries(properties).reduce((acc, [key, value]) => {
      if (value.properties) {
        // Handle nested object properties
        acc[key] = processProperties(value.properties)
      }
      else if (value.items && value.items.properties) {
        // Handle nested properties in array items
        acc[key] = processProperties(value.items.properties)
      }
      else {
        // Store the description if available; otherwise, use the type
        acc[key] = value.description || value.type
      }
      return acc
    }, {} as SimpleSchema)
  }

  // Start processing from the top-level properties if they exist
  return schema.properties ? processProperties(schema.properties) : {}
}

export function refineOptions<T extends z.AnyZodObject>(args: {
  inputOptions: InputOption[]
  schema?: T
}) {
  const { inputOptions, schema } = args

  if (!schema)
    return { options: inputOptions, unusedSchema: {} }

  let simple = simplifySchema(zodToJsonSchema(schema) as JsonSchema7ObjectType)
  const refineOption = (option: InputOption, basePath = '') => {
    // If the option is a group, refine its children
    if (option.input.value === 'group' && option.options?.value) {
      option.options.value = option.options.value.map(_ => refineOption(_))
      return option
    }

    // Check for a refinement based on the option's key
    const path = basePath ? `${basePath}.${option.key.value}` : option.key.value

    const schemaPart = getNested<JsonSchema7Type>({ data: simple, path })

    if (typeof schemaPart !== 'object')
      simple = setNested<SimpleSchema>({ data: simple, path, value: undefined })

    const prompt = schemaPart?.description
    if (prompt)
      option.generation.value.prompt = prompt

    if (!schemaPart)
      option.isHidden.value = true

    // If the option is a group, refine its children
    if (option.options?.value)
      option.options.value = option.options.value.map(_ => refineOption(_, path))

    return option
  }

  return { options: inputOptions.map(_ => refineOption(_)), unusedSchema: simple }
}

export function collectKeysFromOptions(inputOptions: InputOption[] | readonly InputOption[]): string[] {
  const collectKeys = (options: InputOption[] | readonly InputOption[], basePath = ''): string[] =>
    options.flatMap((option) => {
      const path = basePath ? `${basePath}.${option.key.value}` : option.key.value
      // Recursively collect keys if there are nested options
      const childKeys = option.options?.value ? collectKeys(option.options.value, path) : []
      return [path, ...childKeys]
    })

  return collectKeys(inputOptions)
}
