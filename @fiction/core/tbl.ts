import type { FactorDbCol } from './plugin-db'

export const standardTable = {
  org: 'factor_org',
  member: 'factor_org_user',
  user: 'factor_user',
  media: 'factor_media',
  usage: 'factor_usage',
  model: 'fiction_model',
  render: 'fiction_render',
  image: 'fiction_image',
  collection: 'fiction_collection',
  collectionMedia: 'fiction_collection_media',
  comments: 'fiction_comments',
  likes: 'fiction_likes',
  followers: 'fiction_followers',
  jobs: 'fiction_jobs',
  deleted: 'fiction_deleted',
  agent: 'pagelines_agent',
  source: 'pagelines_source',
  thread: 'pagelines_thread',
  message: 'pagelines_message',
}

type Timestamps = {
  updatedAt?: string
  createdAt?: string
}

type CreateTuple<T extends readonly FactorDbCol[]> = {
  [P in keyof T]: T[P] extends FactorDbCol<infer X, infer Q> ? [X, Q] : never
}[number]

type TupleToObject<T extends [string, unknown]> = {
  [P in T[0]]: T extends [P, infer B] ? B : never
}

export type CreateObjectType<T extends readonly FactorDbCol[]> = TupleToObject<
  CreateTuple<T>
> & Timestamps
