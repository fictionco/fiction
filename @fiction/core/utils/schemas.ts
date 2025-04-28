import type { z } from 'zod'

/**
 * Get object paths with better handling of potential circular references
 * This preserves type information while preventing infinite recursion
 */
export type SchemaPathsWithDepth<T, Depth extends number = 3> =
  T extends string | number | boolean | null | undefined | Date
    ? never
    : Depth extends 0
      ? never
      : T extends Array<infer U>
        ? `${number}` | `${number}.${SchemaPathsWithDepth<U, DecrementDepth<Depth>>}`
        : T extends object
        ? keyof T & string | {
            [K in keyof T & string]: `${K}.${SchemaPathsWithDepth<T[K], DecrementDepth<Depth>>}`
          }[keyof T & string]
          : never

// Helper type to decrement depth counter
type DecrementDepth<D extends number> = D extends 0 ? 0 : D extends 1 ? 0 : D extends 2 ? 1 : D extends 3 ? 2 : 0

/**
 * Safer version of SchemaFields that avoids circular references
 */
export type SchemaFields<T extends z.ZodObject<any>> = SchemaPathsWithDepth<z.infer<T>> | '*'

/**
 * Type helper to validate paths against a schema
 * Returns the path with proper typing from schema
 */
export function pathCheck<T extends z.ZodType>(
  path: SchemaPathsWithDepth<z.infer<T>>,
  _schema?: T,
): SchemaPathsWithDepth<z.infer<T>> {
  return path
}
