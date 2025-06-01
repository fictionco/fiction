import { z } from 'zod/v4'

export function functionSchema<T extends z.core.$ZodFunction>(schema: T) {
  return z.custom<Parameters<T['implement']>[0]>(fn => schema.implement(fn as any))
}

export function createAsyncFunctionSchema<T extends z.core.$ZodFunction>(schema: T) {
  return z.custom<Parameters<T['implementAsync']>[0]>(fn => schema.implementAsync(fn as any))
}
