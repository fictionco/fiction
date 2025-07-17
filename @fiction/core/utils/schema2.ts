import type { ZodType } from 'zod/v4'
import { z, ZodArray, ZodObject } from 'zod/v4'

// Generic interface for schema items that preserves the ID type
interface SchemaItem<TId extends string = string> {
  id: TId
  schema: ZodObject<any>
}

// Type helper to extract the shape from schema items
type ExtractCombinedShape<T extends readonly SchemaItem[]> = {
  [K in T[number] as K['id']]: K['schema']
}

// Type helper for the combined schema
type CombinedSchemaType<T extends readonly SchemaItem[]> = ZodObject<ExtractCombinedShape<T>>

// Utility class for schema operations with full type safety
export class SchemaUtility {
  // Type-safe version that preserves input schema types
  processSchemas<T extends readonly SchemaItem[]>(
    schemas: T,
  ): {
    combinedSchema: CombinedSchemaType<T>
    aiDotPaths: Record<string, ZodType>
  } {
    const combinedShape: Record<string, ZodType> = {}
    const aiDotPaths: Record<string, ZodType> = {}

    for (const card of schemas) {
      combinedShape[card.id] = this.filterSchemaForAI(
        card.schema,
        card.id,
        aiDotPaths,
        false, // Initial inheritedAI is false
      )
    }

    return {
      combinedSchema: z.object(combinedShape) as CombinedSchemaType<T>,
      aiDotPaths,
    }
  }

  private filterSchemaForAI(
    schema: ZodType,
    path: string,
    aiDotPaths: Record<string, ZodType>,
    inheritedAI: boolean,
  ): ZodType {
    // Check AI metadata
    const meta = schema.meta()
    const isAIField = meta?.ai === true
    const isExplicitlyNotAI = meta?.ai === false

    // Determine if this schema should be considered AI-enabled
    const shouldIncludeInAI
      = (isAIField || (inheritedAI && !isExplicitlyNotAI))
        && !(schema instanceof ZodObject) // Exclude objects, include their fields

    // Add this schema to aiDotPaths if it meets the criteria
    if (shouldIncludeInAI) {
      aiDotPaths[path] = schema
    }

    // For containers (objects and arrays), include their path if explicitly marked ai: true
    if (isAIField && (schema instanceof ZodObject || schema instanceof ZodArray)) {
      aiDotPaths[path] = schema
    }

    // Determine the inheritedAI state for children
    const childInheritedAI = isAIField || inheritedAI

    // Handle object types
    if (schema instanceof ZodObject) {
      const newShape: Record<string, ZodType> = {}

      for (const [key, value] of Object.entries(schema.shape)) {
        const currentPath = `${path}.${key}`
        newShape[key] = this.filterSchemaForAI(value as ZodType, currentPath, aiDotPaths, childInheritedAI)
      }

      return z.object(newShape)
    }

    // Handle array types
    if (schema instanceof ZodArray) {
      const innerType = schema.element
      const arrayPath = `${path}.0` // Use .0. for array elements
      return z.array(this.filterSchemaForAI(innerType as ZodType, arrayPath, aiDotPaths, childInheritedAI))
    }

    // Default: return unchanged schema
    return schema
  }
}

// Alternative helper function for even more type safety
export function processSchemas<T extends readonly SchemaItem[]>(
  schemas: T,
): {
  combinedSchema: CombinedSchemaType<T>
  aiDotPaths: Record<string, ZodType>
} {
  const utility = new SchemaUtility()
  return utility.processSchemas(schemas)
}
