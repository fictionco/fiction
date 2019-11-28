import { FactorUser } from "@factor/user/typings"
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
  schema: object;
  populatedFields?: object[];
  callback?: (s: mongoose.Schema) => void;
}

export interface FactorPost {}
