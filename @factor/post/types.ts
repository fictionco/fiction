import { CurrentUserState } from "@factor/user/types"
import mongoose from "mongoose"

export interface PostEndpointMeta {
  bearer?: CurrentUserState;
}

export enum PostStatus {
  Draft = "draft",
  Published = "published",
  Trash = "trash"
}

export interface UpdatePost {
  post: FactorPost;
  postType: string;
}

export interface UpdateManyPosts {
  _ids: string[];
  data: object;
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

export interface PostIndexRequestParameters {
  postType: string;
  options: { limit?: number; page?: number; skip?: number; sort?: string };
  conditions: {
    [index: string]: any;
    status?: PostStatus | { $ne: PostStatus };
    tag?: string;
    category?: string;
    role?: string;
  };
}

export interface PostIndex {
  meta: {};
  posts: FactorPost[];
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
  post: FactorPost;
  action: PostActions;
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
}

export interface FactorSchema {
  name: string;
  options?: mongoose.SchemaOptions;
  schema: mongoose.SchemaDefinition;
  populatedFields?: PopulatedField[];
  callback?: (s: mongoose.Schema) => void;
  permissions?: {
    create?: PermissionLevel;
    retrieve?: PermissionLevel;
    update?: PermissionLevel;
    delete?: PermissionLevel;
  };
}

export type PopulatedPost = mongoose.Types.ObjectId
export type PopulatedPosts = mongoose.Types.ObjectId[]

export interface FactorPost {
  date?: string;
  postType?: string;
  title?: string;
  subTitle?: string;
  content?: string;
  author?: PopulatedPosts;
  images?: PopulatedPosts;
  avatar?: PopulatedPost;
  tag?: string[];
  category?: string[];
  revision?: object[];
  settings?: object;
  list?: object[];
  status?: PostStatus;
  uniqueId?: string;
  permalink?: string;
  [key: string]: any;
}
