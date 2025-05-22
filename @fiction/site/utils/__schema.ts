import type { Card } from '@fiction/site/card.js'
import type { Site } from '@fiction/site/site.js'
import type { JsonSchema7AllOfType, JsonSchema7ArrayType, JsonSchema7ObjectType, JsonSchema7Type } from 'zod-to-json-schema'
import { z } from 'zod/v4'
import { CardOptionsWithStandardSchema } from '../schema.js'

type JsonSchemaWithDefinitions = JsonSchema7Type & { definitions?: Record<string, JsonSchema7Type>, $ref: string }

export function filterAiOptions(args: { jsonSchema: JsonSchemaWithDefinitions, aiOptionsOnly?: boolean, caller?: string }): JsonSchemaWithDefinitions | undefined {
  const { jsonSchema, aiOptionsOnly = true } = args
  if (!aiOptionsOnly)
    return jsonSchema

  const definitions = jsonSchema.definitions || {}

  function filterSchema(node: JsonSchemaWithDefinitions, isUnderUserConfig: boolean): any {
    if (!node || typeof node !== 'object')
      return node

    // Handle $ref by resolving and filtering the referenced schema
    if (node.$ref) {
      const refKey = node.$ref.split('/').pop()
      const refSchema = refKey ? definitions[refKey] : undefined
      return refSchema ? filterSchema(refSchema as JsonSchemaWithDefinitions, isUnderUserConfig) : node
    }

    // Handle objects
    if ((node as JsonSchema7ObjectType).type === 'object') {
      const typedNode = node as JsonSchema7ObjectType
      const properties = Object.entries(typedNode.properties || {}).reduce((acc, [propName, propSchema]) => {
        const nextUnderUserConfig = propName === 'userConfig' || isUnderUserConfig
        const filtered = filterSchema(propSchema as JsonSchemaWithDefinitions, nextUnderUserConfig)
        if (filtered)
          acc[propName] = filtered
        return acc
      }, {} as Record<string, any>)

      // Apply filtering only under userConfig
      if (isUnderUserConfig) {
        const filteredProps = Object.entries(properties).reduce((acc, [name, schema]) => {
          const hasAi = schema.description?.includes('[@ai]')
          if (schema.type === 'object' || (schema.type === 'array' && hasAi) || (['string', 'number', 'boolean'].includes(schema.type) && hasAi)) {
            acc[name] = schema
          }
          return acc
        }, {} as Record<string, any>)

        return { ...typedNode, properties: filteredProps, required: typedNode.required?.filter((r: string) => r in filteredProps) }
      }
      return { ...typedNode, properties }
    }

    // Handle arrays
    if ((node as JsonSchema7ArrayType).type === 'array') {
      const typedNode = node as JsonSchema7ArrayType
      const _items = (typedNode.items || []) as JsonSchemaWithDefinitions[]

      const items = _items?.map(item => filterSchema(item, isUnderUserConfig)) || []
      return isUnderUserConfig && !node.description?.includes('[@ai') ? null : { ...node, items }
    }

    // Handle allOf composition
    if ((node as JsonSchema7AllOfType).allOf) {
      const typedNode = node as JsonSchema7AllOfType
      return { ...typedNode, allOf: typedNode.allOf.map((sub: any) => filterSchema(sub, isUnderUserConfig)).filter(Boolean) }
    }

    return node
  }

  return filterSchema(jsonSchema, false)
}
/**
 * Converts a card to a Zod schema, optionally filtering to AI-only options
 */
export async function cardToZodSchema(args: {
  card: Card
}): Promise<z.ZodTypeAny> {
  const { card } = args
  let userConfigSchema = z.record(z.unknown())

  const tpl = card.tpl.value

  // Get schema from template if available
  if (tpl) {
    const { schema } = await tpl.getConfig({ site: card.site }) || {}
    if (schema)
      userConfigSchema = schema
  }

  const describeClausFromTemplate = [
    `${tpl?.settings.title} template`,
    `${tpl?.settings.description}`,
    `(${tpl?.settings.tags})`,
  ].join(' - ')

  return z.object({
    cardId: z.literal(card.cardId),
    userConfig: userConfigSchema.and(CardOptionsWithStandardSchema) || z.record(z.unknown()),
  }).describe(describeClausFromTemplate)
}

/**
 * Converts a page to a Zod schema, optionally filtering to AI-only options
 */
export async function pageToZodSchema(args: {
  page: Card
}): Promise<z.ZodTypeAny> {
  const { page } = args

  // Get schema from template if available
  let userConfigSchema = z.record(z.unknown())
  if (page.tpl.value) {
    const { schema } = await page.tpl.value.getConfig({ site: page.site }) || {}
    if (schema)
      userConfigSchema = schema
  }

  // Generate schemas for child cards
  const cardSchemas = await Promise.all(
    page.cards.value.map(card => cardToZodSchema({ card })),
  )

  return z.object({
    cardId: z.literal(page.cardId),
    cards: cardSchemas.length > 0
      ? z.tuple(cardSchemas as [z.ZodTypeAny, ...z.ZodTypeAny[]])
      : z.tuple([]),
    userConfig: userConfigSchema.and(CardOptionsWithStandardSchema),
  })
}

/**
 * Converts a site to a Zod schema, optionally filtering to AI-only options
 */
export async function siteToZodSchema(args: {
  site: Site
}): Promise<z.ZodTypeAny> {
  const { site } = args

  const standardPages = site.pages.value.filter(page => !page.isSystem.value)
  const pageSchemas = await Promise.all(
    standardPages.map(page => pageToZodSchema({ page })),
  )

  return z.object({
    siteId: z.literal(site.siteId),
    pages: pageSchemas.length > 0
      ? z.tuple(pageSchemas as [z.ZodTypeAny, ...z.ZodTypeAny[]])
      : z.tuple([]),
  })
}

/**
 * Converts a site to a JSON schema, optionally filtering to AI-only options
 */
export async function siteToJsonSchema(args: {
  site: Site
  aiOptionsOnly?: boolean
}): Promise<JsonSchema7Type | undefined> {
  const { site, aiOptionsOnly = true } = args
  const { default: zodToJsonSchema } = await import('zod-to-json-schema')

  const schema = await siteToZodSchema({ site })
  const fullJsonSchema = zodToJsonSchema(schema, {
    $refStrategy: 'root',
    name: 'Site',
  }) as JsonSchemaWithDefinitions

  if (aiOptionsOnly) {
    const filteredSchema = filterAiOptions({
      jsonSchema: fullJsonSchema,
      aiOptionsOnly,
      caller: 'siteToJsonSchema',
    })

    return filteredSchema
  }
  else {
    return fullJsonSchema
  }
}
