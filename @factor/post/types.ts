import { CurrentUserState } from "@factor/user/types"
import mongoose from "mongoose"
import { Component } from "vue"
export type PopulatedPost = mongoose.Types.ObjectId
export type PopulatedPosts = mongoose.Types.ObjectId[]

export interface PostEndpointMeta {
  bearer?: CurrentUserState;
}

export interface PostEditComponent {
  postType: string[];
  name: string;
  component: () => Promise<Component>;
}

export enum PostStatus {
  Draft = "draft",
  Published = "published",
  Trash = "trash"
}

export interface UpdatePost {
  post: FactorPost | UnsavedFactorPost;
  postType: string;
}

export interface UpdateManyPosts {
  _ids: string[];
  data?: object;
  postType: string;
}

export interface PostRequestParameters {
  _id?: string;
  status?: string;
  createOnEmpty?: boolean;
  postType?: string;
  conditions?: any;
  token?: string;
  options?: { limit?: number; skip?: number; page?: number; sort?: string };
  permalink?: string;
  field?: string;
  depth?: number;
}

export type PostIndexParametersFlat = PostIndexOptions &
  PostIndexConditions & {
    postType: string;
    select?: string | null;
  }

export interface PostIndexRequestParameters {
  postType: string;
  select?: string | null;
  options: PostIndexOptions;
  conditions: PostIndexConditions;
}

export interface PostIndexOptions {
  limit?: number;
  page?: number;
  skip?: number;
  sort?: string;
}

export interface PostIndexConditions {
  [index: string]: any;
  status?: PostStatus | { $ne: PostStatus };
  tag?: string;
  category?: string;
  role?: string;
}

export interface PostIndex {
  meta: PostIndexMeta | {};
  posts: FactorPost[];
}

export type PostIndexMeta = PostIndexAggregations &
  PostIndexCounts &
  PostIndexOptions & { conditions: PostIndexConditions } & { [key: string]: any }

export interface PostIndexAggregations {
  tags: any;
  category: any;
  status: any;
  role: any;
}

export interface PostIndexCounts {
  total: number;
  totalForQuery: number;
  pageCount: number;
  pageCurrent: number;
}

export enum PostActions {
  Create = "create",
  Retrieve = "retrieve",
  Update = "update",
  Delete = "delete"
}

export interface DetermineUpdatePermissions {
  bearer: CurrentUserState;
  post?: FactorPost;
  action: PostActions;
  postType?: string;
}

export type FactorSchemaModule = FactorSchema | { (): FactorSchema }

export interface PopulatedField {
  field: string;
  depth: number;
}

export interface PermissionLevel {
  accessLevel?: number;
  role?: string;
  author?: boolean;
  status?: { [key in PostStatus]?: PermissionLevel };
}

export interface SchemaPermissions {
  create?: PermissionLevel;
  retrieve?: PermissionLevel;
  update?: PermissionLevel;
  delete?: PermissionLevel;
  list?: PermissionLevel;
}

export interface FactorSchema {
  name: string;
  options?: mongoose.SchemaOptions;
  schema?: mongoose.SchemaDefinition;
  populatedFields?: PopulatedField[];
  callback?: (s: mongoose.Schema) => void;
  permissions?: SchemaPermissions;
}

export type CurrentFactorPost = FactorPost | undefined

export interface FactorPost extends UnsavedFactorPost {
  _id: string;
}

export interface UnsavedFactorPost {
  date?: string;
  postType?: string;
  title?: string;
  subTitle?: string;
  synopsis?: string;
  content?: string;
  author?: PopulatedPosts;
  images?: PopulatedPosts;
  avatar?: PopulatedPost;
  tag?: string[];
  category?: string[];
  revision?: object[];
  settings?: object;
  list?: any[];
  status?: PostStatus;
  uniqueId?: string;
  permalink?: string;
  [key: string]: any;
}
