import type { Col } from './plugin-db/index.js'

export const standardTable = {
  org: 'fiction_org',
  member: 'fiction_org_user',
  user: 'fiction_user',
  media: 'fiction_media',
  usage: 'fiction_usage',
  taxonomy: 'fiction_taxonomy',
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
  site: 'fiction_site',
}

type Timestamps = {
  updatedAt?: string
  createdAt?: string
}

/**
 * NEW
 */
type ColTuple<T extends readonly Col<string, any>[]> = {
  [P in keyof T]: T[P] extends Col<infer X, infer Q> ? [X, Q] : never
}[number]

type ColTupleToObject<T extends [string, unknown]> = {
  [P in T[0]]: T extends [P, infer B] ? B : never
}

export type ColType<T extends readonly Col<string, any>[]> = ColTupleToObject<ColTuple<T>> & Timestamps
