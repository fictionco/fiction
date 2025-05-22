import type { Col } from './plugin-db/objects.js'
import { z } from 'zod/v4'

export const standardTable = {
  org: 'fiction_org',
  member: 'fiction_org_user',
  user: 'fiction_user',
  media: 'fiction_media',
  usage: 'fiction_usage',
  revisions: 'fiction_revisions',
  // model: 'fiction_model',
  // render: 'fiction_render',
  // image: 'fiction_image',
  // collection: 'fiction_collection',
  // collectionMedia: 'fiction_collection_media',
  comments: 'fiction_comments',
  likes: 'fiction_likes',
  followers: 'fiction_followers',
  jobs: 'fiction_jobs',
  deleted: 'fiction_deleted',
  agent: 'fiction_agent',
  source: 'fiction_source',
  thread: 'fiction_thread',
  message: 'fiction_message',
  // sites: 'fiction_site',
}

type Timestamps = {
  updatedAt?: string
  createdAt?: string
}

type ColTuple<T extends readonly Col<string, any>[]> = {
  [P in keyof T]: T[P] extends Col<infer X, infer Q> ? [X, Q] : never
}[number]

type ColTupleToObject<T extends [string, unknown]> = {
  [P in T[0]]: T extends [P, infer B] ? B : never
}

export type ColType<T extends readonly Col<string, any>[]> = ColTupleToObject<ColTuple<T>> & Timestamps

/**
 * creates a typed schema from a list of columns
 * Fixed: Return the inferred type directly instead of wrapping with ZodObject
 */
export function createTableSchema<T extends readonly Col<any, any>[]>(cols: T) {
  const entries = cols.map(col => [col.key, col.sch({ z })])
  const shape = Object.fromEntries(entries)

  // Add createdAt and updatedAt to the shape
  const schema = z.object({ ...shape, createdAt: z.string().optional(), updatedAt: z.string().optional() }).partial()

  // Return the schema but with proper type inference
  return schema as z.ZodType<ColType<T>>
}
