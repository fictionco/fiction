import { Component } from "vue"
import { slugify, MarkdownFile } from "@factor/api"

interface PostAttributes {
  title?: string
  titleSub?: string
  description?: string
  excerpt?: string
  postImage?: string
  authorName?: string
  authorEmail?: string
  authorImage?: string
  authorWebsite?: string
  authorTwitter?: string
  publishDate?: string
}

export type PostEntryConfig = {
  readingMinutes?: number
  path?: string
  attributes?: Record<string, string | string[]>
  markdown?: string
  content?: string
  parentGroup?: PostNavGroup
  component?: Component

  [key: string]:
    | string
    | string[]
    | number
    | boolean
    | PostNavGroup
    | Component
    | undefined
} & PostSingle &
  PostAttributes

export interface PostSingle {
  nav?: boolean
  title?: string
  key?: string
  file?: () => Promise<MarkdownFile>
  path?: string
}
export type PostNavGroup = {
  title?: string
  description?: string
  icon?: string
  key?: string
  pages?: Record<string, PostSingle>
  docId?: string
} & PostSingle

export type PostTypes =
  | "article"
  | "guide"
  | "tutorial"
  | "video"
  | "example"
  | "resource"
  | "reference"
  | "update"
  | "release"

export type BlogPostParams<T extends string> = {
  key: T
  status?: "published" | "draft"
  permalink?: string
  publishDate?: string
  fileImport?: () => Promise<MarkdownFile>
  imageImport?: () => Promise<{ default: string }>
  type?: PostTypes[]
  category?: string[]
}

export class BlogPost<T extends string> {
  key: T
  status: "published" | "draft"
  permalink: string
  publishDate?: string
  fileImport?: () => Promise<MarkdownFile>
  imageImport?: () => Promise<{ default: string }>
  type?: PostTypes[]
  category?: string[]
  constructor(params: BlogPostParams<T>) {
    this.key = params.key
    this.status = params.status ?? "draft"
    this.permalink = params.permalink || slugify(params.key) || ""
    this.publishDate = params.publishDate
    this.fileImport = params.fileImport
    this.imageImport = params.imageImport
    this.type = params.type
    this.category = params.category
  }
}

export type BlogPostKeysUtility<T extends BlogPost<string>[]> = {
  [K in keyof T]: T[K] extends BlogPost<infer T> ? T : never
}[number]

export interface BlogOptions {
  baseRoute: string
  posts: BlogPost<string>[]
}
