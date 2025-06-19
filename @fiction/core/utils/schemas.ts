import type { z } from 'zod/v4'

/**
 * Get object paths with support for deeper nesting levels
 * Handles array indices and nested objects within arrays
 */
export type SchemaPathsWithDepth<T, Depth extends number = 5>
  = T extends string | number | boolean | null | undefined | Date
    ? never
    : Depth extends 0
      ? never
      : T extends Array<infer U>
        ? `${number}` | `${number}.${SchemaPathsWithDepth<U, DecrementDepth<Depth>>}`
        : T extends object
        ? keyof T & string | {
            [K in keyof T & string]: `${K}` | `${K}.${SchemaPathsWithDepth<T[K], DecrementDepth<Depth>>}`
          }[keyof T & string]
          : never

// Helper to decrement depth with better support for deeper nesting
type DecrementDepth<D extends number>
  = D extends 0 ? 0
    : D extends 1 ? 0
      : D extends 2 ? 1
        : D extends 3 ? 2
          : D extends 4 ? 3
            : D extends 5 ? 4 : 0

/**
 * Type for schema paths that supports deeper nesting and array paths
 * while still preventing circular references
 */
export type SchemaFields<T extends z.ZodType<any>>
  = SchemaPathsWithDepth<z.infer<T>> | '*'

/**
 * Type helper to validate paths against a schema
 */
export function pathCheck<T extends z.ZodType<any>>(
  path: SchemaFields<T>,
  _schema?: T,
): SchemaFields<T> {
  return path
}
