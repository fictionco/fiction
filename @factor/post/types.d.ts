import { FactorUser } from "@factor/user/types"
import mongoose from "mongoose"

export interface PostEndpointMeta {
  bearer?: FactorUser | null;
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

export interface FactorSchema {
  name: string;
  options?: mongoose.SchemaOptions;
  schema: mongoose.SchemaDefinition;
  populatedFields?: { field: string; depth: number }[];
  callback?: (s: mongoose.Schema) => void;
}

export type PopulatedPost = mongoose.Types.ObjectId
export type PopulatedPosts = mongoose.Types.ObjectId[]

export enum Status {
  Draft = "draft",
  Published = "published",
  Trash = "trash"
}

export interface FactorPost {
  date: string;
  postType: string;
  title: string;
  subTitle: string;
  content: string;
  author: PopulatedPosts;
  images: PopulatedPosts;
  avatar: PopulatedPost;
  tag: string[];
  category: string[];
  revision: object[];
  settings: object;
  list: object[];
  status: Status;
  uniqueId: string;
  permalink: string;
  [key: string]: any;
}
