import { CurrentUserState } from "@factor/user/types"
import mongoose, { FilterQuery } from "mongoose"
import { EndpointParameters } from "@factor/endpoint"
import { FactorPostDocument } from "@factor/post/database"
export type PopulatedPost = string
export type PopulatedPosts = string[]
export type ObjectId = mongoose.Types.ObjectId
export interface PostEndpointMeta {
  bearer?: CurrentUserState
}

export interface PostEditComponent {
  postType: string[]
  name: string
  component: () => Promise<any>
}

/**
 * Contexts to determine when to populate certain fields
 * e.g cover images should not be populated on post listings with authors
 *     they should only be populated on single profile pages, etc.
 */
export enum PopulationContext {
  Any = "any",
  List = "list",
  Single = "single",
  Detailed = "detailed",
}

/**
 * Available publication status
 */
export enum PostStatus {
  Draft = "draft",
  Published = "published",
  Trash = "trash",
}

/**
 * Sorting time frames
 */
export enum IndexTimeFrame {
  Day = "day",
  Week = "week",
  Month = "month",
  Year = "year",
  AllTime = "all-time",
}

export enum IndexOrderBy {
  Latest = "latest",
  UpdatedAt = "updatedAt",
  Popular = "popular",
  Top = "top",
  Oldest = "oldest",
}

export interface UpdatePost {
  post: FactorPost | UnsavedFactorPost
  postType: string
}

export interface UpdatePostEmbedded {
  action: "save" | "delete" | "retrieve"
  postType?: string
  parentId: string
  data?: FactorPost | UnsavedFactorPost
  _id?: string
  skip?: number
  limit?: number
}

export interface UpdateManyPosts {
  _ids: string[]
  data?: Record<string, any>
  postType: string
}

export type PostRequestParameters = {
  _id?: string
  status?: string
  createOnEmpty?: boolean
  postType?: string
  conditions?: any
  token?: string
  options?: { limit?: number; skip?: number; page?: number; sort?: string }
  permalink?: string
  field?: string
  depth?: number
} & EndpointParameters

export type PostIndexParametersFlat = PostIndexOptions &
  PostIndexConditions & {
    postType: string
    select?: string | null
  }

export type PostIndexRequestParameters = {
  postType: string
  select?: string | null
  options: PostIndexOptions
  conditions: FilterQuery<FactorPostDocument> & PostIndexConditions
  sameSource?: boolean
} & EndpointParameters

export enum SortDelimiters {
  Ascending = "ascending",
  Descending = "descending",
}
export interface PostIndexOptions {
  limit?: number
  page?: number
  skip?: number
  sort?: string | Record<string, SortDelimiters>
  order?: IndexOrderBy
  time?: IndexTimeFrame
  search?: string
}

export interface PostIndexConditions {
  [index: string]: any
  status?: PostStatus | { $ne: PostStatus } | keyof PostStatus
  tag?: string
  category?: string
  role?: string
  search?: string
}

export interface PostIndex {
  meta: PostIndexMeta | Record<string, any>
  posts: FactorPost[]
}

export type PostIndexMeta = PostIndexAggregations &
  PostIndexCounts &
  PostIndexOptions & { conditions: PostIndexConditions } & { [key: string]: any }

export interface PostIndexAggregations {
  tags: any
  category: any
  status: any
  role: any
}

export interface PostIndexCounts {
  total: number
  totalForQuery: number
  pageCount: number
  pageCurrent: number
}

export enum PostActions {
  Create = "create",
  Retrieve = "retrieve",
  Update = "update",
  Delete = "delete",
}

export interface DetermineUpdatePermissions {
  bearer: CurrentUserState
  post?: FactorPost
  action: PostActions
  postType: string
  manyPosts?: boolean
}

export type FactorSchemaModule = FactorSchema | { (): FactorSchema }

/**
 * @deprecate 1.7
 */
export interface PopulatedField {
  field: string
  depth: number
  context?: "list" | "single" | "any"
}

export interface PermissionLevel {
  accessLevel?: number
  accessPublished?: number
  accessAuthor?: boolean
  accessMany?: boolean
}

export interface SchemaPermissions {
  create?: PermissionLevel
  retrieve?: PermissionLevel
  update?: PermissionLevel
  delete?: PermissionLevel
  embedded?: SchemaPermissions
}

export interface FactorSchema {
  name: string
  options?: mongoose.SchemaOptions
  schema?: mongoose.SchemaDefinition
  populatedFields?: PopulatedField[]
  callback?: (s: mongoose.Schema) => void
  permissions?: SchemaPermissions
}

export type FactorPostState = FactorPost | undefined

export interface FactorPost extends UnsavedFactorPost {
  _id: string
  __t?: string
}

export type FactorPostKey = FactorPost & { [key: string]: any }

export interface UnsavedFactorPost {
  _id?: string
  postType?: string
  title?: string
  subTitle?: string
  synopsis?: string
  content?: string
  author?: PopulatedPosts
  follower?: PopulatedPosts
  images?: PopulatedPosts
  avatar?: PopulatedPost
  tag?: string[]
  category?: string[]
  revision?: Record<string, any>[]
  settings?: Record<string, any>
  list?: any[]
  embedded?: FactorPost[]
  status?: PostStatus
  uniqueId?: string
  permalink?: string
  date?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
  contributedAt?: Date | string
  //[key: string]: any;
}
